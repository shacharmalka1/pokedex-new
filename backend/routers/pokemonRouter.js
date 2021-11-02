const fs = require("fs");
const path = require("path");
// const usersPath = `C:/dev/cyber4s/Pokedex/backend/users`;
const router = require("express").Router();
const Pokedex = require("pokedex-promise-v2");
const P = new Pokedex();
const { errorfunc } = require("../middlewere/errorHandler");
const { handleUserName } = require("../middlewere/userHandler");

router.get("/", handleUserName, (req, res) => {
  //send in te header the username
  const userName = req.username;
  const userPath = path.resolve(path.join("./users", userName));

  const upokemonsTempArray = fs.readdirSync(userPath); //['3.json','222.json']
  let pokemonsNewArray = [];
  upokemonsTempArray.forEach((file) => {
    pokemonsNewArray.push(openPokemonFile(`${userPath}/${file}`));
  });
  res.send(pokemonsNewArray);
  // return pokemonsNewArray
});

function openPokemonFile(usersPath) {
  //gets file path return the name of the pokemon
  //Open chest
  const pokemonObj = JSON.parse(fs.readFileSync(usersPath));
  return pokemonObj.name;
}

router.get("/get/:id", async (req, res) => {
  res.send(await getPokemon(req.params.id));
});

router.get("/get/:id", async (req, res) => {
  try {
    res.send(await getPokemon(req.params.id));
  } catch {
    errorfunc.forbiddenAction(null, req, res);
  }
});
router.get("/query", async (req, res) => {
  try {
    res.send(await getPokemon(req.query.name));
  } catch {
    errorfunc.forbiddenAction(null, req, res);
  }
});

router.get("/query", async (req, res) => {
  res.send(await getPokemon(req.query.name));
});

router.put("/catch/:id", handleUserName, async (req, res) => {
  //send with username in headers
  try {
    const id = req.params.id;
    const userName = req.username;
    const userPath = path.resolve(path.join("./users", userName));

    const pokemonObj = JSON.stringify(await getPokemon(id));
    if (fs.existsSync(`${userPath}/${id}.json`))
      errorfunc.forbiddenAction(null, req, res);
    else {
      fs.writeFileSync(`${userPath}/${id}.json`, pokemonObj);
      res.send("pokemon caught");
    }
  } catch (error) {
    errorfunc.pokemonNotFound(null, req, res);
  }
});

router.delete("/release/:id", handleUserName, (req, res) => {
  //send with username in headers
  const id = req.params.id;
  const userName = req.username;
  const userPath = path.resolve(path.join("./users", userName));

  const userFilesArray = fs.readdirSync(userPath);
  if (userFilesArray.includes(`${id}.json`)) {
    fs.unlinkSync(`${userPath}/${id}.json`);
    res.send("pokemon deleted");
  } else {
    errorfunc.forbiddenAction(null, req, res);
  }
});

async function getPokemon(id) {
  const pokeObj = await P.getPokemonByName(id);
  return {
    name: pokeObj.name,
    height: pokeObj.height,
    weight: pokeObj.weight,
    types: pokeObj.types,
    front_pic: pokeObj.sprites.front_default,
    back_pic: pokeObj.sprites.back_default,
    id: pokeObj.id,
    abilities: pokeObj.moves,
  };
}

module.exports = router;
