import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import { useData } from '../lib/dataContext';
import GlassCard from '../components/GlassCard';

const gradeColors: Record<string, string> = {
  'A+': '#1a9e78', 'A': '#1a9e78', 'A-': '#22c997',
  'B+': '#3b82f6', 'B': '#3b82f6', 'B-': '#60a5fa',
  'C+': '#f59e0b', 'C': '#f59e0b', 'C-': '#fbbf24',
  'D': '#f97316', 'F': '#ef4444',
};

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

export default function Grades() {
  const { grades, courses, semesters, currentSemester } = useData();
  const [selectedSemester, setSelectedSemester] = useState(currentSemester);

  const filtered = grades.filter(g => g.semester === selectedSemester);

  const semGPA = (() => {
    if (filtered.length === 0) return 0;
    let pts = 0, cr = 0;
    filtered.forEach(g => {
      const credits = parseFloat(courses.find(c => c.course_id === g.course_id)?.credits ?? '3');
      pts += (GRADE_POINTS[g.grade.toUpperCase()] ?? 0) * credits;
      cr  += credits;
    });
    return cr > 0 ? Math.round((pts / cr) * 100) / 100 : 0;
  })();

  const allCourses = [...courses];
  filtered.forEach(g => {
    if (!allCourses.find(c => c.course_id === g.course_id))
      allCourses.push({ course_id: g.course_id, course_name: g.course_id, credits: '3', instructor: '—', semester: g.semester });
  });

  const gpaColor = semGPA >= 3.5 ? '#1a9e78' : semGPA >= 3.0 ? '#3b82f6' : semGPA >= 2.0 ? '#f59e0b' : '#ef4444';

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl" style={{ color: '#1a2e28' }}>Grades</h1>
        <p className="text-sm" style={{ color: '#7a9e94' }}>Academic performance overview</p>
      </motion.div>

      {/* GPA Banner */}
      <GlassCard delay={0.08} className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 rounded-[22px] pointer-events-none"
          style={{ background: 'linear-gradient(135deg,rgba(26,158,120,0.06),rgba(34,201,151,0.03))' }} />
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#7a9e94' }}>Semester GPA</p>
            <div className="flex items-end gap-2">
              <motion.span
                initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-5xl tracking-tighter" style={{ color: gpaColor }}>
                {semGPA.toFixed(2)}
              </motion.span>
              <span className="text-lg mb-1" style={{ color: '#9ab8b0' }}>/ 4.00</span>
            </div>
          </div>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(26,158,120,0.12),rgba(34,201,151,0.06))', border: '1px solid rgba(26,158,120,0.15)' }}>
            <BarChart2 size={28} style={{ color: '#1a9e78' }} />
          </div>
        </div>
        <div className="mt-4 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,158,120,0.10)' }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${(semGPA / 4) * 100}%` }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, #1a9e78, #22c997, #4ade80)` }} />
        </div>
      </GlassCard>

      {/* Semester tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {semesters.map(sem => (
          <button key={sem} onClick={() => setSelectedSemester(sem)}
            className="px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all"
            style={selectedSemester === sem
              ? { background: 'linear-gradient(135deg,#1a9e78,#22c997)', color: 'white', boxShadow: '0 4px 16px rgba(26,158,120,0.28)' }
              : { background: 'rgba(26,158,120,0.08)', color: '#5a7a70', border: '1px solid rgba(26,158,120,0.12)' }
            }>
            {sem}
          </button>
        ))}
      </div>

      {/* Table */}
      <GlassCard delay={0.18} className="overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(26,158,120,0.08)' }}>
          <span style={{ color: '#1a2e28' }}>Subject Grades</span>
        </div>
        <div>
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-sm" style={{ color: '#9ab8b0' }}>No grades for this semester</p>
          ) : filtered.map((g, i) => {
            const course = allCourses.find(c => c.course_id === g.course_id);
            const col = gradeColors[g.grade] || '#1a2e28';
            return (
              <motion.div key={g.course_id}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between px-5 py-4 transition-colors"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(26,158,120,0.06)' : 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,158,120,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div className="flex-1">
                  <p className="text-sm" style={{ color: '#1a2e28' }}>{course?.course_name || g.course_id}</p>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-xs" style={{ color: '#9ab8b0' }}>{course?.instructor || '—'}</span>
                    <span className="text-xs" style={{ color: '#c8dcd6' }}>·</span>
                    <span className="text-xs" style={{ color: '#9ab8b0' }}>{course?.credits || '3'} cr</span>
                  </div>
                </div>
                <div className="text-right ml-4 px-3 py-1.5 rounded-xl"
                  style={{ background: `${col}12`, border: `1px solid ${col}20` }}>
                  <span className="text-xl" style={{ color: col }}>{g.grade}</span>
                  <p className="text-xs" style={{ color: '#9ab8b0' }}>{g.score}%</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
