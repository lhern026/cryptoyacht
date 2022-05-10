import { Html,Environment,Plane,Sphere, OrbitControls, PerspectiveCamera ,Billboard, Text} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { useEffect, useRef } from "react";
import { angleToRadians } from "../utils/angle";
import * as THREE from "three";
import gsap from "gsap";
import { Link, Router} from "react-router-dom";



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
    })

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
                ease: "power2.out"
            });

            // y-axis motion
            timeline.to(ballRef.current.position, {
                y: 0.5,
                duration: 1,
                ease: "bounce.out"
            }, "<");

            // Play
            timeline.play();
        }
    }, [ballRef.current])

    return (
        <>
            {/* Camera */}
            <PerspectiveCamera makeDefault position={[6, 1, 5]} />
            <OrbitControls ref={orbitControlsRef} minPolarAngle={angleToRadians(60)} maxPolarAngle={angleToRadians(80)} />

            {/* Ball */}
            
           
            <Sphere>
              <meshBasicMaterial color="hotpink" />
            </Sphere>
            
            <Billboard
                        position={[0,1,.5]}
                        args = {[440,300]}><Text onPointerOver={screen}  fontSize={.7} color="#ffffff"anchorX="center"characters="abcdefghijklmnopqrstuvwxyz0123456789!" anchorY="middle">CRYPTO YACHT CLUB</Text>
            <meshBasicMaterial attach="material" color="rgb(9,15,74)" />
              </Billboard>
       

            {/* Car */}
          

            {/* Floor */}
            <mesh rotation={[-(angleToRadians(90)), 0, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="rgb(6, 25, 39)" />
            </mesh>

            {/* Ambient light */}
            <ambientLight args={["#ffffff", 1]} />

            {/* Spotlight light */}
            <spotLight args={["#746df9", 80, 7, angleToRadians(45), 0.4]} position={[-3, 1, 3]} castShadow />

            {/* Environmnet */}
            <Environment background>
                <mesh>
                    <sphereGeometry args={[100, 50, 100]} />

                    <meshBasicMaterial color="#746df9" side={THREE.BackSide} />
                </mesh>
            </Environment>
        </>
    )
}