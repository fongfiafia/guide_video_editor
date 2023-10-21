import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import * as THREE from 'three';
import dd from "../video/test.mp4";

const VideoPlane = ({ videoElement }) => {
    const videoTexture = useMemo(() => {
        const texture = new THREE.VideoTexture(videoElement);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        // texture.format = THREE.RGBFormat;
        return texture;
    }, [videoElement]);

    const planeRef = useRef();

    useFrame(() => {
        // Rotate the plane (optional)
        planeRef.current.rotation.y += 0.005;
    });

    return (
        <mesh ref={planeRef} position={[0, 0, 0]}>
            <planeGeometry args={[16, 9]} />
            <meshBasicMaterial map={videoTexture} />
        </mesh>
    );
};

const App = () => {
    const videoRef = useRef();

    return (
        <Canvas>
            <VideoPlane videoElement={videoRef.current} />
            <video ref={videoRef} autoPlay loop crossOrigin="anonymous" muted>
                <source src={dd} type="video/mp4" />
            </video>
        </Canvas>
    );
};

export default App;
