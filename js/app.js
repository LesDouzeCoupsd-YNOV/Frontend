import { fetchQuestion } from "./api.js";

// config
const CELEBRITIES = [
    "Joe Keery",
    "Michael B Jordan",
    "Lewis Hamilton", 
    "Louis de Funès",
    "Margot Robbie",
    "Marion Cotillard",
    "Pedro Pascal",
    "Rafael Nadal",
    "Theodora"
];
const GRID_COLS = 4;
const GRID_ROWS = 4;
const TILES_PER_CORRECT = 1;
const TILE_BORDER_COLOR = "#c7b136ff";
const TILE_COLOR = "#0f3460";

// état du jeu
let currentCelebIndex = -1;
let tiles = [];
let score = 0;
let celebsRemaining = [...CELEBRITIES];
let hasGuessed = false;
let currentImage = null;
let currentCorrectName = "";

// reset 
document.body.style.margin = '0';
document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

// Container principal
const container = document.createElement('div');
Object.assign(container.style, {
    display: 'flex',
    width: '100vw',
    height: '100vh',
});

// Panneau gauche
const left = document.createElement('div');
Object.assign(left.style, {
    flex: '1',
    backgroundColor: '#1A1A2E',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    gap: '18px',
    overflow: 'auto'
});

// Panneau gauche - Titre
const imageTitle = document.createElement('div');
imageTitle.textContent = "Qui se cache derrière ?";
Object.assign(imageTitle.style, {
    fontSize: "1.3rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#c7b136ff"
});

// Panneau gauche - Score
const scoreDisplay = document.createElement('div');
Object.assign(scoreDisplay.style, {
    fontSize: "1.1rem",
    padding: "8px 20px",
    backgroundColor: "#0f3460",
    borderRadius: "20px",
    border: "1px solid #c7b136ff"
});

function updateScore() {
    scoreDisplay.textContent = `Score : ${score}`;
}
updateScore()

// Panneau gauche - Compteur de céleb
const celebCounter = document.createElement('div');
Object.assign(celebCounter.style, {
    fontSize: "0.9rem",
    opacity: "0.7"
});

function updateCounter() {
    const done = CELEBRITIES.length - celebsRemaining.length;
    celebCounter.textContent = `Célébrité ${done} / ${CELEBRITIES.length}`;
}
updateCounter();

// Panneau gauche - Canva
const canvasWrapper = document.createElement('div');
Object.assign(canvasWrapper.style, {
    position: "relative",
    width: "min(380px, 75vw)",
    height: "min(380px, 75vw)",
    borderRadius: "12px",
    overflow: "hidden",
    border: "3px solid #c7b136ff",
    boxShadow: "0 0 30px rgba(199, 177, 54, 0.3)"
});

const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block' });
const ctx = canvas.getContext("2d");
canvasWrapper.appendChild(canvas);

const feedback = document.createElement("div");
Object.assign(feedback.style, {
    fontSize: "1rem",
    textAlign: "center",
    minHeight: "24px",
    fontWeight: "bold",
    transition: "opacity 0.3s"
});

const guessSection = document.createElement("div");
Object.assign(guessSection.style, {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "min(380px, 75vw)"
});

const guessLabel = document.createElement("div");
guessLabel.textContent = "Devinez la célébrité :";
Object.assign(guessLabel.style, {
    fontSize: "0.9rem",
    textAlign: "center",
    opacity: "0.7"
});

const guessGrid = document.createElement("div");
Object.assign(guessGrid.style, {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px"
});

guessSection.appendChild(guessLabel);
guessSection.appendChild(guessGrid);

// Assembler panneau gauche
left.appendChild(imageTitle);
left.appendChild(scoreDisplay);
left.appendChild(celebCounter);
left.appendChild(canvasWrapper);
left.appendChild(feedback);
left.appendChild(guessSection);

// Panneau droit
const right = document.createElement("div");
Object.assign(right.style, {
    flex: "1",
    backgroundColor: "#1A1A2E",
    color: "#fff",
    padding: "40px",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderLeft: "2px solid #0f3460"
});

// Block question reponse 
const quizBlock = document.createElement('div');
Object.assign(quizBlock.style, {
    width: '100%',
    maxWidth: '600px'
});

const quizTitle = document.createElement('div');
quizTitle.textContent = "Répondez pour révéler l'image";
Object.assign(quizTitle.style, {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "15px",
    textAlign: "center",
    color: "#c7b136ff"
});

const question = document.createElement('div');
Object.assign(question.style, {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#0f3460',
    border: "2px solid #c7b136ff",
    overflow: 'auto',
    borderRadius: "8px",
    lineHeight: "1.5"
});

// Grille de reponses
const answersGrid = document.createElement('div');
Object.assign(answersGrid.style, {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
});

quizBlock.appendChild(quizTitle);
quizBlock.appendChild(question);
quizBlock.appendChild(answersGrid);
right.appendChild(quizBlock);

// Fonction canvas

