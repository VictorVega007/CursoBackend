'use strict';

const socket = io();
const btn = document.getElementById('btn-submit');
const btnMenssage = document.getElementById('btn-submit-message');
const form = document.getElementById('myform');
        
const inputTitle = document.getElementById('input-title');
const inputPrice = document.getElementById('input-price');
const inputImg = document.getElementById('input-img');
        
btnMenssage.addEventListener('click', (evt) => {
    evt.preventDefault();
    const email = document.getElementById('input-email').value;
    const message = document.getElementById('input-message').value;
            
    if (email !== '' && message !== '') {
            
        socket.emit('newMessage', {
            "email" : email,
            "message" : message,
            "date" : new Date().toLocaleString()
        });
        form.reset()
    }; 
});
        
btn.addEventListener('click', () => {
            
    const title = inputTitle.value;
    const price = inputPrice.value;
    const img = inputImg.value;
            
    if (title !== '' && price !== '' && img !== '') {
        socket.emit('productAdded',{
            "title": title,
            "price": price,
            "thumbnail": img
        });
        form.reset();
    };    
});

const showMessages = async (dataProducts) => {
    const response = await fetch('../templates/messagesTemplate.hbs');
    const plantilla = await response.text();
    const message = document.getElementById('messages-history');
    message.innerHTML = '';
    
    dataProducts.forEach(product => {
        const template = Handlebars.compile(plantilla);
        const html = template(product);
        message.innerHTML += html;
    });
};

socket.on('welcomeMessageList', (data) => {
    showMessages(data);
});

socket.on('messageListUpdated', (data) => {
    showMessages(data);
});

const showTableBody = async (dataProducts) => {
    const response = await fetch('../templates/productsTemplate.hbs');
    const plantilla = await response.text();
    const listOfProducts = document.getElementById('table-body');
    listOfProducts.innerHTML = '';

    dataProducts.forEach(product => {
        const template = Handlebars.compile(plantilla);
        const html = template(product);
        listOfProducts.innerHTML += html;
    });
};

socket.on('welcomeList', (data) => {
    showTableBody(data);
});

socket.on('listUpdated', (data) => {
    showTableBody(data);
});