import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TOWN_BUILDINGS, TownBuildingData } from '../data/townData';

interface DigitalTownSceneProps {
  scrollProgress: number;
  mousePos: { x: number; y: number };
  activeBuildingIndex: number;
  onSelectBuilding?: (building: TownBuildingData) => void;
}

// Single Solid Textured 3D Historic Building (No wireframes)
function SolidHistoricBuilding({
  b,
  texture,
  isActive,
  onSelect,
}: {
  b: TownBuildingData;
  texture: THREE.Texture;
  isActive: boolean;
  onSelect: (b: TownBuildingData) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Group>(null);
  const halfH = b.h / 2;
  const isLeftSide = b.x < 0;

  // Gentle float or hover feedback & beacon pulse
  useFrame((state) => {
    if (groupRef.current) {
      const targetY = hovered || isActive ? 0.15 : 0;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1;
    }
    if (beaconRef.current) {
      beaconRef.current.rotation.y += 0.02;
      const s = 1.0 + Math.sin(state.clock.elapsedTime * 3) * 0.12;
      beaconRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[b.x, halfH, b.z]}
      rotation={[0, b.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(b);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. SOLID STONE FOUNDATION PLINTH */}
      <mesh position={[0, -halfH + 0.1, 0]}>
        <boxGeometry args={[b.w * 1.06, 0.22, b.d * 1.06]} />
        <meshStandardMaterial
          color="#2A2017"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* 2. SOLID MAIN ENCLOSURE CORE */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[b.w, b.h, b.d]} />
        <meshStandardMaterial
          color="#1A1511"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* 3. FRONT PRIMARY PHOTO TEXTURED FACADE (Facing Road) */}
      <mesh
        position={[0, 0, b.d / 2 + 0.03]}
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[b.w * 0.98, b.h * 0.96]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* 4. SIDE PHOTO TEXTURED FACADE (Facing approaching camera along main road) */}
      <mesh
        position={[isLeftSide ? b.w / 2 + 0.03 : -b.w / 2 - 0.03, 0, 0]}
        rotation={[0, isLeftSide ? Math.PI / 2 : -Math.PI / 2, 0]}
      >
        <planeGeometry args={[b.d * 0.96, b.h * 0.96]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* 5. BACK & OPPOSITE SIDES RUSTIC TIMBER / IRON CLADDING */}
      <mesh
        position={[0, 0, -b.d / 2 - 0.02]}
        rotation={[0, Math.PI, 0]}
      >
        <planeGeometry args={[b.w * 0.98, b.h * 0.96]} />
        <meshStandardMaterial
          color="#2E2319"
          roughness={0.9}
        />
      </mesh>

      {/* 6. CORRUGATED PITCH ROOF / ARCHITECTURE ACCENTS */}
      {(b.type === 'post' || b.type === 'supply' || b.type === 'hut' || b.type === 'workshop' || b.type === 'archive') && (
        <group position={[0, halfH + 0.38, 0]}>
          {/* Overhanging Gabled Roof */}
          <mesh rotation={[0, 0, 0]}>
            <coneGeometry args={[Math.max(b.w, b.d) * 0.65, 0.75, 4]} />
            <meshStandardMaterial
              color={hovered || isActive ? '#C68B59' : '#8A5D3B'}
              roughness={0.6}
              metalness={0.4}
            />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[b.w * 1.08, 0.1, b.d * 1.08]} />
            <meshStandardMaterial color="#3D2E1E" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* DUGOUT EARTHEN DOME & ENTRANCE */}
      {b.type === 'dugout' && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, halfH + 0.2, -b.d * 0.1]}>
            <sphereGeometry args={[b.w * 0.65, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#4A382A" roughness={0.95} />
          </mesh>
          {/* Dugout entrance arch */}
          <mesh position={[0, 0, b.d / 2 + 0.05]}>
            <torusGeometry args={[b.w * 0.35, 0.08, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#E0A96D" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* MINE HEADFRAME & PULLEY WHEEL */}
      {b.type === 'mine' && (
        <group position={[0, halfH + 1.2, 0]}>
          {/* Solid Timber/Steel Headframe Legs */}
          <mesh>
            <cylinderGeometry args={[0.15, 0.85, 2.5, 4]} />
            <meshStandardMaterial color="#2E3A3B" roughness={0.5} metalness={0.7} />
          </mesh>
          {/* Top Sheave Pulley Wheel */}
          <mesh position={[0, 1.35, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.45, 0.06, 12, 24]} />
            <meshStandardMaterial color="#4FD1C5" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Cyan shaft glow */}
          <pointLight color="#4FD1C5" intensity={isActive || hovered ? 3 : 1.5} distance={7} />
        </group>
      )}

      {/* 7. ACTIVE / HOVER GLOW RIM & BEACON */}
      {(hovered || isActive) && (
        <pointLight
          color={b.type === 'mine' ? '#4FD1C5' : '#E0A96D'}
          intensity={2.8}
          distance={8}
          position={[0, halfH + 0.8, 0]}
        />
      )}

      {/* 8. 3D PURE THREE.JS FLOATING RETICLE BEACON & PIN */}
      <group
        ref={beaconRef}
        position={[0, halfH + (b.type === 'mine' ? 3.0 : 1.2), 0]}
      >
        {/* Reticle Stem Line */}
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([0, -0.6, 0, 0, 0, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={b.type === 'mine' ? '#4FD1C5' : '#E0A96D'} transparent={true} opacity={0.6} />
        </line>

        {/* Outer Orbit Ring */}
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[0.22, 0.28, 16]} />
          <meshBasicMaterial
            color={b.type === 'mine' ? '#4FD1C5' : '#E0A96D'}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={hovered || isActive ? 1 : 0.7}
          />
        </mesh>

        {/* Inner Solid Core */}
        <mesh position={[0, 0.1, 0]}>
          <circleGeometry args={[0.1, 16]} />
          <meshBasicMaterial color={b.type === 'mine' ? '#4FD1C5' : '#D4A373'} />
        </mesh>
      </group>
    </group>
  );
}

// Surrounding Claim Huts & Outback Structures (Photo-textured)
function PeripheralClaims({ textures }: { textures: THREE.Texture[] }) {
  const claims = useMemo(() => {
    const list: Array<{
      x: number;
      z: number;
      w: number;
      h: number;
      d: number;
      rot: number;
      imgIdx: number;
    }> = [];

    for (let i = 0; i < 20; i++) {
      const z = -8 - (i / 20) * 62 + (Math.random() - 0.5) * 4;
      const isLeft = i % 2 === 0;
      const x = (isLeft ? -1 : 1) * (9.0 + (i % 4) * 2.8 + Math.random() * 2);
      const imgIdx = (i + 1) % 7;

      list.push({
        x,
        z,
        w: 2.8 + (i % 3) * 0.4,
        h: 1.8 + (i % 2) * 0.3,
        d: 2.8 + (i % 3) * 0.4,
        rot: (Math.random() - 0.5) * 0.5,
        imgIdx,
      });
    }
    return list;
  }, []);

  return (
    <group>
      {claims.map((c, idx) => {
        const tex = textures[c.imgIdx % textures.length];
        return (
          <group key={`claim-${idx}`} position={[c.x, c.h / 2, c.z]} rotation={[0, c.rot, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[c.w, c.h, c.d]} />
              <meshStandardMaterial color="#1E1712" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0, c.d / 2 + 0.02]}>
              <planeGeometry args={[c.w * 0.95, c.h * 0.95]} />
              <meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
            <mesh position={[0, c.h / 2 + 0.2, 0]}>
              <coneGeometry args={[c.w * 0.6, 0.4, 4]} />
              <meshStandardMaterial color="#704D31" roughness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 3D Desert Terrain Ground Surface & Road
function DesertTerrain() {
  const { geometry } = useMemo(() => {
    const width = 90;
    const depth = 130;
    const segmentsX = 64;
    const segmentsZ = 80;

    const planeGeom = new THREE.PlaneGeometry(width, depth, segmentsX, segmentsZ);
    planeGeom.rotateX(-Math.PI / 2);

    const pos = planeGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      const distFromCenter = Math.abs(x);
      const roadFactor = Math.exp(-(x * x) / 16); // flat main road

      let elevation =
        Math.sin(x * 0.12) * Math.cos(z * 0.08) * 1.6 +
        Math.sin(x * 0.28 + z * 0.2) * 0.5 +
        Math.pow(distFromCenter * 0.2, 1.3) * 0.35;

      elevation *= 1 - roadFactor * 0.85;

      // Mullock mounds
      const mound1 = Math.exp(-((x - 8) ** 2 + (z + 22) ** 2) / 16) * 3.0;
      const mound2 = Math.exp(-((x + 10) ** 2 + (z + 38) ** 2) / 20) * 3.5;
      const mound3 = Math.exp(-((x - 7) ** 2 + (z + 52) ** 2) / 14) * 2.8;

      elevation += mound1 + mound2 + mound3;

      pos.setY(i, elevation - 0.2);
    }

    planeGeom.computeVertexNormals();
    return { geometry: planeGeom };
  }, []);

  return (
    <group position={[0, -0.15, -35]}>
      {/* Solid Textured Desert Soil Surface */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#18130E"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle Road Strip Cladding */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 120]} />
        <meshStandardMaterial color="#140F0B" roughness={0.9} />
      </mesh>
    </group>
  );
}

// Underground Opal Seams & Silica Fire Lines
function SubsurfaceOpalVeins() {
  const lineRef = useRef<THREE.LineSegments>(null);

  const { linesGeometry, particlePositions, particleColors } = useMemo(() => {
    const points: number[] = [];
    const pCount = 300;
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);

    const opalColors = [
      new THREE.Color('#4FD1C5'), // Cyan
      new THREE.Color('#E0A96D'), // Copper
      new THREE.Color('#38B2AC'), // Teal
      new THREE.Color('#ED8936'), // Fire Amber
    ];

    for (let s = 0; s < 16; s++) {
      let curX = (Math.random() - 0.5) * 14;
      let curY = -0.3 - Math.random() * 0.6;
      let curZ = -Math.random() * 70;

      const segments = 10;
      for (let j = 0; j < segments; j++) {
        const nextX = curX + (Math.random() - 0.5) * 2;
        const nextY = curY + (Math.random() - 0.5) * 0.2;
        const nextZ = curZ - (2 + Math.random() * 3);

        points.push(curX, curY, curZ, nextX, nextY, nextZ);

        curX = nextX;
        curY = nextY;
        curZ = nextZ;
      }
    }

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 20;
      pPos[i * 3 + 1] = -0.2 - Math.random() * 1.0;
      pPos[i * 3 + 2] = -Math.random() * 75;

      const c = opalColors[Math.floor(Math.random() * opalColors.length)];
      pCol[i * 3] = c.r;
      pCol[i * 3 + 1] = c.g;
      pCol[i * 3 + 2] = c.b;
    }

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));

    return { linesGeometry: lineGeom, particlePositions: pPos, particleColors: pCol };
  }, []);

  useFrame((state) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group>
      <lineSegments ref={lineRef} geometry={linesGeometry}>
        <lineBasicMaterial color="#4FD1C5" transparent={true} opacity={0.5} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[particleColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
          sizeAttenuation={true}
        />
      </points>
    </group>
  );
}

// LiDAR Floating Atmosphere Dust
function LidarAtmosphere() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, count } = useMemo(() => {
    const pCount = 350;
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = -Math.random() * 75;
    }
    return { positions: pos, count: pCount };
  }, []);

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        let y = posAttr.getY(i) - delta * 0.25;
        if (y < 0) y = 8;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#D4A373"
        transparent={true}
        opacity={0.45}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Smooth Camera Controller with Physics Damping
function CameraRig({
  scrollProgress,
  mousePos,
}: {
  scrollProgress: number;
  mousePos: { x: number; y: number };
}) {
  useFrame(({ camera }, delta) => {
    // Clamped progress between 0 and 1
    const p = Math.max(0, Math.min(1, scrollProgress));

    // Smooth Z travel from z = 6 down to z = -72
    const targetZ = 6 - p * 76;

    // Smooth altitude descent
    let targetY = 5.8 - p * 4.4;
    if (p > 0.8) {
      targetY = 1.4 - (p - 0.8) * 1.8;
    }

    // Natural road curvature
    const roadCurveX = Math.sin(p * Math.PI * 2.8) * 1.6;
    const targetX = roadCurveX + mousePos.x * 1.0;
    const camY = targetY + mousePos.y * 0.6;

    // Smooth damp towards target
    const damp = Math.min(1, delta * 5.0);
    camera.position.x += (targetX - camera.position.x) * damp;
    camera.position.y += (camY - camera.position.y) * damp;
    camera.position.z += (targetZ - camera.position.z) * damp;

    // Look ahead down the town road
    const lookZ = camera.position.z - 12;
    const lookY = Math.max(-0.8, targetY - 0.6);
    const lookX = targetX * 0.45;

    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}

export function DigitalTown3D({
  scrollProgress,
  mousePos,
  activeBuildingIndex,
  onSelectBuilding,
}: DigitalTownSceneProps) {
  // Load all 7 building textures (1.png to 7.png)
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const list: THREE.Texture[] = [];
    for (let i = 1; i <= 7; i++) {
      const tex = loader.load(`/src/assets/images/${i}.png`);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      list.push(tex);
    }
    return list;
  }, []);

  const handleSelect = (b: TownBuildingData) => {
    if (onSelectBuilding) {
      onSelectBuilding(b);
    }
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 5.8, 6], fov: 52, near: 0.1, far: 140 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#020202', 16, 75]} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[12, 22, 10]} intensity={1.2} color="#F5D0A9" />
        <directionalLight position={[-12, 16, -20]} intensity={0.6} color="#4FD1C5" />
        <pointLight position={[0, 4, -30]} intensity={1.5} color="#E0A96D" distance={40} />

        <CameraRig scrollProgress={scrollProgress} mousePos={mousePos} />
        <DesertTerrain />

        {/* The 7 Primary Explorable Historical Buildings */}
        {TOWN_BUILDINGS.map((b, idx) => (
          <SolidHistoricBuilding
            key={b.id}
            b={b}
            texture={textures[b.imageIndex % textures.length]}
            isActive={activeBuildingIndex === idx}
            onSelect={handleSelect}
          />
        ))}

        {/* Peripheral Claim Huts */}
        <PeripheralClaims textures={textures} />

        <SubsurfaceOpalVeins />
        <LidarAtmosphere />
      </Canvas>
    </div>
  );
}
