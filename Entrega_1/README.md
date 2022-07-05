# Primera Entrega del Proyecto Final
## _Ecommerce Backend App_

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

App Ecommerce en desarrollo con backend stacks como NodeJS, Express, Nodemon, entre otras. En esta entrega se configura todo el entorno de rutas hacia productos y el carrito de compras. Se crean funcionalidades de GET, POST, PUT y DELETE de productos; así como la posibilidad de agregar, modificar, eliminar productos del carrito de compras. 

## Inicializar la app

La App se inicia a través de la terminal con el comando 'npm start', luego de haber instalado las dependencias de NodeJS, express y Nodemon en las DevDependencies. 

## Features

### Rutas y métodos

### Ruta /api/productos/

- GET: '/'
Se obtiene el listado completo de todos los productos. Ruta disponible para usuarios y administradores.

- GET: '/:id'
Se obtiene un producto del listado por su id. Disponible para usuarios y administradores.

- POST: '/'
Se incluyen productos al listado (sólo disponible para administradores). El formato para incluir el producto debe ser JSON { "nombre": string, "descripcion": string, "codigo": string, "url": string, "precio": number, "stock": number }. El id y el timestamp se agregan de manera automática.
    
- PUT: '/:id'
El método permite actualizar cualquier característica de algún producto por su id (sólo disponible para administradores). Se debe actualizar en formato JSON { "nombre": string, "descripcion": string, "codigo": string, "url": string, "precio": number, "stock": number }. El id y el timestamp se agregan de manera automática.

- DELETE: '/:id'
Elimina un producto de la lista por su id (sólo disponible para administradores).

### Ruta /api/carrito/

- POST: '/'
Crea un carrito nuevo y devuelve el id del mismo.

- DELETE: '/:id'
Elimina el carrito por su 'id'.

- GET: '/'
Lista todos los carritos creados.

- GET: '/:id/productos'
Lista todos los productos guardados en el carrito segun el 'id' del carrito.

- POST: '/:id/productos/:id_prod'
Agrega al carrito un producto por su id 'id_prod', agregando el 'id' del carrito igualmente.

- DELETE: '/:id/productos/:id_prod'
Elimina el producto por su 'id_prod' del carrito por su 'id'.