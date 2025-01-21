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
  let alredySubmit = false

  function addCategory() {
    inputCategories.push(catg);
    catg = "";
  }

  async function createRoom() {
    await fetch(baseUrl + "/create-room", {
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
    console.log(`Round ended for game ${gameId}`);
    if ($store.gameStatus === "in-progress" && !alredySubmit) {
      submitAnswer();
    }

    // Atualiza o estado do jogo
    store.update((current) => ({
      ...current,
      gameStatus: "finished",
    }));
  });

  function startGame() {
    ws.play(roomId);
  }

  function submitAnswer() {
    const formToSubmit: SubmitForm = {
      answers: inputAnswers,
      gameId: roomId,
      player: player,
    };
    alredySubmit = true

    ws.submitAnswer(formToSubmit);
  }
</script>

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
      placeholder={`Input ${category}`}
    />
  {/each}
  <button onclick={submitAnswer}>Submit</button>
{/if}
