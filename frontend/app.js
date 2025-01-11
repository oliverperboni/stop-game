const socket = io("http://localhost:3000");

document.getElementById("createRoomBtn").onclick = () => {
    const categories = document.getElementById("categories").value.split(",").map(c => c.trim());
    if (categories.length > 0) {
        fetch("http://localhost:3000/create-room", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ categories }),
        })
        .then(response => response.json())
        .then(data => {
            alert(`Sala criada com ID: ${data.roomId}`);
            document.getElementById("create-room").style.display = "none";
            document.getElementById("join-room").style.display = "block";
        })
        .catch(error => console.error("Erro ao criar sala:", error));
    } else {
        alert("Por favor, insira categorias válidas.");
    }
};

document.getElementById("joinRoomBtn").onclick = () => {
    const roomId = document.getElementById("roomId").value;
    const playerName = document.getElementById("playerName").value;

    if (roomId && playerName) {
        socket.emit("join-room", { roomId, playerName });
        document.getElementById("join-room").style.display = "none";
        document.getElementById("game").style.display = "block";
        document.getElementById("gameInfo").innerText = `Você entrou na sala: ${roomId}`;
    } else {
        alert("Por favor, preencha o ID da sala e seu nome.");
    }
};

document.getElementById("submitAnswerBtn").onclick = () => {
    const answer = document.getElementById("answer").value;
    const gameId = document.getElementById("roomId").value; // Use o ID da sala como gameId
    const playerName = document.getElementById("playerName").value;

    if (answer) {
        socket.emit("submit-awnser", { gameId, player: playerName, awnsers: [answer] });
        document.getElementById("answer").value = ""; // Limpa o campo de resposta
    } else {
        alert("Por favor, insira uma resposta.");
    }
};
