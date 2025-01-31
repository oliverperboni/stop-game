<script lang="ts">
  import { goto } from "$app/navigation";
  import { gameStore } from "$lib/stores/gameStore";
  import {URL_BACKEND} from "$lib/env";
  let inputCategories: string[] = $state([]);
  let catg = $state("");

  function addCategory() {
    if (catg.trim() === "") return; // Evita adicionar categorias vazias
    inputCategories = [...inputCategories, catg.trim()];
    catg = "";
  }

  async function createRoom() {
    if (inputCategories.length === 0) {
      alert("Please add at least one category before creating a game.");
      return;
    }

    const response = await fetch(URL_BACKEND+"/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categories: inputCategories }),
    });

    const data = await response.json();
    gameStore.update((store) => ({
      ...store,
      roomId: data.roomId,
    }));

    goto("/join");
  }
</script>
<div class="py-48">
<div class="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md mx-auto ">
  <!-- Display Categories -->
  <div class="flex flex-wrap gap-2 mb-4 justify-center space-x-2 m-2">
    {#each inputCategories as item}
      <div class="bg-purple-600 text-white px-3 py-1 rounded-md hover:bg-purple-700 transition duration-300">
        {item}
      </div>
    {:else}
      <p class="text-gray-400 text-sm">No categories added yet.</p>
    {/each}
  </div>

  <!-- Input for New Category -->
  <input
          bind:value={catg}
          class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition duration-300"
          onkeydown={(e) => e.key === "Enter" && addCategory()}
          placeholder="Enter a category"
          type="text"
  />

  <!-- Buttons -->
  <div class="space-y-2">
    <button
            onclick={addCategory}
            class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
    >
      Add Category
    </button>

    <button
            onclick={createRoom}
            class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            disabled={inputCategories.length === 0}
    class:opacity-50={inputCategories.length === 0}
    class:cursor-not-allowed={inputCategories.length === 0}
    >
    Create a Game
    </button>
  </div>
</div>
</div>