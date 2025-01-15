<script lang="ts">
  const baseUrl = "http://localhost:3000";
  let inputText: string[] = $state([]);
  let catg = "";
  function addCategory() {
    inputText.push(catg);
  }

  async function createRoom() {
    const request = await fetch(baseUrl + "/create-room", {
      method: "Post",
      body: JSON.stringify(catg),
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
