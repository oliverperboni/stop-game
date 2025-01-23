<script lang="ts">
    import { goto } from '$app/navigation';
    import { gameStore } from '$lib/stores/gameStore';
    import  socketService  from '$lib/services/socketService';
    import type { JoinRoom } from '$lib/types';
  
    let player = $state("");
    let roomId = $state($gameStore.roomId);
  
    function joinGame() {
      const join: JoinRoom = {
        playerName: player,
        roomId: roomId,
      };
      
      socketService.joinRoom(join, (categories) => {
        gameStore.update(current => ({
          ...current,
          roomId: roomId,
          players: [...current.players, { name: join.playerName, score: 0 }],
          categories,
          currentPlayer:player,
        }));
      });
      
      goto('/game/lobby');
    }
  </script>
  
  <div class="bg-gray-800 p-6 rounded-xl shadow-lg">
    <input
      type="text"
      bind:value={roomId}
      placeholder="Room ID"
      class="w-full p-2 mb-4 bg-gray-700 text-white border-2 border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    <input
      type="text"
      bind:value={player}
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