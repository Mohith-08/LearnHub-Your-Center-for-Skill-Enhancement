
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import StudentDashboard from '../components/student/StudentDashboard';
import TeacherDashboard from '../components/teacher/TeacherDashboard';
import Spinner from '../components/common/Spinner';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  }

  if (!user) {
    return <p className="text-center mt-8">Please log in to see your dashboard.</p>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {user.role === UserRole.STUDENT ? <StudentDashboard /> : <TeacherDashboard />}
    </div>
  );
};

export default DashboardPage;
