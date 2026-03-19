const buttons = {
    "btn-game":    "../game.html",
    "btn-quit-game": "https://www.youtube.com/watch?v=uPLX6Lee9K8&list=RDuPLX6Lee9K8&start_radio=1",
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
