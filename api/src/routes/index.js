const { Router } = require('express');
const axios = require('axios');
const URL = "https://api.thedogapi.com/v1/breeds/"
const db = require("../db");
const { Dog, Temperament } = require('../db');



// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();
router.get('/dogs', async (req, res) =>{
        try {
            const response = await axios.get(URL)
            const dogs = response.data;
            res.json(dogs);
        } catch (error){
            console.log(error)
            res.status (500).json({error: 'Error al obtener las razas'});
        }
});
router.get('/dogs/:idRaza', async (req, res) =>{
        const idRaza = req.params.idRaza;
        const { id } = req.params;
        try {
            const response = await axios.get(URL)
            const dogs = response.data;
            const dog = dogs.find(dog => dog.id === parseInt(idRaza));
            
            if(dog){
                res.json(dog);
            } else {
                res.status(404).json({error: 'No se encontro la raza'});
            }
        } catch (error){
            console.log(error)
            res.status (500).json({error: 'Error al obtener las razas'});
        }
        try {
            const dog = await Dog.findByPk(id, { include: Temperament });
            if (dog) {
                res.json(dog);
            } else {
                res.status(404).json({ error: 'No se encontró la raza' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al obtener la raza' });
        }
});

router.get('/dogs/name', async (req, res) => {
    const { name } = req.query.name;
    
    if(!name){
        res.status(400).send(`Debes proporcionar un nombre de raza`);
    }
    try{
        const response = await axios.get(URL)
        const dogs = response.data;
        const dog = dogs.find(dog => dog.name === name);
        if(dog){
            res.json(dog);
        } else {
            res.status(404).json({error: 'No se encontro la raza'});
        }
        }catch(error){
            console.log(error)
            res.status (500).json({error: 'Error al obtener las razas'});
        }
    });


router.post('/dogs', async (req, res) => {
    const { name, height, weight, life_span, image, temperaments } = req.body;

    try {
        const temperamentsDB = await Temperament.findAll();
        const selectedTemperaments = temperamentsDB.filter((temp) =>
            temperaments.includes(temp.name)
        );

        const newDog = await Dog.create({
            name,
            height,
            weight,
            life_span,
            image,
        });

        await newDog.addTemperaments(selectedTemperaments);

        res.status(201).json(newDog);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al crear la raza' });
    }
});

router.get('/temperaments', async (req, res) => {
    try {
        const temperamentsDB = await Temperament.findAll();
        if (temperamentsDB.length > 0) {
            const temperaments = temperamentsDB.map((temp) => temp.name);
            return res.status(200).json(temperaments);
        }

        const response = await axios.get(URL + "?api_key=" + process.env.API_KEY);
        const breeds = response.data;
        const allTemperaments = breeds.reduce((acc, breed) => {
            if (breed.temperament) {
                const breedTemperaments = breed.temperament.split(", ");
                return acc.concat(breedTemperaments);
            }
            return acc;
        }, []);

        const uniqueTemperaments = [...new Set(allTemperaments)];
        const createdTemperaments = await Promise.all(
            uniqueTemperaments.map((name) => Temperament.create({ name }))
        );

        const temperaments = createdTemperaments.map((temp) => temp.name);
        res.status(200).json(temperaments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener los temperamentos" });
    }
});
module.exports = router;


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
