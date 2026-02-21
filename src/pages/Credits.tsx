import { motion } from 'framer-motion';
import { Award, TrendingUp, Target, BookOpen } from 'lucide-react';
import { useData } from '../lib/dataContext';
import GlassCard from '../components/GlassCard';
import ProgressRing from '../components/ProgressRing';

const GRAD_CREDITS = 120;

export default function Credits() {
  const { courses, grades, totalCredits, creditsInProgress, currentSemester } = useData();

  const totalEarned   = totalCredits;
  const inProgress    = creditsInProgress;
  const remaining     = Math.max(0, GRAD_CREDITS - totalEarned - inProgress);
  const gradProgress  = Math.round(((totalEarned + inProgress) / GRAD_CREDITS) * 100);

  const semesterBreakdown = grades.reduce((acc, g) => {
    if (!acc[g.semester]) acc[g.semester] = 0;
    acc[g.semester] += 3;
    return acc;
  }, {} as Record<string, number>);
  const sortedSemesters = Object.entries(semesterBreakdown).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl" style={{ color: '#1a2e28' }}>Credits Tracker</h1>
        <p className="text-sm" style={{ color: '#7a9e94' }}>Graduation progress</p>
      </motion.div>

      {/* Ring card */}
      <GlassCard delay={0.08} className="p-8 relative overflow-hidden">
        <div className="absolute inset-0 rounded-[22px] pointer-events-none"
          style={{ background: 'linear-gradient(135deg,rgba(26,158,120,0.06),rgba(34,201,151,0.03))' }} />
        <div className="flex flex-col items-center relative">
          <div className="relative">
            <ProgressRing
              value={totalEarned + inProgress}
              max={GRAD_CREDITS}
              size={188}
              strokeWidth={16}
              label={`${totalEarned + inProgress}`}
              sublabel="/ 120 credits"
            />
            {/* Inner in-progress ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg width={188} height={188} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                <circle cx={94} cy={94} r={68} fill="none"
                  stroke="rgba(59,130,246,0.25)" strokeWidth={8}
                  strokeDasharray={2 * Math.PI * 68}
                  strokeDashoffset={2 * Math.PI * 68 * (1 - inProgress / GRAD_CREDITS)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1.5s ease' }} />
              </svg>
            </div>
          </div>

          <div className="flex gap-5 mt-6">
            {[
              { color: '#1a9e78', label: 'Earned' },
              { color: 'rgba(59,130,246,0.6)', label: 'In Progress' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                <span className="text-xs" style={{ color: '#7a9e94' }}>{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 px-4 py-2 rounded-full"
            style={{ background: 'rgba(26,158,120,0.08)', border: '1px solid rgba(26,158,120,0.15)' }}>
            <span className="text-sm text-gradient">{gradProgress}% toward graduation</span>
          </div>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Award,     label: 'Earned',      value: totalEarned, color: '#1a9e78', bg: 'rgba(26,158,120,0.08)',  border: 'rgba(26,158,120,0.18)'  },
          { icon: TrendingUp,label: 'In Progress',  value: inProgress,  color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.18)'  },
          { icon: Target,    label: 'Remaining',    value: remaining,   color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)'  },
        ].map(({ icon: Icon, label, value, color, bg, border }, i) => (
          <GlassCard key={label} delay={i * 0.08 + 0.18} className="p-4 text-center relative overflow-hidden">
            <div className="absolute inset-0 rounded-[22px] pointer-events-none" style={{ background: bg }} />
            <div className="w-10 h-10 rounded-2xl mx-auto mb-3 flex items-center justify-center relative"
              style={{ background: bg, border: `1px solid ${border}` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-2xl relative" style={{ color }}>{value}</p>
            <p className="text-xs mt-1 relative" style={{ color: '#7a9e94' }}>{label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Semester breakdown */}
      {sortedSemesters.length > 0 && (
        <GlassCard delay={0.42} className="p-6">
          <p className="mb-5" style={{ color: '#1a2e28' }}>Credits by Semester</p>
          <div className="space-y-4">
            {sortedSemesters.map(([sem, credits], i) => {
              const isCurrent = sem === currentSemester;
              return (
                <div key={sem}>
                  <div className="flex justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: '#1a2e28' }}>{sem}</span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: 'rgba(59,130,246,0.10)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.18)' }}>
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-sm" style={{ color: '#7a9e94' }}>{credits} cr</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(26,158,120,0.10)' }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(credits / 18) * 100}%` }}
                      transition={{ duration: 0.9, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: isCurrent ? 'linear-gradient(90deg,#3b82f6,#60a5fa)' : 'linear-gradient(90deg,#1a9e78,#22c997)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Current courses */}
      <GlassCard delay={0.55} className="p-6">
        <p className="mb-4" style={{ color: '#1a2e28' }}>Current Semester Courses</p>
        <div className="space-y-2">
          {courses.map((c, i) => (
            <motion.div key={c.course_id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 + 0.55 }}
              className="flex items-center justify-between p-3.5 rounded-2xl"
              style={{ background: 'rgba(26,158,120,0.04)', border: '1px solid rgba(26,158,120,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.18)' }}>
                  <BookOpen size={14} style={{ color: '#3b82f6' }} />
                </div>
                <p className="text-sm" style={{ color: '#1a2e28' }}>{c.course_name}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs"
                style={{ background: 'rgba(59,130,246,0.10)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.18)' }}>
                {c.credits} cr
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
