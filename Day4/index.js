import express from 'express';
import mongoose, { isObjectIdOrHexString } from 'mongoose';

//Khoi tao server web
const server = express();

//Middleware. This middleware parses the JSON data from the request body and makes it available in the request.body object.
server.use(express.json());

server.get('/', (request, response) => {
  response.status(200).send('Hello ');
});

//Connect to Mongo DB
const connectDb = async () => {
  await mongoose.connect(
    'mongodb+srv://duykien85:KfnTVFtEL8uF0FQn@cluster0.gd5vymx.mongodb.net/day4'
  );
};

//Tao schema
const Schema = mongoose.Schema;

//Tao schema/model cho users
const userSchema = new Schema({
  userName: String,
  email: String,
});
const userModel = mongoose.model('users', userSchema);

//Tao schema/model cho posts
const postSchema = new Schema({
  content: String,
  authorId: String,
});
const postModel = mongoose.model('posts', postSchema);

//Tao schema/model cho comments
const commentSchema = new Schema({
  content: String,
  postId: String,
  authorId: String,
});
const commentModel = mongoose.model('comments', commentSchema);

//===============================
//1. Viết API việc đăng ký user với userName, khong trung
server.post('/users', async (req, res) => {
  try {
    const { userName, email } = req.body;

    //validate input
    if (!userName) throw new Error('userName is required');
    if (!email) throw new Error('email is required');

    //Check trùng userName, findOne tra ve null neu khong co du lieu,
    const validUserName = await userModel.findOne({ userName });
    if (validUserName) throw new Error('userName already exists');

    //tao moi user tren mongodb
    const newItem = await userModel.create({
      userName,
      email,
    });

    res.status(201).send({ data: newItem, message: 'Register successful!', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});
//===============================
//2. Viết API cho phép user tạo bài post
server.post('/posts', async (req, res) => {
  try {
    const { content, authorId } = req.body;

    //validate input
    if (!content) throw new Error('content is required');
    if (!isObjectIdOrHexString(authorId)) throw new Error('authorId is not valid');

    //Check authorId co thuoc users
    const validUserId = await userModel.findById(authorId);
    if (!validUserId) throw new Error('authorId does not exist');

    //isObjectIdOrHexString(validUserId);
    //Luu y: neu authorId khong du ky tu > lenh findById se tra ve loi > xu ly the nao?

    //tao moi user tren mongodb
    const newItem = await postModel.create({
      content,
      authorId,
    });

    res.status(201).send({ data: newItem, message: 'Post created successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});
//===============================
//3. Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
server.put('/posts/:postId', async (req, res) => {
  try {
    const { content, authorId } = req.body;
    const { postId } = req.params;

    //validate input
    if (!content) throw new Error('content is required');
    if (!authorId) throw new Error('authorId is required');

    //Check postId co ton tai
    const currentPost = await postModel.findById(postId);
    if (!currentPost) throw new Error('postId does not exist');

    //Luu y: neu authorId khong du ky tu > lenh findById se tra ve loi > xu ly the nao

    //Check user cua post co trung voi user chinh sua post
    if (currentPost.authorId !== authorId) throw new Error('userId does not have right');

    //update content cua post
    currentPost.content = content;

    //update post vao database
    const temp = await currentPost.save();
    console.log(temp);

    res
      .status(201)
      .send({ data: currentPost, message: 'Post updated successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});
//===============================
//4. Viết API cho phép user được comment vào bài post
server.post('/comments', async (req, res) => {
  try {
    const { content, postId, authorId } = req.body;

    //validate input
    if (!content) throw new Error('content is required');
    if (!postId) throw new Error('postId is required');
    if (!authorId) throw new Error('authorId is required');

    //Check postId co ton tai
    const currentPost = await postModel.findById(postId);
    if (!currentPost) throw new Error('postId does not exist');

    //Luu y: neu authorId khong du ky tu > lenh findById se tra ve loi > xu ly the nao

    //tao moi comment tren mongodb
    const newItem = await commentModel.create({
      content,
      postId,
      authorId,
    });

    res.status(201).send({ data: newItem, message: 'Comment created successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});
//===============================
//5. Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa)
server.put('/comments/:commentId', async (req, res) => {
  try {
    const { content, authorId } = req.body;
    const { commentId } = req.params;

    //validate input
    if (!content) throw new Error('content is required');
    if (!authorId) throw new Error('authorId is required');

    //Check commentId co ton tai
    const current = await commentModel.findById(commentId);
    if (!current) throw new Error('commentId does not exist');

    //Luu y: neu authorId khong du ky tu > lenh findById se tra ve loi > xu ly the nao

    //Check user cua comment co trung voi user chinh sua comment
    if (current.authorId !== authorId) throw new Error('userId does not have right to edit');

    //update content cua comment
    current.content = content;

    //update post vao database
    const temp = await current.save();
    console.log(temp);

    res.status(201).send({ data: current, message: 'Comment updated successfully', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});
//===============================
//6. Viết API lấy tất cả comment của một bài post
server.get('/comments/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await commentModel.find({ postId });

    res.status(200).send({ data: comments, message: 'Get comments by postId', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});
//===============================
//7. Viết API lấy tất cả các bài post, 3 comment đầu (dựa theo index) của tất cả user .
server.get('/posts', async (req, res) => {
  try {
    const posts = await postModel.find({});
    const comments = await commentModel.find({});

    const postWithComments = posts.map((post) => {
      const commentsByPost = comments.filter((comment) => comment.postId === post._id.toString());
      const threeComments = commentsByPost.slice(0, 3);

      return { ...post._doc, comments: threeComments };

      //Luu y: neu dung {...post} > co nhieu du lieu khac hien thi
    });

    res
      .status(200)
      .send({ data: postWithComments, message: 'Get posts with 3 first comments', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});
//===============================
//8. Viết API lấy một bài post và tất cả comment của bài post đó thông qua postId
server.get('/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    //Kiem tra postId co ton tai
    const post = await postModel.findById(postId);
    if (!post) throw new Error('postId does not exist');

    //Get comments
    const comments = await commentModel.find({ postId });

    const postWithComments = { ...post._doc, comments: comments };

    //Luu y: neu dung {...post} > co nhieu du lieu khac hien thi

    res
      .status(200)
      .send({ data: postWithComments, message: 'Get a post with comments', success: true });
  } catch (error) {
    res.status(403).send({ data: null, message: error.message, success: false });
  }
});

//===============================
//Lang nghe request tu client
connectDb().then(
  server.listen(3000, () => {
    console.log('Server running port 3000');
  })
);
