<script lang="ts">
  import socketService from "../service/socketService";
  import type { JoinRoom, SubmitForm } from "../models/models";
  import { gameState } from "./store/gameStore";
  let store = gameState;
  const baseUrl = "http://localhost:3000";
  let inputCategories: string[] = $state([]);
  let inputAnswers = inputCategories.map(() => "");
  const ws = socketService;
  let catg = $state("");
  let roomId = $state("");
  let player = $state("");
  let alredySubmit = false;
  let url = $state("home-page");

  function addCategory() {
    inputCategories.push(catg);
    catg = "";
  }

  async function createRoom() {
    await fetch(baseUrl + "/room", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categories: inputCategories }),
    })
      .then((response) => response.json())
      .then((data) => {
        roomId = data.roomId;
      });

    url = "join-room";
  }
  async function getRoom() {
    await fetch(baseUrl + "/room", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }
  function navigateToCreateGame() {
    url = "create-room";
  }

  function joinGame() {
    const join: JoinRoom = {
      playerName: player,
      roomId: roomId,
    };
    ws.joinRoom(join, (cols) => {
      store.update((current) => ({
        ...current,
        roomId: join.roomId,
        players: [...current.players, { name: join.playerName, score: 0 }],
        categories: cols,
      }));
    });
    url = "start-game";
  }
  ws.on("started", (letter, gameId) => {
    store.update((curr) => ({
      ...curr,
      gameStatus: "in-progress",
    }));
    store.update((current) => ({
      ...current,
      letter: letter,
      currentRound: current.currentRound + 1,
    }));
  });

  ws.on("end-round", (gameId) => {
    if ($store.gameStatus === "in-progress" && !alredySubmit) {
      submitAnswer();
    }
    store.update((current) => ({
      ...current,
      gameStatus: "finished",
    }));
  });

  function startGame() {
    ws.play(roomId);
    url = "play-game";
  }

  function submitAnswer() {
    const formToSubmit: SubmitForm = {
      answers: inputAnswers,
      gameId: roomId,
      player: player,
    };
    alredySubmit = true;

    ws.submitAnswer(formToSubmit);
  }
</script>

<div
  class="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-4"
>
  <!-- FORM CATEGORIA -->
  {#if url === "home-page"}
    <div
      class="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-6"
    >
      <div class="bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-lg">
        <h1 class="text-4xl font-bold text-purple-500 mb-4">
          Welcome to Stop - OTE!
        </h1>
        <p class="text-gray-200 mb-6">
          A fun and fast-paced word game where creativity and quick thinking
          lead you to victory. Gather your friends, create a room, and play!
        </p>
        <p class="text-gray-400">
          In "Stop Game," you'll be given a letter and categories to fill in
          with unique answers before time runs out. Can you beat the competition
          and come up with the most creative answers?
        </p>

        <button
          onclick={navigateToCreateGame}
          class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none mt-2"
        >
          Create a new game
        </button>
      </div>
    </div>
  {/if}

  {#if url === "create-room"}
    <div class="bg-gray-800 p-4 rounded-xl shadow-lg m-1">
      <div class="flex flex-box justify-center m-2">
        {#each inputCategories as item}
          <p class="text-white mt-2">{item}</p>
        {:else}
          <p class="text-gray-400 mt-2">No categories</p>
        {/each}
      </div>

      <input
        type="text"
        bind:value={catg}
        placeholder="Category"
        class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onclick={addCategory}
        class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none mb-2"
      >
        Add Category
      </button>

      <button
        onclick={createRoom}
        class="w-full p-2 mb-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
      >
        Create a Game
      </button>
    </div>
  {/if}

  {#if url === "join-room"}
    <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
      <input
        type="text"
        bind:value={roomId}
        placeholder="Room ID"
        class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <input
        type="text"
        bind:value={player}
        placeholder="Player Name"
        class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      <button
        onclick={joinGame}
        class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
      >
        Join Room
      </button>

      {#if roomId}
        <h4 class="text-white mt-4">{roomId}</h4>
      {/if}
    </div>
  {/if}

  {#if url === "start-game"}
    <button
      onclick={startGame}
      class="mt-6 p-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 focus:outline-none"
    >
      Start Game
    </button>
  {/if}
  {#if url === "play-game"}
    <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
      {#if $store.gameStatus === "in-progress"}
        <h3 class="text-white mb-4">{$store.letter}</h3>
        {#each $store.categories as category, index}
          <div class="mb-4">
            <p class="text-gray-200">{category}</p>
            <input
              type="text"
              bind:value={inputAnswers[index]}
              placeholder={`Input ${category}`}
              class="w-full p-2 mt-2 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        {/each}
        <button
          onclick={submitAnswer}
          class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
        >
          Submit
        </button>
      {/if}
    </div>
  {/if}
</div>

  <!-- <div class="bg-gray-800 p-4 rounded-xl shadow-lg m-1">
    <div class="flex flex-box justify-center m-2">
      {#each inputCategories as item}
        <p class="text-white mt-2">{item}</p>
      {:else}
        <p class="text-gray-400 mt-2">No categories</p>
      {/each}
    </div>

    <input
      type="text"
      bind:value={catg}
      placeholder="Category"
      class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <button
      onclick={addCategory}
      class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none mb-2"
    >
      Add Category
    </button>

    <button
      onclick={createRoom}
      class="w-full p-2 mb-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
    >
      Create a Game
    </button>
  </div> -->

  <!-- CREATE AND JOIN -->
  <!-- <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
    <input
      type="text"
      bind:value={roomId}
      placeholder="Room ID"
      class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <input
      type="text"
      bind:value={player}
      placeholder="Player Name"
      class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <button
      onclick={joinGame}
      class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
    >
      Join Room
    </button>

    {#if roomId}
      <h4 class="text-white mt-4">{roomId}</h4>
    {/if}
  </div> -->

  <!-- PLAY THE GAME -->
  <!-- <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
    {#if $store.gameStatus === "in-progress"}
      <h3 class="text-white mb-4">{$store.letter}</h3>
      {#each $store.categories as category, index}
        <div class="mb-4">
          <p class="text-gray-200">{category}</p>
          <input
            type="text"
            bind:value={inputAnswers[index]}
            placeholder={`Input ${category}`}
            class="w-full p-2 mt-2 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      {/each}
      <button
        onclick={submitAnswer}
        class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
      >
        Submit
      </button>
    {/if}
  </div> -->

<!-- 
{#each inputCategories as item}
  <p>{item}</p>
{:else}
  <p>no categories</p>
{/each}
{#if roomId}
  <h4>{roomId}</h4>
{/if}
<input type="text" bind:value={catg} placeholder="Category" />
<button onclick={addCategory}>Add Category</button>
<button onclick={createRoom}>Create a Game</button>

<input type="text" bind:value={roomId} placeholder="Roomv Id" />
<input type="text" bind:value={player} placeholder="Player name" />
<button onclick={joinGame}>Join room</button>

<button onclick={startGame}>Start Game</button>
{#if $store.gameStatus === "in-progress"}
  {#each $store.categories as category, index}
    <h3>{$store.letter}</h3>
    <p>{category}</p>
    <input
      type="text"
      bind:value={inputAnswers[index]}
      placeholder="input {category}"
    />
  {/each}
  <button onclick={submitAnswer}>Submit</button>
{/if} -->
