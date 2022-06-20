'use strict';

// const { urlencoded } = require('express');
const express = require('express');
const { engine } = require('express-handlebars');
const routes = require('../routes/index')
const app = express();
const port = 8080;
const path = require('path')


app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static('public'));

app.set('views', path.join(__dirname, './views') );
app.set('view engine', 'hbs');

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: path.join(__dirname, '/views/layouts'),
    partialsDir:path.join(__dirname, '/views/partials') 
}));

app.use('/', routes);

app.listen(port, () => {
    console.log(`Servidor escuchando el puerto ${port}`)
})





// const testMethods = async () => {
    // 1. Método save //
    
    //   const product1 = await container.save({ title: 'Zapatilla', price: 90.77, thumbnail: 'https://e7.pngegg.com/pngimages/244/55/png-clipart-sneakers-nike-free-nike-air-max-shoe-nike-white-sport.png' });
    //   const product2 = await container.save({ title: 'Remera', price: 50.89, thumbnail: 'https://w7.pngwing.com/pngs/840/59/png-transparent-t-shirt-adidas-netshoes-clothing-adidas-t-shirt-tshirt-orange-fashion.png' });
    //   const product3 = await container.save({ title: 'Short', price: 45.30, thumbnail: 'https://toppng.com/uploads/preview/under-armour-mens-volleyball-shorts-under-armour-raid-shorts-black-11563249478jsdd7yfrm9.png' });
    //   console.log(product1, product2, product3); 
    
    // 2. Método getById //
    
      // const productId = await container.getById(2);
      // console.log(productId); 
    
    // 3. Método getAll
      // const allProducts = await container.getAll();
      // console.log(allProducts);
    
    // 4. Método deleteById
      // await container.deleteById(2);
    
    // 5. Método deleteAll
    
    //   await container.deleteAll();
    // };
    
    // testMethods();