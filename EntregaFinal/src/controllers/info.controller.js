const authorizationLevel = 0

const dotenv = require('dotenv')
dotenv.config()

const numOfCPUs = require('os').cpus().length

const getServerInfo = (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        const serverInfo = [
            { name: 'Storage Method', value: process.env.STORAGE },
            { name: 'Port', value: process.env.PORT },
            { name: 'Clustering', value: process.env.CLUSTERING },
            { name: 'platformName', value: process.platform },
            { name: 'nodeVersion', value: process.version },
            { name: 'memoryUsage', value: process.memoryUsage().rss },
            { name: 'processId', value: process.pid },
            { name: 'folder', value: process.cwd() },
            { name: 'systemCore', value: numOfCPUs }
        ]

        return res.status(200).render('info', { serverInfo })
    } else {
        res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.originalUrl}', método '${req.method}' no autorizada para el usuario.`
        })
    }
}

module.exports = { getServerInfo }