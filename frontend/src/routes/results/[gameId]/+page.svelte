<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  let data : any
  export let headers: string[] = ["player","score"];
  export let rows: string[][] = [];
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
    rows = data
    console.log(data);
  });
</script>



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
</div>
</div>
