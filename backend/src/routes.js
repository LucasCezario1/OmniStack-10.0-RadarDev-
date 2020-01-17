const { Router} = require('express');

const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs' , DevController.index); //Listar
routes.post('/devs', DevController.store ); //Criar

routes.get('/search',SearchController.index); //Buscar

module.exports = routes;
