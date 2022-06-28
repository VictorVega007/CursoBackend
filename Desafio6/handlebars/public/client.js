'use strict';

const socket = io();
const btn = document.getElementById('btn-submit');
const btnMensaje = document.getElementById('btn-submit-mensaje');
        
const inputTitle = document.getElementById('input-title');
const inputPrice = document.getElementById('input-price');
const inputImg = document.getElementById('input-img');
        
btnMensaje.addEventListener('click', (evt) => {
    evt.preventDefault();
    const email = document.getElementById('input-email').value;
    const mensaje = document.getElementById('input-mensaje').value;
            
    if (email !== '' && mensaje !== '') {
            
        socket.emit('nuevoMensaje', {
            "email" : email,
            "message" : mensaje,
            "date" : new Date().toLocaleString()
        })
    }
            
})
        
btn.addEventListener('click', (evt) => {
            
    const title = inputTitle.value;
    const price = inputPrice.value;
    const img = inputImg.value;
            
    if (title !== '' && price !== '' && img !== '') {
        socket.emit('productoAgregado',{
            "title": title,
            "price": price,
            "thumbnail": img
        })
    }    
})


socket.on('listaMensajesBienvenida', (data) => {
    const historialMensajes = document.getElementById('historial-mensajes');
    historialMensajes.innerHTML = '';
    data.forEach(mensaje => {
        historialMensajes.innerHTML += `
            <small style="display:block"> 
                - <em style="color: gray">[${mensaje.date}]</em> 
                <strong style="color: #787698">${mensaje.email}</strong>: 
                ${mensaje.message} 
            </small>
        `
    });
});

socket.on('listaMensajesActualizada', (data) => {
    const historialMensajes = document.getElementById('historial-mensajes');
    historialMensajes.innerHTML = '';
    data.forEach(mensaje => {
        historialMensajes.innerHTML += `
            <small style="display:block"> 
                - <em style="color: gray">[${mensaje.date}]</em> 
                <strong style="color: #787698">${mensaje.email}</strong>: 
                ${mensaje.message} 
            </small>
        `
    });
});

socket.on('bienvenidoLista', (data) => {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    data.forEach(product => {
        tableBody.innerHTML += `
            <tr>
                <th scope="row">${product.id}</th>
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td><img src="${product.thumbnail}" alt="${this.title}" style="max-width: 100px; height: 100px"/></td></td>
            </tr>
        `
    });
});

socket.on('listaActualizada', (data) => {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    data.forEach(product => {
        tableBody.innerHTML += `
            <tr>
                <th scope="row">${product.id}</th>
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td><img src="${product.thumbnail}" alt="${this.title}" style="max-width: 100px; height: 100px"/></td></td>
            </tr>
        `
    });
});