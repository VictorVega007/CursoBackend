'use strict';

const fs = require('fs');

class Container {
    constructor(fileName) {
      this.fileName = fileName;
      this.readOrCreateNewFile();
    }

    async getDataFromFile() {
        const dataFromFile = await fs.promises.readFile(this.fileName, 'utf-8');
        return dataFromFile;
    }
  
    async readOrCreateNewFile() {
      try {
        await fs.promises.readFile(this.fileName, 'utf-8');
      } catch (error) {
            if (error) {
                this.createAnEmptyArray()
            } else {
                console.log(`Hubo un error al leer el archivo ${this.fileName}`);
        }
      }
    }
  
    async createAnEmptyArray() {
      fs.writeFile(this.fileName, '[]', (error) => {
        if (error) {
            console.log(error)
        } else {
            console.log(`El archivo ${this.fileName} fue vaciado con éxito`);
        }       
      });
    }

    async save(obj) {
        try {
            const completeData = await this.getDataFromFile();
            const parsedData = JSON.parse(completeData);
    
            obj.id = parsedData.length + 1;
            parsedData.push(obj);
    
            await fs.promises.writeFile(this.fileName, JSON.stringify(parsedData));
            return obj.id;
        } catch (error) {
            console.log(`Hubo un error al guardar el item ${error}`);
        }
    }

    async getById(id) {
        try {
          const completeData = await this.getDataFromFile();
          const parsedData = JSON.parse(completeData);
    
          return parsedData.find((product) => product.id === id);
  
        } catch (error) {
          console.log(`Hubo un error al obtener el item con ID: ${id}. Error: ${error}`);
        }
    }

    async getAll() {
        const completeData = await this.getDataFromFile();
        return JSON.parse(completeData);
    }

    async deleteById(id) {
        try {
          const completeData = await this.getDataFromFile();
          const parsedData = JSON.parse(completeData);
          const itemToRemove = parsedData.find(
            (producto) => producto.id === id
          );
    
          if (itemToRemove) {
            const index = parsedData.indexOf(itemToRemove);
            parsedData.splice(index, 1);
            await fs.promises.writeFile(this.fileName, JSON.stringify(parsedData));
  
          } else {
            console.log(`El item ${id} no existe en el archivo`);
            return null;
          }
        } catch (error) {
          console.log(`Error: ${error}. No se puede remover el item`);
        }
      }

    async deleteAll() {
        try {
          await this.createAnEmptyArray();
        } catch (error) {
          console.log(`Hubo un error: ${error}. No se pueden eliminar todos los items`);
        }
      }
  }

///// Testing Area 

const container = new Container("productos.json");

const testMethods = async () => {
//   const product1 = await container.save({ title: 'Zapatilla', price: 90.77, thumbnail: 'https://e7.pngegg.com/pngimages/244/55/png-clipart-sneakers-nike-free-nike-air-max-shoe-nike-white-sport.png' });
//   const product2 = await container.save({ title: 'Remera', price: 50.89, thumbnail: 'https://w7.pngwing.com/pngs/840/59/png-transparent-t-shirt-adidas-netshoes-clothing-adidas-t-shirt-tshirt-orange-fashion.png' });
//   const product3 = await container.save({ title: 'Short', price: 45.30, thumbnail: 'https://toppng.com/uploads/preview/under-armour-mens-volleyball-shorts-under-armour-raid-shorts-black-11563249478jsdd7yfrm9.png' });

//   console.log(product1, product2, product3); // 1, 2, 3

//   const productId = await container.getById(2);
//   console.log(productId); // { title: 'Remera', price:50.89, id: 2 }

//   await container.deleteById(2);

  const allProducts = await container.getAll();
  console.log(allProducts);
  /**
     * [
        { title: 'Zapatilla', price: 90.77, id: 1 },
        { title: 'Remera', price: 50.89, id: 2 },
        { title: 'Short', price: 45.30, id: 3 }
        ]
    */

//   await container.deleteAll();
};

testMethods();

