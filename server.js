const express = require ('express')
const session = require('express-session');
const app = express()
const product = require('./products.json');
sortJsonArray = require('sort-json-array');
const fs = require("fs");



app.use(express.json())
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));

const users = []

app.get('/users', (req, res) => {
    res.json(users)
})


app.post('/users',  (req, res) => {
    try {
      const password = req.body.password
      const user = { name: req.body.name, password: password }
      users.push(user)
      res.status(201).send()
    } catch {
      res.status(500).send()
    }
  })

app.post('/users/login',  (req, res) => {

    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
      return res.status(400).send('Aucun Utilisateur existe')
    }
    try {
      if(req.body.password == user.password) {
        res.send('Utilisateur Connecté')
        req.session.user=req.body.name;
      } else {
        res.send('Verifier votre email ou mot de passe')
      }
    } catch {
      res.status(500).send()
    }
   
  })

app.get('/users/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err=>{
            if(err){
                res.status(400).send('Erreur de Déconnexion')
            }else{
                res.send('Utilisateur Déconnecté')
            }
            })
    } else {
        res.send('Utilisatuer non connecté pour déconnecter.');
    }
});

app.post('/products', (req,res)=>{
    
    res.send(product);
})
app.post('/Sortedproducts', (req,res)=>{
    
  res.send(sortJsonArray(product, 'type'))
})
app.post('/Achat', (req,res)=>{
  const fileData = fs.readFileSync("./products.json", "utf8")
  const jsonData = JSON.parse(fileData)

jsonData["stock"]=-1; 
  res.send("Achat Effectué")
})


app.listen(3000)