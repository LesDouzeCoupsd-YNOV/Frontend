import { GRID_COLS, GRID_ROWS, state } from "./constantes.js";
import { redrawCanvas } from "./canvas.js";
import { submitGuess, nextCelebrity } from "./api.js";
import {
    guessGrid, feedback, celebCounter,
    scoreDisplay, left
} from "./ui.js";

//  Mise à jour de l'affichage du score 
export function updateScore() {
    scoreDisplay.textContent = `Score : ${state.score}`;
}

//  Mise à jour du compteur de célébrités 
export function updateCounter() {
    celebCounter.textContent = `Célébrité ${state.currentNum} / ${state.totalCelebs}`;
}

//  Affichage d'une célébrité 
export function showCelebrity(celebName) {
    state.currentCorrectName = celebName;
    state.hasGuessed = false;
    feedback.textContent = "";

    updateCounter();

    // Réinitialiser la grille (tout cacher)
    state.tiles = new Array(GRID_COLS * GRID_ROWS).fill(true);

    // Charger l'image
    const img = new Image();
    img.onload = () => {
        state.currentImage = img;
        redrawCanvas();
    };
    img.src = `images/${encodeURIComponent(celebName)}.png`;

    buildGuessButtons();
}

//  Passer à la célébrité suivante 
export async function handleNextCelebrity() {
    const data = await nextCelebrity(state.gameId);

    if (data.finished) {
        state.score = data.state.score;
        showEndScreen();
    } else {
        state.currentNum = data.current;
        state.totalCelebs = data.total;
        state.score = data.state.score;
        updateScore();
        showCelebrity(data.celebrity);
    }
}

//  Construction des boutons de devinette 
export function buildGuessButtons() {
    guessGrid.innerHTML = "";

    const shuffled = [...state.celebrities].sort(() => Math.random() - 0.5);

    shuffled.forEach(name => {
        const btn = document.createElement("button");
        btn.textContent = name;
        Object.assign(btn.style, {
            padding: "10px 8px",
            fontSize: "0.85rem",
            border: "2px solid transparent",
            borderRadius: "8px",
            backgroundColor: "#16213e",
            color: "#fff",
            cursor: "url('../css/assets/Cursor_pointer.cur'), auto",
            transition: "all 0.2s",
            fontWeight: "bold"
        });

        btn.addEventListener("mouseenter", () => {
            if (!state.hasGuessed) {
                btn.style.borderColor = "#c7b136ff";
                btn.style.backgroundColor = "#1a2a50";
            }
        });
        btn.addEventListener("mouseleave", () => {
            if (!state.hasGuessed) {
                btn.style.borderColor = "transparent";
                btn.style.backgroundColor = "#16213e";
            }
        });

        btn.addEventListener("click", async () => {
            if (state.hasGuessed) return;
            state.hasGuessed = true;

            const hiddenCount = state.tiles.filter(t => t).length;
            const totalTiles = GRID_COLS * GRID_ROWS;

            const result = await submitGuess(state.gameId, name, hiddenCount, totalTiles);

            if (result.correct) {
                btn.style.backgroundColor = "#2ecc71";
                btn.style.borderColor = "#2ecc71";
                state.score = result.state.score;
                updateScore();
                feedback.style.color = "#2ecc71";
                feedback.textContent = `Bravo. C'est ${result.correctName} ! +${result.bonus} pts`;
            } else {
                btn.style.backgroundColor = "#e74c3c";
                btn.style.borderColor = "#e74c3c";
                feedback.style.color = "#e74c3c";
                feedback.textContent = `Raté. C'était ${result.correctName}`;
            }

            // Tout révéler
            state.tiles.fill(false);
            redrawCanvas();

            setTimeout(handleNextCelebrity, 2500);
        });

        guessGrid.appendChild(btn);
    });
}

//  Écran de fin de partie 
export function showEndScreen() {
    left.innerHTML = "";

    const endBlock = document.createElement("div");
    Object.assign(endBlock.style, { textAlign: "center", padding: "40px" });

    const endTitle = document.createElement("div");
    endTitle.textContent = "Partie terminée !";
    Object.assign(endTitle.style, {
        fontSize: "2rem",
        fontWeight: "bold",
        margin: "20px 0",
        color: "#c7b136ff"
    });

    const endScore = document.createElement("div");
    endScore.textContent = `Score final : ${state.score} pts`;
    Object.assign(endScore.style, { fontSize: "1.4rem", marginBottom: "30px" });

    const restartBtn = document.createElement("button");
    restartBtn.textContent = "Rejouer";
    Object.assign(restartBtn.style, {
        padding: "15px 40px",
        fontSize: "1.1rem",
        border: "2px solid #c7b136ff",
        borderRadius: "8px",
        backgroundColor: "#0f3460",
        color: "#fff",
        cursor: "url('../css/assets/Cursor_pointer.cur'), auto",
        fontWeight: "bold",
        transition: "all 0.2s"
    });
    restartBtn.addEventListener("mouseenter", () => restartBtn.style.backgroundColor = "#1a4a80");
    restartBtn.addEventListener("mouseleave", () => restartBtn.style.backgroundColor = "#0f3460");
    restartBtn.addEventListener("click", () => location.reload());

    endBlock.appendChild(endTitle);
    endBlock.appendChild(endScore);
    endBlock.appendChild(restartBtn);
    left.appendChild(endBlock);
}