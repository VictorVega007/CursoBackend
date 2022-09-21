# Tercera Entrega del Proyecto Final
## _Ecommerce Backend App_

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

En esta tercera entrega se implementa un registro de usuario en la app, al momento de inciar el servidor se muestra la página de Signup (registro), Login (ingreso) y Logout (deslogueo). Los datos ingresados son guardados en la base de datos de MongoDB.

Igualmente, se usó nodemailer para el envío de notificaciones vía correo electrónico al momento del registro de un nuevo usuario. Esta notificación se envía al administrador de la app. Se trabaja los test de rutas en forma local.  

## Inicializar la app

La App se inicia a través de la terminal con el comando 'npx nodemon', luego de haber instalado las dependencias de NodeJS, express y Nodemon en las DevDependencies. 

## Features

### Rutas y métodos

Las rutas para realizar los test respectivos se ecnuentran en la carpeta 'Routes' de carrito, producto y usuarios. Los test respectivos pueden realizarse en Postman. 

Por último, se implementó logger para mostrar en los archivos respectivos los errores al momento de probar la app. 