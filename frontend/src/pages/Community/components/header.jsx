import React from 'react';
import { Tractor, User2 } from 'lucide-react';

export function Header({ currentUser }) {
  return (
    <header className="bg-green-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Tractor className="h-8 w-8" />
          <h1 className="text-2xl font-bold">FarmConnect</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-2">
            <User2 className="h-5 w-5" />
            
            <span className="bg-green-700 px-2 py-1 rounded-full text-sm">
              {currentUser.role}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}