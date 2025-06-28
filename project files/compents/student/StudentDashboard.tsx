
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../../services/mockApi';
import { Course, CourseCategory, EnrolledCourse } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../common/Spinner';
import PaymentModal from './PaymentModal';

const StudentDashboard: React.FC = () => {
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTitle, setSearchTitle] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All Courses');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const [courses, enrolled] = await Promise.all([
                    api.getCourses(),
                    api.getStudentEnrolledCourses(user.id)
                ]);
                setAllCourses(courses);
                setEnrolledCourses(enrolled);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);
    
    const handleStartCourse = (course: Course) => {
        setSelectedCourse(course);
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async () => {
        if(!user || !selectedCourse) return;
        await api.enrollInCourse(user.id, selectedCourse.id);
        const enrolled = await api.getStudentEnrolledCourses(user.id);
        setEnrolledCourses(enrolled);
        setShowPaymentModal(false);
        setSelectedCourse(null);
        alert('Enrolled successfully!');
    }

    const filteredCourses = useMemo(() => {
        return allCourses
            .filter(course =>
                course.title.toLowerCase().includes(searchTitle.toLowerCase())
            )
            .filter(course =>
                selectedCategory === 'All Courses' || course.category === selectedCategory
            );
    }, [allCourses, searchTitle, selectedCategory]);

    const isEnrolled = (courseId: string) => enrolledCourses.some(c => c.id === courseId);

    if (loading) return <div className="flex justify-center items-center py-10"><Spinner /></div>;

    return (
        <div>
            {selectedCourse && (
                <PaymentModal 
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    course={selectedCourse}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
            
            {/* All Courses Section */}
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-4">Modules</h1>
                 <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow">
                    <div>
                        <label className="font-medium">Search By:</label>
                        <input 
                            type="text" 
                            placeholder="Title" 
                            className="ml-2 p-2 border rounded-md"
                            value={searchTitle}
                            onChange={e => setSearchTitle(e.target.value)}
                        />
                    </div>
                    <select 
                        className="p-2 border rounded-md"
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                    >
                        <option>All Courses</option>
                        {Object.values(CourseCategory).map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.length > 0 ? filteredCourses.map(course => (
                        <div key={course.id} className="bg-white p-5 rounded-lg shadow-lg border border-gray-200 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-red-500">{course.title}</h2>
                                <p className="text-sm text-brand-secondary font-semibold my-2">{course.category}</p>
                                <p className="text-sm font-medium">By: {course.educator}</p>
                                <p className="text-sm font-medium">Sections: {course.sections.length}</p>
                                <p className="text-sm font-medium">Price(Rs.): {course.price}</p>
                                <p className="text-sm font-medium">Enrolled students: {course.enrolledStudentIds.length}</p>
                            </div>
                            <button 
                                onClick={() => isEnrolled(course.id) ? {} : handleStartCourse(course)}
                                className={`mt-4 w-full text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 ${isEnrolled(course.id) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900'}`}
                                disabled={isEnrolled(course.id)}
                            >
                                {isEnrolled(course.id) ? 'Enrolled' : 'Start Course'}
                            </button>
                        </div>
                    )) : <p>No courses match your criteria.</p>}
                </div>
                 {filteredCourses.length > 0 && <p className="mt-4 text-center text-gray-600">many more to watch..</p>}
            </div>

            {/* Enrolled Courses Section */}
            <div>
                <h1 className="text-3xl font-bold mb-6">Enrolled Courses</h1>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="py-3 px-4 text-left">Course ID</th>
                                <th className="py-3 px-4 text-left">Course Name</th>
                                <th className="py-3 px-4 text-left">Course Educator</th>
                                <th className="py-3 px-4 text-left">Course Category</th>
                                <th className="py-3 px-4 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                                <tr key={course.id}>
                                    <td className="py-3 px-4">{course.id}</td>
                                    <td className="py-3 px-4">{course.title}</td>
                                    <td className="py-3 px-4">{course.educator}</td>
                                    <td className="py-3 px-4">{course.category}</td>
                                    <td className="py-3 px-4">
                                        <Link to={`/course/${course.id}`} className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600">
                                            GO TO
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">yet to be enrolled courses</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
