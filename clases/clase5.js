'use strict';

// let obj = {}

// function setRandomNumbers(min, max) {
//     return Math.floor((Math.random() * (max - min + 1)) + min);
// }

// for (let i = 0; i <= 10000; i++) {
//     const randomNumber = setRandomNumbers(1, 20);
//     if (obj[randomNumber]) {
//         obj[randomNumber] += 1;
//     } else {
//         obj[randomNumber] = 1;
//     }
// };

// console.log(obj);

const productos = [
    { id:1, nombre:'Escuadra', precio:323.45 },
    { id:2, nombre:'Calculadora', precio:234.56 },
    { id:3, nombre:'Globo Terráqueo', precio:45.67 },
    { id:4, nombre:'Paleta Pintura', precio:456.78 },
    { id:5, nombre:'Reloj', precio:67.89 },
    { id:6, nombre:'Agenda', precio:78.90 }
]

const productsName = [];
let totalPrice = 0;
let lowerPrice = productos[0].precio;
let higherPrice = 0;

productos.map(item => {
    productsName.push(item.nombre);
    totalPrice += item.precio;
    if(item.precio > higherPrice) higherPrice = item.precio;
    if(item.precio < higherPrice) higherPrice = item.precio; 
})

const objToShow = {
    productsName: productsName.join(', '),
    totalPrice,
    lowerPrice,
    higherPrice,
    averagePrice: totalPrice / 6
}

console.log(objToShow)