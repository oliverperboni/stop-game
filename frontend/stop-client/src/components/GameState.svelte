<script lang="ts">
    export let gameStatus: string = "";
    export let categories: string[] = [];
    export let letter: string = "";
    export let inputAnswers: string[] = [];
    export let submitAnswer: () => void;
  
    let inputFields = inputAnswers;
  </script>
  
  <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
    {#if gameStatus === "in-progress"}
      <h3 class="text-white mb-4">{letter}</h3>
      {#each categories as category, index}
        <div class="mb-4">
          <p class="text-gray-200">{category}</p>
          <input
            type="text"
            bind:value={inputFields[index]}
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
  