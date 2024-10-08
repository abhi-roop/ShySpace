'use client'

import React from 'react';
import AddNewInterview from './_component/AddNewInterview';
import InterviewList from './_component/InterviewList';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-950 text-white w-full">
      <div className="container mx-auto p-6 md:p-10">
        <header className="mb-8">
          <h1 className="font-bold text-3xl md:text-4xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-500">
            Dashboard
          </h1>
          <p className="text-indigo-300 text-lg">Create and start your Interview</p>
        </header>

        <main>
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-200">New Interview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <AddNewInterview />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-200">Previous Interviews</h2>
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg">
              <InterviewList />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
