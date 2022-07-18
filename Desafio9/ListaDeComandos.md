# Lista de comandos utilizados

- Para crear la base de datos "ecommerce"

```console
use ecommerce;
```

- Para crear las colecciones “Productos” y “Carritos”

```console
db.createCollection(‘productos’);
db.createCollection(‘carritos’);
```

- Para agregar productos a la BD

```console
db.productos.insertMany([
	{
		"timestamp": ISODate(), 
		"title": "Remera", 
		"price": 100, 
		"description": "Remera deportiva", 
		"code": "XP-1", "image": "google.com", 
		"stock": 100
	}, 
	{
		"timestamp": ISODate(), 
		"title": "Pantalon", 
		"price": 320, 
		"description": 
		"Pantalon para trekking", 
		"code": "XP-2", 
		"image": "google.com", 
		"stock": 200
	}, 
	{
		"timestamp": ISODate(), 
		"title": "Camisa", 
		"price": 930, 
		"description": "Camisa manga larga", 
		"code": "XP-3", "image": "google.com", 
		"stock": 300
	}, 
	{
		"timestamp": ISODate(), 
		"title": "TV Led", 
		"price": "1140", 
		"description": "TV ultima generacion", 
		"code": "XP-4", "image": "google.com", 
		"stock": 400
	}, 
	{
		"timestamp": ISODate(), 
		"title": "PlayStation 5", 
		"price": 2250, 
		"description": "Consola de videojuegos", 
		"code": "XP-5", "image": "google.com", 
		"stock": 500
	}, 
	{
		"timestamp": ISODate(), 
		"title": "Notebook", 
		"price": 3360, 
		"description": "Notebook HP", 
		"code": "XP-6", 
		"image": "google.com", 
		"stock": 600
	}, 
	{
		"timestamp": ISODate(), 
		"title": "Smartphone", 
		"price": 4470, 
		"description": "Smartphone Galaxy", 
		"code": "XP-7", 
		"image": "google.com", 
		"stock": 700
	}, 
	{
		"timestamp": ISODate(), 
		"title": "MacBook", 
		"price": 5000, 
		"description": "MacBook Pro M1", 
		"code": "XP-8", 
		"image": "google.com", 
		"stock": 800
	}, 
	{
		"timestamp": ISODate(), 
		"title": "Monitor Samsung", 
		"price": 3450, 
		"description": "Monitor gamer", 
		"code": "XP-9", 
		"image": "google.com", 
		"stock": 900
	}, 
	{
		"timestamp": ISODate(), 
		"title": "Notebook Thinkpad", 
		"price": 2860, 
		"description": "Notebook game", 
		"code": "XP-10", 
		"image": "google.com", 
		"stock": 1000
	}
]);
```

- Para insertar la colección carritos

```console
db.carritos.insertMany([{timestamp: ISODate()}, {timestamp: ISODate()}])
```

- Listar todos los productos y todos los carritos

```console
db.productos.find();
db.carritos.find();
```

- Contar la cantidad de documentos en productos

```console
db.productos.countDocuments();
```

- Agregar un nuevo producto a la colección productos

```console
db.productos.insertOne({
		"timestamp": ISODate(), 
		"title": "Teclado Apple", 
		"price": 3860, 
		"description": "Teclado inalambrico", 
		"code": "XP-11", 
		"image": "google.com", 
		"stock": 1100
	});
```

- Consulta por nombre específico de un producto

```console
db.productos.find({code: “XP-11”}, {title: 1, _id: 0});
```

- Listar productos con precio menor a 1000 pesos

```console
db.productos.find({price: {$lt: 1000}});
```

- Listar productos con precio entre 1000 a 3000 pesos

```console
db.productos.find({price: {$gt: 1000, $lt: 3000}});
```

- Listar productos con precio mayor a 3000 pesos

```console
db.productos.find({price: {$gt: 3000}});
```

- Consulta por nombre del tercer producto más barato

```console
db.productos.find({}, {title: 1, _id: 0}).sort({price: 1}).skip(2).limit(1);
```

- Actualización sobre todos los productos, agregando el campo stock a todos ellos con un valor de 100

```console
db.productos.updateMany({}, {$inc: {stock: 100}}); 
```

- Cambio de stock a 0 de los productos con precio mayor a 4000

```console
db.productos.updateMany({price: {$gt: 4000}}, {$set: {stock: 0}});
```

- Eliminar productos con precio menor a 1000 pesos

```console
db.productos.deleteMany({price: {$lt: 1000}});
```

- Crear usuario Pepe con password: asd456 y que sólo tenga permiso de lectura

```console
use admin

switched to db admin

db.createUser({user: “pepe”, pwd: “asd456”, roles: [{role: “read”, db: “ecommerce”}]});
```

- Login y test con el usuario creado

```console
mongo —auth —-dbpath “Colocar el path correspondiente”;

	mongo -u pepe -p asd456;

	db 
	
	test
	
	use ecommerce

	switched to db ecommerce

	> db.productos.insertOne({nombre: "Zapatillas"})
	uncaught exception: WriteCommandError({
	"ok" : 0,
	"errmsg" : "not authorized on ecommerce to execute command { insert: \"productos\", ordered: true, lsid: { id: UUID(\"87e8b018-6ff1-4363-9c4e-14636c1a7e1f\") }, $db: \"ecommerce\" }",
	"code" : 13,
	"codeName" : "Unauthorized"
	}) :
	WriteCommandError({
	"ok" : 0,
	"errmsg" : "not authorized on ecommerce to execute command { insert: \"productos\", ordered: true, lsid: { id: UUID(\"87e8b018-6ff1-4363-9c4e-14636c1a7e1f\") }, $db: \"ecommerce\" }",
	"code" : 13,
	"codeName" : "Unauthorized"
	})