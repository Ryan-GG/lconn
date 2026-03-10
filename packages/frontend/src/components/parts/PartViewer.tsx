import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useQuery } from '@tanstack/react-query';
import * as THREE from 'three';
import type { LdrawPartGeometry } from '@lconn/shared';
import { fetchGeometry, buildGeometry } from '@/lib/ldraw-geometry';

export function PartMesh({ geometries }: { geometries: LdrawPartGeometry[] }) {
  const resolved = useMemo(() => buildGeometry(geometries), [geometries]);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(resolved.linePositions, 3));
    return g;
  }, [resolved.linePositions]);

  const triGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(resolved.trianglePositions, 3));
    g.computeVertexNormals();
    return g;
  }, [resolved.trianglePositions]);

  // Compute bounding sphere for camera positioning
  const center = useMemo(() => {
    const box = new THREE.Box3();
    if (resolved.trianglePositions.length > 0) {
      triGeom.computeBoundingBox();
      if (triGeom.boundingBox) box.union(triGeom.boundingBox);
    }
    if (resolved.linePositions.length > 0) {
      lineGeom.computeBoundingBox();
      if (lineGeom.boundingBox) box.union(lineGeom.boundingBox);
    }
    const c = new THREE.Vector3();
    box.getCenter(c);
    const size = box.getSize(new THREE.Vector3()).length();
    return { center: c, size };
  }, [triGeom, lineGeom, resolved]);

  return (
    <group position={[-center.center.x, -center.center.y, -center.center.z]} scale={[1, -1, 1]}>
      {resolved.trianglePositions.length > 0 && (
        <mesh geometry={triGeom}>
          <meshBasicMaterial wireframe color="#4a9eff" />
        </mesh>
      )}
      {resolved.linePositions.length > 0 && (
        <lineSegments geometry={lineGeom}>
          <lineBasicMaterial color="#ffffff" />
        </lineSegments>
      )}
    </group>
  );
}

interface PartViewerProps {
  filename: string;
}

export function PartViewer({ filename }: PartViewerProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['partGeometry', filename],
    queryFn: () => fetchGeometry(filename),
  });

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center text-muted-foreground">Loading geometry...</div>;
  }

  if (error) {
    return <div className="h-[400px] flex items-center justify-center text-destructive">{error.message}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="h-[400px] flex items-center justify-center text-muted-foreground">No geometry available.</div>;
  }

  return (
    <div className="h-[400px] w-full rounded-md border bg-black/90">
      <Canvas camera={{ position: [0, 0, 150], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <PartMesh geometries={data} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
