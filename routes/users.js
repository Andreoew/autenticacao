var express = require('express');
var router = express.Router();



router.get('/signup', function (req, res, next) {
  if (req.query.fail)
    res.render('signup', { title: 'Sign Up', message: 'Falha no cadastro do usuário!' });
  else
    res.render('signup', { title: 'Sign Up', message: null });
});

/* POST users */
router.post('/signup', function (req, res, next) {

  if (!req.body.name | !req.body.username | !req.body.email | !req.body.password | !req.body.profile)
    return res.render('signup', { title: 'Sign up', message: 'Preencha os campos corretamente!', error: true });

  const db = require('../db');
  db.createUser(req.body.name, req.body.username, req.body.email, req.body.password, req.body.profile, (err, result) => {
    if (err) return res.redirect('/users/signup?fail=true');
    else {
      var text = 'Obrigado por se cadastrar {fulano}, sua senha é {senha}';
      text = text.replace('{fulano}', req.body.username).replace('{senha}', req.body.password);

      require('../mail')(req.body.email, 'Cadastro realizado com sucesso!', text);
      res.redirect('/index');
      // return res.render('signup', { title: 'Sign up', message: 'Cadastro realizado com sucesso!', error: false });

    }
  })

})


router.post('/forgot', function (req, res, next) {
  const db = require('../db');
  db.resetPassword(req.body.email, (err, result, newPassword) => {
    if (err) {
      return res.redirect('/login?reset=true');
    }
    else {
      var text = `Olá,sua nova senha é ${newPassword}. Sua senha antiga, não funciona mais!`;
      require('../mail')(req.body.email, 'Sua senha foi alterada!', text);
      res.redirect('/login');
    }
  })
})

router.get('/forgot', function (req, res, next) {
  res.render('forgot', { title: 'Esqueci minha Senha', });
})

router.get('/edit/', (req, res, next) => {  
  res.render("user", { title: 'Edição de Cadastro', user: {} });
});


router.post('/edit/:id',  (req, res, next) => {
  const id = req.params.id;
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const profile = req.body.profile;

  const user = { name, username, email, password, profile }
  
  const db = require('../db');
  db.findUser(id)
    .then(user => res.render("user", { title: 'Edição de Cadastro', user }))
    // .then(db.updateUser(id, user))
    .catch(error => res.render("user", { title: 'Não foi possível encontrar o usuário' }, error)) 
  const promise =  db.updateUser(id, user)
  promise
    .then(result => {
      res.redirect("/")
    })
    .catch(error => {
      return console.error(error);
    })
console.log(user)
})

module.exports = router;