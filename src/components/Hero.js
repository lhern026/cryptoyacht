import {
  Sparkles,
  Cloud,
  Sky,
  ScrollControls,
  Scroll,
  Float,
  Image,
  Environment,
  Plane,
  Sphere,
  OrbitControls,
  PerspectiveCamera,
  Billboard,
  Text,
  Stars,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Text3DFacade } from "troika-3d-text";
import { useEffect, useRef } from "react";
import { angleToRadians } from "../utils/angle";
import * as THREE from "three";
import gsap from "gsap";
import { Link, Router } from "react-router-dom";
import { TextGeometry } from "three";
import { extend } from "@react-three/fiber";
import { FontLoader } from "three";

extend({ TextGeometry });

export default function Hero() {
  // Code to move the camera around
  const orbitControlsRef = useRef(null);
  useFrame((state) => {
    if (!!orbitControlsRef.current) {
      const { x, y } = state.mouse;
      orbitControlsRef.current.setAzimuthalAngle(-x * angleToRadians(45));
      orbitControlsRef.current.setPolarAngle((y + 1) * angleToRadians(90 - 30));
      orbitControlsRef.current.update();
    }
  });

  // Animation
  const ballRef = useRef(null);
  useEffect(() => {
    if (!!ballRef.current) {
      // Timeline
      const timeline = gsap.timeline({ paused: true });

      // x-axis motion
      timeline.to(ballRef.current.position, {
        x: 1,
        duration: 2,
        ease: "power2.out",
      });

      // y-axis motion
      timeline.to(
        ballRef.current.position,
        {
          y: 0.5,
          duration: 1,
          ease: "bounce.out",
        },
        "<"
      );

      // Play
      timeline.play();
    }
  }, [ballRef.current]);

  return (
    <>
      {/* Camera */}
      <PerspectiveCamera
        makeDefault
        aspect={1200 / 600}
        radius={(1200 + 600) / 4}
        fov={86}
        position={[3, 10, 2]}
        onUpdate={(self) => self.updateProjectionMatrix()}
      />
      <OrbitControls
        ref={orbitControlsRef}
        minPolarAngle={angleToRadians(60)}
        maxPolarAngle={angleToRadians(80)}
      />

      {/* Ball */}
      <Sparkles
        color={"#ffffff"}
        count={22222}
        size={0.9}
        scale={[20, 20, 20]}
        noise={0}
      />

      <Float
        speed={1} // Animation speed, defaults to 1
        rotationIntensity={1} // XYZ rotation intensity, defaults to 1
        floatIntensity={1} // Up/down float intensity, defaults to 1
      >
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
          position={[0, 2, 0.5]}
          args={[4, 100]}
        >
          <Text
            maxWidth={20}
            fontSize={2}
            outlineWidth={0.2}
            outlineColor="#000000"
            strokeWidth={".9%"}
            strokeColor="#000000"
          >
            CRYPTO YACHT CLUB
          </Text>
        </Billboard>
      </Float>

      {/* Car */}

      {/* Floor */}
      <mesh rotation={[-angleToRadians(90), 0, 0]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="rgb(6, 25, 39)" />
      </mesh>

      {/* Ambient light */}
      {/* <ambientLight args={["#746df9", 1]} /> */}

      {/* Spotlight light */}
      {/* <spotLight args={["#ffffff", 20, 90, angleToRadians(45), 0.4]} position={[-3, 1, 3]} castShadow /> */}

      {/* Environmnet */}
      <Environment background>
        <mesh>
          <sphereGeometry args={[100, 50, 100]} />

          <meshBasicMaterial color="#000000" side={THREE.BackSide} />
        </mesh>
      </Environment>
    </>
  );
}
