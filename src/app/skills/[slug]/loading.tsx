export default function SkillDetailLoading() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 animate-pulse">
      <div className="flex gap-6 items-center mb-10">
        <div className="w-20 h-20 bg-gray-800 rounded-2xl" />
        <div className="space-y-3 flex-1">
          <div className="h-8 bg-gray-800 rounded w-1/3" />
          <div className="h-4 bg-gray-800 rounded w-1/2" />
        </div>
      </div>
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-4 border-b border-gray-800 pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 w-24 bg-gray-800 rounded" />
            ))}
          </div>
          <div className="h-64 bg-gray-800 rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-800 rounded w-3/4" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-40 bg-gray-800 rounded-xl" />
          <div className="h-32 bg-gray-800 rounded-xl" />
          <div className="h-48 bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
