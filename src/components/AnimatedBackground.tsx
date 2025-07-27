import React from 'react';

export const AnimatedBackground: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    {/* Animated gradient blobs */}
    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-gradient-to-br from-blue-200 via-purple-200 to-pink-100 rounded-full filter blur-3xl opacity-60 animate-blob1" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-gradient-to-tr from-purple-100 via-blue-100 to-pink-200 rounded-full filter blur-2xl opacity-50 animate-blob2" />
    <div className="absolute top-1/2 left-1/2 w-[30vw] h-[30vw] bg-gradient-to-tl from-pink-100 via-blue-100 to-purple-200 rounded-full filter blur-2xl opacity-40 animate-blob3" />
    <style>{`
      @keyframes blob1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(10vw, 5vw) scale(1.1); }
      }
      @keyframes blob2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-8vw, -6vw) scale(1.05); }
      }
      @keyframes blob3 {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-55%, -45%) scale(1.08); }
      }
      .animate-blob1 { animation: blob1 18s ease-in-out infinite; }
      .animate-blob2 { animation: blob2 22s ease-in-out infinite; }
      .animate-blob3 { animation: blob3 26s ease-in-out infinite; }
    `}</style>
  </div>
); 