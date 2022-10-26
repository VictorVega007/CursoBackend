# Reformar para usar otro framework
## _Ecommerce Backend App_

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

En este desafío se modifica el proyecto para adaptarlo a la integración con Koa. Se adaptan los archivos contenidos en la carpeta "graphql" y "services" para usar los middlewares propios del framework. 

## Inicializar la app

Para poder realizar los tests en graphiql hay que levantar primero el servidor con el siguiente comando:

```console
npm start
```

Si el anterior comando no inicia la app se puede usar el siguiente:

```console
npx nodemon --inspect ./src/serverKoa.js
```

## Features

### CRUD en GraphQL

Para visualizar la vista de GraphiQL se debe ingresar a la siguiente ruta: 

```console
http://localhost:6965/graphql
```

#### Ejemplo de ejecución del servidor con GraphQL

```console
[nodemon] 2.0.20
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node --inspect ./src/serverKoa.js`
Debugger listening on ws://127.0.0.1:9229/f720e06c-6838-4dd7-a499-82fda797e2e4
For help, see: https://nodejs.org/en/docs/inspector
[2022-10-26T09:19:38.349] [INFO] default - 🚀 Server started at http://localhost:6965
[2022-10-26T09:19:38.354] [INFO] default - 🕸️  GraphQL Playground: http://localhost:6965/graphql
[2022-10-26T09:19:39.444] [INFO] default - 🆗 Connected to MongoDB
```