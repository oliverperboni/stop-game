<script lang="ts">
    import { page } from "$app/stores";
    import { gameStore } from "$lib/stores/gameStore";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import socketService from "$lib/services/socketService";
    import { URL_BACKEND } from "$lib/env";

    let data: any;
    let isLoading = $state(true);
    let rows: string[][] = $state([]);
    let cat = $gameStore.categories;
    let headers: string[] = $state(["player", "score"]);
    let newHeader = insertArrayBetween(cat, headers);

    headers = newHeader;

    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    onMount(async () => {
        try {
            await delay(2000);
            rows=[]

            // Faz a requisição à API
            const response = await fetch(URL_BACKEND + "/result/" + $page.params.gameId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            data = await response.json();
            rows = data.data;
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            isLoading = false; // Desativa o estado de carregamento após receber os dados
        }

        socketService.on("game-finish", () => {
            goto("/");
        });
    });

    function insertArrayBetween(insertArray: string[], targetArray: string[]) {
        const midIndex = Math.floor(targetArray.length / 2);
        return [
            ...targetArray.slice(0, midIndex),
            ...insertArray,
            ...targetArray.slice(midIndex),
        ];
    }

    async function endGame() {
        const response = await fetch(URL_BACKEND + "/room/" + $page.params.gameId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        socketService.finishGame($page.params.gameId, () => {
            goto("/");
        });
        goto("/");
    }

    async function prepareToPlayAgain() {
        isLoading = true;
        try {
            gameStore.update((curr) => ({
                ...curr,
                alreadySubmit: false,
            }));
            await goto("/game/lobby");
        } finally {
            isLoading = false;
        }
    }
</script>

{#if isLoading}
    <!-- Spinner enquanto carrega -->
    <div class="flex justify-center items-center h-screen">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
    </div>
{:else}
    <!-- Conteúdo da página após o carregamento -->
    <div class="bg-gray-900 text-gray-100 p-6 rounded-xl shadow-lg">
        <div class="overflow-x-auto">
            <table class="min-w-full border-collapse bg-gray-800 rounded-lg overflow-hidden shadow-md">
                <!-- Table Header -->
                <thead>
                <tr class="bg-gray-700">
                    {#each headers as header}
                        <th class="text-left p-4 text-gray-200 font-semibold uppercase text-sm tracking-wide">
                            {header}
                        </th>
                    {/each}
                </tr>
                </thead>
                <!-- Table Body -->
                <tbody>
                {#each rows as row, rowIndex}
                    <tr class={rowIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}>
                        {#each row as cell}
                            <td class="p-4 text-gray-300 text-sm">
                                {cell}
                            </td>
                        {/each}
                    </tr>
                {/each}
                </tbody>
            </table>
            <button onclick={prepareToPlayAgain} class="w-full p-2 mt-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none mt-2">Next Round</button>
            <button onclick={endGame} class="w-full p-3 mt-4 bg-purple-900 text-white rounded-md hover:bg-rose-900 focus:outline-none transition-colors">
                End Game
            </button>
        </div>
    </div>
{/if}