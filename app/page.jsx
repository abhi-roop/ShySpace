"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import { MathUtils, Color, Vector3 } from "three";
import { useDrag } from "@use-gesture/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Rotating Rubik's Cube component
function RotatingCube() {
  const groupRef = useRef();
  const cubesRef = useRef([]);
  const [hovered, setHovered] = useState(false);

  const { size } = useThree();

  // Original cube positions
  const cubePositions = useMemo(() => {
    return Array.from({ length: 3 }).flatMap((_, x) =>
      Array.from({ length: 3 }).flatMap((_, y) =>
        Array.from({ length: 3 }).map((_, z) => [x - 1, y - 1, z - 1])
      )
    );
  }, []);

  // Colors for the cubes
  const colors = useMemo(
    () => [
      "#FFD700", // Gold
      "#C0C0C0", // Silver
      "#000000", // Black
    ],
    []
  );

  // Target positions for cube dispersal (on hover)
  const targetPositions = useMemo(() => {
    return cubePositions.map(
      () =>
        new Vector3(
          MathUtils.randFloatSpread(8), // Increase spread distance
          MathUtils.randFloatSpread(8),
          MathUtils.randFloatSpread(8)
        )
    );
  }, [cubePositions]);

  // Drag event handler to rotate the cube group
  const bind = useDrag(({ offset: [x, y] }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = y / 100;
      groupRef.current.rotation.y = x / 100;
    }
  });

  // Animate the cubes
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * (hovered ? 1 : 0.2);
      groupRef.current.rotation.y += delta * (hovered ? 1.4 : 0.3);
    }

    // Update cube positions and colors
    cubesRef.current.forEach((cube, index) => {
      if (cube) {
        const time = state.clock.getElapsedTime();
        const [x, y, z] = cubePositions[index];
        const targetPos = targetPositions[index];

        // On hover, disperse the cubes further, else return to normal
        if (hovered) {
          cube.position.lerp(targetPos, 0.1);
        } else {
          cube.position.lerp(
            new Vector3(
              x + Math.sin(time * 2 + index) * 0.1,
              y + Math.cos(time * 2 + index) * 0.1,
              z + Math.sin(time * 3 + index) * 0.1
            ),
            0.1
          );
        }

        // Scale oscillation
        cube.scale.setScalar(
          MathUtils.lerp(0.9, 1.1, Math.sin(time * 4 + index) * 0.5 + 0.5)
        );

        // Dynamically change color hue for some variation
        const hue = (time * 50 + index * 20) % 360;
        cube.material.color.setHSL(hue / 360, 1, 0.5);
        cube.material.emissive.setHSL(hue / 360, 1, 0.2);
      }
    });
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...bind()}
      style={{ cursor: hovered ? "grab" : "auto" }}
    >
      {cubePositions.map((position, index) => (
        <mesh key={index} position={position} ref={(el) => (cubesRef.current[index] = el)}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshPhysicalMaterial
            color={colors[index % colors.length]}
            metalness={1}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            reflectivity={1}
            emissive={new Color(colors[index % colors.length]).multiplyScalar(0.2)}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main landing page component
export default function LandingPage() {
  const router = useRouter(); // Corrected router definition

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Header Section */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          
          <span className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            ShySpace
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Add any additional header elements if necessary */}
        </div>
      </header>
      <div className="text-center text-gray-400 text-lg">
        Name Definitely not inspired from SciSpace
      </div>

      {/* Main Content Section */}
      <main className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between py-20">
        {/* Left Section: Text Content */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Get Your Interview Feedback Before the Actual Interview!
          </h1>
          <p className="text-xl text-gray-400">
            Start preparing for your interview without the fear of being judged.
          </p>

          <button
            onClick={() => router.replace("/sign-in")}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 flex items-center space-x-2 px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Right Section: Rotating Cube */}
        <div className="md:w-1/2 mt-10 md:mt-0">
          <div className="w-full h-96 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 rounded-full filter blur-3xl animate-pulse"></div>
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <RotatingCube />
            </Canvas>
          </div>
        </div>
      </main>
    </div>
  );
}
