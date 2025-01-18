<script lang="ts">
  import socketService from "../service/socketService";
  import type { JoinRoom, SubmitForm } from "../models/models";
  import { gameState } from "./store/gameStore";
  let store = gameState;
  const baseUrl = "http://localhost:3000";
  let inputCategories: string[] = $state([]);
  let inputAnswers = inputCategories.map(()=> "")
  const ws = socketService;
  let catg = $state("");
  let roomId = $state("");
  let player = $state("");


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

  function startGame(){
    ws.play(roomId)
    store.update((curr)=> ({
      ...curr,
      gameStatus:'in-progress',
    }))
  }

  function logInputs() {
    const formToSubmit : SubmitForm ={
      answers: inputAnswers,
      gameId:roomId,
      player: player
    }
    console.log(`dei submite das respostars ${formToSubmit.answers} - ${formToSubmit.gameId} - ${formToSubmit.player}`)
    ws.submitAnswer(formToSubmit)
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
<input type="text" bind:value={catg} />
<button onclick={addCategory}>Add Category</button>
<button onclick={createRoom}>Create a Game</button>

<input type="text" bind:value={roomId} />
<input type="text" bind:value={player} />
<button onclick={joinGame}>Join room</button>


<button onclick={startGame}>Start Game</button>
{#if $store.gameStatus === 'in-progress'}

  {#each $store.categories as category, index}
    <p>{category}</p>
    <input type="text" bind:value={inputAnswers[index]} placeholder={`Input ${category}`} />
  {/each}
  <button onclick={logInputs}>Submit</button>
{/if}

