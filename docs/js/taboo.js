function taboo() {
  return {
    // state
    selectedDeck: localStorage.getItem("selectedDeck") || "javascript",
    cards: [],
    index: 0,
    animation: "fade-right",
    audience: false,
    timerDuration: parseInt(localStorage.getItem("timerDuration"), 10) || 60,
    timeLeft: 0,
    timerId: null,
    timerEnabled: true,
    timeUp: false,
    deckName: "",

    // lifecycle
    init() {
      this.loadDeck();
      this.startTimer();
    },

    // load deck JSON based on selection
    async loadDeck() {
      try {
        const res = await fetch(`./decks/${this.selectedDeck}.json`);
        if (!res.ok) throw new Error("Deck not found");

        const data = await res.json();
        this.cards = data.cards || [];
        this.index = 0;
        this.deckName = data.name || this.selectedDeck.toUpperCase();
        this.animate("right");
        this.startTimer();
      } catch (err) {
        console.error("Failed to load deck:", err);
        this.cards = [];
      }
    },

    get timeDisplay() {
      const m = Math.floor(this.timeLeft / 60);
      const s = this.timeLeft % 60;
      return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    },

    get timerClass() {
      return this.timeLeft <= 10 ? "warning" : "";
    },

    startTimer() {
      if (!this.timerEnabled) return;

      clearInterval(this.timerId);
      this.timeLeft = this.timerDuration;
      this.timeUp = false;

      this.timerId = setInterval(() => {
        this.timeLeft--;

        if (this.timeLeft <= 0) {
          clearInterval(this.timerId);
          this.timerId = null;
          this.timeLeft = 0;
          this.timeUp = true;
        }
      }, 1000);
    },

    toggleTimer() {
      this.timerEnabled = !this.timerEnabled;

      if (this.timerEnabled) {
        this.startTimer();
      } else {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    },

    // computed
    get current() {
      return this.cards[this.index] || { term: "", forbidden: [] };
    },

    get counterText() {
      return `${this.index + 1} / ${this.cards.length}`;
    },

    // navigation
    next() {
      if (!this.cards.length) return;
      this.index = (this.index + 1) % this.cards.length;
      this.animate("right");
      this.startTimer();
    },

    prev() {
      if (!this.cards.length) return;
      this.index = (this.index - 1 + this.cards.length) % this.cards.length;
      this.animate("left");
      this.startTimer();
    },

    shuffle() {
      if (!this.cards.length) return;
      this.cards = [...this.cards].sort(() => Math.random() - 0.5);
      this.index = 0;
      this.animate("right");
      startTimer();
    },

    // modes
    toggleAudience() {
      this.audience = !this.audience;
    },

    // animation helper
    animate(dir) {
      this.animation = "";
      requestAnimationFrame(() => {
        this.animation = dir === "left" ? "fade-left" : "fade-right";
      });
    },

    // keyboard shortcuts
    keys(e) {
      if (e.key === "ArrowRight") this.next();
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "a") this.toggleAudience();
      if (e.key === "s") this.shuffle();
      if (e.key === "t") this.startTimer();
    }
  };
}
