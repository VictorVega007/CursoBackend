'use strict';

import { UserService } from '../services/user.service.js';
import { sendGmail } from '../utils/notifications/gmail/EmailSender.js';
import { htmlNewUserTemplate } from '../utils/notifications/gmail/htmltemplates/NewUserCreatedTemplate.js';

const userService = new UserService.getInstance();

export const loginView = async (req, res) => {
    if (req.session.login) {
        res.redirect('/api/usuario');
    } else {
        res.render('pages/login', {status: false});
    };
};

export const signUpView = async (req, res) => {
    if (req.session.login) {
        res.redirect('/api/usuario');
    } else {
        res.render('pages/signup', {status: false});
    };
};

export const signUp = async (req, res) => {
    const { body } = req;
    const newUser = await userService.createUser(body);

    if (newUser) {
        const registrationDate = new Date();
        const newUserTemplateEmail = htmlNewUserTemplate(newUser._id, registrationDate.toLocaleString());
        await sendGmail('New user created', newUserTemplateEmail);
        
        res.status(200).json({'success': 'User created with ID: ' + newUser._id});
    } else {
        res.status(400).json({'error': 'Please verify the body content match schema'});
    };
};

export const logIn = async (req, res) => {
    const { user, pass } = req.body;
    const loggedUser = await userService.loginUser({
        username: user,
        password: pass
    });

    if (loggedUser) {
        req.session.login = true;
        res.redirect('/api/usuario');
    } else {
        res.session.login = false;
        res.redirect('/api/usuario/login');
    };
}; 

export const homeView = async (req, res) => {
    res.render('pages/home', { status: req.session.login });
};

export const logOutView = async (req, res) => {
    if (!req.session.login) {
        res.redirect('/api/usuario');
    } else {
        req.session.destroy( error => {
            if (error) {
                res.json(error);
            } else {
                res.render('pages/logout', { status: false });
            };
        });
    };
};