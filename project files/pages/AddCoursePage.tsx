
import React from 'react';
import AddCourseForm from '../components/teacher/AddCourseForm';

const AddCoursePage: React.FC = () => {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-brand-text">Add a New Course</h1>
            <AddCourseForm />
        </div>
    );
};

export default AddCoursePage;
