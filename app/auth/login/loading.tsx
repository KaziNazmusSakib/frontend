export default function Loading() {
  return (
    <div className="max-w-md mx-auto">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg"></div>
            <p className="mt-4">Loading login page...</p>
          </div>
        </div>
      </div>
    </div>
  );
}