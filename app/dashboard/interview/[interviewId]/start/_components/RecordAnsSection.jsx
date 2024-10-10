'use strict';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Webcam } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { useToast } from "@/hooks/use-toast";  // Properly import useToast
import { chatSession } from '@/utils/GeminiAiModel';
import { UserAnswer } from '@/utils/schema';
import moment from 'moment';  // Make sure moment.js is imported if you're using it
import { db } from '@/utils/db';

function RecordAnsSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, user }) {
    const [userAnswer, setUserAnswer] = useState(''); // State to hold the recorded answer
    const { toast } = useToast();  // Destructure toast from useToast
    const [loading, setLoading] = useState(false);
    
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
        setResults
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        // Log results to check structure
        console.log(results);

        // Update userAnswer based on the results from speech-to-text
        results.forEach((result) => {
            if (result?.transcript) {
                setUserAnswer((prevAns) => prevAns + result.transcript + ' '); // Accumulate transcriptions with a space
            }
        });
    }, [results]);

    const StartsStopRecording = async () => {
        if (isRecording) {
            setLoading(true);
            stopSpeechToText();
    
            if (userAnswer?.length <= 5) {
                setLoading(false);
                toast({
                    title: "Uh oh! Something went wrong.",
                    description: "Please speak more than 10 words.",
                    variant: "destructive",  
                });
                return; 
            }
    
            const feedbackPrompt = "Question: " + mockInterviewQuestion[activeQuestionIndex].question +
                " Answer: " + userAnswer +
                ", Depending on the question and user answer for the given interview question, " +
                "please give us a rating for the answer and feedback as areas of improvement if any in just 3-5 lines. " +
                "Format it in JSON with fields for 'rating' and 'feedback'.";
    
            try {
                const result = await chatSession.sendMessage(feedbackPrompt);
                const responseText = await result.response.text();
               // console.log("Response Text:", responseText); // Log the entire response
    
                // Use regex to find the first valid JSON object in the response
                const jsonMatch = responseText.match(/{.*}/s);
                if (!jsonMatch) {
                    console.error("No JSON found in the response.");
                    setLoading(false);
                    return;
                }
    
                const cleanedJson = jsonMatch[0]; // Extract the matched JSON string
                //console.log("Cleaned JSON:", cleanedJson);
    
                // Try parsing the cleaned response
                let parsedJson;
                try {
                    parsedJson = JSON.parse(cleanedJson);
                    console.log("Parsed JSON:", JSON.stringify(parsedJson));
                } catch (error) {
                    console.error("Failed to parse JSON:", error);
                    setLoading(false);
                    return;
                }
    
                const resp = await db.insert(UserAnswer)
                    .values({
                        mockIdRef: interviewData?.mockId,
                        question: mockInterviewQuestion[activeQuestionIndex]?.question,
                        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                        userAns: userAnswer,
                        feedback: parsedJson?.feedback,
                        rating: parsedJson?.rating,
                        userEmail: user?.primaryEmailAddress?.emailAddress,
                        createdAt: moment().format('DD-MM-YYYY')
                    });
    
                if (resp) {
                    toast({
                        title: "Success",
                        description: "User Answer Saved Successfully",
                        variant: "success",
                    });
                    setResults([]); // Clear results after saving
                }
                setResults([]);
                setLoading(false);
    
            } catch (error) {
                console.error("Error fetching feedback:", error);
                setLoading(false);
            }
    
        } else {
            setUserAnswer(''); // Clear userAnswer when starting recording again
            startSpeechToText();
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl h-full">
            <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                <Image
                    className="relative z-10 rounded-full shadow-md transition-transform duration-300 group-hover:scale-105"
                    src="/webcam.png"
                    alt="Webcam"
                    width={160}
                    height={160}
                />
            </div>
            <div className="space-y-4 w-full max-w-xs">
                <Button
                    disabled={loading}
                    className="w-full py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center mx-auto bg-blue-500 text-white hover:bg-blue-600 rounded-md"
                    variant="default"
                    onClick={StartsStopRecording}
                >
                    <Webcam className="mr-2" size={24} />
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Button>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <ul className="text-gray-800">
                    {results.map((result, index) => (
                        <li key={index} className="py-1 border-b border-gray-300">
                            {typeof result.transcript === 'string' ? result.transcript : 'Invalid response'}
                        </li>
                    ))}
                    {interimResult && <li className="italic text-gray-600">{interimResult}</li>}
                </ul>
            </div>
            <Button 
            disabled={true}
                onClick={() => console.log(userAnswer)} 
                className="mt-4 py-2 px-6 text-md font-semibold transition-all duration-300 hover:scale-105 bg-green-500 text-white rounded-md"
            >
                Show User Answer
            </Button>
        </div>
    );
}

export default RecordAnsSection;
