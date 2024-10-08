'use client'; // Ensure this component runs on the client

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function InterviewItemsCard({ interview }) {
  const router = useRouter();

  const onFeedback = () => {
    router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
  };

  const onStart = () => {
    router.push(`/dashboard/interview/${interview?.mockId}`);
  };

  return (
    <div className='flex items-center justify-between border border-gray-200 shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow duration-300 bg-white mb-4'>
      <div className='flex-grow space-y-1'>
        <h2 className='font-bold text-lg text-primary'>{interview?.jobPosition}</h2>
        <p className="text-sm text-gray-600">{interview?.jobExperience} Years of Experience</p>
        <p className='text-xs text-gray-400'>Created At: {new Date(interview.createdAt).toLocaleDateString()}</p>
      </div>
      <div className='flex flex-col space-y-2 ml-4'>
        <Button variant="secondary" className="w-full" onClick={onFeedback}>Feedback</Button>
        <Button className="w-full" onClick={onStart}>Start</Button>
      </div>
    </div>
  );
}

export default InterviewItemsCard;
