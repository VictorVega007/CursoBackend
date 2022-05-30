'use strict';
const fs = require('fs');

const date = new Date();
const actualDate = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();

try {
    fs.writeFileSync('./fyh.txt', JSON.stringify(actualDate))
    console.log(fs.readFileSync('./fyh.txt', 'utf-8'))
} catch(e) {
    console.log(`This is an error ${e}`)
}

const cities = [
    { nombre: "Buenos Aires", poblacion: 12000 }, 
    { nombre: "Sao Pablo", poblacion: 12000 }, 
    { nombre: "Caracas", poblacion: 12000 }
];

fs.mkdir('./ciudades', error => {
    if(error) {
        console.log(`Hubo un error ${error}`)
    } else {
        console.log('Se creó la carpeta con éxito')
    }
}) 

fs.writeFile('./ciudades/ciudades.txt', JSON.stringify(cities), error =>{
    error && console.log(`Error al crear el archivo ${error}`)

    fs.readFile('./ciudades/ciudades.txt', 'utf-8', (error, resultado) => {
        if(error) {
            console.log(`Se produjo un error al leer el archivo ${error}`)
        } else {
            const infoParsed = JSON.parse(resultado)

            for(let i = 0; i < infoParsed.length; i++) {
                console.log(
                    `
                        Ciudad: ${infoParsed[i].nombre}
                        Población: ${infoParsed[i].poblacion}
                    `
                )
            }
        }
    })
})