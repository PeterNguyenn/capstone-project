import express from 'express';
import { createPost, getPosts, singlePost, updatePost } from '../controllers';
import { identifier } from '../middlewares/identification';
import { validate } from '../middlewares/validations';
import { CreatePostSchema } from '../types/auth/create-post-body.dto';


const router = express.Router();

router.get('/all-posts', getPosts);
router.get('/single-post', singlePost);
router.post('/create-post', validate(CreatePostSchema), identifier, createPost);
router.put('/update-post', identifier, updatePost);

export default router;