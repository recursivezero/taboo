const decks = {
  javascript: {
    name: "JavaScript Basics",
    cards: [
      { term: "Closure", forbidden: ["function", "scope", "variable", "lexical", "inner"] },
      { term: "Promise", forbidden: ["async", "await", "then", "callback", "resolve"] },
      { term: "Hoisting", forbidden: ["variable", "function", "declaration", "undefined", "scope"] }
    ]
  },
  react: {
    name: "React Concepts",
    cards: [
      { term: "React Hook", forbidden: ["state", "useEffect", "lifecycle", "component", "function"] },
      { term: "Virtual DOM", forbidden: ["react", "browser", "diff", "render", "performance"] }
    ]
  },
  web: {
    name: "Web Fundamentals",
    cards: [
      { term: "REST API", forbidden: ["http", "endpoint", "request", "response", "server"] },
      { term: "CORS", forbidden: ["browser", "security", "header", "origin", "request"] }
    ]
  }
};

let currentDeck = decks.javascript.cards;
let index = 0;

const termEl = document.getElementById("term");
const forbiddenEl = document.getElementById("forbidden");
const counterEl = document.getElementById("counter");
const contentEl = document.getElementById("content");
const deckSelect = document.getElementById("deckSelect");

function render(direction = "right") {
  // @ts-ignore
  contentEl.classList.remove("fade-left", "fade-right");
  // @ts-ignore
  void contentEl.offsetWidth;
  // @ts-ignore
  contentEl.classList.add(direction === "left" ? "fade-left" : "fade-right");

  const card = currentDeck[index];
  // @ts-ignore
  termEl.textContent = card.term;
  // @ts-ignore
  forbiddenEl.innerHTML = card.forbidden.map((w) => `<span>${w}</span>`).join("");
  // @ts-ignore
  counterEl.textContent = `${index + 1} / ${currentDeck.length}`;
}

/* Navigation */
// @ts-ignore
document.getElementById("next").onclick = () => {
  index = (index + 1) % currentDeck.length;
  render("right");
};

// @ts-ignore
document.getElementById("prev").onclick = () => {
  index = (index - 1 + currentDeck.length) % currentDeck.length;
  render("left");
};

/* Keyboard */
document.addEventListener("keydown", (e) => {
  // @ts-ignore
  if (e.key === "ArrowRight") document.getElementById("next").click();
  // @ts-ignore
  if (e.key === "ArrowLeft") document.getElementById("prev").click();
});

/* Deck selector */
Object.entries(decks).forEach(([key, deck]) => {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = deck.name;
  // @ts-ignore
  deckSelect.appendChild(opt);
});

// @ts-ignore
deckSelect.onchange = () => {
  // @ts-ignore
  currentDeck = decks[deckSelect.value].cards;
  index = 0;
  render("right");
};

render();
