import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BookOpen, CalendarCheck, Award, ChevronRight, Star, Zap } from 'lucide-react';
import { useData } from '../lib/dataContext';
import { useAuth } from '../lib/authContext';
import GlassCard from '../components/GlassCard';
import { DashboardSkeleton } from '../components/Skeleton';
import { useNavigate } from 'react-router-dom';

// ── Types ─────────────────────────────────────────────
interface Student {
  name: string;
  email: string;
  program: string;
  photoURL?: string;
}

interface Course {
  course_id: string;
  course_name: string;
  instructor?: string;
}

interface Grade {
  course_id: string;
  grade: string;
  score: number;
  semester: string;
}

interface Attendance {
  course_id: string;
  attended: number | string;
  total: number | string;
}

// ── Theme colors ──────────────────────────────────────
const THEME = {
  gradeColors: { 'A+':'#1a9e78','A':'#1a9e78','A-':'#22c997','B+':'#3b82f6','B':'#3b82f6','B-':'#60a5fa','C+':'#f59e0b','C':'#f59e0b','F':'#ef4444' },
  gradients: {
    courses: 'linear-gradient(135deg,rgba(59,130,246,0.08),rgba(96,165,250,0.04))',
    attendance: 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(74,222,128,0.04))',
    credits: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(251,191,36,0.04))',
    semester: 'linear-gradient(135deg,rgba(168,85,247,0.08),rgba(192,132,252,0.04))',
  }
};

// ── Stat Widget ──────────────────────────────────────
function StatWidget({ icon: Icon, label, value, sub, grad, delay, onClick }: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  grad: string; delay: number; onClick?: () => void;
}) {
  return (
    <GlassCard delay={delay} hover onClick={onClick} className="p-5 relative overflow-hidden">
      <div className="absolute inset-0 rounded-[22px] opacity-40 pointer-events-none" style={{ background: grad }} />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.7)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Icon size={18} style={{ color: '#1a9e78' }} />
          </div>
          {onClick && <ChevronRight size={14} style={{ color: '#aac8be' }} />}
        </div>
        <p className="text-xs uppercase tracking-wider mb-1 text-[#7a9e94]">{label}</p>
        <p className="text-2xl tracking-tight text-[#1a2e28]">{value}</p>
        {sub && <p className="text-xs mt-0.5 text-[#9ab8b0]">{sub}</p>}
      </div>
    </GlassCard>
  );
}

