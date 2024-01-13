//const { foo } = require('./until');
//import foo from './until.js';
import { foo } from './until.js';
import http from 'node:http';

//const name = ' Mindx';
//console.log(foo + name); //Xin chao mindx

const server = http.createServer((request, response) => {
  //   console.log(request.url);
  //   console.log(request.method);
  //   console.log(request.body);
  //   console.log(request.headers);

  switch (request.url) {
    case '/':
      response.end(JSON.stringify({ name: 'Mindx', age: 20 }));
      break;
    case '/hello':
      response.end('Hello man!');
      break;
    default:
      response.end('Not found');
      break;
  }
});

server.listen(3000);

console.log('Server running');
