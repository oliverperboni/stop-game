<script lang="ts">
    import {onMount} from "svelte";
    import {gameStore} from "$lib/stores/gameStore";
    import socketService from "$lib/services/socketService";
    import type {SubmitForm} from "$lib/types";
    import {goto} from "$app/navigation";

    let isLoading = $state(false);
    let inputAnswers: string[] = [];
    let alreadySubmit = $state(false)
    $effect(() => {

        alreadySubmit = false
        inputAnswers = []
    })
    onMount(() => {
        console.log("USUARIO:", $gameStore.currentPlayer, "VAI SUBMETER ? : ", alreadySubmit)
        console.log("ESTADO INICIAL DAS RESPOSTAS QUE ESTAO A SER ENVIADAS", inputAnswers)
        socketService.on("end-round", (gameId) => {
            console.log("WEB SOCKET --- ALTEREI O ALREADY SUBMIT DO USER", $gameStore.currentPlayer, "PARA", alreadySubmit);
            console.log("RECEBI E VOU ENVIAR ESSA RESPOSTAS", inputAnswers);
            if (!alreadySubmit) {
                submitAnswer();
            }
            gameStore.update((curr) => ({...curr, gameStatus: "finished"}));
        });

        socketService.play($gameStore.roomId);


    });

    function submitAnswer() {
        const formToSubmit: SubmitForm = {
            answers: inputAnswers,
            gameId: $gameStore.roomId,
            player: $gameStore.currentPlayer,
        };
        console.log("RESPOSTAS QUE ESTAO A SER ENVIADAS", inputAnswers)
        // gameStore.update((curr) => ({ ...curr, alreadySubmit: true }));
        alreadySubmit = true;
        console.log("SUBMIT --- ALTEREI O ALREADY SUBMIT DO USER", $gameStore.currentPlayer, "PARA", alreadySubmit);
        socketService.submitAnswer(formToSubmit);
        goto("/results/" + $gameStore.roomId)
    }
</script>
<div class="py-48">
    <div class="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg max-w-2xl mx-2 md:mx-auto">
        {#if $gameStore.gameStatus === "in-progress"}
            <div class="space-y-6">
                <h3 class="text-3xl font-bold text-purple-500 text-center mb-6">
                    {$gameStore.letter}
                </h3>

                <div class="space-y-4">
                    {#each $gameStore.categories as category, index}
                        <div class="space-y-2">
                            <label class="text-gray-200 font-medium text-lg">
                                {category}
                            </label>
                            <input
                                    type="text"
                                    bind:value={inputAnswers[index]}
                                    placeholder={`Enter ${category.toLowerCase()}`}
                                    class="w-full p-3 bg-gray-700 text-white rounded-lg
                     border-2 border-gray-600 focus:border-purple-500
                     focus:ring-2 focus:ring-purple-500 placeholder-gray-400
                     transition duration-200"
                                    disabled={isLoading}
                            />
                        </div>
                    {/each}
                </div>

                <button
                        on:click={submitAnswer}
                        class="w-full p-3 bg-purple-600 text-white rounded-lg
             hover:bg-purple-700 focus:outline-none focus:ring-2
             focus:ring-purple-500 focus:ring-offset-2 transition-all
             duration-200 flex items-center justify-center gap-2"
                        disabled={isLoading}
                >
                    {#if isLoading}
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                    {:else}
                        Submit Answers
                    {/if}
                </button>
            </div>
        {:else}
            <div class="text-center space-y-4 py-8">
                <div class="animate-pulse text-purple-500">
                    <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                <h4 class="text-xl text-gray-200 font-semibold">
                    Waiting for host to start the game
                </h4>
                <p class="text-gray-400">
                    Get ready! The game will start soon...
                </p>
            </div>
        {/if}
    </div>
</div>