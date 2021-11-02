const router = require("express").Router();
const fs = require("fs");
const path = require("path");
// const usersPath = `C:/dev/cyber4s/pokedex-back2/backend/users`;

router.post("", (req, res) => {
  //sign up
  const userName = req.headers.username;
  const userPath = path.resolve(path.join("./users", userName));

  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath, { recursive: true }); //create new directory by the username
    res.send("you are just signed up");
  } else {
    res.send("This username is already taken try another one....");
  }
});

router.get("/login", (req, res) => {
  //sign in
  const userName = req.headers.username;
  const userPath = path.resolve(path.join("./users", userName));
  if (fs.existsSync(userPath)) res.send(true);
  else res.send(false);
});

module.exports = router;
