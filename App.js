'use strict'

class User {
    constructor (name, lastname) {
      this.name = name,
      this.lastname = lastname,
      this.pets = [],
      this.books = []
    };
  
  getFullName() {
      return console.log(`Nombre de usuario: ${this.name} ${this.lastname}`);
  };
  
  addPets(...petName) {
      return this.pets.push(...petName);
  };
    
  countPets() {
      let numOfPets = this.pets.length;
      return console.log(numOfPets);
  };

  addBooks(...book) {
      return  this.books.push(...book);
  };

  getBookNames() {
      let Array = this.books;
      let newArray = [];
      
      Array.map(object => {
          let nameOfBooks = object.nameBook;
          
          if(nameOfBooks) {
            newArray.push(nameOfBooks);
        };
    });
        console.log(newArray);
  };
};
  
  
  const userOne = new User('Victor', 'Vega');
  console.log(userOne);
  userOne.getFullName();
  userOne.addPets('Spike', 'Loki', 'Grumpy', 'Rocky', 'Raiden');
  userOne.countPets();
  userOne.addBooks( 
      {nameBook: 'James Bond 007', author: 'Ian Fleming'},
      {nameBook: 'Eloquent JavaScript', author: 'Marijn Haverbeke'},
      {nameBook: 'Black Hawk Down', author: 'Mark Bowden'},
      {nameBook: 'Angels & Demons', author: 'Dan Brown'}
    );
  userOne.getBookNames();


  