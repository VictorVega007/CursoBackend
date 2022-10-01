'use strict';

import os from 'node:os';
import { fork } from 'child_process';

const randomNumbersGeneratorFork = fork('./src/utils/functions/randomNumbersGenerator.js');

export const getInfo = async (req, res) => {
    const processInfo = {
        platform: process.platform,
        version: process.versions,
        title: process.title,
        execPath: process.execPath,
        processId: process.pid,
        rss: process.memoryUsage().rss,
        numberOfProcessors: os.cpus().length
    };
    res.status(200).json(processInfo);
};

export const getRandomNumbers = async (req, res) => {
    const cant = req.query.cant || 5000;

    randomNumbersGeneratorFork.on('message', result => {
        res.status(200).json(result);
    });
    randomNumbersGeneratorFork.send(cant);
};