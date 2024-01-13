import http from 'http';
import { users } from './data.js';
const listStudent = [
  {
    id: 1,
    fullName: 'Jackie',
    age: 5,
    class: '5A',
  },
  {
    id: 2,
    fullName: 'Juli MTP',
    age: 5,
    class: '5A',
  },
  {
    id: 3,
    fullName: 'Denis',
    age: 5,
    class: '5B',
  },
];
const app = http.createServer((request, response) => {
  const endpoint = request.url;
  const new_endpoint = endpoint.split('/');
  console.log(new_endpoint);

  switch (endpoint) {
    case '/':
      response.end(`Hello MindX`);
      break;
    case '/students':
      response.end(JSON.stringify(listStudent));
      break;
    case '/users':
      response.end(JSON.stringify(users));
      break;

    case '/users/old':
      const users_old = users.filter((item) => item.age >= 50);
      response.end(JSON.stringify(users_old));
      break;

    case '/users/add-random':
      const user_add = {
        id: 4,
        userName: 'Dungcm',
        email: 'dungcm@gmail.com',
        address: 'BinhDinh',
        age: 33,
      };
      users.push(user_add);
      response.end('Add new User:' + JSON.stringify(user_add));
      break;

    case '/users/add':
      break;

    default:
      response.end(`404 Notfound`);
      break;
  }
});

app.listen(3000, () => {
  console.log('Server is running!');
});
