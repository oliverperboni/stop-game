<script lang="ts">
  import { goto } from "$app/navigation";
  import socketService from "$lib/services/socketService";
  import { gameStore } from "$lib/stores/gameStore";
  import { onMount } from "svelte";

  onMount( ()=>{
    socketService.on("started", (letter, gameId) => {
      gameStore.update((curr) => ({
        ...curr,
        gameStatus: "in-progress",
        letter: letter,
        currentRound: curr.currentRound + 1,
        alreadySubmit: false
      }));
      goto("/game/play");
    });
    
  })

  function startGame() {
    goto("/game/play");
  }
</script>

<button
  on:click={startGame}
  class="mt-6 p-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 focus:outline-none"
>
  Start Game
</button>
