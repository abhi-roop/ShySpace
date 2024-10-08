'use client';

import { SignIn, useSignIn } from '@clerk/nextjs';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Euler, MathUtils, Vector3 } from 'three';
import { PerspectiveCamera, Environment, RoundedBox } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { useDrag } from '@use-gesture/react';

const COLORS = ['#0A0A0A']; // Metallic Black

function RubiksCube() {
  const groupRef = useRef();
  const [cubeState, setCubeState] = useState(Array(26).fill().map(() => ({
    rotation: new Euler(),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    position: new Vector3(),
  })));
  const [rotatingFace, setRotatingFace] = useState(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  const [globalRotation, setGlobalRotation] = useState(new Euler());
  const [isHovered, setIsHovered] = useState(false);

  const rotateFace = () => {
    const faces = ['x', 'y', 'z'];
    const randomFace = faces[Math.floor(Math.random() * faces.length)];
    const randomDirection = Math.random() < 0.5 ? 1 : -1;
    setRotatingFace({ axis: randomFace, direction: randomDirection });
    setRotationProgress(0);
  };

  useEffect(() => {
    const solveInterval = setInterval(() => {
      rotateFace();
    }, 2000);

    return () => clearInterval(solveInterval);
  }, []);

  useFrame((state, delta) => {
    const speedMultiplier = isHovered ? 2 : 1;

    setGlobalRotation((prev) => new Euler(
      prev.x + delta * 0.2 * speedMultiplier,
      prev.y + delta * 0.3 * speedMultiplier,
      prev.z + delta * 0.1 * speedMultiplier
    ));

    if (rotatingFace) {
      setRotationProgress((prev) => {
        const newProgress = prev + delta * 2 * speedMultiplier;
        if (newProgress >= 1) {
          setRotatingFace(null);
          setCubeState((prevState) =>
            prevState.map((cube) => ({
              ...cube,
              rotation: new Euler(
                MathUtils.euclideanModulo(cube.rotation.x, Math.PI / 2),
                MathUtils.euclideanModulo(cube.rotation.y, Math.PI / 2),
                MathUtils.euclideanModulo(cube.rotation.z, Math.PI / 2),
              ),
            }))
          );
          return 0;
        }
        return newProgress;
      });
    }
  });

  const bind = useDrag(({ offset: [x, y] }) => {
    setGlobalRotation(new Euler(y / 100, x / 100, 0));
  });

  const cubeSize = 0.9;
  const gap = 0.05;
  const positions = [-1, 0, 1];

  return (
    <group
      ref={groupRef}
      rotation={globalRotation}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      scale={[0.8, 0.8, 0.8]}
      {...bind()}
      style={{ cursor: 'pointer' }}
    >
      {positions.map((x, i) =>
        positions.map((y, j) =>
          positions.map((z, k) => {
            if (x === 0 && y === 0 && z === 0) return null;
            const index = (i * 9 + j * 3 + k) - (i > 0 ? 1 : 0) - (j > 0 ? 1 : 0) - (k > 0 ? 1 : 0);
            const shouldRotate =
              (rotatingFace?.axis === 'x' && x === 1) ||
              (rotatingFace?.axis === 'y' && y === 1) ||
              (rotatingFace?.axis === 'z' && z === 1);
            const rotationAngle = shouldRotate
              ? (Math.PI / 2) * rotationProgress * rotatingFace.direction
              : 0;
            return (
              <group
                key={`${x}-${y}-${z}`}
                position={[x * (cubeSize + gap), y * (cubeSize + gap), z * (cubeSize + gap)]}
                rotation={cubeState[index]?.rotation || new Euler()}
              >
                <group
                  rotation={new Euler(
                    rotatingFace?.axis === 'x' ? rotationAngle : 0,
                    rotatingFace?.axis === 'y' ? rotationAngle : 0,
                    rotatingFace?.axis === 'z' ? rotationAngle : 0
                  )}
                >
                  <RoundedBox args={[cubeSize, cubeSize, cubeSize]} radius={0.05} smoothness={4}>
                    <meshPhysicalMaterial
                      color={cubeState[index].color}
                      metalness={0.9}
                      roughness={0.1}
                      clearcoat={1}
                      clearcoatRoughness={0.1}
                      reflectivity={1}
                      envMapIntensity={1}
                    />
                  </RoundedBox>
                </group>
              </group>
            );
          })
        )
      )}
    </group>
  );
}

export default function Component() {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [isMounted, setIsMounted] = useState(false);

  const signIn = useSignIn(); // Use Clerk's useSignIn hook

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    setIsMounted(true);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showCube = windowWidth >= 768;

  return (
    <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 min-h-screen flex items-center justify-center p-4 duration-500">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden lg:flex lg:max-w-5xl w-full duration-500 ease-in-out transform hover:scale-105 hover:shadow-3xl">
        {isMounted && showCube && (
          <aside className="relative lg:w-1/2 h-96 lg:h-auto duration-500">
            <div className="absolute inset-0">
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <RubiksCube />
                <Environment preset="sunset" />
              </Canvas>
            </div>
          </aside>
        )}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <SignIn />
        </div>
      </div>
    </section>
  );
}
