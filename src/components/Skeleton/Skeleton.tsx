const Skeleton = () => {
  return (
    <div role="status" className="animate-pulse w-full">
      <div className="h-4 bg-gray-200 rounded-full"></div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Skeleton
