<script lang="ts">
  import socketService from "../service/socketService";
  import type { JoinRoom, SubmitForm } from "../models/models";
  import { gameState } from "./store/gameStore";
  let store = gameState
  const baseUrl = "http://localhost:3000";
  let inputText: string[] = $state([]);
  const ws = socketService;
  let catg = $state("");
  let roomId = $state("");
  let player = $state("");
  function addCategory() {
    inputText.push(catg);
    catg = "";
  }

  async function createRoom() {
    await fetch(baseUrl + "/create-room", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categories: inputText }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }

  function joinGame() {
    const join : JoinRoom ={
      playerName: player,
      roomId: roomId
    }
    ws.joinRoom(join, (cols) => {
      store.update(current => ({ ...current,roomId: join.roomId, players: [...current.players, {name: join.playerName, score: 0}]}))
    });

  }
</script>

{#each inputText as item}
  <p>{item}</p>
{:else}
  <p>no categories</p>
{/each}
<input type="text" bind:value={catg} />
<button onclick={addCategory}>Add Category</button>
<button onclick={createRoom}>Create a Game</button>

<input type="text" bind:value={roomId} />
<input type="text" bind:value={player} />
<button onclick={joinGame}>Join room</button>
