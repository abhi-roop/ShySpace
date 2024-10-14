"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import { MathUtils, Color, Vector3 } from "three";
import { useDrag } from "@use-gesture/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function RotatingCube() {
  const groupRef = useRef();
  const cubesRef = useRef([]);
  const [hovered, setHovered] = useState(false);
  const { size } = useThree();

  const cubePositions = useMemo(() => {
    return Array.from({ length: 4 }).flatMap((_, x) =>
      Array.from({ length: 4 }).flatMap((_, y) =>
        Array.from({ length: 4 }).map((_, z) => [x - 1.5, y - 1.5, z - 1.5])
      )
    );
  }, []);

  const colors = useMemo(() => [
    "#3A3A3A", "#2B8CBE", "#2C8EAA", "#FF8B6A", "#5BAE9B",
    "#D89B53", "#7E56C2", "#3AAEBF", "#FF8FF4",
  ], []);

  const targetPositions = useMemo(() => {
    return cubePositions.map(() =>
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
          <boxGeometry args={[0.75, 0.75, 0.75]} />
          <meshPhysicalMaterial
            color={colors[index % colors.length]}
            metalness={0.7}
            roughness={0.2}
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
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      <header className="w-full bg-gray-800 bg-opacity-90 py-6 shadow-md">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <span className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-blue-500">
              ShySpace
            </span>
          </motion.div>
          <nav className="flex space-x-6">
            {["About", "Features", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-lg text-gray-300 hover:text-white transition duration-300 ease-in-out"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-5rem)] py-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:w-1/2 space-y-8 mb-10 lg:mb-0"
        >
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-500 mb-6">
            Ace Your Interview: Gather Feedback Before You Go!
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 mb-8">
            Start preparing for your interview without the fear of being judged. Practice, learn, and improve with ShySpace.
          </p>

          <motion.button
            onClick={() => router.replace("/sign-in")}
            className="bg-gradient-to-r from-pink-500 to-blue-600 text-white hover:from-pink-600 hover:to-blue-700 flex items-center space-x-2 px-8 py-4 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 mr-2" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.28 1.68-3.3 2.66-5.71 2.66-4.49 0-8.13-3.58-8.13-8.03 0-4.44 3.63-8.02 8.13-8.02 2.47 0 4.73.93 6.47 2.46l2.92-2.91c-2.27-2.04-5.22-3.2-9.39-3.2-6.02 0-10.89 4.89-10.89 10.89 0 6 4.88 10.89 10.89 10.89z" />
            </svg>
            <span>Get Started with Google</span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:w-1/2"
        >
          <Canvas camera={{ position: [5, 5, 5], fov: 55 }}>
            <ambientLight intensity={0.3} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <RotatingCube />
          </Canvas>
        </motion.div>
      </main>
    </div>
  );
}
