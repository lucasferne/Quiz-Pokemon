/* ===============================
   Seleção de elementos do DOM
   =============================== */

const pokemonName = document.querySelector('.pokemon__name'); // Nome do Pokémon exibido
const pokemonButton = document.querySelectorAll('.pokemon__button'); // Botões de escolha
const pokemonNameBotao = document.querySelector('.pokemon__name__botao'); // Botão opção 1
const pokemonNameBotao2 = document.querySelector('.pokemon__name__botao2'); // Botão opção 2
const pokemonNameBotao3 = document.querySelector('.pokemon__name__botao3'); // Botão opção 3
const pokemonNameBotao4 = document.querySelector('.pokemon__name__botao4'); // Botão opção 4
const pokemonNumber = document.querySelector('.pokemon__number'); // Número do Pokémon
const pokemonImage = document.querySelector('.pokemon__image'); // Sprite exibido
const pokemonCrie = new Audio(); // Objeto responsável por tocar o cry do Pokémon
const streakValue = document.querySelector("#streak"); // Elemento que exibe o streak
const loader = document.querySelector("#loader"); // Indicador visual de carregamento

/* ===============================
   Variáveis iniciais do jogo
   =============================== */

const randomNumber = generatePokemon(); // Número aleatório inicial
const randomChoices = generateChoices(); // Lista inicial de escolhas

let searchPokemon = randomNumber; // Pokémon atualmente buscado
let searchChoices = randomChoices; // Lista atual de escolhas
let streak = 0; // Contador de acertos consecutivos

var correctPokemonId; // ID do Pokémon correto da rodada
let nextPokemonId; // (reservado para uso futuro)

/* ===============================
   Função responsável por buscar
   dados da API da PokéAPI
   =============================== */

