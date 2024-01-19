import express from 'express';
import mongoose from 'mongoose';

const connectDb = async () => {
  await mongoose.connect(
    'mongodb+srv://duykien85:KfnTVFtEL8uF0FQn@cluster0.gd5vymx.mongodb.net/fullstack'
  );
};

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BlogPost = new Schema({
  author: String,
  title: String,
  body: String,
  date: String,
});
const BlogModel = mongoose.model('blog', BlogPost);

const server = express();
server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).send('Hello');
});

//RESTful API
//==========================
//Get all
server.get('/blogs', async (req, res) => {
  try {
    const blogs = await BlogModel.find({});
    res.status(200).send(blogs);
  } catch (error) {
    console.log(error);
    res.status(400).send('Server error');
  }
});

//Get one
server.get('/blogs/:blogId', async (req, res) => {
  const { blogId } = req.params;

  try {
    const blogs = await BlogModel.findById(blogId);
    res.status(200).send(blogs);
  } catch (error) {
    console.log(error);
    res.status(400).send('Server error');
  }
});

//==========================
server.post('/blogs', async (req, res) => {
  try {
    const { author, title, body, date } = req.body;

    //validate input
    if (!author) throw new Error('Author is required');
    if (!title) throw new Error('Title is required');
    if (!body) throw new Error('Body is required');
    if (!date) throw new Error('Date is required');

    const newBlog = await BlogModel.create({
      author,
      title,
      body,
      date,
    });

    res.status(201).send(newBlog);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

//==========================
server.put('/blogs/:blogId', async (req, res) => {
  try {
    const { author, title, body, date } = req.body;

    //validate input
    if (!author) throw new Error('Author is required');
    if (!title) throw new Error('Title is required');
    if (!body) throw new Error('Body is required');
    if (!date) throw new Error('Date is required');

    const newBlog = await BlogModel.updateOne();

    res.status(201).send(newBlog);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

//==========================
server.delete('/blogs/:blogId', async (req, res) => {
  try {
    const { author, title, body, date } = req.body;

    //validate input
    if (!author) throw new Error('Author is required');
    if (!title) throw new Error('Title is required');
    if (!body) throw new Error('Body is required');
    if (!date) throw new Error('Date is required');

    const newBlog = await BlogModel.deleteOne();

    res.status(201).send(newBlog);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

//luôn kết nối database trước khi bật server
connectDb().then(
  server.listen(3000, () => {
    console.log('Server running');
  })
);
