'use strict';

const fs = require('fs');

class Container {
    constructor(fileName) {
      this.fileName = fileName;
      this.readOrCreateNewFile();
    };

    async getDataFromFile() {
        const dataFromFile = await fs.promises.readFile(this.fileName, 'utf-8');
        return dataFromFile;
    };

    async parsedData() {
        const completeData = await this.getDataFromFile();
        const parsedData = JSON.parse(completeData);
        return parsedData;
    };
  
    async readOrCreateNewFile() {
      try {
        await fs.promises.readFile(this.fileName, 'utf-8');
      } catch (error) {
            if (error) {
                this.createAnEmptyArray()
            } else {
                console.log(`Hubo un error al leer el archivo ${this.fileName}`);
        };
      };
    };
  
    async createAnEmptyArray() {
      fs.writeFile(this.fileName, '[]', (error) => {
        if (error) {
            console.log(error)
        } else {
            console.log(`El archivo ${this.fileName} fue vaciado con éxito`);
        };     
      });
    };

    async save(obj) {
        try {
            const dataParsed = await this.parsedData();
            obj.id = dataParsed.length + 1;
            dataParsed.push(obj);
            await fs.promises.writeFile(this.fileName, JSON.stringify(dataParsed));
            return obj.id;

        } catch (error) {
            console.log(`Hubo un error al guardar el item ${error}`);
        };
    };

    async getById(id) {
        try {
          const dataParsed = await this.parsedData();
          return dataParsed.find((product) => product.id === id);
  
        } catch (error) {
          console.log(`Hubo un error al obtener el item con ID: ${id}. Error: ${error}`);
        };
    };

    async getAll() {
        const completeData = await this.getDataFromFile();
        return JSON.parse(completeData);
    };

    async deleteById(id) {
        try {
          const dataParsed = await this.parsedData();
          const itemToRemove = dataParsed.find(
            (producto) => producto.id === id
          );
    
          if (itemToRemove) {
            const index = dataParsed.indexOf(itemToRemove);
            dataParsed.splice(index, 1);
            await fs.promises.writeFile(this.fileName, JSON.stringify(dataParsed));
  
          } else {
            console.log(`El item ${id} no existe en el archivo`);
            return null;
          }
        } catch (error) {
          console.log(`Error: ${error}. No se puede remover el item`);
        };
      };

    async deleteAll() {
        try {
          await this.createAnEmptyArray();
        } catch (error) {
          console.log(`Hubo un error: ${error}. No se pueden eliminar todos los items`);
        };
      };
  };

module.exports = Container;