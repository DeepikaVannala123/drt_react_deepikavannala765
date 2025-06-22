// components/Header.tsx
import React from 'react';

const Header: React.FC = () => (
  <header className="fixed shadow-md bg-white shadow-sm px-4 py-3 border-b border-slate-200 top-0 left-0 right-0 z-50">
    <div className="max-w-screen-xl mx-auto flex items-center justify-between">
      <h1 className="text-lg font-semibold  text-primary">Satellite Tracker</h1>
      <nav className="text-sm text-slate-600 hidden sm:flex gap-4">
        <a href="#" className="hover:text-blue-600">Home</a>
        <a href="#" className="hover:text-blue-600">About</a>
        <a href="#" className="hover:text-blue-600">Docs</a>
      </nav>
    </div>
  </header>
);

export default Header;
