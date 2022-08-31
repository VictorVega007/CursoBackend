'use strict';

const express = require('express');
const app = express();
const { Router } = express;
const yargs = require('yargs/yargs');
const numCPUs = require('os').cpus().length;
const cluster = require('cluster');

// ==== Set middlewares ====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public'));

const infoRouter = Router();
const randomRouter = Router();

app.use('/info', infoRouter);
app.use('/api/random', randomRouter);

// ==== Set views ====
app.set('views', '/public/views/ejs');
app.set('view engine', 'ejs');

// ==== Set server port ====
const args = yargs(process.argv.slice(2))
    .alias({
        port: 'p',
        balancer: 'b'
    })
    .default({
        port: 8080,
        balancer: 'FORK'
    })
    .argv;

let PORT = 8080;
if (typeof args.port === 'number'){
    PORT = args.port;
};

let loadBalancer = args.balancer;

infoRouter.get('', async (req, res) => {
    const processInfo = [
        {name: "consoleArg", value: process.argv.slice(2)},
        {name: "platformName", value: process.platform},
        {name: "nodeVersion", value: process.version},
        {name: "memoryUsage", value: process.memoryUsage().rss},
        {name: "path", value: process.path},
        {name: "processId", value: process.pid},
        {name: "folder", value: process.cwd()},
        {name: "systemCores", value: numCPUs}
    ]
    return res.render('info', { processInfo });
});

randomRouter.get('/:number?', async (req, res) => {
    if (loadBalancer === 'FORK') {
        if (req.user) {
            const computo = fork('./computo.js', [req.params.number]);
            computo.on('message', numberArray => {
                return res.send(numberArray);
            });
        };    
    };
});

app.all('*', (req, res) => {
    return res.status(404).json(`Route '${req.path}' not found`);
});

if (loadBalancer === 'FORK') {
    if (cluster.isMaster) {
        console.log(`Primary node ${process.pid} executing`);

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        };

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} ended`);
        });
    } else {
        console.log(`Worker node executing on process ${process.pid}`);

        const server = app.listen(PORT, ()=> {
            console.log(`Server executing address ${server.address().port} and using ${loadBalancer} as balancer of charge. Process ID ${process.id}`);
        });
        server.on('error', err => { console.log(`Server error: ${err.message}`) });
    };
};
