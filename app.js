console.log("app.js loaded");

const PI_DIGITS = "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679";

const practiceRadio = document.getElementById("mode-practice");
const challengeRadio = document.getElementById("mode-challenge");
const maxMistakesInput = document.getElementById("max-mistakes");

const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const input = document.getElementById("input");

const modeDisplay = document.getElementById("mode-display");
const digitCount = document.getElementById("digit-count");
const mistakeCount = document.getElementById("mistake-count");
const message = document.getElementById("message");
const piDisplay = document.getElementById("pi-display");

let currentIndex = 0;
let mistakes = 0;
let gameStarted = false;
let wrongIndexes = new Set();

function updateModeUI() {
  if (practiceRadio.checked) {
    maxMistakesInput.disabled = true;
    modeDisplay.textContent = "現在のモード: 練習モード";
  } else {
    maxMistakesInput.disabled = false;
    modeDisplay.textContent = "現在のモード: 本番モード";
  }
}

function renderInitialPiDisplay() {
  piDisplay.innerHTML = `
    <div class="pi-line first-line">
      <span class="digit-box fixed">3</span>
      <span class="digit-box fixed">.</span>
    </div>
    <div class="pi-line digits-line"></div>
  `;
}

function addDigitBox(digit, isWrongPosition = false) {
  const line = piDisplay.querySelector(".digits-line");
  const span = document.createElement("span");
  span.className = "digit-box";

  if (isWrongPosition) {
    span.classList.add("wrong");
  }

  span.textContent = digit;
  line.appendChild(span);
}

function updateStatus() {
  digitCount.textContent = `到達桁数: ${currentIndex}`;
  mistakeCount.textContent = `ミス回数: ${mistakes}`;
}

function resetGame() {
  currentIndex = 0;
  mistakes = 0;
  gameStarted = false;
  wrongIndexes = new Set();

  updateStatus();
  message.textContent = "";

  renderInitialPiDisplay();

  input.value = "";
  input.disabled = true;

  updateModeUI();
}

function startGame() {
  currentIndex = 0;
  mistakes = 0;
  gameStarted = true;
  wrongIndexes = new Set();

  updateStatus();
  message.textContent = "";

  renderInitialPiDisplay();

  input.value = "";
  input.disabled = false;
  input.focus();

  updateModeUI();
}

function handleCorrectInput(userInput) {
  const wasWrongBefore = wrongIndexes.has(currentIndex);

  addDigitBox(userInput, wasWrongBefore);

  currentIndex += 1;
  updateStatus();

  message.textContent = "Correct";
  message.style.color = "";
}

function handleIncorrectInput() {
  mistakes += 1;
  updateStatus();

  wrongIndexes.add(currentIndex);

  message.textContent = "Incorrect";
  message.style.color = "red";
}

function handlePracticeMode(userInput) {
  const correctDigit = PI_DIGITS[currentIndex];

  if (userInput === correctDigit) {
    handleCorrectInput(userInput);
  } else {
    handleIncorrectInput();
  }
}

function handleChallengeMode(userInput) {
  const correctDigit = PI_DIGITS[currentIndex];
  const maxMistakes = Number(maxMistakesInput.value);

  if (userInput === correctDigit) {
    handleCorrectInput(userInput);
  } else {
    handleIncorrectInput();

    if (mistakes > maxMistakes) {
      gameStarted = false;
      input.disabled = true;
      message.textContent = `Game Over - ${currentIndex}桁`;
      message.style.color = "red";
    }
  }
}

function handleInput(event) {
  if (!gameStarted) {
    return;
  }

  const userInput = event.target.value;

  if (!/^[0-9]$/.test(userInput)) {
    input.value = "";
    return;
  }

  if (practiceRadio.checked) {
    handlePracticeMode(userInput);
  } else {
    handleChallengeMode(userInput);
  }

  input.value = "";
}

practiceRadio.addEventListener("change", updateModeUI);
challengeRadio.addEventListener("change", updateModeUI);
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
input.addEventListener("input", handleInput);

resetGame();