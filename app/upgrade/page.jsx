'use client'

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../dashboard/_component/Header'; // Ensure this path is correct

// Clock Component
const AnalogClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Calculate the angles for the clock hands
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondHandStyle = {
        transform: `rotate(${(seconds / 60) * 360}deg)`,
    };

    const minuteHandStyle = {
        transform: `rotate(${(minutes / 60) * 360 + (seconds / 60) * 6}deg)`,
    };

    const hourHandStyle = {
        transform: `rotate(${(hours % 12) / 12 * 360 + (minutes / 60) * 30}deg)`,
    };

    return (
        <div className="relative w-40 h-40 md:w-52 md:h-52 border-8 border-white rounded-full flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full border-4 border-white">
                <div className="absolute w-1 h-1 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <motion.div
                className="absolute w-1 bg-red-500"
                style={{ height: '40%', ...secondHandStyle }}
                animate={{ rotate: seconds * 6 }}
                transition={{ duration: 1, ease: 'linear' }} />
            <motion.div
                className="absolute w-2 bg-gray-400"
                style={{ height: '30%', ...minuteHandStyle }} />
            <motion.div
                className="absolute w-3 bg-gray-800"
                style={{ height: '25%', ...hourHandStyle }} />
        </div>
    );
};

function ComingSoonPage() {
    return (
        <>
            <Header className="fixed top-0 left-0 w-full" />
            <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 flex flex-col items-center justify-center text-white p-4">
                <motion.h1
                    className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mt-16"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Coming Soon
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl mb-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    We're crafting something amazing. Stay tuned!
                </motion.p>

                <AnalogClock />

                <motion.div
                    className="mt-12 text-sm text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                >
                    <p>&copy; 2024 Abhiroop Kumar Singh. <br /> All rights reserved.</p>
                    <div className="mt-2">
                        <a href="#" className="text-blue-400 hover:text-blue-300 mx-2">Privacy Policy</a>
                        <a href="#" className="text-blue-400 hover:text-blue-300 mx-2">Terms of Service</a>
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export default ComingSoonPage;