function drawTiles() {
    const tileW = canvas.width / GRID_COLS;
    const tileH = canvas.height / GRID_ROWS;

    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const idx = row * GRID_COLS + col;
            if (!tiles[idx]) continue;

            const x = col * tileW;
            const y = row * tileH;
            
            // Tuile
            ctx.fillStyle = TILE_COLOR;
            ctx.fillRect(x, y, tileW, tileH);
            
            // Bordure
            ctx.strokeStyle = TILE_BORDER_COLOR;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 1, y + 1, tileW -2, tileH - 2);

            // Point d'interrogation
            ctx.fillStyle = "rgba(255,255,255,0.35)";
            ctx.font = "bold 32px 'Segoe UI', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("?", x + tileW / 2, y + tileH / 2);

        }
    }
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentImage) {
        ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    }
    drawTiles();
}

function revealRandomTiles(count) {
    const hiddenIndices = tiles
        .map((hidden, i) => (hidden ? i : -1))
        .filter(i => i !== -1);

    if (hiddenIndices.length === 0) return 0;

    // Fisher-Yates shuffle
    for (let i = hiddenIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [hiddenIndices[i], hiddenIndices[j]] = [hiddenIndices[j], hiddenIndices[i]];
    }

    const toReveal = hiddenIndices.slice(0, Math.min(count, hiddenIndices.length));

    // anim séquentiel
    toReveal.forEach((idx, i) => {
        setTimeout(() => {
            tiles[idx] = false;
            redrawCanvas();
        }, i * 250);
    });

    return toReveal.length;
}

// Gestion des céleb
function loadCelebrity() {
    if (celebsRemaining.length === 0) {
        showEndScreen();
        return;
    }

    hasGuessed = false;
    feedback.textContent = "";

    // Choisir aléatoirement une celeb
    const randIdx = Math.floor(Math.random() * celebsRemaining.length);
    const celebName = celebsRemaining.splice(randIdx, 1)[0];
    updateCounter();
    currentCelebIndex = CELEBRITIES.indexOf(celebName);
    currentCorrectName = celebName;

    // Réinitialiser grille (tout cacher)
    tiles = new Array(GRID_COLS * GRID_ROWS).fill(true);

    // Charger l'image de la celeb
    const img = new Image();
    img.onload = () => {
        currentImage = img;
        redrawCanvas();
    };
    img.src = `images/${encodeURIComponent(celebName)}.png`;

    buildGuessButtons();
}

function buildGuessButtons() {
    guessGrid.innerHTML = "";

    const shuffled = [...CELEBRITIES].sort(() => Math.random() - 0.5);

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
            if (!hasGuessed) {
                btn.style.borderColor = "#c7b136ff";
                btn.style.backgroundColor = "#1a2a50";
            }
        });
        btn.addEventListener("mouseleave", () => {
            if (!hasGuessed) {
                btn.style.borderColor = "transparent";
                btn.style.backgroundColor = "#16213e";
            }
        });

        btn.addEventListener("click", () => {
            if (hasGuessed) return;
            hasGuessed = true;

            const hiddenCount = tiles.filter(t => t).length;
            const totalTiles = GRID_COLS * GRID_ROWS;

            if (name === currentCorrectName) {
                btn.style.backgroundColor = "#2ecc71";
                btn.style.borderColor = "#2ecc71";
                const bonus = Math.round((hiddenCount / totalTiles) * 100);
                score += bonus;
                updateScore();
                feedback.style.color = "#2ecc71";
                feedback.textContent = `Bravo. C'est ${currentCorrectName} ! +${bonus} pts`;
            } else {
                btn.style.backgroundColor = "#e74c3c";
                btn.style.borderColor = "#e74c3c";
                feedback.style.color = "#e74c3c";
                feedback.textContent = `Raté. C'était ${currentCorrectName}`;
            }

            // Révéler tout
            tiles.fill(false);
            redrawCanvas();

            setTimeout(loadCelebrity, 2500);
        });

        guessGrid.appendChild(btn);
    });
}

function showEndScreen() {
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
    endScore.textContent = `Score final : ${score} pts`;
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

// Quizz

async function loadQuestion() {
    let locked = false;
    const data = await fetchQuestion();

    question.textContent = data.q;
    answersGrid.innerHTML = '';

    data.r.forEach((text, index) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            padding: '15px',
            fontSize: '1rem',
            border: '2px solid transparent',
            borderRadius: '8px',
            backgroundColor: '#0f3460',
            color: '#fff',
            cursor: "url('../css/assets/Cursor_pointer.cur'), auto",
            transition: 'border-color 0.2s'
        });

        btn.addEventListener('mouseenter', () => btn.style.borderColor = '#c7b136ff');
        btn.addEventListener('mouseleave', () => btn.style.borderColor = 'transparent');
        btn.addEventListener('click', () => {
            if (locked) return;
            locked = true;

            if (index === data.correctIndex) {
                btn.style.backgroundColor = '#2ecc71';
                revealRandomTiles(TILES_PER_CORRECT);
            } else {
                btn.style.backgroundColor = '#e74c3c';
            }
            setTimeout(loadQuestion, 1500);
        });

        answersGrid.appendChild(btn);
    });
};

// Assembler et injecter
container.appendChild(left);
container.appendChild(right);
document.body.appendChild(container);

loadCelebrity();
loadQuestion();