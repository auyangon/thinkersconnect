import { motion } from 'framer-motion';
import { BookOpen, User, Award } from 'lucide-react';
import { useData } from '../lib/dataContext';
import GlassCard from '../components/GlassCard';
import { CourseSkeleton } from '../components/Skeleton';

const gradeColors: Record<string, string> = {
  'A+': '#1a9e78', 'A': '#1a9e78', 'A-': '#22c997',
  'B+': '#3b82f6', 'B': '#3b82f6', 'B-': '#60a5fa',
  'C+': '#f59e0b', 'C': '#f59e0b', 'C-': '#fbbf24',
  'D': '#f97316', 'F': '#ef4444',
};

const gradeProgress: Record<string, number> = {
  'A+': 100, 'A': 97, 'A-': 93, 'B+': 88, 'B': 85, 'B-': 82,
  'C+': 78, 'C': 75, 'C-': 72, 'D': 65, 'F': 0,
};

const cardGrads = [
  'linear-gradient(135deg,rgba(26,158,120,0.07),rgba(34,201,151,0.03))',
  'linear-gradient(135deg,rgba(59,130,246,0.07),rgba(96,165,250,0.03))',
  'linear-gradient(135deg,rgba(168,85,247,0.07),rgba(192,132,252,0.03))',
  'linear-gradient(135deg,rgba(245,158,11,0.07),rgba(251,191,36,0.03))',
  'linear-gradient(135deg,rgba(239,68,68,0.07),rgba(248,113,113,0.03))',
];

export default function Courses() {
  const { courses, grades, currentSemester, loading } = useData();
  if (loading) return <CourseSkeleton />;

  const courseGrades = courses.map(course => ({
    ...course,
    grade: grades.find(g => g.course_id === course.course_id && g.semester === currentSemester),
  }));

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
        <h1 className="text-2xl" style={{ color: '#1a2e28' }}>My Courses</h1>
        <p className="text-sm" style={{ color: '#7a9e94' }}>{currentSemester} · {courses.length} enrolled</p>
      </motion.div>

      {courseGrades.map((course, i) => {
        const gradeVal = course.grade?.grade || '—';
        const progress = gradeProgress[gradeVal] || 0;
        const color = gradeColors[gradeVal] || '#9ab8b0';
        const grad = cardGrads[i % cardGrads.length];

        return (
          <GlassCard key={course.course_id} delay={i * 0.07} hover className="p-5 relative overflow-hidden">
            {/* Subtle bg tint */}
            <div className="absolute inset-0 rounded-[22px] pointer-events-none opacity-60" style={{ background: grad }} />

            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(26,158,120,0.12)', border: '1px solid rgba(26,158,120,0.15)' }}>
                      <BookOpen size={14} style={{ color: '#1a9e78' }} />
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-lg"
                      style={{ background: 'rgba(26,158,120,0.08)', color: '#1a9e78' }}>
                      {course.course_id}
                    </span>
                  </div>
                  <h3 className="text-base leading-tight" style={{ color: '#1a2e28' }}>{course.course_name}</h3>
                </div>
                {gradeVal !== '—' && (
                  <div className="text-right ml-4 px-3 py-2 rounded-2xl"
                    style={{ background: `${color}14`, border: `1px solid ${color}25` }}>
                    <span className="text-2xl" style={{ color }}>{gradeVal}</span>
                    <p className="text-xs" style={{ color: '#9ab8b0' }}>{course.grade?.score}%</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <User size={12} style={{ color: '#9ab8b0' }} />
                  <span className="text-xs" style={{ color: '#7a9e94' }}>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={12} style={{ color: '#9ab8b0' }} />
                  <span className="text-xs" style={{ color: '#7a9e94' }}>{course.credits} credits</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs" style={{ color: '#9ab8b0' }}>Progress</span>
                  <span className="text-xs" style={{ color: '#7a9e94' }}>
                    {gradeVal !== '—' ? `${progress}%` : 'In Progress'}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(26,158,120,0.10)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${gradeVal !== '—' ? progress : 65}%` }}
                    transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: gradeVal !== '—' ? `linear-gradient(90deg, ${color}, ${color}bb)` : 'linear-gradient(90deg,#1a9e78,#22c997)' }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        );
      })}

      {courses.length === 0 && (
        <div className="text-center py-20" style={{ color: '#9ab8b0' }}>
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p>No courses enrolled this semester</p>
        </div>
      )}
    </div>
  );
}
