//  Réinitialisation globale 
document.body.style.margin = '0';
document.body.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

//  Container principal 
export const container = document.createElement('div');
Object.assign(container.style, {
    display: 'flex',
    width: '100vw',
    height: '100vh',
});

//  Panneau gauche 
export const left = document.createElement('div');
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

export const imageTitle = document.createElement('div');
imageTitle.textContent = "Qui se cache derrière ?";
Object.assign(imageTitle.style, {
    fontSize: "1.3rem",
    fontWeight: "bold",
    textAlign: "center",
    color: "#c7b136ff"
});

export const scoreDisplay = document.createElement('div');
Object.assign(scoreDisplay.style, {
    fontSize: "1.1rem",
    padding: "8px 20px",
    backgroundColor: "#0f3460",
    borderRadius: "20px",
    border: "1px solid #c7b136ff"
});

export const celebCounter = document.createElement('div');
Object.assign(celebCounter.style, {
    fontSize: "0.9rem",
    opacity: "0.7"
});

// Canvas
export const canvasWrapper = document.createElement('div');
Object.assign(canvasWrapper.style, {
    position: "relative",
    width: "min(380px, 75vw)",
    height: "min(380px, 75vw)",
    borderRadius: "12px",
    overflow: "hidden",
    border: "3px solid #c7b136ff",
    boxShadow: "0 0 30px rgba(199, 177, 54, 0.3)"
});

export const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 600;
Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block' });
canvasWrapper.appendChild(canvas);

export const feedback = document.createElement("div");
Object.assign(feedback.style, {
    fontSize: "1rem",
    textAlign: "center",
    minHeight: "24px",
    fontWeight: "bold",
    transition: "opacity 0.3s"
});

// Section de guess
export const guessSection = document.createElement("div");
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

export const guessGrid = document.createElement("div");
Object.assign(guessGrid.style, {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px"
});

guessSection.appendChild(guessLabel);
guessSection.appendChild(guessGrid);

// Assemblage du panneau gauche
left.appendChild(imageTitle);
left.appendChild(scoreDisplay);
left.appendChild(celebCounter);
left.appendChild(canvasWrapper);
left.appendChild(feedback);
left.appendChild(guessSection);

//  Panneau droit 
export const right = document.createElement("div");
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

export const question = document.createElement('div');
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

export const answersGrid = document.createElement('div');
Object.assign(answersGrid.style, {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
});

quizBlock.appendChild(quizTitle);
quizBlock.appendChild(question);
quizBlock.appendChild(answersGrid);
right.appendChild(quizBlock);