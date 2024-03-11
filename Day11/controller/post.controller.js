import express from 'express';
import { PostModel } from '../model/post.model.js';
import { isObjectIdOrHexString } from 'mongoose';

const postController = express.Router();

// GET ALL
postController.get('/', async (req, res) => {
  try {
    // const { $limit, $skip } = req.query; // Query phân trang
    // limit = 10, skip = 0 pages -> lấy 10 resource đầu tiên trong csdl
    // limit = 10, skip = 1 pages -> lấy 10 resource sau khi skip 10

    // req.query = {isPublic: true, $skip: 0, $limit: 10}
    // findQuery = {isPublic: true}

    // if (findQuery.$gt) {
    //   findQuery = { ...findQuery, createAt: { $gt: "2024-02-24" } };
    // }

    // if (findQuery.$lt) {
    //   findQuery = { ...findQuery, createAt: { $lt: "2024-02-24" } };
    // }

    // delete req.query.$limit;
    // delete req.query.$skip;

    let { $skip, $limit, $sort, $gt, $lte, ...findQuery } = req.query; // Spread operator

    const total = await PostModel.countDocuments(); // Lấy total

    const posts = await PostModel.find(findQuery) // Tìm kiếm
      .skip(Number($limit) * Number($skip)) // Phân trang
      .limit(Number($limit)) // Phân trang
      .sort({ createdAt: $sort === 'ASC' ? 1 : -1 }); // Sắp xếp tăng/giảm
    /// Tối ưu sử dụng 1 query vào cơ sở dữ liệu để lấy cả data và tổng số resources - BTVN research

    res.status(200).send({
      total,
      skip: Number($skip),
      limit: Number($limit),
      pages: Math.ceil(total / Number($limit)), // Math.floor()
      data: posts, // length = 10
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

postController.post('/', async (req, res) => {
  try {
    const { userId } = req.body;
    const createdAt = new Date().toISOString();
    // Validate input
    if (!userId) throw new Error('userId is required');
    // Lưu vào cơ sở dữ liệu
    const newPost = await PostModel.create({
      userId,
      content: faker.lorem.paragraph({ min: 1, max: 3 }),
      name: faker.lorem.text(),
      isPublic: true,
      createdAt,
    });
    // Return status 201 + post document vừa được tạo trong mongodb
    res.status(201).send({
      data: newPost,
      message: 'Post created successfully',
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Server error');
  }
});

// postController.get('/', async (req, res) => {
//   try {
//     const query = req.query;
//     const posts = await PostModel.find(query);
//     res.status(200).send({ data: posts, message: 'Get posts', success: true });
//   } catch (error) {
//     res.status(403).send({ data: null, message: error.message, success: false });
//   }
// });

// postController.get('/:postId', async (req, res) => {
//   try {
//     const { postId } = req.params;

//     //Validate postId
//     if (!isObjectIdOrHexString(postId)) throw new Error('postId is not valid');

//     const post = await PostModel.findById(postId);
//     res.status(200).send(post);
//   } catch (error) {
//     res.status(403).send({ data: null, message: error.message, success: false });
//   }
// });

// postController.post('/', async (req, res) => {
//   try {
//     const { userId, content, isPublic } = req.body;
//     const createdAt = new Date().toISOString();

//     //validate input
//     if (!userId) throw new Error('userId is required');
//     if (!content) throw new Error('content is required');
//     if (!isPublic) throw new Error('isPublic is required');

//     //Luu vao co so du lieu
//     const newPost = await PostModel.create({
//       userId,
//       content,
//       isPublic,
//       createdAt,
//     });

//     res.status(201).send({ data: newPost, message: 'Post created successfully', success: true });
//   } catch (error) {
//     res.status(403).send({ data: null, message: error.message, success: false });
//   }
// });
//=====================================
postController.put('/:postId', async (req, res) => {
  try {
    const { userId, content, isPublic } = req.body;
    const { postId } = req.params;

    //Validate input
    if (!userId) throw new Error('userId is required');
    if (!content) throw new Error('content is required');
    if (!isPublic) throw new Error('isPublic is required');

    //Check postId co hop le
    if (!isObjectIdOrHexString(postId)) throw new Error('postId is not valid');

    //Check postId co ton tai
    const currentPost = await PostModel.findById(postId);
    if (!currentPost) throw new Error('postId does not exist');

    //Check user cua post co trung voi user chinh sua post
    if (currentPost.userId !== userId) throw new Error('userId does not have right');

    //udpate post
    const updatedAt = new Date().toISOString();

    const updatePost = await PostModel.findByIdAndUpdate(
      postId,
      { userId, content, isPublic, updatedAt },
      { new: true }
    );

    res.status(201).send({ data: updatePost, message: 'Post updated successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//=====================================
postController.delete('/:postId', async (req, res) => {
  try {
    const { userId, content, isPublic } = req.body;
    const { postId } = req.params;

    //Check postId co hop le
    if (!isObjectIdOrHexString(postId)) throw new Error('postId is not valid');

    //Check postId co ton tai
    const currentPost = await PostModel.findById(postId);
    console.log(currentPost);
    if (!currentPost) throw new Error('postId does not exist');

    //Check user cua post co trung voi user chinh sua post
    if (currentPost.userId !== userId) throw new Error('userId does not have right');

    //delete post
    await PostModel.findByIdAndDelete(postId);

    res.status(204).send('');
    //res.sendStatus(204);
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

export { postController };
