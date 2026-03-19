export async function fetchQuestion() {
    const res = await fetch("http://localhost:3000/api/question");
    return await res.json();
}
