'use strict';

class memoryContainer{
    constructor(name){
        this.name = name;
        this.data = [];
    };

    getAll(cartId) {
        if (cartId === null) {
            return Promise.resolve(this.data);
        };

        const selectedElement = this.data.find(element => element.id === cartId);

        if (selectedElement) {
            return Promise.resolve(selectedElement);
        };
        throw new Error(`Object not found by id: ${cartId}`);
    };

    getById(id) {
        const index = this.data.findIndex(element => element.id === id);

        if (index === -1 ) {
            throw new Error(`Error to retrieve object: ${id}`);
        };
        return this.data[index];
    };

    save(data) {
        data.id = this.data.length + 1;
        data.timestamp = Date.now();
        this.data.push(data);
        
        return Promise.resolve(data);
    };

    updateById(id, newData) {
        const objectToUpdate = this.data.find(element => element.id === id);
        const index = this.data.indexOf(objectToUpdate);

        if (objectToUpdate) {
            if (this.name === 'producto') {
                this.data[index].nombre = newData.nombre;
                this.data[index].descripcion = newData.descripcion;
                this.data[index].codigo = newData.codigo;
                this.data[index].imagen = newData.imagen;
                this.data[index].precio = newData.precio;
                this.data[index].stock = newData.stock;
                this.data[index].timestamp = Date.now();
            } else if (this.name === 'carrito') {
                this.data[index].productos.push(newData);
            } else {
                throw Error('Error to get the url');
            };
        } else {
            throw new Error(`Error to update object: ${id}`);
        };
        return this.data[index];
    };

    deleteById(general_id, prod_id) {
        const selectedElement = this.data.find(element => element.id === general_id);

        if (selectedElement) {
            const index = this.data.indexOf(selectedElement);

            if (prod_id) {
                const subSelectedElement = this.data[index].productos.find(element => element.id === prod_id);
                if (subSelectedElement) {
                    const subIndex = this.data[index].productos.indexOf(subSelectedElement);
                    this.data[index].productos.splice(subIndex, 1);
                } else {
                    throw Error(`Error to delete object: ${prod_id}`);
                };
            } else {
                this.data.splice(index, 1);
            };
        } else {
            throw new Error(`Error to delete object: ${general_id}`);
        };
    };
};

module.exports = memoryContainer;

