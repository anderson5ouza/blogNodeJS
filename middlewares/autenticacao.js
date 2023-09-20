function autenticar(req, res, next){

    //existe a session de logado
    if(req.session.usuario != undefined){
        next();
    }else{
        res.redirect('/login');
    }
        
}

module.exports = autenticar;