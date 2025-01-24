<script lang="ts">
  import { onMount } from "svelte";
  import { gameStore } from "$lib/stores/gameStore";
  import socketService from "$lib/services/socketService";
  import type { SubmitForm } from "$lib/types";
  import { goto } from "$app/navigation";

  let inputAnswers: string[] = [];

  onMount(() => {
    inputAnswers = []
    console.log("USUARIO:",$gameStore.currentPlayer,"VAI SUBMETER ? : ",$gameStore.alreadySubmit)
    console.log("ESTADO INICIAL DAS RESPOSTAS QUE ESTAO A SER ENVIADAS",inputAnswers)
    socketService.on("end-round", (gameId) => {
      if ($gameStore.gameStatus === "in-progress" && !$gameStore.alreadySubmit) {
        submitAnswer();
      }
      gameStore.update((curr) => ({ ...curr, gameStatus: "finished" }));
    });
    socketService.play($gameStore.roomId);
  });
  /// adiciona os jogadores com os player with anwsers da store
  function submitAnswer() {
    const formToSubmit: SubmitForm = {
      answers: inputAnswers,
      gameId: $gameStore.roomId,
      player: $gameStore.currentPlayer,
    };
    console.log("RESPOSTAS QUE ESTAO A SER ENVIADAS",inputAnswers)
    gameStore.update((curr) => ({ ...curr, alreadySubmit: true }));
    socketService.submitAnswer(formToSubmit);
    goto("/results/"+$gameStore.roomId) 
  }
</script>

<div class="bg-gray-800 p-6 rounded-xl shadow-lg">
  {#if $gameStore.gameStatus === "in-progress"}
    <h3 class="text-white mb-4">{$gameStore.letter}</h3>
    {#each $gameStore.categories as category, index}
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
  {:else}
    <h4 class="text-white mb-4">Waiting for the host start the game</h4>
  {/if}
</div>
