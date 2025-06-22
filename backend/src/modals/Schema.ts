import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core';

export const favoritesTable = pgTable('favorites', {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    recipeId: integer('recipe_id').notNull(),
    title: text('title').notNull(),
    image: text('image'),
    cookTime: text('cook_time'),
    servings: text('servings'),
    createdAt: timestamp('created_at').defaultNow(),
})


export const usersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    refreshToken: text('refresh_token'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
})