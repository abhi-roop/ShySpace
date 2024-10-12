"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import { MathUtils, Color, Vector3 } from "three";
import { useDrag } from "@use-gesture/react";
import { useRouter } from "next/navigation";

function RotatingCube() {
  const groupRef = useRef();
  const cubesRef = useRef([]);
  const [hovered, setHovered] = useState(false);
  const { size } = useThree();

  const cubePositions = useMemo(() => {
    return Array.from({ length: 3 }).flatMap((_, x) =>
      Array.from({ length: 3 }).flatMap((_, y) =>
        Array.from({ length: 3 }).map((_, z) => [x - 1, y - 1, z - 1])
      )
    );
  }, []);

  const colors = useMemo(() => [
    "#303030", // Dark Metallic Gray
    "#FFD700", // Metallic Gold
    "#4169E1", // Royal Blue Metallic
    "#FF4500", // Metallic Orange-Red
    "#2E8B57", // Metallic Sea Green
    "#FF1493", // Metallic Deep Pink
    "#9370DB", // Metallic Medium Purple
    "#CD7F32", // Metallic Bronze
    "#40E0D0", // Metallic Turquoise
  ], []);

  const targetPositions = useMemo(() => {
    return cubePositions.map(
      () =>
        new Vector3(
          MathUtils.randFloatSpread(10),
          MathUtils.randFloatSpread(10),
          MathUtils.randFloatSpread(10)
        )
    );
  }, [cubePositions]);

  const bind = useDrag(({ offset: [x, y] }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = y / 100;
      groupRef.current.rotation.y = x / 100;
    }
  });

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * (hovered ? 1 : 0.2);
      groupRef.current.rotation.y += delta * (hovered ? 1.4 : 0.3);
    }

    cubesRef.current.forEach((cube, index) => {
      if (cube) {
        const time = state.clock.getElapsedTime();
        const [x, y, z] = cubePositions[index];
        const targetPos = targetPositions[index];

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

        cube.scale.setScalar(
          MathUtils.lerp(0.9, 1.1, Math.sin(time * 4 + index) * 0.5 + 0.5)
        );

        const baseColor = new Color(colors[index % colors.length]);
        const shiftedColor = baseColor.offsetHSL(0, 0, Math.sin(time * 2 + index) * 0.1);
        cube.material.color.copy(shiftedColor);
        cube.material.emissive.copy(shiftedColor).multiplyScalar(0.2);
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
            metalness={0.9}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            reflectivity={1}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-auto md:overflow-hidden">
      <header className="container mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-500 hover:scale-105 transition-transform duration-300 ease-in-out">
            ShySpace
          </span>
        </div>
        <nav className="flex space-x-6">
          <a href="/questions" className="text-lg text-gray-300 hover:text-white transition duration-300 ease-in-out">About</a>
          <a href="/how-it-works" className="text-lg text-gray-300 hover:text-white transition duration-300 ease-in-out">Features</a>
          <a href="/connect" className="text-lg text-gray-300 hover:text-white transition duration-300 ease-in-out">Contact</a>
        </nav>
      </header>
    
      <div className="mt-8 text-left text-2xl md:text-3xl font-semibold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500">
        Name Definitely not inspired from SciSpace
      </div>
    
      <main className="container mx-auto h-screen px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500">
            Ace Your Interview: Gather Feedback Before You Go!
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Start preparing for your interview without the fear of being judged.
          </p>

          <button
            onClick={() => router.replace("/sign-in")}
            className="bg-gradient-to-r from-pink-500 to-blue-600 text-white hover:from-pink-600 hover:to-blue-700 flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
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

        <div className="md:w-1/2 mt-10 md:mt-0">
          <div className="w-full h-64 md:h-96 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-600 opacity-10 rounded-full filter blur-3xl animate-pulse"></div>
            <Canvas>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1.2} />
              <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={0.8} castShadow />
              <RotatingCube />
            </Canvas>
          </div>
        </div>
      </main>
    </div>
  );
}
