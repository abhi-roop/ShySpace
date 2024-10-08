'use client'; // Ensure this component runs on the client

import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import InterviewItemsCard from '../_component/InterviewItemsCard';

function InterviewList() {
  const { user } = useUser(); 
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  // Fetch interview list when user is available
  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    if (user) {
      setLoading(true); // Set loading to true before fetching
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, user.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id));
      
      console.log(result);
      setInterviewList(result); 
      setLoading(false); // Set loading to false after fetching
    }
  };

  return (
    <div className='p-5 bg-gray-50 rounded-lg shadow-md'>
      <h2 className="font-medium text-xl mb-4">Previous Mock Interviews</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {interviewList.length > 0 ? (
            interviewList.map((interview, index) => (
              <InterviewItemsCard 
                interview={interview}
                key={index}
              />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">No mock interviews found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default InterviewList;
