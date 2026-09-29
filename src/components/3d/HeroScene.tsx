import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HeroSceneProps {
  className?: string;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // Scene & Camera setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Main rotating group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfaf9f5, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.8);
    keyLight.position.set(6, 9, 7);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8e8a82, 1.2);
    fillLight.position.set(-6, -4, -4);
    scene.add(fillLight);

    const terracottaRim = new THREE.DirectionalLight(0xb86b53, 3.2);
    terracottaRim.position.set(2, -7, 5);
    scene.add(terracottaRim);

    // Materials
    const gridLineMaterial = new THREE.MeshStandardMaterial({
      color: 0x282624,
      metalness: 0.1,
      roughness: 0.8,
    });

    const ivoryMaterial = new THREE.MeshStandardMaterial({
      color: 0xfaf9f5,
      metalness: 0.15,
      roughness: 0.28,
    });

    const terracottaMaterial = new THREE.MeshStandardMaterial({
      color: 0xb86b53,
      metalness: 0.25,
      roughness: 0.38,
    });

    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f1e1c,
      metalness: 0.2,
      roughness: 0.85,
    });

    // 1. Architectural 3x3 floating grid lines
    const gridGroup = new THREE.Group();
    const strutThickness = 0.045;
    const strutLength = 4.6;
    const strutGeom = new THREE.BoxGeometry(strutThickness, strutLength, strutThickness);

    // Vertical struts
    const v1 = new THREE.Mesh(strutGeom, gridLineMaterial);
    v1.position.x = -0.75;
    const v2 = new THREE.Mesh(strutGeom, gridLineMaterial);
    v2.position.x = 0.75;

    // Horizontal struts
    const h1 = new THREE.Mesh(strutGeom, gridLineMaterial);
    h1.rotation.z = Math.PI / 2;
    h1.position.y = 0.75;
    const h2 = new THREE.Mesh(strutGeom, gridLineMaterial);
    h2.rotation.z = Math.PI / 2;
    h2.position.y = -0.75;

    gridGroup.add(v1, v2, h1, h2);
    masterGroup.add(gridGroup);

    // 2. Helper to create architectural 3D 'X'
    function createTokenX(scale = 0.62) {
      const group = new THREE.Group();
      const geom = new THREE.BoxGeometry(0.12, 1.25, 0.14);
      const b1 = new THREE.Mesh(geom, ivoryMaterial);
      b1.rotation.z = Math.PI / 4;
      const b2 = new THREE.Mesh(geom, ivoryMaterial);
      b2.rotation.z = -Math.PI / 4;
      group.add(b1, b2);
      group.scale.set(scale, scale, scale);
      return group;
    }

    // 3. Helper to create architectural 3D 'O'
    function createTokenO(scale = 0.6) {
      const geom = new THREE.TorusGeometry(0.52, 0.085, 24, 48);
      const mesh = new THREE.Mesh(geom, terracottaMaterial);
      mesh.scale.set(scale, scale, scale);
      return mesh;
    }

    // Place tokens dynamically on grid positions:
    // Positions: [-1.5, 0, 1.5] for x and y
    const tokenPositions: { type: 'X' | 'O'; pos: [number, number, number]; rot?: [number, number, number] }[] = [
      { type: 'X', pos: [-1.5, 1.5, 0.15], rot: [0.1, 0.15, 0.05] },
      { type: 'O', pos: [0, 1.5, 0.22], rot: [0.2, -0.1, 0] },
      { type: 'O', pos: [1.5, 0, 0.18], rot: [-0.15, 0.25, 0] },
      { type: 'X', pos: [0, 0, 0.35], rot: [-0.1, 0.2, 0.1] },
      { type: 'X', pos: [-1.5, -1.5, 0.2], rot: [0.15, -0.1, 0.2] },
      { type: 'O', pos: [1.5, -1.5, 0.12], rot: [0.1, 0.15, -0.2] },
    ];

    const tokensGroup = new THREE.Group();
    tokenPositions.forEach((item) => {
      const token = item.type === 'X' ? createTokenX() : createTokenO();
      token.position.set(item.pos[0], item.pos[1], item.pos[2]);
      if (item.rot) {
        token.rotation.set(item.rot[0], item.rot[1], item.rot[2]);
      }
      tokensGroup.add(token);
    });
    masterGroup.add(tokensGroup);

    // 4. Subtle Orbital Rings
    const ringGeom1 = new THREE.TorusGeometry(3.6, 0.012, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x8e8a82,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    masterGroup.add(ring1);

    const ringGeom2 = new THREE.TorusGeometry(4.2, 0.009, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xb86b53,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
    });
    const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 5;
    masterGroup.add(ring2);

    // 5. Floating geometric stone plinths / micro cubes
    const floatingCubes: THREE.Mesh[] = [];
    const cubeGeom = new THREE.BoxGeometry(0.24, 0.24, 0.24);
    const cubeCoords: [number, number, number][] = [
      [-2.6, 2.4, -1.2],
      [2.8, -2.1, -0.9],
      [-2.2, -2.5, 0.8],
      [2.5, 2.6, 0.5],
      [0.2, 3.1, -1.5],
      [-3.0, 0.2, 1.2],
    ];

    cubeCoords.forEach((coord) => {
      const cube = new THREE.Mesh(cubeGeom, stoneMaterial);
      cube.position.set(coord[0], coord[1], coord[2]);
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      masterGroup.add(cube);
      floatingCubes.push(cube);
    });

    // 6. Ambient Dust Particles
    const particleCount = prefersReducedMotion ? 60 : 180;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfaf9f5,
      size: 0.04,
      transparent: true,
      opacity: 0.35,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Cursor tracking with lerp damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / rect.width - 0.5) * 2;
      mouse.targetY = -(clientY / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 600;
      const newH = container.clientHeight || 600;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      if (!prefersReducedMotion) {
        // Subtle organic rotation & parallax
        masterGroup.rotation.y = THREE.MathUtils.degToRad(-15) + mouse.x * 0.32 + Math.sin(elapsedTime * 0.35) * 0.06;
        masterGroup.rotation.x = THREE.MathUtils.degToRad(12) - mouse.y * 0.28 + Math.cos(elapsedTime * 0.4) * 0.04;
        masterGroup.position.y = Math.sin(elapsedTime * 0.7) * 0.08;

        // Individual gentle piece movement
        tokensGroup.children.forEach((child, idx) => {
          child.position.z = tokenPositions[idx].pos[2] + Math.sin(elapsedTime * 1.2 + idx) * 0.05;
        });

        // Orbital rings slow differential rotation
        ring1.rotation.z = elapsedTime * 0.06;
        ring2.rotation.z = -elapsedTime * 0.045;

        // Floating cubes slow tumble
        floatingCubes.forEach((cube, idx) => {
          cube.rotation.x += 0.004 * (idx % 2 === 0 ? 1 : -1);
          cube.rotation.y += 0.005;
        });

        // Dust rotation
        particles.rotation.y = elapsedTime * 0.015;
      } else {
        masterGroup.rotation.y = THREE.MathUtils.degToRad(-15);
        masterGroup.rotation.x = THREE.MathUtils.degToRad(12);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      strutGeom.dispose();
      ringGeom1.dispose();
      ringGeom2.dispose();
      cubeGeom.dispose();
      particleGeom.dispose();
      gridLineMaterial.dispose();
      ivoryMaterial.dispose();
      terracottaMaterial.dispose();
      stoneMaterial.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion]);

  if (!webGlSupported) {
    return (
      <div className={`flex items-center justify-center border border-white/10 p-8 ${className}`}>
        <div className="text-center font-mono-meta text-xs text-soft-gray/60">
          [ 3D ACCELERATION UNAVAILABLE — EDITORIAL CANVAS ACTIVE ]
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[380px] md:min-h-[520px] lg:min-h-[640px] pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
};
