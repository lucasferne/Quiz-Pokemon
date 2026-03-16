const pokemonName = document.querySelector('.pokemon__name');
const pokemonButton = document.querySelectorAll('.pokemon__button');
const pokemonNameBotao = document.querySelector('.pokemon__name__botao');
const pokemonNameBotao2 = document.querySelector('.pokemon__name__botao2');
const pokemonNameBotao3 = document.querySelector('.pokemon__name__botao3');
const pokemonNameBotao4 = document.querySelector('.pokemon__name__botao4');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonCrie = new Audio();
const streakValue = document.querySelector("#streak");
const loader = document.querySelector("#loader");

const randomNumber = generatePokemon();
const randomChoices = generateChoices();

let searchPokemon = randomNumber;
let searchChoices = randomChoices;
let streak = 0;

var correctPokemonId;
let nextPokemonId;

const fetchPokemon = async (number) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}


function generatePokemon() {
  return Math.floor(Math.random() * 649) + 1;
}

function generateChoices() {
  let array = [];
  while (array.length < 4) {
    let randomNumber = generatePokemon();
    if (!array.includes(randomNumber)) {
      array.push(randomNumber);
    }
  }
  return array;
}

const renderInterface = async (generateChoices) => {

  let cont = 0;
  let data;
  let choices = [];

  while (choices.length < 4) {
    data = await fetchPokemon(generateChoices[cont]);
    choices.push(data);
    cont++;
  }

  chooseRight(choices);

  loader.style.display = "block";
  pokemonImage.style.display = "none";
  renderRightPokemon(correctPokemonId);

  pokemonNameBotao.innerHTML = (choices[0].name.length > 10) ? choices[0].name.substring(0, 10) + '...' : choices[0].name;
  pokemonNameBotao.id = choices[0].id;
  pokemonNameBotao2.innerHTML = (choices[1].name.length > 10) ? choices[1].name.substring(0, 10) + '...' : choices[1].name;
  pokemonNameBotao2.id = choices[1].id;
  pokemonNameBotao3.innerHTML = (choices[2].name.length > 10) ? choices[2].name.substring(0, 10) + '...' : choices[2].name;
  pokemonNameBotao3.id = choices[2].id;
  pokemonNameBotao4.innerHTML = (choices[3].name.length > 10) ? choices[3].name.substring(0, 10) + '...' : choices[3].name;
  pokemonNameBotao4.id = choices[3].id;

  loader.style.display = "none";
  pokemonImage.style.display = "block";
}

function chooseRight(choices) {

  let rightPokemon = Math.floor(Math.random() * 4);
  correctPokemonId = choices[rightPokemon].id;

}

const renderRightPokemon = async (pokemonId) => {

  pokemonName.innerHTML = '??????';
  pokemonNumber.innerHTML = '???';

  pokemonImage.classList.add("brightless");
  pokemonImage.style.opacity = "0";

  const data = await fetchPokemon(pokemonId);

  if (data) {

    const sprite =
      data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];

    const img = new Image();
    img.src = sprite;

    img.onload = () => {

      pokemonImage.src = sprite;

      requestAnimationFrame(() => {
        pokemonImage.style.opacity = "1";
      });

    };

    searchPokemon = data.id;

  }
}

const inputData = async (pokemonId) => {

  let data = await fetchPokemon(pokemonId);

  if (data) {
    pokemonName.innerHTML = (data.name.length > 10) ? data.name.substring(0, 10) + '...' : data.name;
    pokemonNumber.innerHTML = data.id;

    pokemonCrie.src = data['cries']['latest'];
  }
}

function resetGame() {

  setTimeout(() => {
    pokemonImage.classList.add("brightless");
    renderInterface(generateChoices());
  }, 300);


}

renderInterface(searchChoices);

pokemonButton.forEach((button) => {
  let buttonId;
  button.addEventListener('click', async () => {
    buttonId = button.id;

    if (parseInt(buttonId) === correctPokemonId) {

      const pokemonImage = document.getElementById("pokemon_image");

      pokemonImage.classList.remove("brightless");
      pokemonImage.classList.add("temp-fade");

      await inputData(correctPokemonId);

      pokemonCrie.currentTime = 0;
      pokemonCrie.play();
      setTimeout(() => {
        if (!pokemonCrie.paused) return;
        finishRound();
      }, 4000);
      
      pokemonCrie.onended = () => {

        pokemonImage.classList.add("brightless");
        pokemonImage.classList.add("temp-fade");

        setTimeout(() => {
          pokemonImage.classList.remove("temp-fade");

          streak++;
          streakValue.innerHTML = streak;

          resetGame();
        }, 300);


      };


    } else {
      button.classList.add("button-wrong");

      streak = 0;
      streakValue.textContent = streak;

      setTimeout(() => {
        button.classList.remove("button-wrong");
      }, 400);
    }
  });
});

