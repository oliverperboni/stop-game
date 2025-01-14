<script lang="ts">
  let inputText = "";
  function logInput() {
    console.log(inputText);
  }
</script>

<input type="text" value={inputText} />
<button on:click={() => logInput()}>Create game</button>
