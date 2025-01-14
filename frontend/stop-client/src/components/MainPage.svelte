<script lang="ts">
  let inputText = "Oliver";
  function logInput() {
    console.log(inputText);
  }
</script>

<input type="text" bind:value={inputText} />
<button on:click={logInput}>Create game</button>

