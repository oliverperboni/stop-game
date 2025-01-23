<script lang="ts">
    import { onMount } from 'svelte';
    import { gameStore } from '$lib/stores/gameStore';
    import  socketService  from '$lib/services/socketService';
    import type { SubmitForm } from '$lib/types';
  
    let inputAnswers: string[] = [];
    let alreadySubmit = false;
  
    onMount(() => {
      socketService.on("started", (letter, gameId) => {
        gameStore.update(curr => ({
          ...curr,
          gameStatus: "in-progress",
          letter: letter,
          currentRound: curr.currentRound + 1,
        }));
      });
  
      socketService.on("end-round", (gameId) => {
        if ($gameStore.gameStatus === "in-progress" && !alreadySubmit) {
          submitAnswer();
        }
        gameStore.update(curr => ({
          ...curr,
          gameStatus: "finished"
        }));
      });
    });
  
    function submitAnswer() {
      const formToSubmit: SubmitForm = {
        answers: inputAnswers,
        gameId: $gameStore.roomId,
        player: $gameStore.currentPlayer,
      };
      alreadySubmit = true;
      socketService.submitAnswer(formToSubmit);
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
        on:click={submitAnswer}
        class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
      >
        Submit
      </button>
    {/if}
  </div>