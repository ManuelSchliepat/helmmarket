export default function DashboardLoading() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 flex flex-col md:flex-row gap-8 animate-pulse">
      <aside className="w-full md:w-64 shrink-0 hidden md:block space-y-4">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-gray-800 rounded-lg w-full" />)}
      </aside>
      <main className="flex-1 space-y-8">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-8 bg-gray-800 rounded w-64" />
            <div className="h-4 bg-gray-800 rounded w-96" />
          </div>
          <div className="h-10 bg-gray-800 rounded w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-28 bg-gray-800 rounded-xl w-full" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-64 bg-gray-800 rounded-xl w-full" />
            <div className="h-48 bg-gray-800 rounded-xl w-full" />
          </div>
          <div className="h-96 bg-gray-800 rounded-xl w-full" />
        </div>
      </main>
    </div>
  )
}