// ── Dashboard ────────────────────────────────────────
export default function Dashboard() {
  const { student, courses, grades, attendance, gpa, totalCredits, creditsInProgress, loading, currentSemester, error } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (loading) return <DashboardSkeleton />;
  if (error) return <p className="text-red-500 text-center mt-10">Failed to load data. Please try again.</p>;

  const avgAttendance = attendance.length > 0
    ? Math.round(attendance.reduce((sum, a) => sum + (Number(a.attended)/Number(a.total))*100, 0) / attendance.length)
    : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const recentGrades = grades.filter(g => g.semester === currentSemester).slice(0, 3);

  return (
    <div className="space-y-5">
      {/* ── Hero Welcome ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a9e78 0%, #22c997 55%, #4ade80 100%)', boxShadow: '0 8px 40px rgba(26,158,120,0.28)' }}>
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-20 bg-white/40"></div>
        <div className="absolute -right-4 top-8 w-24 h-24 rounded-full opacity-15 bg-white/50"></div>
        <div className="absolute left-1/2 bottom-0 w-64 h-16 opacity-10 bg-gradient-radial from-white to-transparent"></div>

        <div className="relative flex items-center gap-4">
          <motion.img
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(student?.name || 'Student')}&background=ffffff&color=1a9e78&size=120`}
            alt="avatar"
            className="w-16 h-16 rounded-2xl object-cover"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '2px solid rgba(255,255,255,0.6)' }}
          />
          <div>
            <p className="text-white/75 text-sm">{greeting} 👋</p>
            <h2 className="text-white text-xl tracking-tight">{student?.name || 'Student'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/22 text-white">{student?.program}</span>
              <span className="text-white/60 text-xs">{currentSemester}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── GPA Card ────────────────────────────────── */}
      <GlassCard delay={0.08} className="p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-56 h-56 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none bg-gradient-radial from-[#22c997]/12 to-transparent"></div>
        <div className="flex items-center justify-between relative">
          <div>
            <p className="text-xs uppercase tracking-widest mb-2 text-[#7a9e94]">Current GPA</p>
            <div className="flex items-end gap-2">
              <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 180 }} className="text-6xl tracking-tighter text-gradient">
                {gpa.toFixed(2)}
              </motion.span>
              <span className="text-lg mb-2 text-[#9ab8b0]">/ 4.00</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-1">
                {[1,2,3,4].map(i => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i*0.07 }} className="w-7 h-2 rounded-full"
                    style={{ background: i <= Math.round(gpa) ? 'linear-gradient(90deg,#1a9e78,#22c997)' : 'rgba(26,158,120,0.12)' }} />
                ))}
              </div>
              <span className="text-xs text-[#7a9e94]">
                {gpa >= 3.7 ? "Dean's List 🏆" : gpa >= 3.0 ? 'Good Standing ✓' : gpa >= 2.0 ? 'Satisfactory' : 'Needs Improvement'}
              </span>
            </div>
          </div>
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center bg-gradient-to-br from-[#1ac8961a] to-[#22c9970d] border border-[#1a9e78]/15">
            <TrendingUp size={34} style={{ color: '#1a9e78' }} />
          </div>
        </div>
        <div className="mt-5 h-2 rounded-full overflow-hidden bg-[#1a9e78]/10">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(gpa/4)*100}%` }}
            transition={{ duration: 1.3, delay: 0.3, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#1a9e78] via-[#22c997] to-[#4ade80]" />
        </div>
      </GlassCard>

      {/* ── Stat Grid ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatWidget icon={BookOpen} label="Courses" value={String(courses.length)} sub={currentSemester} grad={THEME.gradients.courses} delay={0.14} onClick={() => navigate('/courses')} />
        <StatWidget icon={CalendarCheck} label="Attendance" value={`${avgAttendance}%`} sub="This semester" grad={THEME.gradients.attendance} delay={0.18} onClick={() => navigate('/attendance')} />
        <StatWidget icon={Award} label="Credits" value={String(totalCredits+creditsInProgress)} sub={`${totalCredits} earned`} grad={THEME.gradients.credits} delay={0.22} onClick={() => navigate('/credits')} />
        <StatWidget icon={Star} label="Semester" value={currentSemester.split(' ')[0]} sub={currentSemester.split(' ')[1]} grad={THEME.gradients.semester} delay={0.26} />
      </div>

      {/* ── Recent Grades ─────────────────────────── */}
      <AnimatePresence>
        {recentGrades.length > 0 && (
          <GlassCard delay={0.3} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#1ac896]/15 to-[#22c997]/08">
                  <Zap size={14} style={{ color: '#1a9e78' }} />
                </div>
                <span className="text-[#1a2e28]">Recent Grades</span>
              </div>
              <button onClick={() => navigate('/grades')} className="text-xs px-3 py-1.5 rounded-full transition-all text-[#1a9e78]" style={{ background: 'rgba(26,158,120,0.08)', border: '1px solid rgba(26,158,120,0.15)' }}>
                View all
              </button>
            </div>
            <div className="space-y-2.5">
              {recentGrades.map((g, i) => {
                const course = courses.find(c => c.course_id === g.course_id);
                const col = THEME.gradeColors[g.grade] || '#1a2e28';
                return (
                  <motion.div key={g.course_id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.38 + i*0.08 }}
                    className="flex items-center justify-between p-3.5 rounded-2xl" style={{ background: 'rgba(26,158,120,0.04)', border: '1px solid rgba(26,158,120,0.08)' }}>
                    <div>
                      <p className="text-sm text-[#1a2e28]">{course?.course_name || g.course_id}</p>
                      <p className="text-xs mt-0.5 text-[#7a9e94]">{course?.instructor}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl" style={{ color: col }}>{g.grade}</span>
                      <p className="text-xs text-[#9ab8b0]">{g.score}%</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>
        )}
      </AnimatePresence>

      {/* ── Quick Access ───────────────────────────── */}
      <GlassCard delay={0.42} className="p-6">
        <p className="mb-4 text-[#1a2e28]">Quick Access</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Study Materials', path: '/materials', emoji: '📚', grad: 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(248,113,113,0.04))' },
            { label: 'Quizzes & Exams', path: '/quizzes', emoji: '📝', grad: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(251,191,36,0.04))' },
            { label: 'Credits Tracker', path: '/credits', emoji: '🎓', grad: 'linear-gradient(135deg,rgba(168,85,247,0.08),rgba(192,132,252,0.04))' },
            { label: 'Attendance', path: '/attendance', emoji: '✅', grad: 'linear-gradient(135deg,rgba(34,197,94,0.08),rgba(74,222,128,0.04))' },
          ].map(({ label, path, emoji, grad }) => (
            <motion.button key={path} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate(path)} className="p-4 rounded-2xl text-left transition-all" style={{ background: grad, border: '1px solid rgba(26,158,120,0.10)' }}>
              <span className="text-2xl block mb-2">{emoji}</span>
              <p className="text-xs text-[#5a7a70]">{label}</p>
            </motion.button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}