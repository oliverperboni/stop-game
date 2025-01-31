<script lang="ts">
    import {page} from "$app/stores";
    import {gameStore} from "$lib/stores/gameStore";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    import socketService from "$lib/services/socketService";

    let data: any;
    let isLoading = $state(false);
    let rows: string[][] = $state([]);
    let cat = $gameStore.categories;
    let headers: string[] = $state(["player", "score"])
    let newHeader = insertArrayBetween(headers, cat, headers);

    headers = newHeader;

    onMount(async () => {
        const response = await fetch(
            "http://localhost:3000/result/" + $page.params.gameId,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        socketService.on("game-finish", ()=>{
            goto("/")
        })

        data = await response.json();
        rows = data.data;
    });

    function insertArrayBetween(
        sourceArray: string[],
        insertArray: string[],
        targetArray: string[]
    ) {
        const midIndex = Math.floor(targetArray.length / 2);
        return [
            ...targetArray.slice(0, midIndex),
            ...insertArray,
            ...targetArray.slice(midIndex),
        ];
    }
    async function endGame() {
        const response = await fetch(
            "http://localhost:3000/room/" + $page.params.gameId,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        socketService.finishGame($page.params.gameId, ()=>{
            goto("/")
        })
        goto("/")
    }

    async function prepareToPlayAgain() {
        isLoading = true;
        try {
            gameStore.update((curr) => ({
                ...curr,
                alreadySubmit: false
            }));
            await goto("/game/lobby");
        } finally {
            isLoading = false;
        }
    }
</script>
<div class="py-48">
    <div class="bg-gray-900 text-gray-100 p-6 rounded-xl shadow-lg max-w-7xl mx-auto">
        <div class="overflow-x-auto">
            <table class="w-full border-collapse bg-gray-800 rounded-lg">
                <!-- Table Header -->
                <thead>
                <tr class="bg-gray-700 sticky top-0">
                    {#each headers as header}
                        <th class="text-left p-3 md:p-4 text-gray-200 font-semibold uppercase text-sm tracking-wide">
                            {header === 'score' ? '🏆 ' + header : header}
                        </th>
                    {/each}
                </tr>
                </thead>

                <!-- Table Body -->
                <tbody>
                {#each rows as row, rowIndex}
                    <tr class={rowIndex % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}>
                        {#each row as cell,cellIndex}
                            <td class={
                                "p-3 md:p-4 text-gray-300 text-sm transition-colors" +
                                (headers[cellIndex] === 'score' ? " font-bold text-purple-400" : "") +
                                (cellIndex === 0 ? " font-medium" : "")
                            }>
                                {cell}
                            </td>
                        {/each}
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>

        <div class="flex flex-col md:flex-row gap-4 mt-6">
            <button
                    onclick={prepareToPlayAgain}
                    class="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none transition-colors"
            >
                Next Round
            </button>

            <button
                    onclick={endGame}
                    class="w-full p-3 bg-purple-900 text-white rounded-md hover:bg-rose-900 focus:outline-none transition-colors"
            >
                End Game
            </button>
        </div>
    </div>
</div>