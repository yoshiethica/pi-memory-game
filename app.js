const PI_DIGITS =
  "14159265358979323846264338327950288419716939937510" +
  "58209749445923078164062862089986280348253421170679" +
  "82148086513282306647093844609550582231725359408128" +
  "48111745028410270193852110555964462294895493038196" +
  "44288109756659334461284756482337867831652712019091" +
  "45648566923460348610454326648213393607260249141273" +
  "72458700660631558817488152092096282925409171536436" +
  "78925903600113305305488204665213841469519415116094" +
  "33057270365759591953092186117381932611793105118548" +
  "07446237996274956735188575272489122793818301194912" +
  "98336733624406566430860213949463952247371907021798" +
  "60943702770539217176293176752384674818467669405132" +
  "00056812714526356082778577134275778960917363717872" +
  "14684409012249534301465495853710507922796892589235" +
  "42019956112129021960864034418159813629774771309960" +
  "51870721134999999";

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
  updateAchievementMessage();
}

function updateAchievementMessage() {
  message.classList.remove("error", "achievement", "feynman");

  if (currentIndex === PI_DIGITS.length) {
    message.classList.add("feynman");
    message.textContent = "and so on!";

    input.disabled = true;
    input.blur();
    gameStarted = false;
    return;
  }

  if (currentIndex > 0 && currentIndex % 100 === 0) {
    message.classList.add("achievement");
    message.textContent = `${currentIndex} digits reached!`;
    return;
  }

  message.textContent = "Correct";
}


function handleIncorrectInput(correctDigit, showCorrectAnswer) {
  mistakes += 1;
  wrongIndexes.add(currentIndex);

  message.classList.remove("achievement", "feynman");
  message.classList.add("error");

  if (showCorrectAnswer) {
    message.textContent = `Wrong! Correct answer: ${correctDigit}`;
  } else {
    message.textContent = "Wrong!";
  }


  updateStatus();
}

function handlePracticeMode(userInput) {
  const correctDigit = PI_DIGITS[currentIndex];

  if (userInput === correctDigit) {
    handleCorrectInput(userInput);
  } else {
    handleIncorrectInput(correctDigit, true);
  }
}

function handleChallengeMode(userInput) {
  const correctDigit = PI_DIGITS[currentIndex];
  const maxMistakes = Number(maxMistakesInput.value);

  if (userInput === correctDigit) {
    handleCorrectInput(userInput);
  } else {
    handleIncorrectInput(correctDigit, false);

    if (mistakes > maxMistakes) {
      gameStarted = false;
      input.disabled = true;
      message.textContent = `Game Over! - ${currentIndex} digits`;
      message.classList.remove("error", "achievement", "feynman");
      return;
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