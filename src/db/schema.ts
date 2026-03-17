import { integer, pgTable, primaryKey, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

// Schema är source of truth — drizzle-kit push syncar databasen härifrån

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
})

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
})

export const comments = pgTable('comments', { 
     id: serial('id').primaryKey(),
     content: text('content').notNull(),
     createdAt: timestamp('created_at'),
     userId: integer('user_id')
        .notNull()
        .references(() => users.id),
     postId: integer('post_id')
        .notNull()
        .references(() => posts.id)
})

export const profile = pgTable('profile', {
  id: serial('id').primaryKey(),
  avatar: varchar('avatar'),
  description: text('description'),
  location: varchar('localtion'),
  userId: integer('user_id')
              .notNull()
              .unique()
              .references(()=> users.id)
})

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
})

// Kopplingstabellen (junction table)
export const postCategories = pgTable('post_categories', {
    postId: integer('post_id')
        .notNull()
        .references(() => posts.id),
    categoryId: integer('category_id')
        .notNull()
        .references(() => categories.id)
  },
    // Primary key som är en kombo av de två foreign keys, för att undvika konflikt
  (table) => ({
    // En post kan inte kopplas till samma kategori två gång
    pk: primaryKey({ columns: [table.postId, table.categoryId] }),
  }));
   




export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
export type Profile = typeof profile.$inferSelect
export type NewProfile = typeof profile.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type PostCategory = typeof postCategories.$inferInsert
export type NewPostCategory = typeof postCategories.$inferSelect