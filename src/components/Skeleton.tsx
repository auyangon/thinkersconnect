export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5 p-4">
      <SkeletonBlock className="h-28 w-full rounded-2xl" />
      <SkeletonBlock className="h-36 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <SkeletonBlock className="h-28 rounded-2xl" />
        <SkeletonBlock className="h-28 rounded-2xl" />
        <SkeletonBlock className="h-28 rounded-2xl" />
        <SkeletonBlock className="h-28 rounded-2xl" />
      </div>
      <SkeletonBlock className="h-52 w-full rounded-2xl" />
    </div>
  );
}

export function CourseSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[1, 2, 3, 4].map(i => (
        <SkeletonBlock key={i} className="h-32 w-full rounded-2xl" />
      ))}
    </div>
  );
}
