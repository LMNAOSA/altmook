import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PLYLoader } from 'three-stdlib';
import * as THREE from 'three';

function ProceduralOpalStone() {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geom = new THREE.DodecahedronGeometry(1.5, 4);
    const posAttr = geom.attributes.position;
    const count = posAttr.count;
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#3E7D91'),
      new THREE.Color('#A4683D'),
      new THREE.Color('#D8C6A4'),
      new THREE.Color('#1E2224'),
      new THREE.Color('#5C6958'),
      new THREE.Color('#35312D'),
    ];

    for (let i = 0; i < count; i++) {
      // Add organic noise deformation
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      const noise = (Math.sin(x * 3) + Math.cos(y * 3) + Math.sin(z * 3)) * 0.15;
      posAttr.setXYZ(i, x + noise, y + noise, z + noise);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geom.computeVertexNormals();
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.2;
      pointsRef.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.04}
        vertexColors={true}
        transparent={true}
        opacity={0.9}
        sizeAttenuation={true}
      />
    </points>
  );
}

function PLYMesh({ url }: { url: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loader = new PLYLoader();
    loader.load(
      url,
      (geom) => {
        geom.computeBoundingBox();
        const center = new THREE.Vector3();
        geom.boundingBox?.getCenter(center);
        geom.translate(-center.x, -center.y, -center.z);

        const box = new THREE.Box3().setFromObject(new THREE.Mesh(geom));
        const size = box.getSize(new THREE.Vector3()).length();
        const scale = 3 / (size || 1);
        geom.scale(scale, scale, scale);

        if (!geom.hasAttribute('color')) {
          const count = geom.attributes.position.count;
          const colors = new Float32Array(count * 3);
          for (let i = 0; i < count * 3; i++) colors[i] = 0.8;
          geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        }
        setGeometry(geom);
      },
      undefined,
      (err) => {
        console.warn('PLY load error, using procedural fallback:', err);
        setLoadError(true);
      }
    );
  }, [url]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15;
      pointsRef.current.rotation.x += delta * 0.05;
    }
  });

  if (loadError || !geometry) {
    return <ProceduralOpalStone />;
  }

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial 
        size={0.03}
        vertexColors={true}
        transparent={true}
        opacity={0.85}
        sizeAttenuation={true}
      />
    </points>
  );
}

export function OpalPointCloud({ url }: { url: string }) {
  return <PLYMesh url={url} />;
}

