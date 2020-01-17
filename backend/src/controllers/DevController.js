const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArrary');
const {findConnections , sendMessage  } = require('../websocket');


module.exports ={
  //Listagem
  async index(request , response){
    const devs = await Dev.find();

    return response.json(devs);
  },

  //Cadastro
  async  store(request , response){
    const { github_username , techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne ({ github_username});
    
    if(!dev){
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
  
      const { name = login, avatar_url,  bio  }  = apiResponse.data ;
      
      const techsArray =parseStringAsArray(techs);
    
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };
    
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs:techsArray,
        location,
      })
      // Filtrar as conexoes que estao ha no maximo de 10km de distancia e que possuem um novo dev com a tech filtrada
    
      const sendSocketMessageTo = findConnections(
        {latitude , longitude},
        techsArray,
        )
       
       sendMessage( sendSocketMessageTo , 'new-dev' , dev);
    }

  
      return response.json(dev);
  }
};