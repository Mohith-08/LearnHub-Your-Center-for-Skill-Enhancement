
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/mockApi';
import { Course } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../common/Spinner';

const TeacherDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCourses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const allCourses = await api.getCourses();
      setCourses(allCourses.filter(c => c.teacherId === user.id));
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDeleteCourse = async (courseId: string) => {
    if(window.confirm("Are you sure you want to delete this course?")){
        try {
            await api.deleteCourse(courseId);
            fetchCourses(); // Refresh list
            alert("Course deleted successfully");
        } catch(error) {
            console.error("Failed to delete course", error);
            alert("Failed to delete course");
        }
    }
  }

  if (loading) return <div className="flex justify-center items-center py-10"><Spinner /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Courses</h1>
      {courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-5 rounded-lg shadow-lg border border-gray-200 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold text-brand-text">{course.title}</h2>
                    <p className="text-sm text-brand-secondary font-semibold my-2">{course.category}</p>
                    <p className="text-brand-light-text text-sm mb-4">{course.description}</p>
                    <p className="text-sm font-medium">Sections: {course.sections.length}</p>
                    <p className="text-sm font-medium">Enrolled students: {course.enrolledStudentIds.length}</p>
                </div>
                <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                    Delete
                </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">No courses found!!</p>
            <Link to="/add-course" className="mt-4 inline-block bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90">
                Add Your First Course
            </Link>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
