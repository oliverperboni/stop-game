<script lang="ts">
    import { goto } from '$app/navigation';
  import { gameStore } from '$lib/stores/gameStore';
;
    
    let inputCategories: string[] = $state([]);
    let catg = $state("");
    
    function addCategory() {
      inputCategories = [...inputCategories, catg];
      catg = "";
    }
  
    async function createRoom() {
      const response = await fetch('/api/room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categories: inputCategories }),
      });
      
      const data = await response.json();
      gameStore.update(store=> ({
        ...store,
        roomId: data.roomId
      }));
      
      goto('/join');
    }
  </script>

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