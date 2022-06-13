'use strict';

const express = require('express');
const app = express();
const Container = require('./src/container');
const container = new Container('productos.json');
app.use(express.static('public'));
const { Router } = require('express')
const port = 8080;

// const testMethods = async () => {
//     // 1. Método save //
    
//     //   const product1 = await container.save({ title: 'Zapatilla', price: 90.77, thumbnail: 'https://e7.pngegg.com/pngimages/244/55/png-clipart-sneakers-nike-free-nike-air-max-shoe-nike-white-sport.png' });
//     //   const product2 = await container.save({ title: 'Remera', price: 50.89, thumbnail: 'https://w7.pngwing.com/pngs/840/59/png-transparent-t-shirt-adidas-netshoes-clothing-adidas-t-shirt-tshirt-orange-fashion.png' });
//     //   const product3 = await container.save({ title: 'Short', price: 45.30, thumbnail: 'https://toppng.com/uploads/preview/under-armour-mens-volleyball-shorts-under-armour-raid-shorts-black-11563249478jsdd7yfrm9.png' });
//     //   console.log(product1, product2, product3); 
    
//     // 2. Método getById //
    
//       // const productId = await container.getById(2);
//       // console.log(productId); 
    
//     // 3. Método getAll
//       // const allProducts = await container.getAll();
//       // console.log(allProducts);
    
//     // 4. Método deleteById
//       // await container.deleteById(2);
    
//     // 5. Método deleteAll
    
//     //   await container.deleteAll();
//     };
    
//     testMethods();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const router = Router();

app.use('/api/productos', router);

router.get('/', async (req, res) => {
    const products = await container.getAll();
    res.status(200).json(products);
})

router.get('/:id', async (req, res) =>{
    const { id } = req.params;
    const product = await container.getById(id);

    if(product) {
        res.status(200).json(product)
    } else {
        res.status(404).json({error: `El producto con id ${id} no existe`})
    }
})

router.post('/', async (req, res) => {
    const { body } = req;
    const newProductWithId = await container.save(body);
    res.status(200).send(`Producto agregado con éxito con el id ${newProductWithId}`);
})

router.put('/:id', async(req, res) =>{
    const { id } = req.params;
    const { body } = req;
    const productUpdated = await container.updateById(id, body);

    if (productUpdated) {
        res.status(200).send(`Producto con id: ${id} actualizado`);
    } else {
        res.status(404).send(`Producto con id: ${id} no actualizado`);
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const productDeleted = await container.deleteById(id);

    if(productDeleted) {
        res.status(200).send(`El producto con id: ${id} fue eliminado con éxito`);
    } else {
        res.status(404).send(`El producto con id: ${id} no pudo eliminarse`);
    }
})

app.listen(port, err => {
    if(err) {
        console.log(`Hubo un error al iniciar servidor ${err}`)
    } else {

        console.log(`Escuchando puerto ${port}`)
    }
})