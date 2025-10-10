'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const vertexShader = `
  varying vec2 vUv;
  void main() { 
    vUv = uv; 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
  }
`;

const fragmentShader = `
#ifdef GL_ES
precision lowp float;
#endif

uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

// Neural network inspired pattern
vec4 cppn_fn(vec2 coordinate, float in0, float in1, float in2) {
  vec2 p = coordinate;
  
  // Create multiple layers of neural-like patterns
  float layer1 = sin(p.x * 3.0 + iTime * 0.5) * cos(p.y * 2.0 + iTime * 0.3);
  float layer2 = sin(p.x * 5.0 - iTime * 0.4) * cos(p.y * 3.0 - iTime * 0.6);
  float layer3 = sin(p.x * 7.0 + iTime * 0.2) * cos(p.y * 4.0 + iTime * 0.8);
  
  // Combine layers with different weights
  float pattern = layer1 * 0.4 + layer2 * 0.3 + layer3 * 0.3;
  
  // Add some noise for organic feel
  float noise = sin(p.x * 20.0) * cos(p.y * 20.0) * 0.1;
  pattern += noise;
  
  // Create radial gradient from center
  float dist = length(p);
  float radial = 1.0 - smoothstep(0.0, 1.5, dist);
  
  // Combine pattern with radial
  float final = pattern * radial;
  
  // Color mapping - blue to purple gradient
  vec3 color1 = vec3(0.2, 0.4, 0.8); // Blue
  vec3 color2 = vec3(0.6, 0.3, 0.8); // Purple
  vec3 color3 = vec3(0.1, 0.1, 0.3); // Dark blue
  
  // Mix colors based on pattern intensity
  vec3 finalColor = mix(color3, mix(color1, color2, final * 0.5 + 0.5), final * 0.8 + 0.2);
  
  // Add some brightness variation
  finalColor *= (0.8 + 0.4 * sin(iTime * 0.3));
  
  return vec4(finalColor, 0.6 + 0.3 * final);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.y *= -1.0;
  
  // Animate the inputs slightly
  float in0 = 0.1 * sin(0.3 * iTime);
  float in1 = 0.1 * sin(0.69 * iTime);
  float in2 = 0.1 * sin(0.44 * iTime);
  
  gl_FragColor = cppn_fn(uv, in0, in1, in2);
}
`;

// Material
const CPPNShaderMaterial = shaderMaterial(
  { iTime: 0, iResolution: new THREE.Vector2(1,1) },
  vertexShader,
  fragmentShader
);
extend({ CPPNShaderMaterial });

function ShaderPlane() {
  const materialRef = useRef<any>(null!);
  
  useFrame((state) => {
    if (!materialRef.current) return;
    materialRef.current.iTime = state.clock.elapsedTime;
    const { width, height } = state.size;
    materialRef.current.iResolution.set(width, height);
  });
  
  return (
    <mesh position={[0, -0.75, -0.5]}>
      <planeGeometry args={[4, 4]} />
      {/* @ts-expect-error custom element from extend */}
      <cPPNShaderMaterial ref={materialRef} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Error boundary component
function ShaderErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20" />
    );
  }

  return <>{children}</>;
}

export default function NeuralShaderBG() {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // Entrance animation (blur -> clear)
  useGSAP(() => {
    if (!wrapRef.current) return;
    gsap.set(wrapRef.current, { 
      filter: 'blur(20px)', 
      scale: 1.06, 
      autoAlpha: 0.75 
    });
    gsap.to(wrapRef.current, { 
      filter: 'blur(0px)', 
      scale: 1, 
      autoAlpha: 1, 
      duration: 1.2, 
      ease: 'power3.out', 
      delay: 0.2 
    });
  });

  // Respect prefers-reduced-motion
  const reduce = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (reduce) {
    return (
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20" />
    );
  }

  return (
    <ShaderErrorBoundary>
      <div ref={wrapRef} className="absolute inset-0 -z-10" aria-hidden>
        <Suspense fallback={
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20" />
        }>
          <Canvas 
            camera={{ position: [0, 0, 1], fov: 75 }} 
            gl={{ antialias: true, alpha: false }} 
            dpr={[1, 2]} 
            style={{ width: '100%', height: '100%' }}
            onError={(error) => {
              console.warn('Canvas error:', error);
            }}
          >
            <ShaderPlane />
          </Canvas>
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
      </div>
    </ShaderErrorBoundary>
  );
}
