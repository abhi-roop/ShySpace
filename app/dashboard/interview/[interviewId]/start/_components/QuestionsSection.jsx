import { Volume2 } from 'lucide-react';
import React, { useState } from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex, setActiveQuestionIndex }) {
    const [isSpeaking, setIsSpeaking] = useState(false); // State to track if speech is active

    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);

            // If already speaking, stop the speech
            if (isSpeaking) {
                window.speechSynthesis.cancel(); // Stop the current speech
                setIsSpeaking(false); // Update state
            } else {
                // Start speaking and set speaking state
                window.speechSynthesis.speak(speech);
                setIsSpeaking(true); // Update state

                // Event listener to reset speaking state when done
                speech.onend = () => setIsSpeaking(false);
            }
        } else {
            alert('Your browser does not support text to speech');
        }
    };

    return (
        <div className="p-8 border rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <h2 className="text-xl font-bold text-center mb-6 text-primary">Mock Interview Questions</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockInterviewQuestion?.length > 0 ? (
                    mockInterviewQuestion.map((item, index) => (
                        <h2
                            className={`p-4 rounded-full text-xs md:text-sm text-center cursor-pointer transition-colors duration-300 hover:bg-primary hover:text-white ${
                                activeQuestionIndex === index ? 'bg-primary text-white' : 'bg-secondary text-black'
                            }`}
                            key={index}
                            onClick={() => setActiveQuestionIndex(index)} // Click handler to set active question
                            aria-label={`Question ${index + 1}`} // Accessibility improvement
                        >
                            Question #{index + 1}
                        </h2>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-600">No questions available</p>
                )}
            </div>
            <h2 className="my-5 text-lg md:text-xl font-semibold text-center text-gray-800 transition-opacity duration-300 opacity-100">
                {mockInterviewQuestion[activeQuestionIndex]?.question}
            </h2>
            <div className="flex items-center justify-center mb-4">
                <Volume2 
                    onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)} 
                    className="cursor-pointer text-primary hover:text-blue-600 transition-colors duration-300"
                    size={30} // Adjust size of the icon
                />
            </div>
            <div className="flex gap-5">
                <h2 className="font-medium">Note:</h2>
                <p className="text-gray-600">Please ensure your answers are concise and relevant to the question asked.</p>
            </div>
            {mockInterviewQuestion.length > 0 && (
                <p className="text-sm text-gray-500 text-center mt-4">
                    Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}
                </p>
            )}
        </div>
    );
}

export default QuestionsSection;
