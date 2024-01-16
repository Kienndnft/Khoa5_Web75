import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const server = express();

server.use(express.json()); //middleware
//axios.get('http://localhost:8000/posts').then((res) => console.log(res.data));

server.get('/users', async (request, response) => {
  //Dung axios get data tu database mo phong
  const { data } = await axios.get('http://localhost:8000/users');
  response.status(200).send(data);
});

server.get('/posts', async (request, response) => {
  const { data } = await axios.get('http://localhost:8000/posts');
  response.status(200).send(data);
});

server.get('/post1', async (request, response) => {
  try {
    const { data } = await axios.get('http://localhost:9000/posts');
    response.status(200).send(data);
  } catch (error) {
    console.log('Server error');
    response.status(500).send('Server error');
  }
});

server.post('/users', async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    if (!body.userName) throw new Error('Khong chua userName');
    if (!body.email) throw new Error('Khong chua email');
    if (!body.age) throw new Error('Khong chua age');
    if (!body.avatar) throw new Error('Khong chua avatar');

    //xu ly logic
    const id = uuidv4();

    const { data: newUser } = await axios.post('http://localhost:8000/users', { id, ...body });

    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(`Data khong hop le ${error.message}`);
  }
});

server.listen(3000, () => {
  console.log('Server running');
});
