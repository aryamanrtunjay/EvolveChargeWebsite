import { Suspense } from 'react';
import SignUpContent from './SignUpContent'; // Import the new client component (create this file next)

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white bg-[#0A0A0A]">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
}