import { pgTable, pgEnum, uuid, varchar, text, timestamp, boolean, index, jsonb, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── better-auth tables ───

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: varchar('image', { length: 500 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address', { length: 255 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: varchar('account_id', { length: 255 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: varchar('scope', { length: 255 }),
  idToken: text('id_token'),
  password: varchar('password', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verifications = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── LDraw tables ───

export const ldrawPartTypeEnum = pgEnum('ldraw_part_type', ['part', 'subpart', 'primitive']);

export const ldrawParts = pgTable('ldraw_parts', {
  filename: varchar('filename', { length: 255 }).primaryKey(),
  description: varchar('description', { length: 500 }).notNull(),
  partType: ldrawPartTypeEnum('part_type').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
  index('ldraw_parts_part_type_idx').on(table.partType),
]);

// ─── LDraw geometry tables ───

export const ldrawPartGeometries = pgTable('ldraw_part_geometries', {
  filename: varchar('filename', { length: 255 })
    .primaryKey()
    .references(() => ldrawParts.filename, { onDelete: 'cascade' }),
  subfileRefs: jsonb('subfile_refs').notNull().default([]),
  lines: jsonb('lines').notNull().default([]),
  triangles: jsonb('triangles').notNull().default([]),
  quads: jsonb('quads').notNull().default([]),
});

export const ldrawSubfileRefs = pgTable('ldraw_subfile_refs', {
  id: serial('id').primaryKey(),
  parentFilename: varchar('parent_filename', { length: 255 })
    .notNull()
    .references(() => ldrawParts.filename, { onDelete: 'cascade' }),
  childFilename: varchar('child_filename', { length: 255 }).notNull(),
}, (table) => [
  index('ldraw_subfile_refs_parent_idx').on(table.parentFilename),
  index('ldraw_subfile_refs_child_idx').on(table.childFilename),
]);

// ─── Relations ───

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const ldrawPartsRelations = relations(ldrawParts, ({ one, many }) => ({
  geometry: one(ldrawPartGeometries, {
    fields: [ldrawParts.filename],
    references: [ldrawPartGeometries.filename],
  }),
  subfileRefs: many(ldrawSubfileRefs),
}));

export const ldrawPartGeometriesRelations = relations(ldrawPartGeometries, ({ one }) => ({
  part: one(ldrawParts, {
    fields: [ldrawPartGeometries.filename],
    references: [ldrawParts.filename],
  }),
}));

export const ldrawSubfileRefsRelations = relations(ldrawSubfileRefs, ({ one }) => ({
  parent: one(ldrawParts, {
    fields: [ldrawSubfileRefs.parentFilename],
    references: [ldrawParts.filename],
  }),
}));