const fetchPokemon = async (number) => {

  // Requisição HTTP para obter dados do Pokémon
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${number}`);

  // Se a resposta for válida, converte para JSON
  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

/* ===============================
   Gera um número aleatório
   correspondente a um Pokémon
   =============================== */

function generatePokemon() {
  return Math.floor(Math.random() * 649) + 1; // Pokémons da Gen 1 até Gen 5
}

/* ===============================
   Gera 4 escolhas aleatórias
   para os botões do quiz
   =============================== */

function generateChoices() {

  let array = [];

  // Continua gerando até ter 4 Pokémons únicos
  while (array.length < 4) {

    let randomNumber = generatePokemon();

    // Evita duplicatas
    if (!array.includes(randomNumber)) {
      array.push(randomNumber);
    }

  }

  return array;
}

/* ===============================
   Renderiza interface da rodada
   =============================== */

const renderInterface = async (generateChoices) => {

  let cont = 0;
  let data;
  let choices = [];

  // Busca os dados dos 4 Pokémons escolhidos
  while (choices.length < 4) {

    data = await fetchPokemon(generateChoices[cont]);
    choices.push(data);
    cont++;

  }

  // Define qual será o Pokémon correto
  chooseRight(choices);

  // Mostra loader durante carregamento
  loader.style.display = "block";
  pokemonImage.style.display = "none";

  // Renderiza o Pokémon correto (ainda escondido)
  renderRightPokemon(correctPokemonId);

  // Preenche os botões com nomes dos Pokémons

  pokemonNameBotao.innerHTML =
    (choices[0].name.length > 10)
      ? choices[0].name.substring(0, 10) + '...'
      : choices[0].name;

  pokemonNameBotao.id = choices[0].id;

  pokemonNameBotao2.innerHTML =
    (choices[1].name.length > 10)
      ? choices[1].name.substring(0, 10) + '...'
      : choices[1].name;

  pokemonNameBotao2.id = choices[1].id;

  pokemonNameBotao3.innerHTML =
    (choices[2].name.length > 10)
      ? choices[2].name.substring(0, 10) + '...'
      : choices[2].name;

  pokemonNameBotao3.id = choices[2].id;

  pokemonNameBotao4.innerHTML =
    (choices[3].name.length > 10)
      ? choices[3].name.substring(0, 10) + '...'
      : choices[3].name;

  pokemonNameBotao4.id = choices[3].id;

  // Esconde loader e mostra sprite
  loader.style.display = "none";
  pokemonImage.style.display = "block";
}

/* ===============================
   Escolhe aleatoriamente
   qual Pokémon é o correto
   =============================== */

function chooseRight(choices) {

  let rightPokemon = Math.floor(Math.random() * 4);

  correctPokemonId = choices[rightPokemon].id;

}

/* ===============================
   Renderiza o Pokémon correto
   inicialmente escondido
   =============================== */

const renderRightPokemon = async (pokemonId) => {

  // Esconde nome e número
  pokemonName.innerHTML = '??????';
  pokemonNumber.innerHTML = '???';

  // Aplica efeito de silhueta
  pokemonImage.classList.add("brightless");
  pokemonImage.style.opacity = "0";

  // Busca dados do Pokémon correto
  const data = await fetchPokemon(pokemonId);

  if (data) {

    // Sprite animado da geração Black/White
    const sprite =
      data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];

    // Pré-carregamento da imagem
    const img = new Image();
    img.src = sprite;

    img.onload = () => {

      pokemonImage.src = sprite;

      // Aplica fade suave na imagem
      requestAnimationFrame(() => {
        pokemonImage.style.opacity = "1";
      });

    };

    searchPokemon = data.id;

  }
}

/* ===============================
   Carrega dados do Pokémon
   após o jogador acertar
   =============================== */

const inputData = async (pokemonId) => {

  let data = await fetchPokemon(pokemonId);

  if (data) {

    // Mostra nome do Pokémon
    pokemonName.innerHTML =
      (data.name.length > 10)
        ? data.name.substring(0, 10) + '...'
        : data.name;

    // Mostra número
    pokemonNumber.innerHTML = data.id;

    // Define cry do Pokémon
    pokemonCrie.src = data['cries']['latest'];

  }
}

/* ===============================
   Reinicia o jogo para próxima rodada
   =============================== */

function resetGame() {

  setTimeout(() => {

    // Esconde novamente o Pokémon
    pokemonImage.classList.add("brightless");

    // Gera nova rodada
    renderInterface(generateChoices());

  }, 300);

}

/* ===============================
   Inicialização do jogo
   =============================== */

renderInterface(searchChoices);

/* ===============================
   Eventos de clique nos botões
   =============================== */

pokemonButton.forEach((button) => {

  let buttonId;

  button.addEventListener('click', async () => {

    buttonId = button.id;

    // Se o jogador acertar
    if (parseInt(buttonId) === correctPokemonId) {

      const pokemonImage = document.getElementById("pokemon_image");

      // Revela o Pokémon
      pokemonImage.classList.remove("brightless");
      pokemonImage.classList.add("temp-fade");

      // Carrega dados e cry
      await inputData(correctPokemonId);

      // Reinicia áudio
      pokemonCrie.currentTime = 0;
      pokemonCrie.play();

      // Fail-safe caso o evento de áudio falhe
      setTimeout(() => {

        if (!pokemonCrie.paused) return;

        finishRound();

      }, 4000);

      // Evento disparado quando o cry termina
      pokemonCrie.onended = () => {

        pokemonImage.classList.add("brightless");
        pokemonImage.classList.add("temp-fade");

        setTimeout(() => {

          pokemonImage.classList.remove("temp-fade");

          // Incrementa streak
          streak++;
          streakValue.innerHTML = streak;

          // Reinicia rodada
          resetGame();

        }, 300);

      };

    }

    // Caso o jogador erre
    else {

      // Aplica efeito visual no botão
      button.classList.add("button-wrong");

      // Reseta streak
      streak = 0;
      streakValue.textContent = streak;

      setTimeout(() => {
        button.classList.remove("button-wrong");
      }, 400);

    }

  });

});