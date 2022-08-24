# Desafío 14 Objeto Process y Dotenv
## Usando Process y Variables de entorno

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

En esta entrega se se crea el archivo .env en cual se especifican las variables de entorno a usar en la app de manera dinámica. Igualmente se incluye el uso del objeto Process para visualizar la información sobre el proceso principal de la aplicación. 

## Features

Las dos rutas que se implementan son las siguientes:

1. 'http://localhost:8080/info'

En esta ruta se muestran los datos o la información sobre el proceso usado por la app en cuanto a consoleArg, platform, Node version, memoryUsage, path, process id y el cwd. Para poder visualizar la información se debe realizar el Login del usuario y luego especificar la ruta info. 

2. 'http://localhost:8080/api/random/:20000'

En esta ruta se ejecuta el archivo que realiza el cálculo una cantidad de números aleatorios mediante la función contenida en dicho archivo. El número se deberá ingresar por query y en la interfaz se podrá visualizar el objeto con los cálculos respectivos. Igualmente se deberá realizar el login en la app para poder ingresar en la ruta descrita. 