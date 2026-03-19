const API_BASE = "http://localhost:3000";

export async function fetchQuestion() {
    const res = await fetch(`${API_BASE}/api/question`);
    return await res.json();
}

export async function fetchCelebrities() {
    const res = await fetch(`${API_BASE}/api/celebrities`);
    return await res.json();
}

export async function startGame() {
    const res = await fetch(`${API_BASE}/api/game/start`, {
        method: "POST",
    });
    return await res.json();
}

export async function submitGuess(gameId, guess, hiddenCount, totalTiles) {
    const res = await fetch(`${API_BASE}/api/game/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, guess, hiddenCount, totalTiles }),
    });
    return await res.json();
}

export async function nextCelebrity(gameId) {
    const res = await fetch(`${API_BASE}/api/game/next`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
    });
    return await res.json();
}
