import { db } from "./config";
import { users, posts, NewUser, NewPost } from "./schema";
import { eq, desc, and } from "drizzle-orm";

export async function createUser(data: NewUser) {
  const [user] = await db.insert(users).values(data).returning();
  return user;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function getUserWithPosts(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      posts: {
        orderBy: [desc(posts.createdAt)],
      },
    },
  });
}

export async function createPost(data: NewPost) {
  const [post] = await db.insert(posts).values(data).returning();
  return post;
}

export async function getPublishedPosts(limit = 10) {
  return await db.query.posts.findMany({
    where: eq(posts.published, true),
    with: {
      author: true,
    },
    orderBy: [desc(posts.createdAt)],
    limit,
  });
}

export async function updatePost(id: number, data: Partial<NewPost>) {
  const [updated] = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  return updated;
}