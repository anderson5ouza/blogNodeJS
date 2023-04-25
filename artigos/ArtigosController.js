const express = require('express');
const router = express.Router();

router.get('/artigos', (req, res) => {
    res.send('ROTA DE ARTIGOS');
});

router.get('/admin/artigos/criar', (req, res) => {
    res.send('ROTA PARA CRIAR ARTIGO');
});

module.exports = router;