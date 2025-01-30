<script lang="ts">
  import { goto } from "$app/navigation";
  import socketService from "$lib/services/socketService";
  import { gameStore } from "$lib/stores/gameStore";
  import { onMount } from "svelte";

  let isLoading = $state(false); // Estado para controlar o carregamento

  onMount(() => {
    socketService.on("started", (letter, gameId) => {
      gameStore.update((curr) => ({
        ...curr,
        gameStatus: "in-progress",
        letter: letter,
        currentRound: curr.currentRound + 1,
        alreadySubmit: false,
      }));
      goto("/game/play");
    });
  });

  function startGame() {
    isLoading = true; // Ativa o estado de carregamento
    setTimeout(() => {
      isLoading = false; // Desativa o estado de carregamento após um tempo (simulação)
      goto("/game/play");
    }, 1000); // Simula um tempo de carregamento de 1 segundo
  }
</script>
<div class="py-48">
<button
        on:click={startGame}
        class="mt-6 p-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
>
  {#if isLoading}
    <!-- Ícone de carregamento (opcional) -->
    <svg
            class="animate-spin h-5 w-5 text-white mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
    >
      <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
      ></circle>
      <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  {:else}
    Start Game
  {/if}
</button>
</div>