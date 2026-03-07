import type { LdrawSubfileRef, LdrawLineSegment, LdrawTriangle, LdrawQuad, Vertex, TransformMatrix } from '@lconn/shared';

function vertex(tokens: string[], offset: number): Vertex {
  return { x: Number(tokens[offset]), y: Number(tokens[offset + 1]), z: Number(tokens[offset + 2]) };
}

export interface ParsedLdrawContent {
  subfileRefs: LdrawSubfileRef[];
  lines: LdrawLineSegment[];
  triangles: LdrawTriangle[];
  quads: LdrawQuad[];
}

export function parseLdrawContent(content: string): ParsedLdrawContent {
  const subfileRefs: LdrawSubfileRef[] = [];
  const lines: LdrawLineSegment[] = [];
  const triangles: LdrawTriangle[] = [];
  const quads: LdrawQuad[] = [];

  for (const rawLine of content.split('\n')) {
    const line = rawLine.replace(/\r$/, '').trim();
    if (!line) continue;

    const tokens = line.split(/\s+/);
    const type = tokens[0];

    switch (type) {
      case '1': {
        // Sub-file reference: 1 <color> x y z a b c d e f g h i <file>
        if (tokens.length < 15) break;
        const colorCode = parseInt(tokens[1], 10);
        const t = tokens.slice(2, 14).map(Number);
        const transform: TransformMatrix = {
          x: t[0], y: t[1], z: t[2],
          a: t[3], b: t[4], c: t[5],
          d: t[6], e: t[7], f: t[8],
          g: t[9], h: t[10], i: t[11],
        };
        const filename = tokens.slice(14).join(' ').replace(/\\/g, '/').toLowerCase();
        subfileRefs.push({ colorCode, filename, transform });
        break;
      }
      case '2': {
        // Line segment: 2 <color> x1 y1 z1 x2 y2 z2
        if (tokens.length < 8) break;
        const colorCode = parseInt(tokens[1], 10);
        lines.push({ colorCode, v1: vertex(tokens, 2), v2: vertex(tokens, 5) });
        break;
      }
      case '3': {
        // Triangle: 3 <color> x1 y1 z1 x2 y2 z2 x3 y3 z3
        if (tokens.length < 11) break;
        const colorCode = parseInt(tokens[1], 10);
        triangles.push({ colorCode, v1: vertex(tokens, 2), v2: vertex(tokens, 5), v3: vertex(tokens, 8) });
        break;
      }
      case '4': {
        // Quad: 4 <color> x1 y1 z1 x2 y2 z2 x3 y3 z3 x4 y4 z4
        if (tokens.length < 14) break;
        const colorCode = parseInt(tokens[1], 10);
        quads.push({ colorCode, v1: vertex(tokens, 2), v2: vertex(tokens, 5), v3: vertex(tokens, 8), v4: vertex(tokens, 11) });
        break;
      }
      // Types 0 (comments) and 5 (optional lines) are skipped
    }
  }

  return { subfileRefs, lines, triangles, quads };
}
