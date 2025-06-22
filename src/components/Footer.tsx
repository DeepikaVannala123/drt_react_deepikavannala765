// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => (
  <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-100 border-t border-slate-300 h-16 px-4 flex items-center justify-center">
    <div className="text-sm text-slate-500 text-center w-full max-w-screen-xl">
      &copy; {new Date().getFullYear()} Satellite Tracker. All rights reserved.
    </div>
  </footer>
);

export default Footer;
