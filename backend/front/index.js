// const url = "https://pokeapi.co/api/v2";
const url = "https://shacharmalka24.herokuapp.com";
const userText = document.getElementById("search");
document.getElementById("button").addEventListener("click", () => {
  getData(userText.value.toLowerCase());
});
userText.addEventListener("keydown", (e) => {
  //When the user press enter in the input box the wanted pokemon shows up
  if (e.key === "Enter") getData(userText.value.toLowerCase());
});

const getData = async (nameOrId) => {
  if (!nameOrId) {
    alert("error");
    return;
  }
  try {
    removePreviousTypesFromDom(".newType");
    removePreviousTypesFromDom(".new-poke-by-type");

    let resPokemon;
    if (!isNaN(nameOrId))
      resPokemon = await axios.get(`${url}/pokemon/get/${nameOrId}`);
    else resPokemon = await axios.get(`${url}/pokemon/query?name=${nameOrId}`);
    pokeId.textContent = resPokemon.data.id;
    document.getElementById("img").src = resPokemon.data.front_pic;
    document.getElementById("name-value").textContent = resPokemon.data.name;
    document.getElementById("height-value").textContent =
      resPokemon.data.height;
    document.getElementById("weight-value").textContent =
      resPokemon.data.weight;
    for (let i = 0; i < resPokemon.data.types.length; i++) {
      const newSpan = document.createElement("span");
      newSpan.classList.add("newType");
      newSpan.textContent = `| ${resPokemon.data.types[i].type.name} | `;
      document.getElementById("types-value").append(newSpan);
    }
    img.src = resPokemon.data.front_pic;
    img.onmouseenter = function () {
      img.src = resPokemon.data.back_pic;
    };
    img.onmouseout = function () {
      img.src = resPokemon.data.front_pic;
    };

    getType();
  } catch (error) {
    alert("error");
    console.error(error);
  }
};
//get the type from api
function getType() {
  document
    .getElementById("types-value")
    .addEventListener("click", async (e) => {
      const typeText = e.target.textContent
        .replaceAll("|", "")
        .replaceAll(" ", "");
      const resType = await axios.get(`${url}/type/${typeText}`);
      showAllRelatedPokemonsOnDom(resType.data.pokemon);
      document
        .getElementById("related-pokemons")
        .addEventListener("click", (e) => {
          e.stopImmediatePropagation();
          getData(e.target.textContent);
          userText.value = e.target.textContent;
        });
    });
}

function showAllRelatedPokemonsOnDom(pokemons) {
  removePreviousTypesFromDom(".new-poke-by-type");
  pokemons.forEach((pokemon) => {
    const newList = document.createElement("li");
    newList.className =
      "new-poke-by-type list-group-item list-group-item-action list-group-item-secondary";
    newList.textContent = pokemon.pokemon.name;
    document.getElementById("related-pokemons").append(newList);
  });
}

function removePreviousTypesFromDom(cls) {
  for (const newType of document.querySelectorAll(cls)) {
    newType.remove();
  }
}

signInButton.onclick = async () => {
  //for sign up to web
  const userNameVal = userNameSignIn.value;
  if (!userNameVal) {
    alert("type something...");
    return;
  }
  const response = await axiosRequest("get", "info/login", userNameVal); // users/
  // console.log(response);
  if (response) {
    //if there is such username
    alert("you just logged in try to catch some pokemons!");
    connected(userNameVal); //show the connected sign
  } else {
    alert("your username doesn't exsist, click the link below to sign up!");
    document.getElementById("connect").textContent = "";
  }
};

function connected(userName) {
  const connectNofiaction = document.getElementById("connect");
  connectNofiaction.className = "connected";
  connectNofiaction.textContent = `connected as: ${userName}`;
}

async function axiosRequest(methodPath, partialPath, userName) {
  try {
    const response = await axios({
      method: methodPath,
      url: `${url}/${partialPath}`,
      body: {},
      headers: {
        username: userName,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

// signUpButton.onclick = async () => {
document.getElementById("signUpButton").addEventListener("click", async (e) => {
  e.preventDefault();
  //for sign up to web
  const userNameVal = userNameSignUp.value;
  if (!userNameVal) {
    alert("type something...");
    return;
  }
  const response = await axiosRequest("post", "info", userNameVal); // users/
  alert(response);
});

// catchButton.onclick = async (e) => {
catchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  if (document.getElementById("connect").textContent === "") {
    //then you cant catch
    alert("you can't catch pokemons if you aren't logged in");
    return;
  }
  if (document.getElementById("name-value").textContent === "") {
    alert("you must search some pokemon to catch one");
    return;
  }
  const pokemonId = pokeId.textContent;
  const userName = document
    .getElementById("connect")
    .textContent.split("")
    .splice(14)
    .join("");
  const response = await axiosRequest(
    "put",
    `pokemon/catch/${pokemonId}`,
    userName
  );
  if (!response) alert("Pokemon already caught");
  else alert(response);
});

// releaseButton.onclick = async () => {
releaseButton.onclick = async () => {
  //handle catch button
  if (document.getElementById("connect").textContent === "") {
    alert("you can't catch pokemons if you aren't logged in");
    return;
  }
  const pokemonId = pokeId.textContent;
  const userName = document
    .getElementById("connect")
    .textContent.split("")
    .splice(14)
    .join("");
  const response = await axiosRequest(
    "delete",
    `pokemon/release/${pokemonId}`,
    userName
  );
  if (!response) alert("you can't release pokemon you didn't caught");
  else alert(response);
};
