const buttons = {
    "btn-game":    "../game.html",
    "btn-quit-game": "../404.html",
};

for (const [id, page] of Object.entries(buttons)) {
    const el = document.getElementById(id);
    if (!el) continue;

    el.addEventListener("click", () => {
        if (page === null) {
            if (!window.close()) {
                window.location.href = "/static/404.html";
            }
        } else {
            window.location.href = page;
        }
    });
}
