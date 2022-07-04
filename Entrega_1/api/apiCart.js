'use strict';

const fs = require('fs');
const productsContainer = require('./apiProducts.js');
const container = new productsContainer('data/productos.json');

class Cart {
	constructor(filename) {
		this.filename = filename;
	}

	async createCart () {
		const stamp = new Date().toLocaleString('es-CL');
		const arrayCart = await this.getCart();
		let identificador = 0;
		let indexArray = [];
	
		arrayCart.forEach((e) => indexArray.push(e.id));
	
		if (indexArray.length > 0) {
			const arraySorted = indexArray.sort((a, b) => b - a);
			identificador = arraySorted[0] + 1;
		} else {
			identificador = 1;
		}
	
		const newCart = { id: identificador, timestamp: stamp, productos: [] };
		arrayCart.unshift(newCart);
		
		try {
			await fs.promises.writeFile(this.filename, JSON.stringify(arrayCart, null, 2));
			return { estado: `Carrito id: ${identificador} creado` };
		} catch (err) {
			console.log('Error: ', err)
		}
	}
	
	async getCart () {
		try {
			const result = await fs.promises.readFile(this.filename, 'utf-8');
			return JSON.parse(result);
		} catch (err) {
			await fs.promises.writeFile(this.filename, JSON.stringify([], null, 2));
			const result = await fs.promises.readFile(this.filename, 'utf-8');
			return JSON.parse(result);
		}
	}
	
	async addProductById (cart, prod) {
		const idProd = { id: prod };
		const product = await container.getProductById(idProd);
		const errorProd = JSON.stringify(product).search('error');
	
		if (errorProd != -1) {
			return { error: 'El producto no existe' };
		}
	
		const idCart = { id: cart };
		const productosCarro = await this.getCartProductsById(idCart);
		const errorCarro = JSON.stringify(productosCarro).search('error');
	
		if (errorCarro != -1) {
			return { error: 'El carrito no existe' };
		}
	
		let actualizado = [];
		productosCarro.forEach((e) => actualizado.push(e));
		actualizado.push(product);
	
		const response = await this.updateCart(actualizado, cart);
	
		return response;
	}
	
	async updateCart (cart, identificador) {
		const arrayCart = await this.getCart();
		const id = parseInt(identificador);
		const productos = cart;
		const stamp = new Date().toLocaleString('es-CL');
		const updated = { id: id, timestamp: stamp, productos: productos };
		const actualizado = JSON.stringify(arrayCart.find((e) => e.id === id));
		const index = arrayCart.findIndex((e) => e.id === id);
	
		if (actualizado) {
			arrayCart[index] = updated;
			try {
				await fs.promises.writeFile(this.filename, JSON.stringify(arrayCart, null, 2));
				return { estado: 'Producto agregado' };
			} catch (err) {
				console.log('Error: ', err);
			}
		} else {
			return { error: 'El carrito no existe' };
		}
	}
	
	async deleteProductById (cart, identificador) {
		const arrayCart = await this.getCart();
		const stamp = new Date().toLocaleString('es-CL');
		const id = parseInt(identificador);
		const index = arrayCart.findIndex((e) => e.id == cart);
	
		if (index === -1) {
			return { error: 'El carrito no existe' };
		}
	
		const indice = arrayCart[index].productos.findIndex((e) => e.id == id);
	
		if (indice === -1) {
			return { error: 'El producto no existe en el carrito' };
		}
	
		try {
			const newProduct = arrayCart[index].productos.filter((e) => e.id != id);
			arrayCart[index].productos = newProduct;
			arrayCart[index].timestamp = stamp;
			await fs.promises.writeFile(this.filename, JSON.stringify(arrayCart, null, 2));
	
			return { estado: `Producto id: ${id} eliminado del carrito` };
		} catch (err) {
			console.log('Error: ', err);
		}
	}
	
	async deleteCart (identificador) {
		const arrayCart = await this.getCart();
		const id = parseInt(identificador.id);
		const index = arrayCart.findIndex((e) => e.id === id);
	
		if (index != -1) {
			try {
				const borrado = arrayCart.filter((e) => e.id != id);
				await fs.promises.writeFile(this.filename, JSON.stringify(borrado, null, 2));
	
				return { estado: `Carrito id: ${id} eliminado` };
			} catch (err) {
				console.log('Error: ', err);
			}
		} else {
			return { error: 'El carrito no existe' };
		}
	}
	
	async getCartProductsById (identificador) {
		const arrayCart = await this.getCart();
		const id = parseInt(identificador.id);
		const cartFound = arrayCart.find((e) => e.id === id);
	
		if (cartFound) {
			return cartFound.productos;
		} else {
			return { error: `El carrito con id ${id} no existe` };
		}
	}
	
	async getCartById (identificador) {
		const arrayCart = await getCart();
		const id = parseInt(identificador.id);
		const cartFound = arrayCart.find((e) => e.id === id);
	
		if (cartFound) {
			return cartFound;
		} else {
			return { error: `El carrito con id ${id} no existe` };
		}
	}
} 

module.exports = Cart;