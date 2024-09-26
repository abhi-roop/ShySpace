'use client'

import { SignIn } from '@clerk/nextjs'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { MeshStandardMaterial, Euler } from 'three'
import { PerspectiveCamera, Text } from '@react-three/drei' // Import Text from @react-three/drei

function RubiksCube() {
    const groupRef = useRef()
    const [hovered, setHovered] = useState(false)
    const [time, setTime] = useState(0)
    const [solving, setSolving] = useState(false)

    const cubeSize = 0.3
    const gap = 0.05
    const positions = [-1, 0, 1]
    const colors = ['#FF5252', '#FFFFFF', '#FFA000', '#4CAF50', '#2196F3', '#9C27B0']

    // Simulate cube-solving rotations
    useEffect(() => {
        if (solving) {
            let step = 0
            const solveInterval = setInterval(() => {
                if (groupRef.current) {
                    groupRef.current.rotation.x += Math.PI / 2
                    groupRef.current.rotation.y += Math.PI / 2
                    groupRef.current.rotation.z += Math.PI / 2
                    step++
                }
                if (step >= 8) {
                    clearInterval(solveInterval)
                    setSolving(false) // Reset after solving
                }
            }, 500)
        }
    }, [solving])

    // Continuous 360-degree rotation in all axes
    useFrame((state, delta) => {
        setTime((prevTime) => prevTime + delta)
        const speedFactor = hovered ? 2 : 1
        groupRef.current.rotation.x += delta * speedFactor // Rotate on x-axis
        groupRef.current.rotation.y += delta * speedFactor // Rotate on y-axis
        groupRef.current.rotation.z += delta * speedFactor // Rotate on z-axis
    })

    const getRotation = (x, y, z) => {
        const rotationSpeed = 2
        const rotationAmplitude = Math.PI / 4
        return new Euler(
            Math.sin(time * rotationSpeed + x) * rotationAmplitude,
            Math.sin(time * rotationSpeed + y) * rotationAmplitude,
            Math.sin(time * rotationSpeed + z) * rotationAmplitude
        )
    }

    return (
        <group
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={() => setSolving(true)} // Trigger solve on click
        >
            {positions.map((x, i) =>
                positions.map((y, j) =>
                    positions.map((z, k) => (
                        <mesh 
                            key={`${x}-${y}-${z}`} 
                            position={[x * (cubeSize + gap), y * (cubeSize + gap), z * (cubeSize + gap)]}
                            rotation={getRotation(x, y, z)}
                        >
                            <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
                            <meshStandardMaterial
                                color={colors[(i + j + k) % colors.length]}
                                metalness={1} // Increased metalness for shiny effect
                                roughness={0} // Reduced roughness for more reflective surface
                            />
                        </mesh>
                    ))
                )
            )}
            {/* Add the text "We are Venom" below the cube */}
            
        </group>
    )
}

export default function Page() {
    const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const showCube = windowWidth >= 768 // Show cube on medium devices and larger

    return (
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden lg:flex lg:max-w-6xl w-full">
                {showCube && (
                    <aside className="relative lg:w-1/2 h-64 lg:h-auto">
                        <div className="absolute inset-0">
                            <Canvas>
                                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                                <ambientLight intensity={0.8} /> {/* Increased ambient light for brightness */}
                                <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1.5} />
                                <pointLight position={[-10, -10, -10]} intensity={0.8} />
                                <RubiksCube />
                            </Canvas>
                        </div>
                    </aside>
                )}

                <main className={`p-8 lg:p-12 ${showCube ? 'lg:w-1/2' : 'w-full'}`}>
                    <div className="max-w-md mx-auto">
                        <a className="block text-primary hover:text-primary-dark transition-colors" href="#">
                            <span className="sr-only">Home</span>
                            <svg
                                className="h-8 sm:h-10 w-auto"
                                viewBox="0 0 28 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.146 16.175 12.9095 15.924 13.69 15.9447C14.4705 15.924 15.234 16.175 15.85 16.6547C16.988 17.4489 18.3423 17.8747 19.73 17.8747C21.1177 17.8747 22.472 17.4489 23.61 16.6547H23.62Z"
                                    fill="#000"
                                />
                            </svg>
                        </a>
                        <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900">Welcome to InterviePrep</h1>
                        <p className="mt-4 text-gray-600">Prepare for your interview</p>
                        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
                    </div>
                </main>
            </div>
        </section>
    )
}
