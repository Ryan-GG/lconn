import type { LdrawSubfileRef, LdrawLineSegment, LdrawTriangle, LdrawQuad } from '@lconn/shared';

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
        const transform = tokens.slice(2, 14).map(Number);
        const filename = tokens.slice(14).join(' ').replace(/\\/g, '/').toLowerCase();
        subfileRefs.push({ colorCode, filename, transform });
        break;
      }
      case '2': {
        // Line segment: 2 <color> x1 y1 z1 x2 y2 z2
        if (tokens.length < 8) break;
        const colorCode = parseInt(tokens[1], 10);
        const vertices = tokens.slice(2, 8).map(Number);
        lines.push({ colorCode, vertices });
        break;
      }
      case '3': {
        // Triangle: 3 <color> x1 y1 z1 x2 y2 z2 x3 y3 z3
        if (tokens.length < 11) break;
        const colorCode = parseInt(tokens[1], 10);
        const vertices = tokens.slice(2, 11).map(Number);
        triangles.push({ colorCode, vertices });
        break;
      }
      case '4': {
        // Quad: 4 <color> x1 y1 z1 x2 y2 z2 x3 y3 z3 x4 y4 z4
        if (tokens.length < 14) break;
        const colorCode = parseInt(tokens[1], 10);
        const vertices = tokens.slice(2, 14).map(Number);
        quads.push({ colorCode, vertices });
        break;
      }
      // Types 0 (comments) and 5 (optional lines) are skipped
    }
  }

  return { subfileRefs, lines, triangles, quads };
}
