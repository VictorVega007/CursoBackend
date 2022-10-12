# Testeando la API REST
## _Ecommerce Backend App_

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

En este desafío se refactoriza mejor el código de la API REST, para organizar las capas de servicios, lógica de negocio, DAO y DTO, respectivos. Igualmente se agregan los test respectivos para comprobar los métodos de peticiones de productos a la base de datos con Axios. Para los tests se usó Jest. 

## Inicializar la app

Para poder revisar los tests hay que levantar el servidor con el siguiente comando:

```console
npm run server
```

Si el anterior comando no inicia la app se puede usar el siguiente:

```console
npx nodemon --inspect ./src/server.js -p 3031
```

## Features

### Rutas y métodos

Las rutas para realizar los test respectivos se ecnuentran en la carpeta 'Routes' de carrito, producto y usuarios. Los test respectivos pueden realizarse en Postman. 

Por último, para verificar los test por la terminal se debe agregar el siguiente comando:

```console
npm run test
```

Con el siguiente comando se agrega un reporte de los tests en un archivo .txt:

```console
npm run testReport
```