
export enum UserRole {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  educator: string;
  price: number;
  category: CourseCategory;
  sections: Section[];
  enrolledStudentIds: string[];
  teacherId: string;
}

export enum CourseCategory {
  IT_SOFTWARE = 'IT & Software',
  FINANCE_ACCOUNTING = 'Finance & Accounting',
  PERSONAL_DEVELOPMENT = 'Personal Development',
}

export interface EnrolledCourse extends Course {
  progress: { [sectionId: string]: boolean };
}
