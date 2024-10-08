'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import Webcam from 'react-webcam';
import { WebcamIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Component({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(params.interviewId);
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));
            setInterviewData(result[0]);
        } catch (error) {
            console.error('Failed to fetch interview details:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black to-purple-800 py-12 text-black">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl text-white  font-bold text-center mb-12">Let's Get Started</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="border border-indigo-500 p-8 rounded-lg bg-white shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6">Camera Preview</h2>
                        <div className="flex flex-col items-center justify-center">
                            {webCamEnabled ? (
                                <Webcam
                                    onUserMedia={() => setWebCamEnabled(true)}
                                    onUserMediaError={() => setWebCamEnabled(false)}
                                    className="border border-indigo-500 rounded-lg"
                                    style={{
                                        height: 300,
                                        width: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <div className="flex flex-col items-center border border-indigo-500 p-8 rounded-lg bg-gradient-to-br from-purple-800 to-purple-700">
                                    <WebcamIcon className="h-40 w-40 text-indigo-300 mb-6" />
                                    <Button
                                        disabled={true}
                                        onClick={() => setWebCamEnabled(true)}
                                        className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                                    >
                                        Video Recording Coming Soon
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border border-indigo-500 p-8 rounded-lg bg-white shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6">Interview Details</h2>
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-12 w-12 animate-spin text-indigo-300" />
                            </div>
                        ) : interviewData ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-xl">Job Role/Position</h3>
                                    <p className="text-black mt-2">{interviewData.jobPosition}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl">Job Description</h3>
                                    <p className="text-black mt-2">{interviewData.jobDesc}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-xl">Years of Experience</h3>
                                    <p className="text-black mt-2">{interviewData.jobExperience}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-black">No interview data available.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-12">
                <Link href={'/dashboard/interview/' + params.interviewId + '/start'}>
                    <Button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-lg font-semibold shadow-lg">
                        Start Interview
                    </Button>
                </Link>
            </div>
        </div>
    );
}
