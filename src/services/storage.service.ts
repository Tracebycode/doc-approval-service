import fs from 'fs';
import path from 'path';
import { PostTypes } from '../types/posts';

interface StorageShape {
  posts: PostTypes[];
}

export class StorageService {
  private static STORAGE_PATH = path.join(__dirname, '../storage/post.json');

  // ---------- internal helpers ----------

  private static readStorage(): StorageShape {
    if (!fs.existsSync(this.STORAGE_PATH)) {
      return { posts: [] };
    }

    const raw = fs.readFileSync(this.STORAGE_PATH, 'utf-8');
    return JSON.parse(raw) as StorageShape;
  }

  private static writeStorage(data: StorageShape): void {
    fs.writeFileSync(
      this.STORAGE_PATH,
      JSON.stringify(data, null, 2)
    );
  }

  // ---------- public API (persistence only) ----------

  static async createPost(post: PostTypes): Promise<void> {
    const data = this.readStorage();
    data.posts.push(post);
    this.writeStorage(data);
  }

  static async getPostById(id: string): Promise<PostTypes | undefined> {
    return this.readStorage().posts.find(p => p.id === id);
  }

  static async getPosts(): Promise<PostTypes[]> {
    return this.readStorage().posts;
  }

  static async updatePost(post: PostTypes): Promise<void> {
    const data = this.readStorage();
    const index = data.posts.findIndex(p => p.id === post.id);

    if (index === -1) {
      throw new Error('POST_NOT_FOUND');
    }

    data.posts[index] = post;
    this.writeStorage(data);
  }
}
