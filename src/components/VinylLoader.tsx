export function VinylLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 bg-vintage-sepia rounded-full animate-vinyl-spin">
          <div className="absolute inset-2 bg-vintage-brown rounded-full">
            <div className="absolute inset-2 bg-vintage-sepia rounded-full">
              <div className="absolute inset-2 bg-vintage-brown rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-vintage-sepia rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="font-mono text-vintage-sepia">Loading...</p>
        </div>
      </div>
    </div>
  )
}
