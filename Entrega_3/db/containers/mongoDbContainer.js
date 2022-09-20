'use strict';

const mongoose = require('mongoose');
const { checkConnection } = require('../connectionMongoDB');
const { dbLogger } = require('../../utils/log4jsConfig');

class MongoDbContainer {
  constructor(collectionName, schema, uri) {
    this.collection = mongoose.model(collectionName, schema);
    this.uri = uri;
    this.mongoConnect();
  };

  async mongoConnect() {
    checkConnection(this.uri);
  };

  async save(newObject) {
    try {
      const item = await this.collection.create(newObject);
      return item;
    } catch (error) {
      throw new Error(`Error creating collectionName: ${error}`);
    };
  };

  async getById(id) {
    try {
      const items = await this.collection.findById(id);

      if(items) {
        return items;
      }
      throw new Error(`Failed to find ${id}`);
    } catch (error) {
      throw new Error(`Error while trying read getById function: ${error.message}`);
    };
  };

  async getAll(cartId) {
    try {
      const items = await this.collection.find();

      if(cartId === null) {
        return items;
      }
      const selectedElement = items.find(element => element._id.toString() === (cartId));

      if (selectedElement) {
        return selectedElement.productos;
      }

      throw new Error(`Failed to find ${cartId}`);

    } catch (error) {
      throw new Error(`Error to get products: ${error}`);
    };
  };

  // async updateById(id, newData) {
  //   if(this.collection.modelName === 'productos') {
  //     try {
  //       await this.collection.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, {
  //         nombre: newData.nombre,
  //         descripcion: newData.descripcion,
  //         codigo: newData.codigo,
  //         imagen: newData.imagen,
  //         precio: newData.precio,
  //         stock: newData.stock,
  //         timestamp: Date.now()
  //       });
  //       return { message: `The object with id ${id} has been updated successfully`};
  //     } catch(error) {
  //       throw new Error(`The id ${id} doesn't exist ${error}`);
  //     };
  //   } else if(this.collection.modelName === 'carritos') {
  //     try {
  //       await this.collection.updateOne({_id: mongoose.Types.ObjectId(id)}, {
  //         $push: {productos: newData}
  //       });
  //       return { message: `The object with id ${id} has been updated successfully`};

  //     } catch (error) {
  //       throw new Error(`The id ${id} doesn't exist ${error}`);
  //     };
  //   } else {
  //     throw new Error(`Invalid collection`);
  //   }; 
  // };


  async deleteById(general_id, prod_id) {
    if ((this.collection.modelName === 'productos') || ((this.collection.modelName === 'carritos') && (prod_id === null))) {
      try{
        const success = await this.collection.deleteOne({_id: mongoose.Types.ObjectId(general_id)});

        if(success.modifiedCount != 0) {
          return { message: `The product with id: ${general_id} was successfully deleted` };
        } else {
          throw new Error(`There was an error finding in the database`);
        }
      } catch(error) {
        throw new Error(`There was an error deleting the object with id: ${general_id}. ${error}`);
      };
    } else if (this.collection.modelName === 'carritos') {

      try {
        const success = await this.collection.updateMany(
          { _id: mongoose.Types.ObjectId(general_id) },
          { $pull: { productos: {id: Number(prod_id)}} }
        );

        if(success.modifiedCount != 0) {
          return { message: `The product with id: ${prod_id} was successfully deleted from cart with id: ${general_id}` };
        } else {
          throw new Error(`There was an error finding the product with id: ${prod_id}`);
        };

      } catch (error) {
        throw new Error(`There was an error deleting the object with id: ${general_id}. ${error}`);
      };

    } else {
      throw new Error(`The database doesn't exist`);
    };
  };

};

module.exports = MongoDbContainer;