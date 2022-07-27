# Segunda entrega del proyecto final
## Base de datos con MongoDB Atlas y Firebase 

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

En esta entrega se crea la base de datos "ecommerce" en MongoDB Atlas y Firebase; esta base se compone de dos colecciones en cada DBaaS. Las colecciones "carrito" y "productos" en Firebase; así como las colecciones "carritos" y "productos" en MongoDB Atlas, respectivamente. 

## Features

Para la implementación del CRUD en la base de datos se debe iniciar la app con el comando "node server.js" ya que se utiliza NodeJS para el servidor. Previamente a iniciar el servidor se debe escoger el tipo de servicio a utilizar. 

Esta configuración se debe cambiar en el archivo ".env"; por defecto la variable de entorno de la DATABASE se encuentra en "mongodb", para usar firebase se debe colcocar dicha variable "firebase" en el archivo mencionado.

Todas los tests de las rutas respecto al CRUD se pueden ejecutar en POSTMAN.

## Create and Update de datos

### MongoDB Atlas

- Insertar productos a la colleción productos

Para crear o insertar un documento a la colección "productos" se debe ingresar en formato JSON uno o varios productos. El formato sería el siguiente:

```json
{
    "nombre": "Medias",
    "descripcion": "Medias de algodón",
    "codigo": "8746",
    "image": "hotmail.com",
    "precio": 30,
    "stock": 33,
    "timestamp": ""
}
```

- Insertar un carrito nuevo a la coleción carritos

Ingresar la URL "localhost:3000/api/carrito" y en se debe enviar un JSON en el body para insertar los productos, siguiendo el siguiente formato:

```json
{
    "productos": [
        { 
            "_id": "62e147ded21bc7b31843f0e0",
            "nombre": "Pantalón",
            "descripcion": "Pantalón casual",
            "codigo": "7654",
            "image": "google.com",
            "precio": 43,
            "stock": 50,
            "timestamp": "1658931166514"
        },
        {
            "_id": "62e148b0d21bc7b31843f0e6",
            "nombre": "Vestido",
            "descripcion": "Vestido formal",
            "codigo": "8746",
            "image": "google.com",
            "precio": 37,
            "stock": 20,
            "timestamp": "1658931376323"
        },
        {
            "_id": "62e148ebd21bc7b31843f0e8",
            "nombre": "Sweater",
            "descripcion": "Sweater de algodón",
            "codigo": "2536",
            "image": "google.com",
            "precio": 48,
            "stock": 30,
            "timestamp": "1658931435109"
        }
    ],
    "timestamp": ""
}
```

Se pueden agregar el número de productos deseados dentro del Array de la key "productos" siguiendo el formato json. 

- Insertar productos en un carrito específico por ID

Igualmente si se desea ingresar uno o varios productos en un carrito por ID, se debe ingresar a la ruta "localhost:3000/api/carrito/'id del carrito'/productos" y en el body enviar un JSON del producto dentro de un Array. 

```json
[
    { 
        "_id": "62e147ded21bc7b31843f0e0",
        "nombre": "Pantalón",
        "descripcion": "Pantalón casual",
        "codigo": "7654",
        "image": "google.com",
        "precio": 43,
        "stock": 50,
        "timestamp": "1658931166514"
    }
]
```

### Firebase

- Insertar productos 

Para insertar un producto o varios productos a la colección "productos" se debe seguir el siguiente formato JSON:

```json
{
    "nombre": "Zapatilla",
    "descripcion": "Zapatilla deportiva",
    "precio": 37,
    "stock": 45,
    "codigo": 5647,
    "imagen": "google.com",
    "timestamp": ""
}
```

- Insertar un nuevo carrito 

Para crear un nuevo carrito en la colección "carrito" colocar la ruta "localhost:3000/api/carrito" y realizar el POST sin ninguna data JSON; automáticamente se muestra el mensaje de haber sido creado un nuevo carrito con su ID respectivo. 

- Insertar productos a un carrito específico

Para ingresar un producto o varios en un carrito específico por su ID, se debe colocar la ruta "localhost:3000/api/carrito/'id del carrito'/productos" y enviar la data de productos dentro de un Array en un JSON con el siguiente formato:

```json
[
    {
        "stock": 22,
        "precio": 25,
        "descripcion": "Remera deportiva",
        "timestamp": {
            "_seconds": 1658872792,
            "_nanoseconds": 561000000
        },
        "imagen": "google.com",
        "nombre": "Remera",
        "codigo": 3654
    },
    {
        "codigo": 7865,
        "nombre": "Buzo",
        "imagen": "google.com",
        "descripcion": "Buzo deportivo",
        "timestamp": {
            "_seconds": 1658872792,
            "_nanoseconds": 561000000
        },
        "stock": 30,
        "precio": 50
    }
]
```

** Las demás operaciones del CRUD se pueden realizar siguiendo las rutas de los archivos "cartsRouter.js" y "productsRouter.js" respectivamente. **
 