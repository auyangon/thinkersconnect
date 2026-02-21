import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, FileText, Film, File, ExternalLink, ChevronRight } from 'lucide-react';
import { useData } from '../lib/dataContext';
import GlassCard from '../components/GlassCard';

const fileIcons: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  pdf:     { icon: FileText, color: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
  doc:     { icon: FileText, color: '#3b82f6', bg: 'rgba(59,130,246,0.10)' },
  slides:  { icon: File,     color: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },
  video:   { icon: Film,     color: '#a855f7', bg: 'rgba(168,85,247,0.10)' },
  default: { icon: File,     color: '#5a7a70', bg: 'rgba(90,122,112,0.10)' },
};

const folderGrads = [
  'linear-gradient(135deg,rgba(26,158,120,0.07),rgba(34,201,151,0.03))',
  'linear-gradient(135deg,rgba(59,130,246,0.07),rgba(96,165,250,0.03))',
  'linear-gradient(135deg,rgba(168,85,247,0.07),rgba(192,132,252,0.03))',
  'linear-gradient(135deg,rgba(245,158,11,0.07),rgba(251,191,36,0.03))',
  'linear-gradient(135deg,rgba(239,68,68,0.07),rgba(248,113,113,0.03))',
];

export default function Materials() {
  const { materials, courses } = useData();
  const [openFolders, setOpenFolders] = useState<string[]>([courses[0]?.course_id || '']);

  const toggle = (id: string) =>
    setOpenFolders(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const grouped = courses.reduce((acc, c) => {
    acc[c.course_id] = materials.filter(m => m.course_id === c.course_id);
    return acc;
  }, {} as Record<string, typeof materials>);

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl" style={{ color: '#1a2e28' }}>Study Materials</h1>
        <p className="text-sm" style={{ color: '#7a9e94' }}>{materials.length} files across {courses.length} courses</p>
      </motion.div>

      {courses.map((course, ci) => {
        const isOpen = openFolders.includes(course.course_id);
        const files = grouped[course.course_id] || [];
        const grad = folderGrads[ci % folderGrads.length];

        return (
          <GlassCard key={course.course_id} delay={ci * 0.07} className="overflow-hidden">
            {/* Folder header */}
            <button onClick={() => toggle(course.course_id)}
              className="w-full flex items-center gap-3 p-5 transition-colors text-left"
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,158,120,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: grad, border: '1px solid rgba(26,158,120,0.15)' }}>
                <FolderOpen size={20} style={{ color: '#1a9e78' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm" style={{ color: '#1a2e28' }}>{course.course_name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#7a9e94' }}>{files.length} file{files.length !== 1 ? 's' : ''}</p>
              </div>
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.22 }}>
                <ChevronRight size={16} style={{ color: '#9ab8b0' }} />
              </motion.div>
            </button>

            {/* File list */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }}
                  className="overflow-hidden">
                  <div className="px-5 pb-4 pt-3 space-y-2"
                    style={{ borderTop: '1px solid rgba(26,158,120,0.08)' }}>
                    {files.length === 0 ? (
                      <p className="text-sm text-center py-4" style={{ color: '#9ab8b0' }}>No materials uploaded yet</p>
                    ) : files.map((file, fi) => {
                      const ft = fileIcons[file.type] || fileIcons.default;
                      const Icon = ft.icon;
                      return (
                        <motion.a key={fi} href={file.url} target="_blank" rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: fi * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-2xl transition-colors group"
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(26,158,120,0.06)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: ft.bg, border: `1px solid ${ft.color}22` }}>
                            <Icon size={16} style={{ color: ft.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate" style={{ color: '#1a2e28' }}>{file.title}</p>
                            <p className="text-xs uppercase" style={{ color: '#9ab8b0' }}>{file.type}</p>
                          </div>
                          <ExternalLink size={14} style={{ color: '#c8dcd6' }}
                            className="group-hover:!text-[#1a9e78] transition-colors flex-shrink-0" />
                        </motion.a>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        );
      })}
    </div>
  );
}
