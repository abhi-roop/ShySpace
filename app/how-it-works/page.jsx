import { ArrowRight, CheckCircle, Cpu, FileVideo, LineChart, Users } from "lucide-react"
import Header from '../dashboard/_component/Header'

const steps = [
  {
    title: "User Registration",
    description: "Sign up easily with Clerk and personalize your experience by setting up your profile.",
    icon: <CheckCircle className="w-8 h-8 text-white" />,
  },
  {
    title: "Select Interview Type",
    description: "Choose from various formats and skill levels to tailor your mock interview experience.",
    icon: <Users className="w-8 h-8 text-white" />,
  },
  {
    title: "AI-Powered Interviews",
    description: "Experience realistic interviews with Gemini AI, generating relevant questions in real-time.",
    icon: <Cpu className="w-8 h-8 text-white" />,
  },
  {
    title: "Real-Time Feedback",
    description: "Receive instant feedback and access performance analytics to track your progress.",
    icon: <LineChart className="w-8 h-8 text-white" />,
  },
  {
    title: "Video Recording",
    description: "Coming Soon",
    icon: <FileVideo className="w-8 h-8 text-white" />,
  },
  {
    title: "Continuous Learning",
    description: "Access a curated library of resources and stay updated with tailored content.",
    icon: <ArrowRight className="w-8 h-8 text-white" />,
  },
]

export default function Component() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold text-center mb-12">How It Works</h1>
          <p className="text-xl text-center mb-16 max-w-3xl mx-auto">
            Welcome to Our AI Mock Interview App! Prepare for interviews with ease and confidence using our advanced
            technology and user-friendly design.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-6 mx-auto">
                  {step.icon}
                </div>
                <h2 className="text-2xl font-semibold text-center mb-4">{step.title}</h2>
                <p className="text-gray-300 text-center">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Journey Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you&apos;re a recent graduate or an experienced professional, our platform is designed to empower you
              to ace your interviews with confidence.
            </p>
            
          </div>
        </div>
      </div>
    </>
  )
}
