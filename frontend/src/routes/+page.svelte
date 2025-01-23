<script lang="ts">
  import { goto } from "$app/navigation";

  function navigateToCreateGame() {
    goto("/create");
  }
</script>

<div
  class=" bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-6"
>
  <div class="bg-gray-800 p-8 rounded-xl shadow-lg text-center max-w-lg">
    <h1 class="text-4xl font-bold text-purple-500 mb-4">
      Welcome to Stop - OTE!
    </h1>
    <p class="text-gray-200 mb-6">
      A fun and fast-paced word game where creativity and quick thinking lead
      you to victory. Gather your friends, create a room, and play!
    </p>
    <p class="text-gray-400">
      In "Stop Game," you'll be given a letter and categories to fill in with
      unique answers before time runs out. Can you beat the competition and come
      up with the most creative answers?
    </p>

    <button
      onclick={navigateToCreateGame}
      class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none mt-4 mb-2"
    >
      Create a new game
    </button>
    <p class="text-gray-400 m-2">Or</p>
    <button
      onclick={()=> goto('/join')}
      class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none mt-2"
    >
      Join a room
    </button>
  </div>
</div>
