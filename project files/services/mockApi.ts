
import { User, Course, Section, CourseCategory, UserRole } from '../types';

// Initialize with some data
const init = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }
  if (!localStorage.getItem('courses')) {
    localStorage.setItem('courses', JSON.stringify([]));
  }
  if (!localStorage.getItem('enrolledCourses')) {
    localStorage.setItem('enrolledCourses', JSON.stringify({}));
  }
};

init();

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- User Management ---

export const register = async (newUser: Omit<User, 'id'>): Promise<User> => {
  await delay(500);
  const users: User[] = JSON.parse(localStorage.getItem('users')!);
  if (users.some(u => u.email === newUser.email)) {
    throw new Error('User with this email already exists.');
  }
  const user: User = { ...newUser, id: Date.now().toString() };
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  return user;
};

export const login = async (email: string, password: string): Promise<User> => {
  await delay(500);
  const users: User[] = JSON.parse(localStorage.getItem('users')!);
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  throw new Error('Invalid email or password.');
};

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = async (): Promise<User> => {
  await delay(100);
  const user = localStorage.getItem('currentUser');
  if (user) {
    return JSON.parse(user);
  }
  throw new Error('Not logged in');
};

// --- Course Management ---

export const getCourses = async (): Promise<Course[]> => {
    await delay(500);
    return JSON.parse(localStorage.getItem('courses')!);
};

export const getCourseById = async (id: string): Promise<Course> => {
    await delay(300);
    const courses: Course[] = JSON.parse(localStorage.getItem('courses')!);
    const course = courses.find(c => c.id === id);
    if(course) return course;
    throw new Error("Course not found");
};


export const addCourse = async (courseData: Omit<Course, 'id' | 'enrolledStudentIds'>): Promise<Course> => {
    await delay(1000);
    const courses: Course[] = JSON.parse(localStorage.getItem('courses')!);
    const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
        enrolledStudentIds: [],
    };
    courses.push(newCourse);
    localStorage.setItem('courses', JSON.stringify(courses));
    return newCourse;
};

export const deleteCourse = async (courseId: string): Promise<void> => {
    await delay(500);
    let courses: Course[] = JSON.parse(localStorage.getItem('courses')!);
    courses = courses.filter(c => c.id !== courseId);
    localStorage.setItem('courses', JSON.stringify(courses));
};


// --- Enrollment ---

export const enrollInCourse = async (userId: string, courseId: string): Promise<void> => {
    await delay(1000);
    const courses: Course[] = JSON.parse(localStorage.getItem('courses')!);
    const course = courses.find(c => c.id === courseId);
    if(course && !course.enrolledStudentIds.includes(userId)) {
        course.enrolledStudentIds.push(userId);
    }
    localStorage.setItem('courses', JSON.stringify(courses));
    
    // Store progress
    let enrolled = JSON.parse(localStorage.getItem('enrolledCourses')!);
    if(!enrolled[userId]) {
        enrolled[userId] = [];
    }
    if(!enrolled[userId].some((c:any) => c.id === courseId)) {
        const progress = course.sections.reduce((acc, section) => ({ ...acc, [section.id]: false }), {});
        enrolled[userId].push({ id: courseId, progress });
    }
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
};

export const getStudentEnrolledCourses = async (userId: string): Promise<any[]> => {
    await delay(500);
    const allCourses: Course[] = JSON.parse(localStorage.getItem('courses')!);
    const enrolledMap = JSON.parse(localStorage.getItem('enrolledCourses')!)[userId] || [];

    return enrolledMap.map((enrollment: any) => {
        const courseDetails = allCourses.find(c => c.id === enrollment.id);
        return { ...courseDetails, progress: enrollment.progress };
    });
};

export const updateSectionProgress = async (userId: string, courseId: string, sectionId: string, completed: boolean): Promise<void> => {
    await delay(200);
    let enrolled = JSON.parse(localStorage.getItem('enrolledCourses')!);
    const userEnrollments = enrolled[userId];
    const courseEnrollment = userEnrollments?.find((e: any) => e.id === courseId);
    if(courseEnrollment) {
        courseEnrollment.progress[sectionId] = completed;
    }
    localStorage.setItem('enrolledCourses', JSON.stringify(enrolled));
};
