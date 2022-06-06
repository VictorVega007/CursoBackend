'use strict';

// const http = require('http');
// const port = 8080;

// const server = http.createServer((req, res) => {
//     // res.end('Welcome to my server');

//     const hour = new Date().getHours();
//     if (hour >= 6 && hour <= 12) {
//         res.end('Good Morning!');
//     } else if (hour >= 13 && hour <= 19) {
//         res.end('Good Afternoon!');
//     } else if (hour >= 20 || hour <= 5) {
//         res.end('Good Night!')
//     }
// });

// server.listen(port, () => {
//     console.log(`Server is listening port ${port}`);
// });

const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.status(200).send(`<h1 style='color: red'>Hello, I am the home</h1>`)
})

app.get('/posts', (req, res) => {
    res.send('<p>Hello, I am posts</p>')
})

app.listen(port, () => {
    console.log(`Server is listening the port ${port}`)
})