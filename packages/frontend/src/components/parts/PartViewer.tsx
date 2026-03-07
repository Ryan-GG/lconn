import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useQuery } from '@tanstack/react-query';
import * as THREE from 'three';
import type { LdrawPartGeometry } from '@lconn/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchGeometry(filename: string): Promise<LdrawPartGeometry[]> {
  const response = await fetch(`${API_URL}/api/ldraw/parts/${filename}/geometry`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Unknown error');
  }
  return result.data;
}

interface ResolvedGeometry {
  linePositions: Float32Array;
  trianglePositions: Float32Array;
}

function resolveGeometry(
  filename: string,
  parentMatrix: THREE.Matrix4,
  geometryMap: Map<string, LdrawPartGeometry>,
): { lines: number[]; triangles: number[] } {
  const geom = geometryMap.get(filename);
  if (!geom) return { lines: [], triangles: [] };

  const lines: number[] = [];
  const triangles: number[] = [];
  const v = new THREE.Vector3();

  // Transform and collect line segments
  for (const line of geom.lines) {
    for (const vert of [line.v1, line.v2]) {
      v.set(vert.x, vert.y, vert.z);
      v.applyMatrix4(parentMatrix);
      lines.push(v.x, v.y, v.z);
    }
  }

  // Transform and collect triangles
  for (const tri of geom.triangles) {
    for (const vert of [tri.v1, tri.v2, tri.v3]) {
      v.set(vert.x, vert.y, vert.z);
      v.applyMatrix4(parentMatrix);
      triangles.push(v.x, v.y, v.z);
    }
  }

  // Transform and collect quads (split into 2 triangles)
  for (const quad of geom.quads) {
    const qv = [quad.v1, quad.v2, quad.v3, quad.v4].map((vert) => {
      const p = new THREE.Vector3(vert.x, vert.y, vert.z);
      p.applyMatrix4(parentMatrix);
      return p;
    });
    // Triangle 1: 0-1-2
    triangles.push(qv[0].x, qv[0].y, qv[0].z, qv[1].x, qv[1].y, qv[1].z, qv[2].x, qv[2].y, qv[2].z);
    // Triangle 2: 0-2-3
    triangles.push(qv[0].x, qv[0].y, qv[0].z, qv[2].x, qv[2].y, qv[2].z, qv[3].x, qv[3].y, qv[3].z);
  }

  // Recurse into subfile references
  for (const ref of geom.subfileRefs) {
    const t = ref.transform;
    const childMatrix = new THREE.Matrix4();
    childMatrix.set(
      t.a, t.b, t.c, t.x,
      t.d, t.e, t.f, t.y,
      t.g, t.h, t.i, t.z,
      0, 0, 0, 1,
    );
    const combined = new THREE.Matrix4().multiplyMatrices(parentMatrix, childMatrix);
    const childResult = resolveGeometry(ref.filename, combined, geometryMap);
    lines.push(...childResult.lines);
    triangles.push(...childResult.triangles);
  }

  return { lines, triangles };
}

function buildGeometry(geometries: LdrawPartGeometry[]): ResolvedGeometry {
  const geometryMap = new Map<string, LdrawPartGeometry>();
  for (const g of geometries) {
    geometryMap.set(g.filename, g);
  }

  // The first entry is the root part
  const rootFilename = geometries[0].filename;
  const identity = new THREE.Matrix4();
  const { lines, triangles } = resolveGeometry(rootFilename, identity, geometryMap);

  return {
    linePositions: new Float32Array(lines),
    trianglePositions: new Float32Array(triangles),
  };
}

function PartMesh({ geometries }: { geometries: LdrawPartGeometry[] }) {
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
