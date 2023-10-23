const { Router } = require('express');

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();
router.get('/dogs', (req, res) =>{
        res.status(200).send("Arreglo de objetos donde cada uno es una raza")
});
router.get('/dogs/:idRaza', (req, res) =>{
        res.status(200).send("Objeto con la raza que coincida con el id")
});
router.get('/dogs/name', (req, res) => {
    const { name } = req.query;
    res.status(200).send(`Razas de perro que coinciden con el nombre ${name}`);
});

module.exports = router;


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
