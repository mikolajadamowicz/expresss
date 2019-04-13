const express = require("express");
const bodyParser = require("body-parser");
const hash = require("object-hash");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const generateId = () => hash(Date.now() + Math.random());

let users = [
  {
    id: "1",
    login: "login",
    password: "haslo",
    phoneNumber: "604466337",
    birthDate: new Date("05 October 2011 14:48 UTC").toISOString(),
    updateDate: new Date().toISOString()
  }
];

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.get("/users", (req, res) => {
  res.status(200).json(users);
  
});

app.get("/user", (req, res) => {
  const { id } = req.query;
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.sendStatus(404);
  }
  res.set("ETag", hash(user));
  res.set("Cache-Control", "max-age=50");
  res.status(200).json(user);
});

app.post("/create", (req, res) => {
  const { user } = req.body;
  console.log({ req: req.body });
  if (!user || user.id || user.updateDate) {
    return res.sendStatus(400);
  }
  user.id = generateId();
  user.updateDate = new Date().toISOString();
  user.birthDate = new Date(user.birthDate).toISOString();
  users.push(user);
  res.status(201).json(user);
});

// PUT
app.put('/update/:id', (req, res) => {
  const { user } = req.body;
  const { id } = req.params;
  
  if (!user || !id || user.id || user.updateDate) {
    return res.sendStatus(400);
  }
  const objIndex = users.findIndex((obj => obj.id === id));
  
  user.birthDate = user.birthDate && new Date(user.birthDate).toISOString();
  if (objIndex > -1) {    
    users[objIndex] = {
      ...users[objIndex],
      ...user,
      updateDate: new Date().toISOString()
    };
    res.status(200).json(user);
  } else {
    users.push({id,...user})
    res.status(201).json(user);
  }
});

// DELETE
app.delete('/delete/:id', (req, res) => {
  const {id} = req.params;
  let existingItem = users.filter(r => r.id === id)[0];

  if (!existingItem) {
    return res.sendStatus(404)
  }
  users = users.filter(r => r.id !== id);
  res.sendStatus(204)
});

app.listen(3000);


//get all users
//wyszukiwanie po id uzytkownikow
//tworzenie nowego uzytkownika
//aktualizacja uzytkownika 
//wyszkiwanie uzytkownikow po id ma meic buforowanie cache,Cache-Control i ETag