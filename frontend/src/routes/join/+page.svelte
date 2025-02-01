<script lang="ts">
  import { goto } from "$app/navigation";
  import { gameStore } from "$lib/stores/gameStore";
  import socketService from "$lib/services/socketService";
  import type { gameRoom, JoinRoom } from "$lib/types";
  import { onMount } from "svelte";
  import {URL_BACKEND} from "$lib/env";

  let rooms = $state<gameRoom[]>([]);
  let player = $state("");
  let roomId = $state("");
  let isLoading = $state(false);

  async function fetchRooms() {
    try {
      isLoading = true;
      const response = await fetch(URL_BACKEND+"/room", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      rooms = data.rooms;
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    fetchRooms();
  });

  function joinGame() {
    const join: JoinRoom = {
      playerName: player,
      roomId: roomId,
    };

    socketService.joinRoom(join, (categories) => {
      gameStore.update((current) => ({
        ...current,
        roomId: roomId,
        players: [...current.players, { name: join.playerName, score: 0 }],
        categories,
        currentPlayer: player,
      }));
    });

    goto("/game/lobby");
  }
</script>

<div class="py-48">
  <div class="max-w-4xl mx-auto p-4 md:p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Room List -->
      <div class="bg-gray-800 rounded-xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-purple-400">Available Rooms</h2>
          <button
            onclick={fetchRooms}
            class="p-2 text-purple-400 hover:text-purple-300 transition-colors"
            title="Refresh rooms"
            aria-label="Refresh rooms"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        {#if isLoading}
          <div class="text-center py-4">
            <svg
              class="animate-spin h-8 w-8 text-purple-500 mx-auto"
              viewBox="0 0 24 24"
            >
              <!-- Spinner SVG -->
            </svg>
          </div>
        {:else if rooms.length === 0}
          <p class="text-gray-400 text-center py-4">No available rooms</p>
        {:else}
          <div class="space-y-4">
            {#each rooms as room}
              <div
                class="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                onclick={() => (roomId = room.id)}
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="text-purple-400 font-mono font-semibold">
                      #{room.id}
                    </h3>
                    <p class="text-gray-300 text-sm">
                      Current letter: <span class="font-bold"
                        >{room.letter || "-"}</span
                      >
                    </p>
                  </div>
                  <span class="text-xs text-gray-400">Round {room.round}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <div>
                    <p class="text-gray-400">
                      <span class="font-semibold text-purple-300"
                        >{room.columns?.length || 0}</span
                      > categories
                    </p>
                    <p class="text-gray-400">
                      <span class="font-semibold text-purple-300"
                        >{room.playersWithAnswers.size ?? 0}</span
                      > players
                    </p>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Join Form -->
      <div class="bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-bold text-purple-400 mb-6">Join Game</h2>
        <div class="space-y-4">
          <input
            type="text"
            bind:value={roomId}
            placeholder="Room ID"
            class="w-full p-3 bg-gray-700 text-white rounded-lg
                border-2 border-gray-600 focus:border-purple-500
                focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          />
          <input
            type="text"
            bind:value={player}
            placeholder="Player Name"
            class="w-full p-3 bg-gray-700 text-white rounded-lg
                border-2 border-gray-600 focus:border-purple-500
                focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
          />
          <button
            onclick={joinGame}
            class="w-full p-3 bg-purple-600 text-white rounded-lg
              hover:bg-purple-700 focus:outline-none focus:ring-2
              focus:ring-purple-500 focus:ring-offset-2 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!roomId || !player}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
