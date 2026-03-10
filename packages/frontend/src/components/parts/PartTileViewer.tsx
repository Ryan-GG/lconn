import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useQuery } from '@tanstack/react-query';
import * as THREE from 'three';
import type { LdrawPartGeometry } from '@lconn/shared';
import { fetchGeometry, buildGeometry } from '@/lib/ldraw-geometry';

function SpinningMesh({ geometries }: { geometries: LdrawPartGeometry[] }) {
  const groupRef = useRef<THREE.Group>(null);
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

  // Compute bounds and normalize scale
  const { center, scale } = useMemo(() => {
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
    // Normalize so all parts fit in roughly the same visual size
    const targetSize = 100;
    const s = size > 0 ? targetSize / size : 1;
    return { center: c, scale: s };
  }, [triGeom, lineGeom, resolved]);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.5 * delta;
    }
  });

  return (
    <group ref={groupRef}>
      <group position={[-center.x, -center.y, -center.z]} scale={[scale, -scale, scale]}>
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
    </group>
  );
}

interface PartTileViewerProps {
  filename: string;
  enabled: boolean;
}

export function PartTileViewer({ filename, enabled }: PartTileViewerProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['partGeometry', filename],
    queryFn: () => fetchGeometry(filename),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  if (!enabled || isLoading) {
    return (
      <div className="h-[180px] flex items-center justify-center text-muted-foreground text-xs">
        Loading...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[180px] flex items-center justify-center text-muted-foreground text-xs">
        No preview
      </div>
    );
  }

  return (
    <div className="h-[180px] w-full bg-black/90 rounded-t-lg">
      <Canvas
        camera={{ position: [0, 0, 150], fov: 50 }}
        gl={{ antialias: false, powerPreference: 'low-power' }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.5} />
        <SpinningMesh geometries={data} />
      </Canvas>
    </div>
  );
}
