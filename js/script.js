  Authorization: Bearer ADLHYNBAZ4EcclcFv6E7W8sk

const pokemonName = document.querySelector('.pokemon__name');
const pokemonButton = document.querySelectorAll('.pokemon__button');
const pokemonNameBotao = document.querySelector('.pokemon__name__botao');
const pokemonNameBotao2 = document.querySelector('.pokemon__name__botao2');
const pokemonNameBotao3 = document.querySelector('.pokemon__name__botao3');
const pokemonNameBotao4 = document.querySelector('.pokemon__name__botao4');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');

const randomNumber = generatePokemon();
const randomChoices = generateChoices();

let searchPokemon = randomNumber;
let searchChoices = randomChoices;

var correctPokemonId;

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
    array.push(generatePokemon());
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

  renderRightPokemon(correctPokemonId);
  pokemonNameBotao.innerHTML = (choices[0].name.length > 10) ? choices[0].name.substring(0, 10) + '...' : choices[0].name;
  pokemonNameBotao.id = choices[0].id;
  pokemonNameBotao2.innerHTML = (choices[1].name.length > 10) ? choices[1].name.substring(0, 10) + '...' : choices[1].name;
  pokemonNameBotao2.id = choices[1].id;
  pokemonNameBotao3.innerHTML = (choices[2].name.length > 10) ? choices[2].name.substring(0, 10) + '...' : choices[2].name;
  pokemonNameBotao3.id = choices[2].id;
  pokemonNameBotao4.innerHTML = (choices[3].name.length > 10) ? choices[3].name.substring(0, 10) + '...' : choices[3].name;
  pokemonNameBotao4.id = choices[3].id;


}

function chooseRight(choices) {

  let rightPokemon = Math.floor(Math.random() * 4);
  correctPokemonId = choices[rightPokemon].id;

}

const renderRightPokemon = async (pokemonId) => {

  pokemonName.innerHTML = '??????';
  pokemonNumber.innerHTML = '???';
  pokemonImage.classList.add("brightless");

  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';

  const data = await fetchPokemon(pokemonId);

  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = '??????';
    pokemonNumber.innerHTML = '???';
    pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    searchPokemon = data.id;
  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
  }
}

const inputData = async (pokemonId) => {

  let data = await fetchPokemon(pokemonId);
  
  if (data) {
  pokemonName.innerHTML = (data.name.length > 10) ? data.name.substring(0, 10) + '...' : data.name;
  pokemonNumber.innerHTML = data.id;
  }
}

function resetGame(){
  
  renderInterface(generateChoices());
}

renderInterface(searchChoices);

pokemonButton.forEach((button) => {
  let buttonId;
  button.addEventListener('click', () => {
    buttonId = button.id;
    
    if (parseInt(buttonId) === correctPokemonId) {

      const pokemonImage = document.getElementById("pokemon_image");
      pokemonImage.classList.remove("brightless");
      pokemonImage.classList.add("temp-fade");
      inputData(correctPokemonId);

      setTimeout(() => {
        pokemonImage.classList.remove("temp-fade");
      }, 3000);

      setTimeout(() => {
        pokemonImage.classList.add("brightless");
      }, 3500);

      setTimeout(() => {
        resetGame();
      }, 4000);

      else {
      alert('Tente novamente')
    }

    }

  });
});

