# Netflix Website Backend:

## Table of Contents

- [React](#frontend---react)
- [Nodejs express](#backend---nodejs---express)
- [MongoDB database](#mongodb---database)

## Backend - Nodejs - Express

Read more nodejs here: https://nodejs.org/en/docs

Read more express here: https://expressjs.com/en/starter/installing.html

I created backend in server folder

```
$ mkdir my-express-app
$ cd my-express-app
$ npm init
$ npm install express
```

In file index.js

```node
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```

Run it

```
$ node server.js
```

This is file package.json in backend nodejs express

```javascript
{
  "name": "nodejs",
  "version": "1.0.0",
  "description": "Nodejs express project by cuncnthichngu",
  "main": "index.js",
  "scripts": {
    "start": "nodemon --inspect index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/szhin/express-account.git"
  },
  "keywords": [
    "nodejs",
    "express",
    "movies",
    "mongodb",
    "backend",
    "authentication"
  ],
  "author": "cunconthichngu",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/szhin/express-account/issues"
  },
  "homepage": "https://github.com/szhin/express-account#readme",
  "dependencies": {
    "express": "^4.18.2",
    "express-handlebars": "^7.0.7",
    "http": "^0.0.1-security",
    "mongoose": "^7.1.0",
    "path": "^0.12.7"
  },
  "devDependencies": {
    "morgan": "^1.10.0",
    "nodemon": "^2.0.22"
  }
}


```

I create express nodejs according to the MVC scheme and use some libraries express nodejs

## MongoDB - Database

Read more mongodb here: https://www.mongodb.com/docs/

# Netflix Website Frontend here

Link: https://github.com/szhin/netflix-frontend

## Frontend - React

Read more react here: https://github.com/facebook/create-react-app

I created frontend in client folder

```
$ npm install -g create-react-app
$ npx create-react-app my-app
$ cd my-app
$ npm start
```

# I hope you enjoy, have a good day 🥹😙😋
