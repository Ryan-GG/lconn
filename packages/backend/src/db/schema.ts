import { pgTable, uuid, varchar, text, timestamp, jsonb, pgEnum, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  githubId: varchar('github_id', { length: 255 }).notNull().unique(),
  githubUsername: varchar('github_username', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Parts table
export const parts = pgTable('parts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  partNumber: varchar('part_number', { length: 100 }),
  description: text('description'),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Connection specs table
export const connectionSpecs = pgTable('connection_specs', {
  id: uuid('id').primaryKey().defaultRandom(),
  partId: uuid('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
  specData: jsonb('spec_data').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Vote type enum
export const voteTypeEnum = pgEnum('vote_type', ['upvote', 'downvote']);

// Votes table
export const votes = pgTable('votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  connectionSpecId: uuid('connection_spec_id').notNull().references(() => connectionSpecs.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  voteType: voteTypeEnum('vote_type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueUserVote: unique().on(table.connectionSpecId, table.userId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  parts: many(parts),
  connectionSpecs: many(connectionSpecs),
  votes: many(votes),
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
