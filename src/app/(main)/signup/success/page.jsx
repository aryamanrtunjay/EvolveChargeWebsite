// app/(main)/signup/success/page.js
import { Suspense } from 'react';
import SignUpSuccessContent from './SignUpSuccessContent';

export default function SignUpSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>}>
      <SignUpSuccessContent />
    </Suspense>
  );
}