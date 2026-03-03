import { pgTable, uuid, varchar, text, timestamp, jsonb, pgEnum, unique, boolean, integer } from 'drizzle-orm/pg-core';
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

// ─── Application tables ───

export const parts = pgTable('parts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  partNumber: varchar('part_number', { length: 100 }),
  description: text('description'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const connectionSpecs = pgTable('connection_specs', {
  id: uuid('id').primaryKey().defaultRandom(),
  partId: uuid('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
  specData: jsonb('spec_data').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const voteTypeEnum = pgEnum('vote_type', ['upvote', 'downvote']);

export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  connectionSpecId: uuid('connection_spec_id').notNull().references(() => connectionSpecs.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  voteType: voteTypeEnum('vote_type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserVote: unique().on(table.connectionSpecId, table.userId),
}));

// ─── Relations ───

export const usersRelations = relations(users, ({ many }) => ({
  parts: many(parts),
  connectionSpecs: many(connectionSpecs),
  votes: many(votes),
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

export const partsRelations = relations(parts, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [parts.createdBy],
    references: [users.id],
  }),
  connectionSpecs: many(connectionSpecs),
}));

export const connectionSpecsRelations = relations(connectionSpecs, ({ one, many }) => ({
  part: one(parts, {
    fields: [connectionSpecs.partId],
    references: [parts.id],
  }),
  createdBy: one(users, {
    fields: [connectionSpecs.createdBy],
    references: [users.id],
  }),
  votes: many(votes),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  connectionSpec: one(connectionSpecs, {
    fields: [votes.connectionSpecId],
    references: [connectionSpecs.id],
  }),
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
}));
