'use strict';

const fs = require('fs');
const { default: knex } = require('knex');
const { parse } = require('path');

class simplifiedContainer {
    constructor(dataArray, dbOptions, table) {
        this.data = dataArray;
        this.dbOptions = dbOptions;
        this.table = table;
    };

    save(newObject) {    
        const knex = require('knex')(this.dbOptions);
        return knex(this.table).insert(newObject)
        .then(newObjectId => {
            return newObjectId;
        })
        .catch (error => {
            throw Error(`Error saving object in ${this.table}: ${error}`);
        }); 
    };

    getById(id, path) {
        return (fs.promises.readFile(`./public/${path}`, 'utf8')
            .then(data => {
                const parsedData = JSON.parse(data);
                const selectedElement = parsedData.find(element => element.id === id);

                if (selectedElement) {
                    return selectedElement;
                };
                throw Error(`Object with id ${id} not found in ${path}`);
            })
            .catch(error => {
                throw Error(`Error reading getById function in the file: ${error.message}`);
            })
        );
    };

    getAll() {
        const knex = require('knex')(this.dbOptions);
        return knex
            .from(this.table)
            .select('*')
            .then(selection => {
                return selection;
            })
            .catch(error => {
                throw Error(`Error reading getAll function in the file: ${error.message}`);
            });
    };

    updateById(path, id, newData){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
        .then((data) => {
            const parsedData = JSON.parse(data)
            const objectToModify = parsedData.find(element => element.id == id)
            if(objectToModify){
                const index = parsedData.indexOf(objectToModify)
                if(path == 'BDDproducts.txt'){
                    parsedData[index].nombre = newData.nombre
                    parsedData[index].descripcion = newData.descripcion
                    parsedData[index].codigo = newData.codigo
                    parsedData[index].imagen = newData.imagen
                    parsedData[index].precio = newData.precio
                    parsedData[index].stock = newData.stock
                    parsedData[index].timestamp = Date.now()
                } else if (path == 'BDDcart.txt'){
                    parsedData[index].productos.push(newData)
                } else {
                    throw Error('Error in updateById function')
                }
            } else {
                throw Error('Object not found by id')
            }
            const writeData = JSON.stringify(parsedData)
            return fs.promises.writeFile(`./public/${path}`,writeData)
        })
        .then(() => {
            return {message:`The object with id ${id} was successfully modified`}
        })
        .catch(error => {
            throw Error(`Error reading the updateById function. ${error}`)
        })
        );
    };

    deleteById(path, general_id, prod_id){
        return(fs.promises.readFile(`./public/${path}`,'utf-8')
            .then((data) => {
                const parsedData = JSON.parse(data)
                const selectedElement = parsedData.find(element => element.id === general_id)
                if(selectedElement){
                    const index = parsedData.indexOf(selectedElement)  
                    if(prod_id){                                        
                        const subSelectedElement = parsedData[index].productos.find(element => element.id === prod_id)
                        if(subSelectedElement){
                            const subSelectedIndex = parsedData[index].productos.indexOf(subSelectedElement)
                            parsedData[index].productos.splice(subSelectedIndex, 1)
                        } else {
                            throw Error(`The product does not exist with id: ${prod_id}`)
                        }
                    } else {
                        parsedData.splice(index, 1)
                    }
                    const writeData = JSON.stringify(parsedData)
                    return fs.promises.writeFile(`./public/${path}`, writeData)
                } else {
                    throw Error(`The general_id field does not exist: ${general_id}`)
                }
            })
            .then(() => {
                return {message: `The object with id ${general_id} was successfully deleted`}
            })
            .catch(error => {
                throw Error(`Error reading the deleteById function in the file. ${error.message}`)
            })
        );   
    };
};

module.exports = simplifiedContainer;