<script lang="ts">
    export let roomId: string = "";
    export let player: string = "";
    export let createRoom: () => void;
    export let joinGame: () => void;
  
    let roomInput = roomId;
    let playerInput = player;
  </script>
  
  <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
    <button
      onclick={createRoom}
      class="w-full p-2 mb-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
    >
      Create a Game
    </button>
  
    <input
      type="text"
      bind:value={roomInput}
      placeholder="Room ID"
      class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <input
      type="text"
      bind:value={playerInput}
      placeholder="Player Name"
      class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <button
      onclick={joinGame}
      class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none"
    >
      Join Room
    </button>
  
    {#if roomId}
      <h4 class="text-white mt-4">{roomId}</h4>
    {/if}
  </div>
  