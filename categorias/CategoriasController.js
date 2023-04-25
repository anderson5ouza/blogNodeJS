const express = require('express');
const router = express.Router();

router.get('/categorias', (req, res) => {
    res.send('ROTA DE CATEGORIAS');
});

router.get('/admin/categorias/criar', (req, res) => {
    res.send('ROTA PARA CADASTRAR CATEGORIA');
});

module.exports = router;

