import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const server = express();

server.use(express.json()); //middleware

//Get users/posts/comments
server.get('/users', async (request, response) => {
  try {
    const { data } = await axios.get('http://localhost:8000/users');
    response.status(200).send(data);
  } catch (error) {
    response.status(500).send('Server error');
  }
});

server.get('/posts', async (request, response) => {
  try {
    const { data } = await axios.get('http://localhost:8000/posts');
    response.status(200).send(data);
  } catch (error) {
    response.status(500).send('Server error');
  }
});

//6.Viết API lấy tất cả comment của một bài post.
server.get('/comments', async (request, response) => {
  const { postId } = request.query;

  try {
    const { data } = await axios.get('http://localhost:8000/comments');

    if (postId) {
      const cmtList = data.filter((item) => item.postId === postId);
      console.log(cmtList);
      response.status(200).send(cmtList);
    } else {
      response.status(200).send(data);
    }
  } catch (error) {
    response.status(500).send(`Server error: ${error}`);
  }
});

//function====================
const genId = async (type) => {
  let prefix;
  switch (type) {
    case 'users':
      prefix = 'US';
      break;
    case 'posts':
      prefix = 'PS';
      break;
    case 'comments':
      prefix = 'CMT';
      break;
    default:
  }
  const { data: listItem } = await axios(`http://localhost:8000/${type}`);

  const Id = prefix + Math.floor(Math.random() * 1000);
  const check = listItem.find((item) => Id == item.id);
  if (check) {
    genId(type);
  }
  return Id;
};
//====================
const validUser = async (userId) => {
  const { data: listItem } = await axios('http://localhost:8000/users');

  const index = listItem.findIndex((item) => item.id === userId);
  console.log(index);
  if (index === -1) return false;

  return true;
};
//====================
const validPost = async (postId) => {
  const { data: listItem } = await axios('http://localhost:8000/posts');

  const index = listItem.findIndex((item) => item.id === postId);
  console.log(index);
  if (index === -1) return false;

  return true;
};

//1. Viết API việc đăng ký user với userName, id sẽ được là một string ngẫu nhiên, không được phép trùng, bắt đầu từ ký tự US (ví dụ: US8823).
server.post('/users', async (req, res) => {
  console.log(req.body);
  const { userName } = req.body;

  try {
    //valid du lieu
    if (!userName) throw new Error('Please fill the userName');

    //Add user
    const id = await genId('users');
    const newUser = { id, userName };

    await axios.post('http://localhost:8000/users', newUser);
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(`Data is not valid, ${error.message}`);
  }
});

//2. Viết API cho phép user tạo bài post (thêm bài post, xử lý id tương tự user).
server.post('/posts/:userId', async (req, res) => {
  const { content } = req.body;
  const { userId } = req.params;
  try {
    //valid du lieu
    if (!content) throw new Error('Please fill the content');

    //Check user co ton tai trong danh sach
    const valid = await validUser(userId);

    if (valid) {
      const id = await genId('posts');
      const newPost = { id, content, authorId: userId };
      await axios.post('http://localhost:8000/posts', newPost);
      res.status(201).send(newPost);
    } else {
      throw new Error('User not valid');
    }
  } catch (error) {
    res.status(400).send(`Data is not valid, ${error.message}`);
  }
});

//3.Viết API cho phép user chỉnh sửa lại bài post (chỉ user tạo bài viết mới được phép chỉnh sửa).
server.put('/posts/:postId', async (req, res) => {
  const { content, authorId } = req.body;
  const { postId } = req.params;
  try {
    //valid du lieu
    if (!content) throw new Error('Please fill the content');
    if (!authorId) throw new Error('Please fill the authorId');

    //Check post co con tai trong danh sach
    const { data: listItem } = await axios('http://localhost:8000/posts');
    const current = listItem.find((item) => item.id === postId);

    if (current) {
      //Check user co phai cua bai post
      if (current.authorId === authorId) {
        current.content = content;
        const { data } = await axios.put(`http://localhost:8000/posts/${postId}`, current);
        console.log(data);
        res.status(201).send(current);
      } else {
        throw new Error('User not valid');
      }
    } else {
      throw new Error('Post not valid');
    }
  } catch (error) {
    res.status(400).send(`Data is not valid, ${error.message}`);
  }
});

//4.Viết API cho phép user được comment vào bài post
server.post('/comments/:postId/:userId', async (req, res) => {
  const { content } = req.body;
  const { postId, userId } = req.params;

  console.log(content, postId, userId);
  try {
    //valid du lieu
    if (!content) throw new Error('Please fill the content');

    //Check user co ton tai trong danh sach
    const valid1 = await validUser(userId);

    //Check post co ton tai trong danh sach
    const valid2 = await validPost(postId);

    if (valid1 && valid2) {
      const id = await genId('comments');
      const newComment = { id, content, postId, authorId: userId };
      await axios.post('http://localhost:8000/comments', newComment);
      res.status(201).send(newComment);
    } else {
      throw new Error('User/Post not valid');
    }
  } catch (error) {
    res.status(400).send(`Data is not valid, ${error.message}`);
  }

  //res.status(200).send('Test');
});

//5. Viết API cho phép user chỉnh sửa comment (chỉ user tạo comment mới được sửa)
server.put('/comments/:commentId', async (req, res) => {
  const { content, authorId } = req.body;
  const { commentId } = req.params;

  console.log(content, authorId, commentId);
  try {
    //valid du lieu
    if (!content) throw new Error('Please fill the content');
    if (!authorId) throw new Error('Please fill the authorId');

    //Check comment co con tai trong danh sach
    const { data: listItem } = await axios('http://localhost:8000/comments');
    const current = listItem.find((item) => item.id === commentId);

    if (current) {
      //Check user co phai cua bai comment
      if (current.authorId === authorId) {
        current.content = content;
        const { data } = await axios.put(`http://localhost:8000/comments/${commentId}`, current);
        console.log(data);
        res.status(201).send(current);
      } else {
        throw new Error('User not valid');
      }
    } else {
      throw new Error('Comment not valid');
    }
  } catch (error) {
    res.status(400).send(`Data is not valid, ${error.message}`);
  }

  //res.status(200).send('Test');
});

server.listen(3000, () => {
  console.log('Server running');
});
