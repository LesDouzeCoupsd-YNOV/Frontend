import { fetchQuestion } from "./api.js";
import { revealRandomTiles } from "./canvas.js";
import { TILES_PER_CORRECT } from "./constantes.js";
import { question, answersGrid } from "./ui.js";

//  Chargement et affichage d'une question 
export async function loadQuestion() {
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
}