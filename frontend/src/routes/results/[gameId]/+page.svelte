<script lang="ts">
    import {page} from "$app/stores";
    import {gameStore} from "$lib/stores/gameStore";
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";

    let data: any;

    let rows: string[][] = [];
    let cat = $gameStore.categories;
    let headers: string[] = ["player", "score"];
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

    function prepareToPlayAgain() {
        gameStore.update((curr) => ({
            ...curr,
            alreadySubmit: false
        }));
        console.log("NO RESULT --- ALTEREI O ALREADY SUBMIT DO USER",$gameStore.currentPlayer,"PARA",$gameStore.alreadySubmit);
        goto("/game/lobby")
    }
</script>

<div class="bg-gray-900 text-gray-100 p-6 rounded-xl shadow-lg">
    <div class="overflow-x-auto">
        <table
                class="min-w-full border-collapse bg-gray-800 rounded-lg overflow-hidden shadow-md"
        >
            <!-- Table Header -->
            <thead>
            <tr class="bg-gray-700">
                {#each headers as header}
                    <th
                            class="text-left p-4 text-gray-200 font-semibold uppercase text-sm tracking-wide"
                    >
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
        <button onclick={prepareToPlayAgain} class="w-full p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none mt-2">Next Round</button>

  </div>
</div>
