function taboo() {
  return {
    // -----------------
    // STATE
    // -----------------
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
    hasBuzzed: false,

    buzzerMuted: localStorage.getItem("buzzerMuted") === "true",

    deckName: "",
    theme: localStorage.getItem("theme") || "dark",
    menuOpen: false,

    // -----------------
    // INIT
    // -----------------
    init() {
      document.documentElement.dataset.theme = this.theme;
      this.loadDeck();
    },

    // -----------------
    // DECK
    // -----------------
    async loadDeck() {
      this.stopTimer();

      try {
        const res = await fetch(`./decks/${this.selectedDeck}.json`);
        const data = await res.json();

        this.cards = data.cards || [];
        this.index = 0;
        this.deckName = data.name || this.selectedDeck.toUpperCase();

        this.animate("right");
        this.startTimer();
      } catch (err) {
        console.error("Deck load failed", err);
        this.cards = [];
      }
    },

    // -----------------
    // TIMER (SAFE)
    // -----------------
    startTimer() {
      if (!this.timerEnabled) return;

      this.stopTimer();

      this.timeLeft = this.timerDuration;
      this.timeUp = false;
      this.hasBuzzed = false;

      this.timerId = setInterval(() => {
        if (this.timeLeft === 0) {
          this.stopTimer();
          this.timeUp = true;

          if (!this.hasBuzzed && !this.buzzerMuted) {
            this.hasBuzzed = true;
            const buzzer = document.getElementById("buzzer");
            buzzer?.play().catch(() => {});
          }
          return;
        }

        this.timeLeft--;
      }, 1000);
    },

    stopTimer() {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    },

    toggleTimer() {
      this.timerEnabled = !this.timerEnabled;
      this.timerEnabled ? this.startTimer() : this.stopTimer();
    },

    // -----------------
    // BUZZER
    // -----------------
    toggleBuzzer() {
      this.buzzerMuted = !this.buzzerMuted;
      localStorage.setItem("buzzerMuted", this.buzzerMuted);
    },

    // -----------------
    // COMPUTED
    // -----------------
    get current() {
      return this.cards[this.index] || { term: "", forbidden: [] };
    },

    get counterText() {
      return `${this.index + 1} / ${this.cards.length}`;
    },

    get timeDisplay() {
      const m = Math.floor(this.timeLeft / 60);
      const s = this.timeLeft % 60;
      return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    },

    get timerClass() {
      return this.timeLeft <= 10 ? "warning" : "";
    },

    // -----------------
    // NAVIGATION
    // -----------------
    next() {
      if (!this.cards.length) return;
      this.stopTimer();
      this.index = (this.index + 1) % this.cards.length;
      this.animate("right");
      this.startTimer();
    },

    prev() {
      if (!this.cards.length) return;
      this.stopTimer();
      this.index = (this.index - 1 + this.cards.length) % this.cards.length;
      this.animate("left");
      this.startTimer();
    },

    shuffle() {
      if (!this.cards.length) return;
      this.stopTimer();
      this.cards = [...this.cards].sort(() => Math.random() - 0.5);
      this.index = 0;
      this.animate("right");
      this.startTimer();
    },

    // -----------------
    // UI MODES
    // -----------------
    toggleAudience() {
      this.audience = !this.audience;
    },

    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = this.theme;
      localStorage.setItem("theme", this.theme);
    },

    // -----------------
    // ANIMATION
    // -----------------
    animate(dir) {
      this.animation = "";
      requestAnimationFrame(() => {
        this.animation = dir === "left" ? "fade-left" : "fade-right";
      });
    },

    // -----------------
    // KEYBOARD
    // -----------------
    keys(e) {
      if (e.key === "ArrowRight") this.next();
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === "a") this.toggleAudience();
      if (e.key === "s") this.shuffle();
      if (e.key === "t") this.startTimer();
      if (e.key === "m") this.toggleBuzzer(); // ⬅ bonus shortcut
    }
  };
}
