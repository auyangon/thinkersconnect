/**
 * dataContext.tsx
 * ───────────────
 * Fetches student data from the Apps Script proxy once after login.
 * Maps the flat API response into typed lists consumed by each page.
 * Auto-falls back to MOCK_STUDENT when no API URL is configured.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchStudentData, calculateGPA, MOCK_STUDENT, type StudentData, type CourseRecord } from './sheets';
import { useAuth } from './authContext';

// ─── Page-facing types ────────────────────────────────────────────────────────

export interface Student {
  email:      string;
  name:       string;
  student_id: string;
  semester:   string;
  program:    string;
}

export interface Course {
  course_id:   string;
  course_name: string;
  credits:     string;
  instructor:  string;
}

export interface Grade {
  course_id: string;
  semester:  string;
  grade:     string;
  score:     string;
}

export interface Attendance {
  course_id:  string;
  semester:   string;
  attended:   string;
  total:      string;
  percentage: number;
}

export interface Material {
  course_id: string;
  title:     string;
  url:       string;
  type:      string;
}

export interface Quiz {
  course_id: string;
  title:     string;
  date:      string;
  status:    string;
  link:      string | null;
  semester:  string;
}

export type { CourseRecord };

// ─── Context shape ────────────────────────────────────────────────────────────

interface Ctx {
  student:           Student | null;
  courses:           Course[];
  grades:            Grade[];
  attendance:        Attendance[];
  materials:         Material[];
  quizzes:           Quiz[];
  gpa:               number;
  totalCredits:      number;
  creditsInProgress: number;
  currentSemester:   string;
  semesters:         string[];
  loading:           boolean;
  error:             string | null;
  usingMockData:     boolean;
}

const DataContext = createContext<Ctx | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [raw,          setRaw]    = useState<StudentData | null>(null);
  const [loading,      setLoad]   = useState(true);
  const [error,        setError]  = useState<string | null>(null);
  const [usingMockData, setMock]  = useState(false);

  useEffect(() => {
    if (user?.email) load(user.email);
  }, [user]);

  async function load(email: string) {
    setLoad(true);
    setError(null);
    try {
      setRaw(await fetchStudentData(email));
      setMock(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === 'NO_CONFIG') {
        await new Promise(r => setTimeout(r, 800));
        setRaw(MOCK_STUDENT);
        setMock(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoad(false);
    }
  }

  // ── Derive everything from raw ────────────────────────────────────────────

  const currentSemester = raw?.semester ?? 'Spring 2025';

  const student: Student | null = raw ? {
    email:      user?.email ?? '',
    name:       raw.studentName,
    student_id: raw.studentId,
    semester:   raw.semester,
    program:    raw.studyMode,
  } : null;

  const courses: Course[] = (raw?.courses ?? []).map(c => ({
    course_id:   c.courseId,
    course_name: c.courseName,
    credits:     c.credits,
    instructor:  c.instructor,
  }));

  // Each course contributes one grade entry for the current semester
  const grades: Grade[] = (raw?.courses ?? [])
    .filter(c => c.grade)
    .map(c => ({
      course_id: c.courseId,
      semester:  currentSemester,
      grade:     c.grade!,
      score:     c.score ?? '',
    }));

  const attendance: Attendance[] = (raw?.courses ?? [])
    .filter(c => c.attendance !== null)
    .map(c => ({
      course_id:  c.courseId,
      semester:   currentSemester,
      attended:   c.attended,
      total:      c.total,
      percentage: c.attendance!,
    }));

  const materials: Material[] = (raw?.courses ?? []).flatMap(c =>
    c.materials.map(m => ({ course_id: c.courseId, ...m }))
  );

  const quizzes: Quiz[] = (raw?.courses ?? []).flatMap(c =>
    c.quizzes.map(q => ({ course_id: c.courseId, semester: currentSemester, ...q }))
  );

  const gpa               = calculateGPA(raw?.courses ?? []);
  const creditsInProgress = courses.length * 3;
  const totalCredits      = 0; // no historical data in simplified schema
  const semesters         = [currentSemester];

  return (
    <DataContext.Provider value={{
      student, courses, grades, attendance, materials, quizzes,
      gpa, totalCredits, creditsInProgress,
      currentSemester, semesters,
      loading, error, usingMockData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
