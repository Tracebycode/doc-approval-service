import { StorageService } from './storage.service';
import { PostStatus } from '../types/posts';
import { EmailService } from './email.service';

export class PostWorkflowService {

  static async submitPost(id: string) {
    const post = await StorageService.getPostById(id);
    if (!post) throw new Error('NOT_FOUND');

    if (post.status !== PostStatus.DRAFT) {
      throw new Error('INVALID_STATE');
    }

    post.status = PostStatus.PENDING;
    post.updatedAt = new Date().toString();

    await StorageService.updatePost(post);
    await EmailService.sendApproveEmail(post);

    return post;
  }

  static async approvePost(id: string) {
    const post = await StorageService.getPostById(id);
    if (!post) throw new Error('NOT_FOUND');

    if (post.status !== PostStatus.PENDING) {
      throw new Error('INVALID_STATE');
    }

    post.status = PostStatus.APPROVED;
    post.updatedAt = new Date().toString();

    await StorageService.updatePost(post);
    return post;
  }

  static async rejectPost(id: string) {
    const post = await StorageService.getPostById(id);
    if (!post) throw new Error('NOT_FOUND');

    if (post.status !== PostStatus.PENDING) {
      throw new Error('INVALID_STATE');
    }

    post.status = PostStatus.REJECTED;
    post.updatedAt = new Date().toString();

    await StorageService.updatePost(post);
    return post;
  }
}
