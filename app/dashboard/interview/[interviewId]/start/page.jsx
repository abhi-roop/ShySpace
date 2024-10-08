"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';


// Dynamically import RecordAnsSection without SSR
const RecordAnsSection = dynamic(
  () => import('./_components/RecordAnsSection'),
  { ssr: false }
);

function StartInterview({ params }) {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
    } catch (error) {
      setError('Error fetching interview details. Please try again later.');
      console.error('Error fetching interview details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousQuestion = () => {
    setActiveQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setActiveQuestionIndex((prev) => Math.min(mockInterviewQuestion.length - 1, prev + 1));
  };

  

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg font-semibold">Loading interview details...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-lg font-semibold text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left: Questions Section */}
          <div className="md:w-1/2 p-6 border-r border-gray-200">
            <QuestionsSection
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              setActiveQuestionIndex={setActiveQuestionIndex}
            />
          </div>
          
          {/* Right: Record Answer Section */}
          <div className="md:w-1/2 p-6">
            <RecordAnsSection 
              mockInterviewQuestion={mockInterviewQuestion}
              activeQuestionIndex={activeQuestionIndex}
              setActiveQuestionIndex={setActiveQuestionIndex}
              interviewData={interviewData}
            />
          </div>
        </div>
        
        {/* Navigation and End Interview Buttons */}
        <div className="flex justify-between items-center bg-gray-100 p-4">
          <Button 
            onClick={handlePreviousQuestion} 
            disabled={activeQuestionIndex === 0}
            className="flex items-center"
          >
            <ChevronLeft className="mr-2" size={16} />
            Previous
          </Button>
          <Button 
            onClick={handleNextQuestion} 
            disabled={activeQuestionIndex === mockInterviewQuestion.length - 1}
            className="flex items-center"
          >
            Next
            <ChevronRight className="ml-2" size={16} />
          </Button>
          <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
          <Button 
            variant="destructive" 
            className="flex items-center" 
           
            disabled={activeQuestionIndex !== mockInterviewQuestion.length - 1} // Enable only on last question
          >
            <X className="mr-2" size={16} />
            End Interview
          </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StartInterview;
