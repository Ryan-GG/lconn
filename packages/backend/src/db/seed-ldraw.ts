import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { ldrawParts } from './schema';
import { sql } from 'drizzle-orm';

dotenv.config();

interface PartRecord {
  filename: string;
  description: string;
  partType: 'part' | 'subpart' | 'primitive';
  content: string;
}

function parsePartsLst(ldrawDir: string): Map<string, string> {
  const lstPath = path.join(ldrawDir, 'parts.lst');
  const content = fs.readFileSync(lstPath, 'utf-8');
  const map = new Map<string, string>();

  for (const rawLine of content.split('\n')) {
    const line = rawLine.replace(/\r$/, '').trim();
    if (!line) continue;
    const match = line.match(/^(\S+\.dat)\s{2,}(.+)$/);
    if (match) {
      map.set(match[1].toLowerCase(), match[2].trim());
    }
  }

  return map;
}

function extractHeaderDescription(content: string): string {
  const firstLine = content.split('\n')[0]?.replace(/\r$/, '').trim() ?? '';
  // LDraw header: first line starts with "0 " followed by description
  if (firstLine.startsWith('0 ')) {
    return firstLine.slice(2).trim();
  }
  return firstLine;
}

function readDatFiles(dir: string, recursive: boolean): { name: string; content: string }[] {
  const results: { name: string; content: string }[] = [];

  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && recursive) {
      const subResults = readDatFiles(fullPath, true);
      for (const sub of subResults) {
        results.push({ name: path.join(entry.name, sub.name), content: sub.content });
      }
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.dat')) {
      results.push({ name: entry.name, content: fs.readFileSync(fullPath, 'utf-8') });
    }
  }

  return results;
}

async function seed() {
  const ldrawDir = process.env.LDRAW_DIR;
  if (!ldrawDir) {
    throw new Error('LDRAW_DIR environment variable is required');
  }

  const connectionString = process.env.DATABASE_URL!;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);

  console.log(`Reading parts.lst from ${ldrawDir}...`);
  const partsLst = parsePartsLst(ldrawDir);
  console.log(`Found ${partsLst.size} entries in parts.lst`);

  const allParts: PartRecord[] = [];

  // 1. Scan parts/ (excluding s/ subdirectory) — these are main parts
  console.log('Scanning parts/...');
  const partsDir = path.join(ldrawDir, 'parts');
  if (fs.existsSync(partsDir)) {
    const entries = fs.readdirSync(partsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) continue; // skip s/ and any other subdirs
      if (!entry.name.toLowerCase().endsWith('.dat')) continue;
      const content = fs.readFileSync(path.join(partsDir, entry.name), 'utf-8');
      const filename = entry.name.toLowerCase();
      const description = partsLst.get(filename) ?? extractHeaderDescription(content);
      allParts.push({ filename, description, partType: 'part', content });
    }
  }
  console.log(`  Found ${allParts.length} main parts`);

  // 2. Scan parts/s/ — sub-parts
  console.log('Scanning parts/s/...');
  const subpartsDir = path.join(ldrawDir, 'parts', 's');
  const subpartsBefore = allParts.length;
  const subFiles = readDatFiles(subpartsDir, false);
  for (const file of subFiles) {
    const filename = `s/${file.name.toLowerCase()}`.replace(/\\/g, '/');
    const description = extractHeaderDescription(file.content);
    allParts.push({ filename, description, partType: 'subpart', content: file.content });
  }
  console.log(`  Found ${allParts.length - subpartsBefore} sub-parts`);

  // 3. Scan p/ recursively — primitives
  console.log('Scanning p/...');
  const primitivesDir = path.join(ldrawDir, 'p');
  const primitivesBefore = allParts.length;
  const primFiles = readDatFiles(primitivesDir, true);
  for (const file of primFiles) {
    const filename = file.name.toLowerCase().replace(/\\/g, '/');
    const description = extractHeaderDescription(file.content);
    allParts.push({ filename, description, partType: 'primitive', content: file.content });
  }
  console.log(`  Found ${allParts.length - primitivesBefore} primitives`);

  // Normalize all backslashes
  for (const part of allParts) {
    part.filename = part.filename.replace(/\\/g, '/');
  }

  console.log(`\nTotal parts to seed: ${allParts.length}`);
  console.log('Inserting into database...');

  // Batch upsert 500 at a time
  const BATCH_SIZE = 500;
  let inserted = 0;

  for (let i = 0; i < allParts.length; i += BATCH_SIZE) {
    const batch = allParts.slice(i, i + BATCH_SIZE);
    await db
      .insert(ldrawParts)
      .values(batch)
      .onConflictDoUpdate({
        target: ldrawParts.filename,
        set: {
          description: sql`excluded.description`,
          partType: sql`excluded.part_type`,
          content: sql`excluded.content`,
          updatedAt: sql`now()`,
        },
      });

    inserted += batch.length;
    if (inserted % 1000 < BATCH_SIZE) {
      console.log(`  Progress: ${inserted}/${allParts.length}`);
    }
  }

  console.log(`\nSeeding complete! Inserted/updated ${inserted} parts.`);
  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
