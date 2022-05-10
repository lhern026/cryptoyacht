import {Cloud,Sky,ScrollControls,Scroll, Float, Image,Environment,Plane,Sphere, OrbitControls, PerspectiveCamera ,Billboard,Text} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Text3DFacade } from "troika-3d-text";
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
            <PerspectiveCamera makeDefault  
                    aspect={1200 / 600}
                    radius={(1200 + 600) / 4}
                    fov={46}
                    position={[5, 10, 2]}
                    onUpdate={self => self.updateProjectionMatrix()} />
            <OrbitControls ref={orbitControlsRef} minPolarAngle={angleToRadians(60)} maxPolarAngle={angleToRadians(80)} />

            {/* Ball */}
            
            <Sky distance={45000} sunPosition={[0, 6, 0]} inclination={10} azimuth={1}  />
            <Cloud
  opacity={0.5}
  speed={0.4} // Rotation speed
  width={10} // Width of the full cloud
  depth={1.5} // Z-dir depth
  segments={20} // Number of particles
/>
            <ScrollControls 
            pages={3} // Each page takes 100% of the height of the canvas
            distance={1} // A factor that increases scroll bar travel (default: 1)
            damping={4} // Friction, higher is faster (default: 4)
            horizontal={false} // Can also scroll horizontally (default: false)
            infinite={false}>
                <Scroll>
            <Float
                            speed={1.5} // Animation speed, defaults to 1
                            rotationIntensity={2} // XYZ rotation intensity, defaults to 1
                            floatIntensity={2} // Up/down float intensity, defaults to 1
 >
                <Billboard follow={true}
  lockX={false}
  lockY={false}
  lockZ={false}
                        position={[0,2,.500]}
                        args = {[4,100]}><Text fontSize={1} facade={[Text3DFacade]}>CRYPTO YACHT CLUB</Text>
        
              </Billboard>
                </Float></Scroll></ScrollControls>
            
       

            {/* Car */}
          

            {/* Floor */}
            <mesh rotation={[-(angleToRadians(90)), 0, 0]} receiveShadow>
                <planeGeometry args={[30, 30]} />
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

                    <meshBasicMaterial color="#746df9" side={THREE.BackSide} />
                </mesh>
            </Environment>
        </>
    )
}