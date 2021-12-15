class memoramaGame {
  constructor() {
    this.totalCards = [];
    this.cardsNumber = 0;
    this.cardChecker = [];
    this.errors = 0;
    this.levelDifficulty = "";
    this.correctImages = [];
    this.addCards = [];
    this.attemptsNumbers = 0;

    //Elementos HTML
    this.$generalContainer = document.querySelector(".contenedor-general");
    this.$cardsContainer = document.querySelector(".contenedor-tarjetas");
    this.$blockedDisplay = document.querySelector(".pantalla-bloqueada");
    this.$message = document.querySelector("h2.mensaje");
    this.$errorContainer = document.createElement("div");
    this.$levelDifficulty = document.createElement("div");
    this.eventListener();
  } //Es la función que se ejecuta al iniciar la clase
  eventListener() {
    window.addEventListener("DOMContentLoaded", () => {
      this.selectDifficulty();
      this.initialDisplay();
      window.addEventListener(
        "contextmenu",
        (evt) => {
          evt.preventDefault();
        },
        false
      );
    });
  }
  selectDifficulty() {
    const message = prompt(
      "Please select a level of difficulty: easy, medium, hard or extreme"
    );
    if (!message) {
      this.attemptsNumbers = 5;
      this.levelDifficulty = "medium";
    } else {
      if (message.toLowerCase() === "easy") {
        this.attemptsNumbers = 7;
        this.levelDifficulty = "easy";
      } else if (message.toLowerCase() === "medium") {
        this.attemptsNumbers = 5;
        this.levelDifficulty = "medium";
      } else if (message.toLowerCase() === "hard") {
        this.attemptsNumbers = 3;
        this.levelDifficulty = "hard";
      } else if (message.toLowerCase() === "extreme") {
        this.attemptsNumbers = 2;
        this.levelDifficulty = "extreme";
      }
    }
    this.errorContainer();
    this.attemptsMessage();
  }
  async initialDisplay() {
    const fetchAnswer = await fetch("../json/memo.json");
    const answerData = await fetchAnswer.json();
    let html = "";

    this.totalCards = answerData;
    this.totalCards.map((card) => {
      html += `
        <div class="tarjeta">
            <img class="tarjeta-img" src="${card.src}" alt="imagen memorama">
        </div>
        `;
    });
    this.$cardsContainer.innerHTML = html;
    this.startGame();
  }
  startGame() {
    const cards = document.querySelectorAll(".tarjeta");
    cards.forEach((card) => {
      card.addEventListener("click", (evt) => {
        if (
          !evt.target.classList.contains("acertada") &&
          !evt.target.classList.contains("tarjeta-img")
        ) {
          this.clickCard(evt);
        }
      });
    });
  }
  clickCard(evt) {
    let sourceImage, card;
    this.flipCard(evt);
    sourceImage = evt.target.childNodes[1].attributes[1].value;
    card = evt.target;
    this.cardChecker.push(sourceImage);
    this.addCards.unshift(card);
    this.cardCompare();
  }
  flipCard(evt) {
    evt.target.style.backgroundImage = "none";
    evt.target.backgroundColor = "transparent";
    evt.target.childNodes[1].style.display = "block";
  }
  filterPairMatch(params) {
    params.forEach((card) => {
      card.classList.add("acertada");
      this.correctImages.push(card);
      this.victoryGame();
    });
  }
  cardsReverse(params) {
    params.forEach((card) => {
      setTimeout(() => {
        card.style.backgroundImage = "url('../img/cover.jpg')";
        card.childNodes[1].style.display = "none";
      }, 1000);
    });
  }
  cardCompare() {
    if (this.cardChecker.length === 2) {
      if (this.cardChecker[0] === this.cardChecker[1]) {
        this.filterPairMatch(this.addCards);
      } else {
        this.cardsReverse(this.addCards);
        this.errors++;
        this.increaseError();
        this.loseGame();
      }
      this.cardChecker.splice(0);
      this.addCards.splice(0);
    }
  }
  victoryGame() {
    if (this.correctImages.length === this.cardsNumber) {
      setTimeout(() => {
        this.$blockedDisplay.style.display = "block";
        this.$message.innerHTML = "Felicidades, has ganado";
      }, 1000);
      setTimeout(() => {
        location.reload();
      }, 4000);
    }
  }
  loseGame() {
    if (this.errors === this.attemptsNumbers) {
      setTimeout(() => {
        this.$blockedDisplay.style.display = "block";
        this.$message.innerHTML = "Lo sentimos, has perdido";
      }, 1000);
      setTimeout(() => {
        location.reload();
      }, 4000);
    }
  }
  increaseError() {
    this.$errorContainer.innerText = `
        Errors: ${this.errors}
      `;
  }
  errorContainer() {
    this.$errorContainer.classList.add("error");
    this.increaseError();
    this.$generalContainer.appendChild(this.$errorContainer);
  }
  attemptsMessage() {
    this.$levelDifficulty.classList.add("nivel-dificultad");
    this.$levelDifficulty.innerText = `
    Level Difficulty: ${this.levelDifficulty}
      `;
    this.$generalContainer.appendChild(this.$levelDifficulty);
  }
}
new memoramaGame();
