export default function SkillsLoading() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <aside className="w-full md:w-64 shrink-0 space-y-6 hidden md:block">
          <div className="space-y-4">
            <div className="h-6 bg-gray-800 rounded w-1/3 animate-pulse" />
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-800 rounded w-full animate-pulse" />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="flex-1 space-y-8">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-800 rounded w-1/4 animate-pulse" />
            <div className="h-10 bg-gray-800 rounded w-48 animate-pulse" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[280px] bg-gray-900 rounded-xl border border-gray-800 p-5 flex flex-col animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-5 bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 mb-auto">
                  <div className="h-4 bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-800 rounded w-5/6" />
                </div>
                <div className="pt-4 border-t border-gray-800 flex justify-between mt-4">
                  <div className="h-5 bg-gray-800 rounded w-1/4" />
                  <div className="h-5 bg-gray-800 rounded w-1/5" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
