import express from 'express';
import { users, posts } from './data.js';
import { v4 as uuidv4 } from 'uuid';

const server = express();

server.use(express.json()); //middleware

//1. Viết API lấy thông tin của user với id được truyền trên params
server.get('/users', (req, res) => {
  const query = req.query;
  console.log('query', query);

  if (query.id) {
    const user = users.find((user) => user.id === query.id);
    res.status(200).send(user);
  } else {
    res.status(200).send(users);
  }
});

//2. Viết API tạo user với các thông tin như trên users, với id là random (uuid), email là duy nhất, phải kiểm tra được trùng email khi tạo user.
server.post('/users', (req, res) => {
  const body = req.body;
  console.log('query', body);

  const index = users.findIndex((user) => user.email === body.email);

  if (index === -1) {
    const new_user = { id: uuidv4(), ...body };
    users.push(new_user);
    res.status(201).send('Created new user: ' + JSON.stringify(new_user));
  } else {
    res.status(409).send('Fail, email already exists: ' + JSON.stringify(body));
  }
});

//3. Viết API lấy ra các bài post của user được truyền userId trên params.
server.get('/posts/:userId', (req, res) => {
  const userId = req.params.userId;
  const posts_user = posts.filter((post) => post.userId === userId);

  res.status(200).send(posts_user);

  //   if (posts_user) {
  //     res.status(200).send(posts_user);
  //   } else {
  //     res.status(404).send('Post not found');
  //   }
  //   if (query.userId) {
  //     const posts_user = posts.filter((post) => post.userId === userId);
  //     res.status(200).send(posts_user);
  //   } else {
  //     res.status(404).send('Post not found');
  //   }
});

//4.Viết API thực hiện tạo bài post với id của user được truyền trên params.
server.post('/posts/:userId', (req, res) => {
  const userId = req.params.userId;
  const body = req.body;

  //Chech userId co thuoc danh sach user
  const index = users.findIndex((user) => user.id === userId);

  if (index !== -1) {
    const new_post = { ...body, postId: uuidv4(), userId };
    posts.push(new_post);
    res.status(201).send('Created new post: ' + JSON.stringify(new_post));
  } else {
    res.status(409).send('Fail, userId not exist in users');
  }
});

//5.Viết API cập nhật thông tin bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
server.put('/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  const body = req.body;

  //tim bai post
  const index = posts.findIndex((item) => item.postId === postId);

  if (index !== -1) {
    if (posts[index].userId === body.userId) {
      posts[index] = { ...body, postId };
      res.status(201).send('Post updated: ' + JSON.stringify(posts[index]));
    } else {
      res.status(401).send('User has no right to change');
    }
  } else {
    res.status(404).send('Post not found');
  }
});

//6. Viết API xoá bài post với postId được truyền trên params, chỉ có user tạo bài mới được phép.
server.delete('/posts/:postId', (req, res) => {
  const postId = req.params.postId;
  const body = req.body;

  //tim bai post
  const post = posts.find((item) => item.postId === postId);

  if (post) {
    if (post.userId === body.userId) {
      posts.pop(post);
      res.status(200).send('Post deleted: ' + JSON.stringify(post));
    } else {
      res.status(401).send('User has no right to delete');
    }
  } else {
    res.status(404).send('Post not found');
  }
});

//7. Viết API tìm kiếm các bài post với content tương ứng được gửi lên từ query params.
//8. Viết API lấy tất cả các bài post với isPublic là true, false thì sẽ không trả về.
server.get('/posts', (req, res) => {
  const query = req.query;
  console.log('query', query);

  if (query.content) {
    const posts_ = posts.filter((post) => post.content.includes(query.content));
    res.status(200).send(posts_);
  } else if (query.isPublic === 'true') {
    const posts_ = posts.filter((post) => post.isPublic === true);
    res.status(200).send(posts_);
  } else {
    res.status(404).send('Post not found');
  }
});

server.listen(3000, () => {
  console.log('Server running');
});
