
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCategory, Section } from '../../types';
import * as api from '../../services/mockApi';
import { useAuth } from '../../hooks/useAuth';

const AddCourseForm: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [courseTitle, setCourseTitle] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [courseEducator, setCourseEducator] = useState('');
    const [coursePrice, setCoursePrice] = useState(0);
    const [courseCategory, setCourseCategory] = useState<CourseCategory>(CourseCategory.IT_SOFTWARE);
    const [sections, setSections] = useState<Partial<Omit<Section, 'id'>>[]>([{ title: '', description: '', videoUrl: '' }]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddSection = () => {
        setSections([...sections, { title: '', description: '', videoUrl: '' }]);
    };

    const handleRemoveSection = (index: number) => {
        const newSections = sections.filter((_, i) => i !== index);
        setSections(newSections);
    };

    const handleSectionChange = (index: number, field: keyof Omit<Section, 'id'>, value: string) => {
        const newSections = [...sections];
        newSections[index][field] = value;
        setSections(newSections);
    };
    
    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            const fileName = e.target.files[0].name;
            handleSectionChange(index, 'videoUrl', fileName);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("You must be logged in to add a course.");
            return;
        }
        setIsLoading(true);
        try {
            const finalSections: Section[] = sections.map((s, i) => ({
                id: `sec_${Date.now()}_${i}`,
                title: s.title || '',
                description: s.description || '',
                videoUrl: s.videoUrl || '',
            }));

            await api.addCourse({
                title: courseTitle,
                description: courseDescription,
                educator: courseEducator,
                price: coursePrice,
                category: courseCategory,
                sections: finalSections,
                teacherId: user.id
            });
            alert('Course created successfully');
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to create course", error);
            alert('Failed to create course');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Course Type</label>
                    <select value={courseCategory} onChange={e => setCourseCategory(e.target.value as CourseCategory)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        {Object.values(CourseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course Title</label>
                    <input type="text" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course Educator</label>
                    <input type="text" value={courseEducator} onChange={e => setCourseEducator(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Course Price(Rs.)</label>
                    <input type="number" value={coursePrice} onChange={e => setCoursePrice(Number(e.target.value))} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                    <p className="text-xs text-gray-500">for free course, enter 0</p>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Course Description</label>
                <textarea value={courseDescription} onChange={e => setCourseDescription(e.target.value)} required rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
            </div>

            <hr/>
            <h3 className="text-lg font-semibold">Course Sections</h3>
            {sections.map((section, index) => (
                <div key={index} className="p-4 border rounded-md relative space-y-4">
                     <button type="button" onClick={() => handleRemoveSection(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">&times;</button>
                     <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Section Title</label>
                            <input type="text" value={section.title} onChange={e => handleSectionChange(index, 'title', e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Section Content (Video or Image)</label>
                            <input type="file" onChange={e => handleFileChange(index, e)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary/10 file:text-brand-primary hover:file:bg-brand-primary/20"/>
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Section Description</label>
                        <textarea value={section.description} onChange={e => handleSectionChange(index, 'description', e.target.value)} required rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                </div>
            ))}

            <div className="flex justify-between items-center">
                <button type="button" onClick={handleAddSection} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-md hover:bg-gray-300">
                    + Add Section
                </button>
                <button type="submit" disabled={isLoading} className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    );
};

export default AddCourseForm;
