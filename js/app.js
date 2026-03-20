import { startGame } from "./utils/api.js";
import { state } from "./utils/constantes.js";
import { container, left, right } from "./utils/ui.js";
import { showCelebrity, updateCounter, updateScore } from "./utils/celebrity.js";
import { loadQuestion } from "./utils/quiz.js";

//  Assemblage du DOM 
container.appendChild(left);
container.appendChild(right);
document.body.appendChild(container);

//  Initialisation de la partie 
async function initGame() {
    const data = await startGame();

    state.gameId = data.gameId;
    state.celebrities = data.celebrities;
    state.totalCelebs = data.total;
    state.currentNum = data.current;
    state.score = 0;

    updateScore();
    updateCounter();
    showCelebrity(data.celebrity);
    loadQuestion();
}

initGame();