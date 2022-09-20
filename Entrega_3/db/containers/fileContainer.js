'use strict';

const fs = require('fs');

class fileContainer {
    constructor(name) {
        this.name = name;
    };

    save(newObject) {
        return (fs.promises.readFile(`./public/${this.name}`, 'utf8')
            .then (data => {
                const parsedData = JSON.parse(data);
                newObject.id = parsedData.length + 1;
                newObject.timestamp = Date.now();
                parsedData.push(newObject);

                const writeData = JSON.stringify(parsedData);
                return fs.promises.writeFile(`./public/${this.name}`, writeData);
            })
            .then(() => {
                return { message: 'Object saved in the database' };
            })
            .then(error => {
                console.log(`Error reading file: ${error}`);                
            })
        )
    };

    getById(id) {
        return (fs.promises.readFile(`./public/${this.name}`, 'utf8')
            .then (data => {
                const parsedData = JSON.parse(data);
                const selectedItem = parsedData.find(element => Number(element.id) === id);
                if (selectedItem) {
                    return selectedItem;
                }
                return { message: `Object not found by id: ${id}` }; 
            })
            .catch(error => {
                console.log(`Error reading file: ${error}`);                
            })
        );
    };

    getAll(cartId) {
        return (fs.promises.readFile(`./public/${this.name}`, 'utf8')
            .then (data => {
                const parsedData = JSON.parse(data);
                if (cartId === null) {
                    return parsedData;
                };
                const selectedItems = parsedData.find(element => element.id === cartId);

                if(selectedItems) {
                    return selectedItems.productos;
                }
                return { message: `Object not found by id: ${cartId}` };
            })
            .catch(error => {
                console.log(`Error reading file: ${error}`);                
            })
        );
    };

    updateById(id, newData) {
        return (fs.promises.readFile(`./public/${this.name}`, 'utf8')
            .then (data => {
                const parsedData = JSON.parse(data);
                const objectToModify = parsedData.find(element => element.id === id);

                if (objectToModify) {
                    const index = parsedData.indexOf(objectToModify);
                    if(this.name === './productos.json') {
                        parsedData[index].nombre = newData.nombre;
                        parsedData[index].descripcion = newData.descripcion;
                        parsedData[index].codigo = newData.codigo;
                        parsedData[index].imagen = newData.imagen;
                        parsedData[index].precio = newData.precio;
                        parsedData[index].stock = newData.stock;
                        parsedData[index].timestamp = Date.now();
                    } else if (this.name === './carrito.json') {
                        parsedData[index].productos.push(newData);
                    } else {
                        return { message: 'Error in router of database' };
                    }
                } else {
                    return { message: `Object not found by id: ${id}` };
                }
                const writeData = JSON.stringify(parsedData);
                return fs.promises.writeFile(`./public/${this.name}`, writeData);
            })
            .then(() => {
                return { message: `Object updated with id ${id}` };
            })
            .catch(error => {
                console.log(`Error reading file in update function by id: ${error}`);                
            })
        );
    };

    deletedById(general_id, prod_id) {
        return (fs.promises.readFile(`./public/${this.name}`, 'utf8')
            .then(data => {
                const parsedData = JSON.parse(data);
                const selectedItem = parsedData.find(element => element.id === general_id);

                if(selectedItem) {
                    const index = parsedData.indexOf(selectedItem);
                    if(prod_id) {
                        const subSelectedItem = parsedData[index].productos.find(element => element.id === prod_id);
                        if(subSelectedItem) {
                            const subIndex = parsedData[index].productos.indexOf(subSelectedItem);
                            parsedData[index].productos.splice(subIndex, 1);
                        } else {
                            return { message: `Object not found by id: ${prod_id}` };
                        };
                    } else {
                        parsedData.splice(index, 1);
                    };
                    const writeData = JSON.stringify(parsedData);
                    return fs.promises.writeFile(`./public/${this.name}`, writeData);
                } else {
                    return { message: `General object not found by id: ${general_id}` };
                };
            })
            .then(() => {
                return { message: `Object deleted with id ${general_id}` };
            })
            .catch(error => {
                throw new Error(`Error reading file in delete function by id: ${error}`);
            })
        );
    };

};

module.exports = fileContainer;