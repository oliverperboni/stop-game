<script lang="ts">
  import CategoryForm from "./CategoryForm.svelte";
  import RoomManager from "./RoomManager.svelte";
  import GameState from "./GameState.svelte";
  import socketService from "../service/socketService";
  import { gameState } from "./store/gameStore";

  let store = gameState;
  const baseUrl = "http://localhost:3000";
  let inputCategories: string[] = [];
  let inputAnswers = inputCategories.map(() => "");
  const ws = socketService;
  let catg = "";
  let roomId = "";
  let player = "";
  let alredySubmit = false;

  function addCategory() {
    inputCategories.push(catg);
    catg = "";
  }

  async function createRoom() {
    const response = await fetch(baseUrl + "/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories: inputCategories }),
    });
    const data = await response.json();
    roomId = data.roomId;
  }

  function joinGame() {
    const join = { playerName: player, roomId };
    ws.joinRoom(join, (cols) => {
      store.update((current) => ({
        ...current,
        roomId,
        players: [...current.players, { name: player, score: 0 }],
        categories: cols,
      }));
    });
  }

  function submitAnswer() {
    const formToSubmit = { answers: inputAnswers, gameId: roomId, player };
    alredySubmit = true;
    ws.submitAnswer(formToSubmit);
  }

  function startGame() {
    ws.play(roomId);
  }

  ws.on("started", (letter) => {
    store.update((curr) => ({
      ...curr,
      gameStatus: "in-progress",
      letter,
      currentRound: curr.currentRound + 1,
    }));
  });

  ws.on("end-round", () => {
    if ($store.gameStatus === "in-progress" && !alredySubmit) submitAnswer();
    store.update((curr) => ({ ...curr, gameStatus: "finished" }));
  });
</script>

<div class="min-h-screen bg-gray-900 text-gray-100 flex flex-col justify-center items-center p-4">
  <CategoryForm categories={inputCategories} catg={catg} addCategory={addCategory} />
  <RoomManager
    roomId={roomId}
    player={player}
    createRoom={createRoom}
    joinGame={joinGame}
  />
  <button
    onclick={startGame}
    class="mt-6 p-4 bg-purple-700 text-white rounded-lg hover:bg-purple-800 focus:outline-none"
  >
    Start Game
  </button>
  <GameState
    gameStatus={$store.gameStatus}
    categories={$store.categories}
    letter={$store.letter}
    inputAnswers={inputAnswers}
    submitAnswer={submitAnswer}
  />
</div>
