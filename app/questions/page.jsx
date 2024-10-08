import React from 'react'
import { ArrowRight, Eye, Target } from 'lucide-react'
import Header from '../dashboard/_component/Header'

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-purple-900 text-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-purple-100 mb-12">About Us</h1>

          <section className="mb-16 bg-purple-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-semibold text-purple-200 mb-4">Who We Are</h2>
            <p className="text-purple-100 leading-relaxed">
              We are a dedicated team of AI enthusiasts and interview experts committed to revolutionizing the way people prepare for job interviews. Our AI-powered platform provides personalized interview practice, feedback, and coaching to help job seekers succeed in their career journeys.
            </p>
          </section>

          <section className="mb-16 bg-purple-800 rounded-lg p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <Eye className="w-8 h-8 text-purple-300 mr-3" />
              <h2 className="text-3xl font-semibold text-purple-200">Our Vision</h2>
            </div>
            <p className="text-purple-100 leading-relaxed">
              To create a world where every job seeker has access to top-quality interview preparation, leveling the playing field and enabling individuals to showcase their true potential to prospective employers.
            </p>
          </section>

          <section className="mb-16 bg-purple-800 rounded-lg p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <Target className="w-8 h-8 text-purple-300 mr-3" />
              <h2 className="text-3xl font-semibold text-purple-200">Our Mission</h2>
            </div>
            <p className="text-purple-100 leading-relaxed">
              To empower job seekers with cutting-edge AI technology that provides personalized interview practice, real-time feedback, and actionable insights, helping them build confidence and excel in their job interviews.
            </p>
          </section>

          <section className="text-center bg-purple-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-semibold text-purple-200 mb-4">Join Us on Our Journey</h2>
            <p className="text-purple-100 leading-relaxed mb-6">
              We're constantly innovating and improving our platform to better serve job seekers like you. Start your interview preparation journey with us today and take the first step towards your dream career.
            </p>
        
          </section>
        </div>
      </div>
    </>
  )
}