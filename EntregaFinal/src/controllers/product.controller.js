const { errorLogger } = require('../utils/log4js/log4js.config')
const {
    getItemById,
    getAllItems,
    addItem,
    editItem,
    deleteItem
} = require('../services/product.service')

const authorizationLevel = 0

const getProductById = async (req, res) => {
    if (authorizationLevel === 0 || authorizationLevel === 1) {
        const productId = req.params.id

        if (productId) {
            try {
                const data3 = await getItemById(productId)
                return res.status(200).json(data3)
            } catch (error) {
                errorLogger.error(error)
                return res.status(500).json(error.message)
            }
        }

        try {
            const data3 = await getAllItems()
            return res.status(200).json(data3)
        } catch (error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.originalUrl}', método '${req.method}' no autorizada para el usuario.`
        })
    }
}

const addProduct = async (req, res) => {
    if (authorizationLevel === 0) {
        const newProduct = req.body

        try {
            const answer = await addItem(newProduct)
            return res.status(201).json(answer)
        } catch (error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.originalUrl}', método '${req.method}' no autorizada para el usuario.`
        })
    }
}

const editProduct = async (req, res) => {
    if (authorizationLevel === 0) {
        const productId = req.params.id
        const productUpdated = req.body

        try {
            const answer = await editItem(productId, productUpdated)
            return res.status(201).json(answer)
        } catch (error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.originalUrl}', método '${req.method}' no autorizada para el usuario.`
        })
    }
}

const deleteProduct = async (req, res) => {
    if (authorizationLevel === 0) {
        const productId = req.params.id

        try {
            const answer = await deleteItem(productId, null)
            return res.status(201).json(answer)
        } catch(error) {
            errorLogger.error(error)
            return res.status(500).json(error.message)
        }
    } else {
        return res.status(401).json({
            url: req.originalUrl,
            method: req.method,
            status: 401,
            error: 'Unauthorized',
            message: `Ruta '${req.originalUrl}', método '${req.method}' no autorizada para el usuario.`
        })
    }
}

module.exports = {
    getProductById,
    addProduct,
    editProduct,
    deleteProduct
}