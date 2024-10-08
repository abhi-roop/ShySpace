'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle, X } from "lucide-react";  // Importing the X icon
import { chatSession } from '@/utils/GeminiAiModel';
import { MockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/utils/db';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router= useRouter();

  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);

    const InputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDesc}, Experience: ${jobExperience}, Depending on Job Position, Job Description, and Experience, give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions along with answers in JSON format. Provide only the JSON structure in the response.`;

    try {
      const result = await chatSession.sendMessage(InputPrompt);

      const responseText = await result.response.text();
      console.log("Response Text:", responseText);

      // Clean the response to extract JSON
      const jsonStart = responseText.indexOf('[');  // Find the start of the JSON array
      const jsonEnd = responseText.lastIndexOf(']') + 1;  // Find the end of the JSON array
      const cleanedJson = responseText.slice(jsonStart, jsonEnd).trim();  // Extract the JSON part

      console.log(cleanedJson);

      // Parse the cleaned JSON
      const parsedJson = JSON.parse(cleanedJson);
      console.log("Parsed JSON:", JSON.stringify(parsedJson));

      // Set the parsed JSON to the state
      setJsonResponse(parsedJson);

      // If JSON is valid, insert it into the database
      if (parsedJson) {
        const resp = await db.insert(MockInterview).values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsedJson),
          jobPosition: jobPosition,
          jobDesc: jobDesc,
          jobExperience: jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }).returning({ mockId: MockInterview.mockId });
        console.log("Inserted Id", resp);
        if(resp) {
          setOpenDialog(false);
          router.push('/dashboard/interview/'+resp[0]?.mockId);
        }
      }
    } catch (err) {
      console.error("Error while parsing JSON:", err);
     
    }
    finally{

      setLoading(false);
    }
  };

  return (
    <div>
      <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'>
        <h2 className='font-bold text-lg text-center text-black' onClick={() => setOpenDialog(true)}>
          + Add New
        </h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
              onClick={() => setOpenDialog(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <DialogTitle className="text-2xl">Tell us more about your interview</DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>Add Details About Your Job Position/Role</h2>
                  <div className='mt-7 my-3'>
                    <label>Job Role/Job Position</label>
                    <Input
                      placeholder='Enter Job Role/Position'
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className='mt-7 my-3'>
                    <label>Job description/Tech Stack</label>
                    <Textarea
                      placeholder='Job description/Tech Stack (In short)'
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div>
                    <h2>Add Details About Your Experience</h2>
                    <div className='mt-7 my-3'>
                      <label>Years of Experience</label>
                      <Input
                        placeholder='In Years'
                        type="number"
                        min="0"
                        max="100"
                        required
                        onChange={(event) => setJobExperience(event.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className='flex gap-5 justify-end'>
                  <Button type="button" variant='ghost' onClick={() => setOpenDialog(false)}>Cancel</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <><LoaderCircle className='animate-spin' />'Generating from Ai'</> : 'Start Interview'}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
