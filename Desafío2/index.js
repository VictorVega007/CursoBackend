'use strict';

const Container = require('./ManejoDeArchivos.js')

const container = new Container("productos.json");

//// Test Area | Llamadas a todos los métodos creados en el módulo que contiene la clase Container

const testMethods = async () => {
// 1. Método save //

  // const product1 = await container.save({ title: 'Zapatilla', price: 90.77, thumbnail: 'https://e7.pngegg.com/pngimages/244/55/png-clipart-sneakers-nike-free-nike-air-max-shoe-nike-white-sport.png' });
  // const product2 = await container.save({ title: 'Remera', price: 50.89, thumbnail: 'https://w7.pngwing.com/pngs/840/59/png-transparent-t-shirt-adidas-netshoes-clothing-adidas-t-shirt-tshirt-orange-fashion.png' });
  // const product3 = await container.save({ title: 'Short', price: 45.30, thumbnail: 'https://toppng.com/uploads/preview/under-armour-mens-volleyball-shorts-under-armour-raid-shorts-black-11563249478jsdd7yfrm9.png' });
  // console.log(product1, product2, product3); 

// 2. Método getById //

  // const productId = await container.getById(2);
  // console.log(productId); 

// 3. Método getAll
  // const allProducts = await container.getAll();
  // console.log(allProducts);

// 4. Método deleteById
  // await container.deleteById(2);

// 5. Método deleteAll

  // await container.deleteAll();
};

testMethods();


