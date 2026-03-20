import { GRID_COLS, GRID_ROWS, TILE_COLOR, TILE_BORDER_COLOR, state } from "./constantes.js";
import { canvas } from "./ui.js";

export const ctx = canvas.getContext("2d");

//  Dessin des tuiles cachées 
export function drawTiles() {
    const tileW = canvas.width / GRID_COLS;
    const tileH = canvas.height / GRID_ROWS;

    for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
            const idx = row * GRID_COLS + col;
            if (!state.tiles[idx]) continue;

            const x = col * tileW;
            const y = row * tileH;

            // Tuile
            ctx.fillStyle = TILE_COLOR;
            ctx.fillRect(x, y, tileW, tileH);

            // Bordure
            ctx.strokeStyle = TILE_BORDER_COLOR;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 1, y + 1, tileW - 2, tileH - 2);

            // Point d'interrogation
            ctx.fillStyle = "rgba(255,255,255,0.35)";
            ctx.font = "bold 32px 'Segoe UI', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("?", x + tileW / 2, y + tileH / 2);
        }
    }
}

//  Redessiner le canvas complet 
export function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (state.currentImage) {
        ctx.drawImage(state.currentImage, 0, 0, canvas.width, canvas.height);
    }
    drawTiles();
}

//  Révéler des tuiles aléatoirement (Fisher-Yates) 
export function revealRandomTiles(count) {
    const hiddenIndices = state.tiles
        .map((hidden, i) => (hidden ? i : -1))
        .filter(i => i !== -1);

    if (hiddenIndices.length === 0) return 0;

    for (let i = hiddenIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [hiddenIndices[i], hiddenIndices[j]] = [hiddenIndices[j], hiddenIndices[i]];
    }

    const toReveal = hiddenIndices.slice(0, Math.min(count, hiddenIndices.length));

    // Animation séquentielle
    toReveal.forEach((idx, i) => {
        setTimeout(() => {
            state.tiles[idx] = false;
            redrawCanvas();
        }, i * 250);
    });

    return toReveal.length;
}