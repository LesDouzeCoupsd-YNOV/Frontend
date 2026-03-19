import { fetchQuestion } from "./api.js";

// reset 
document.body.style.margin = '0';

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
    padding: '20px',
    overflow: 'auto'
});
left.textContent = 'Panneau gauche';

// Panneau droit
const right = document.createElement('div');
Object.assign(right.style, {
    flex: '1',
    backgroundColor: '#1A1A2E',
    color: '#fff',
    padding: '40px',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
});

// Block question reponse 
const quizBlock = document.createElement('div');
Object.assign(quizBlock.style, {
    width: '100%',
    maxWidth: '600px'
});

const question = document.createElement('div');
Object.assign(question.style, {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#0f3460',
    border: '2px solid transparent',
    borderColor: '#c7b136ff',
    overflow: 'auto',
    borderRadius: '8px'
});

// Grille de reponses
const answersGrid = document.createElement('div');
Object.assign(answersGrid.style, {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
});

async function loadQuestion() {
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
            if (index === data.correctIndex) {
                btn.style.backgroundColor = '#2ecc71';
                console.log('Bonne réponse !');
            } else {
                btn.style.backgroundColor = '#e74c3c';
                console.log('Mauvaise réponse');
            }
            setTimeout(loadQuestion, 1500);
        });

        answersGrid.appendChild(btn);
    });
};

// Assembler et injecter
quizBlock.appendChild(question);
quizBlock.appendChild(answersGrid);
right.appendChild(quizBlock);
container.appendChild(left);
container.appendChild(right);
document.body.appendChild(container);

loadQuestion()