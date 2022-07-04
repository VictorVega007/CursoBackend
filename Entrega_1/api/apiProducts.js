'use strict';

const fs = require('fs');

const routeProducts = 'data/productos.json';

const getProducts = async () => {
	try {
		const result = await fs.promises.readFile(routeProducts, 'utf-8');
		return JSON.parse(result);
	} catch (error) {
		await fs.promises.writeFile(routeProducts, JSON.stringify([], null, 2));
		const result = await fs.promises.readFile(routeProducts, 'utf-8');
		return JSON.parse(result);
	}
}

const saveProduct = async (product) => {
	const { nombre, descripcion, codigo, url, precio, stock } = product;
	const stamp = new Date().toLocaleString('es-AR');
	const arrayProducts = await getProducts();
	let identificador = 0;
	let indexArray = [];
	arrayProducts.forEach((e) => indexArray.push(e.id));
	if (indexArray.length > 0) {
		const arraySorted = indexArray.sort((a, b) => b - a);
		identificador = arraySorted[0] + 1;
	} else {
		identificador = 1;
	}
	const response = { id: identificador, timestamp: stamp, nombre: nombre, descripcion: descripcion, codigo: codigo, url: url, precio: precio, stock: stock };
	arrayProducts.unshift(response);
	try {
		await fs.promises.writeFile(routeProducts, JSON.stringify(arrayProducts, null, 2));
		return { estado: '¡Producto agregado!' };
	} catch (err) {
		console.log('Error: ', err);
	}
}

const updateProduct = async (product, identificador) => {
	const arrayProducts = await getProducts();
	const id = parseInt(identificador.id);
	const { nombre, descripcion, codigo, url, precio, stock } = product;
	const stamp = new Date().toLocaleString('es-AR');
	const updated = { id: id, timestamp: stamp,	nombre: nombre, descripcion: descripcion, codigo: codigo, url: url, precio: precio, stock: stock };
	const actualizado = JSON.stringify(arrayProducts.find((e) => e.id === id));
	const index = arrayProducts.findIndex((e) => e.id === id);
	if (actualizado) {
		arrayProducts[index] = updated;
		try {
			await fs.promises.writeFile(routeProducts, JSON.stringify(arrayProducts, null, 2));
			return { estado: '¡Producto actualizado!' };
		} catch (err) {
			console.log('Error: ', err);
		}
	} else {
		return { error: '¡Producto no encontrado!' };
	}
}

const deleteProduct = async (identificador) => {
	const arrayProducts = await getProducts();
	const id = parseInt(identificador.id);
	const index = arrayProducts.findIndex((e) => e.id === id);
	if (index != -1) {
		try {
			const borrado = arrayProducts.filter((e) => e.id != id);
			await fs.promises.writeFile(routeProducts, JSON.stringify(borrado, null, 2));
			return { estado: '¡Producto eliminado!' };
		} catch (err) {
			console.log('Error: ', err);
		}
	} else {
		return { error: '¡Producto no encontrado!' };
	}
}

const getProductById = async (identificador) => {
	const arrayProducts = await getProducts();
	const id = parseInt(identificador.id);
	const hallado = arrayProducts.find((e) => e.id === id);
	if (hallado) {
		return hallado;
	} else {
		return { error: '¡Producto no encontrado!' };
	}
}

module.exports = {
    getProducts,
    saveProduct,
    updateProduct,
    deleteProduct,
    getProductById
}