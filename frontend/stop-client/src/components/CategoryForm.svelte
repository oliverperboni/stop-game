<script lang="ts">
  let categories: string[] = $state([]);
  let catg: string = $state("");

  function handleAddCategory() {
    categories.push(catg);
    catg = ""
  }
</script>

<div class="bg-gray-800 p-4 rounded-xl shadow-lg">
  <input
    type="text"
    bind:value={catg}
    placeholder="Category"
    class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
  />
  <button
    onclick={handleAddCategory}
    class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
  >
    Add Category
  </button>

  {#each categories as item}
    <p class="text-white mt-2">{item}</p>
  {:else}
    <p class="text-gray-400 mt-2">No categories</p>
  {/each}
</div>
