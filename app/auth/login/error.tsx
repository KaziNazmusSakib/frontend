'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto">
      <div className="card bg-error text-error-content shadow-xl">
        <div className="card-body text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="card-title justify-center">Something went wrong!</h2>
          <p>{error.message}</p>
          <div className="card-actions justify-center mt-4">
            <button onClick={() => reset()} className="btn btn-outline btn-sm">
              Try again
            </button>
            <Link href="/" className="btn btn-outline btn-sm">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}