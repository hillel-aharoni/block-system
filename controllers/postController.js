const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.getAllPosts = async (req, res) => {
  const posts = await Post.find().populate('author', 'username').populate({
    path: 'comments',
    populate: { path: 'author', select: 'username' }
  });
  res.json({
    posts : posts
  });
};

exports.createPost = async (req, res) => {
  const { content } = req.body;
  const post = new Post({ content, author: req.user.userId });
  await post.save();
  res.status(201).json(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ message: 'Post deleted' });
};

exports.addComment = async (req, res) => {
  const { content } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const comment = new Comment({
    content,
    author: req.user.userId,
    post: post._id
  });

  await comment.save();
  post.comments.push(comment._id);
  await post.save();

  res.status(201).json(comment);
};
