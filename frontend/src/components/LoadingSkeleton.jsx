export default function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow-md h-40">
          <div className="bg-gray-300 h-24 w-full rounded mb-2"></div>
          <div className="bg-gray-300 h-4 w-3/4 rounded"></div>
        </div>
      ))}
    </div>
  );
}