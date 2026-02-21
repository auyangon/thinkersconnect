/**
 * sheets.ts — Apps Script API client
 * ────────────────────────────────────
 * One fetch, one URL, one response shape.
 *
 * GET {VITE_APPS_SCRIPT_URL}?email=student@auy.edu.mm
 *
 * Returns StudentData directly (no envelope wrapper).
 * Falls back to MOCK_STUDENT when VITE_APPS_SCRIPT_URL is not set.
 */

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Material {
  title: string;
  url:   string;
  type:  string; // 'pdf' | 'doc' | 'slides' | 'video'
}

export interface Quiz {
  title:  string;
  date:   string;   // YYYY-MM-DD
  status: string;   // 'Upcoming' | 'Completed'
  link:   string | null;
}

export interface CourseRecord {
  courseId:   string;
  courseName: string;
  credits:    string;
  instructor: string;
  grade:      string | null;
  score:      string | null;
  attendance: number | null;  // 0–100 %
  attended:   string;
  total:      string;
  materials:  Material[];
  quizzes:    Quiz[];
}

export interface StudentData {
  studentName: string;
  studentId:   string;
  studyMode:   string;
  semester:    string;
  courses:     CourseRecord[];
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export async function fetchStudentData(email: string): Promise<StudentData> {
  if (!API_URL) throw new Error('NO_CONFIG');

  const res  = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json() as StudentData & { error?: string };
  if (json.error) throw new Error(json.error);

  return json;
}

// ─── GPA helper ──────────────────────────────────────────────────────────────

const GP: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F':  0.0,
};

export function calculateGPA(courses: CourseRecord[]): number {
  const graded = courses.filter(c => c.grade);
  if (!graded.length) return 0;
  let pts = 0, cr = 0;
  graded.forEach(c => {
    const credits = parseFloat(c.credits) || 3;
    pts += (GP[(c.grade ?? '').toUpperCase()] ?? 0) * credits;
    cr  += credits;
  });
  return cr ? Math.round((pts / cr) * 100) / 100 : 0;
}

// ─── Mock data (demo mode) ────────────────────────────────────────────────────

export const MOCK_STUDENT: StudentData = {
  studentName: 'Alex Johnson',
  studentId:   'STU-2024-001',
  studyMode:   'Computer Science',
  semester:    'Spring 2025',
  courses: [
    {
      courseId: 'CS301', courseName: 'Data Structures & Algorithms',
      credits: '3', instructor: 'Dr. Sarah Chen',
      grade: 'A', score: '94', attendance: 93, attended: '28', total: '30',
      materials: [
        { title: 'Lecture 1 – Introduction to DSA', url: 'https://drive.google.com', type: 'pdf' },
        { title: 'Problem Set 1',                   url: 'https://drive.google.com', type: 'doc' },
        { title: 'Chapter 2 Slides',                url: 'https://drive.google.com', type: 'slides' },
      ],
      quizzes: [
        { title: 'Quiz 1 – Arrays & Linked Lists', date: '2025-02-10', status: 'Completed', link: null },
        { title: 'Quiz 2 – Trees & Graphs',        date: '2025-03-15', status: 'Completed', link: null },
        { title: 'Midterm Exam',                   date: '2025-04-01', status: 'Upcoming',  link: 'https://exam.university.edu' },
      ],
    },
    {
      courseId: 'CS350', courseName: 'Operating Systems',
      credits: '3', instructor: 'Prof. James Miller',
      grade: 'B+', score: '88', attendance: 73, attended: '22', total: '30',
      materials: [
        { title: 'OS Concepts – Week 1', url: 'https://drive.google.com', type: 'pdf' },
        { title: 'Lab Manual',           url: 'https://drive.google.com', type: 'doc' },
      ],
      quizzes: [
        { title: 'Quiz 1 – Process Management', date: '2025-02-20', status: 'Completed', link: null },
        { title: 'Midterm',                     date: '2025-04-05', status: 'Upcoming',  link: 'https://exam.university.edu' },
      ],
    },
    {
      courseId: 'MATH201', courseName: 'Linear Algebra',
      credits: '3', instructor: 'Dr. Emily Rodriguez',
      grade: 'A-', score: '91', attendance: 97, attended: '29', total: '30',
      materials: [
        { title: 'Linear Algebra Textbook Ch1', url: 'https://drive.google.com', type: 'pdf' },
      ],
      quizzes: [
        { title: 'Vectors Quiz', date: '2025-02-28', status: 'Completed', link: null },
      ],
    },
    {
      courseId: 'CS380', courseName: 'Web Development',
      credits: '3', instructor: 'Prof. David Kim',
      grade: 'A', score: '96', attendance: 100, attended: '30', total: '30',
      materials: [
        { title: 'React Tutorial Video', url: 'https://drive.google.com', type: 'video' },
        { title: 'Project Guidelines',   url: 'https://drive.google.com', type: 'doc' },
      ],
      quizzes: [
        { title: 'HTML/CSS Assessment', date: '2025-02-14', status: 'Completed', link: null },
        { title: 'React Project Demo',  date: '2025-04-10', status: 'Upcoming',  link: null },
      ],
    },
    {
      courseId: 'CS310', courseName: 'Database Systems',
      credits: '3', instructor: 'Dr. Lisa Wang',
      grade: 'B', score: '85', attendance: 80, attended: '24', total: '30',
      materials: [
        { title: 'SQL Reference Sheet', url: 'https://drive.google.com', type: 'pdf' },
      ],
      quizzes: [
        { title: 'SQL Fundamentals Quiz', date: '2025-04-15', status: 'Upcoming', link: null },
      ],
    },
  ],
};
