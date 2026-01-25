import { Request, Response, NextFunction } from 'express';
import { StorageService} from '../services/storage.service';
import { DocumentParseService } from '../services/parser.service';
import { v4 as uuidv4 } from 'uuid';
import { authrequest } from '../storage/users';
import { PostStatus, PostTypes } from '../types/posts';
import { PostWorkflowService } from '../services/post-workflow.service';

export class PostController {

  static async CreatePostController(req: authrequest, res: Response) {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const parsed = await DocumentParseService.ParseDocument(
        req.file.buffer,
        req.file.originalname
      );

      const post: PostTypes = {
        id: uuidv4(),
        author: req.user!.username,
        title: parsed.title,
        content: parsed.content,
        image: parsed.image,
        status: PostStatus.DRAFT,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };

      await StorageService.createPost(post);

      res.status(201).json({
        id: post.id,
        message: 'Post created successfully',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async PostlistController(req: Request, res: Response) {
    const posts = await StorageService.getPosts();
    res.status(200).json({ data: posts });
  }

  static async PostSubmitController(req: authrequest, res: Response) {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    try {
      await PostWorkflowService.submitPost(id);
      res.status(200).json({ message: 'Post submitted for approval' });
    } catch (err: any) {
      if (err.message === 'NOT_FOUND')
        return res.status(404).json({ message: 'Post not found' });

      if (err.message === 'INVALID_STATE')
        return res.status(409).json({ message: 'Post is not in draft state' });

      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async ApprovePostController(req: authrequest, res: Response) {
    const { id } = req.params;

    try {
      await PostWorkflowService.approvePost(id);
      res.status(200).json({ message: 'Post approved' });
    } catch (err: any) {
      if (err.message === 'NOT_FOUND')
        return res.status(404).json({ message: 'Post not found' });

      if (err.message === 'INVALID_STATE')
        return res.status(409).json({ message: 'Post not in pending state' });

      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async RejectPostController(req: authrequest, res: Response) {
    const { id } = req.params;

    try {
      await PostWorkflowService.rejectPost(id);
      res.status(200).json({ message: 'Post rejected' });
    } catch (err: any) {
      if (err.message === 'NOT_FOUND')
        return res.status(404).json({ message: 'Post not found' });

      if (err.message === 'INVALID_STATE')
        return res.status(409).json({ message: 'Post not in pending state' });

      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
