
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/mockApi';
import { EnrolledCourse, Section } from '../types';
import Spinner from '../components/common/Spinner';
import CertificateModal from '../components/student/CertificateModal';
import VideoPlayer from '../components/common/VideoPlayer';

const CoursePage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { user } = useAuth();
    const [course, setCourse] = useState<EnrolledCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [showCertificate, setShowCertificate] = useState(false);

    const fetchCourse = useCallback(async () => {
        if (!user || !courseId) return;
        setLoading(true);
        try {
            const enrolledCourses = await api.getStudentEnrolledCourses(user.id);
            const currentCourse = enrolledCourses.find(c => c.id === courseId);
            if(currentCourse) {
                setCourse(currentCourse);
                setActiveVideo(currentCourse.sections[0]?.videoUrl || null);
            }
        } catch (error) {
            console.error("Failed to fetch course data", error);
        } finally {
            setLoading(false);
        }
    }, [user, courseId]);

    useEffect(() => {
        fetchCourse();
    }, [fetchCourse]);
    
    const handleToggleComplete = async (sectionId: string) => {
        if (!user || !courseId || !course) return;

        const newProgress = { ...course.progress, [sectionId]: !course.progress[sectionId] };
        await api.updateSectionProgress(user.id, courseId, sectionId, newProgress[sectionId]);
        
        setCourse(prev => prev ? { ...prev, progress: newProgress } : null);
    };

    const allSectionsCompleted = course && course.sections.every(s => course.progress[s.id]);

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    if (!course) return <p className="text-center mt-8">Course not found or you are not enrolled.</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-4">Welcome to the course: {course.title}</h1>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-4">
                    {course.sections.map(section => (
                        <div key={section.id} className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold">{section.title}</h3>
                            <div className="flex items-center justify-between mt-2">
                                <button onClick={() => setActiveVideo(section.videoUrl)} className="text-sm text-brand-primary font-semibold">
                                    PLAY VIDEO
                                </button>
                                <button
                                    onClick={() => handleToggleComplete(section.id)}
                                    className={`text-sm px-3 py-1 rounded-full ${course.progress[section.id] ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    {course.progress[section.id] ? 'COMPLETED' : 'Mark as complete'}
                                </button>
                            </div>
                        </div>
                    ))}
                     {allSectionsCompleted && (
                        <button 
                            onClick={() => setShowCertificate(true)}
                            className="w-full mt-6 bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition duration-300 hover:opacity-90"
                        >
                            Download Certificate
                        </button>
                    )}
                </div>
                <div className="md:col-span-2">
                    {activeVideo ? (
                        <VideoPlayer videoUrl={activeVideo} />
                    ) : (
                        <div className="bg-gray-200 aspect-video rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">Select a video to play.</p>
                        </div>
                    )}
                </div>
            </div>

            {showCertificate && user && (
                <CertificateModal 
                    isOpen={showCertificate}
                    onClose={() => setShowCertificate(false)}
                    studentName={user.fullName}
                    courseName={course.title}
                />
            )}
        </div>
    );
};

export default CoursePage;
