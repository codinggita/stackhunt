import React from 'react';
import { Target } from 'lucide-react';

const MyRepo = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">My Repositories</h1>
      <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4 rounded-[32px] border border-white/5">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
          <Target className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-500">No Repositories Connected</h2>
          <p className="text-gray-400 max-w-sm mx-auto mt-2">
            You haven't connected any repositories to StackHunt yet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyRepo;
