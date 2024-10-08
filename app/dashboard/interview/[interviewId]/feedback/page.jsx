"use client";

import { db } from '@/utils/db';
import { ChevronsUpDownIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(UserAnswer.id);
    console.log(result);
    setFeedbackList(result);
  }

  return (
    <div className='p-6 bg-gray-50'>
      <h2 className='text-3xl font-bold text-green-600 mb-4'>Congratulations</h2>
      <h2 className='text-2xl font-bold text-gray-800 mb-6'>Here is your interview feedback</h2>

      <h2 className='text-sm text-gray-600 mb-8'>Find below questions and answers with correct answer, your answer and feedback for improvement</h2>

      <div className='space-y-4'>
        {feedbackList.length > 0 ? (
          feedbackList.map((item, index) => (
            <Collapsible key={index}>
              <CollapsibleTrigger className='flex justify-between items-center w-full p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors'>
                <span className='text-left text-gray-800'>{item.question}</span>
                <ChevronsUpDownIcon className='text-gray-500' />
              </CollapsibleTrigger>
              <CollapsibleContent className='mt-2 p-4 bg-white rounded-lg shadow-sm'>
                <p className='text-gray-700'>
                  <div className='flex flex-col gap-2'>
                    <h2 className='text-red-500 p-2 border rounded-lg'><strong>Rating:</strong> {item.rating}</h2>
                    <h2><strong>Your Answer:</strong> {item.userAns}</h2>
                    <h2><strong>Correct Answer:</strong> {item.correctAns}</h2>
                    <h2><strong>Feedback:</strong> {item.feedback}</h2>
                  </div>
                </p>
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <p className="text-gray-500 text-center">No interview was recorded.</p> // Message when no feedback is available
        )}
        <Button onClick={() => router.replace('/dashboard')}>Go home</Button>
      </div>
    </div>
  )
}

export default Feedback;
