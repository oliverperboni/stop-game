<script lang="ts">
    import {goto} from "$app/navigation";

    function navigateToCreateGame() {
        goto("/create");
    }
</script>
<div>
    <div class="bg-gray-900 text-gray-100 min-h-screen flex flex-col justify-center items-center p-4">
        <div class="bg-gray-800 p-6 rounded-xl shadow-lg text-center w-full max-w-md">
            <h1 class="text-3xl md:text-4xl font-bold text-purple-500 mb-4">
                Welcome to Stop - OTE!
            </h1>
            <p class="text-gray-200 mb-6 text-sm md:text-base">
                A fun and fast-paced word game where creativity and quick thinking lead
                you to victory. Gather your friends, create a room, and play!
            </p>
            <p class="text-gray-400 text-sm md:text-base">
                In "Stop Game," you'll be given a letter and categories to fill in with
                unique answers before time runs out. Can you beat the competition and come
                up with the most creative answers?
            </p>

            <button
                    onclick={navigateToCreateGame}
                    class="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none mt-6 mb-3 text-sm md:text-base"
            >
                Create a new game
            </button>
            <p class="text-gray-400 text-sm md:text-base my-2">Or</p>
            <button
                    onclick={() => goto('/join')}
                    class="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none mt-3 text-sm md:text-base"
            >
                Join a room
            </button>
        </div>
    </div>
</div>