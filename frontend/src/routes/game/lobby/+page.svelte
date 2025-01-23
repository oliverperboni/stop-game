<script lang="ts">
    import { goto } from '$app/navigation';
  
  
    function startGame() {
      goto('/game/play');
    }
  </script>
  
  <button
    on:click={startGame}
    class="mt-6 p-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 focus:outline-none"
  >
    Start Game
  </button>