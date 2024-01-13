import express from 'express';

const server = express();

server.use(express.json()); //middleware

const classes = [
  {
    id: 1,
    name: 'Mindx 1',
    members: 50,
  },
  { id: 2, name: 'Mindx 2', members: 10 },
  { id: 3, name: 'Mindx 3', members: 20 },
];

server.get('/home', (request, response) => {
  //   console.log('requestHeader', request.headers);
  //   console.log('requestUrl', request.url);
  //   console.log('requestBody', request.body);
  //   console.log('requestMethod', request.method);

  response.status(200).send({ name: 'Mindx', age: 10 });
});

//request: medhotd - POST, duong dan: /users
//response : status - 200, data la 1 obj ten va tuoi

server.post('/users', (request, response) => {
  response.status(200).send({ name: 'Kiennd', age: 35 });
});

server.get('/classes', (req, res) => {
  const query = req.query;
  console.log('query', query);

  if (query.memberOver40) {
    const over40 = classes.filter((item) => item.members > 40);
    res.status(200).send(over40);
  } else {
    res.status(200).send(classes);
  }
});

//syntax query parameters
//localhost:3000/classes?members=10

//request: GET , endpoint /classes/over40
//response: status: 200, data la classes
// server.get('/classes/over40', (request, response) => {
//   const over40 = classes.filter((item) => item.members > 40);
//   response.status(200).send(over40);
// });

//URL parameter khac voi URL query
//cap nhat data
server.put('/classes/:id', (req, res) => {
  //   console.log('params', req.params);
  //   console.log('body', req.body);
  //const id = Number(req.params)
  //   const current = classes.find((item) => (item.id = Number(req.params.id)));
  //   console.log(current);

  const new_arr = classes.filter((item) => item.id != Number(req.params.id));
  const new_classes = [...new_arr, req.body];
  res.status(200).send(new_classes);
});

//xoa data
server.delete('/classes/:id', (req, res) => {
  console.log('params', req.params);
  res.status(204).send(classes);
});

//request: GET , endpoint /classes
//response: status: 201, data la new  classes
server.listen(3000, () => {
  console.log('Server running');
});
