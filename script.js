let secretNumber;
let attempts;
let feedbackMessages = [];

const input = document.getElementById("guessInput");
const feedbackDiv = document.getElementById("feedback");
const attemptsLabel = document.getElementById("attemptsLabel");
const congrats = document.getElementById("congrats");
const congratsText = document.getElementById("congratsText");
const congratsGif = document.getElementById("congratsGif");
const submitBtn = document.getElementById("submitBtn");

function startNewGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    feedbackMessages = [];
    feedbackDiv.innerHTML = "";
    attemptsLabel.textContent = "Attempts: 0";
    congrats.classList.add("hidden");
    input.disabled = false;
    submitBtn.disabled = false;
    input.value = "";
    input.focus();
}

// Mimic Swing last 5 messages logic
function addFeedback(message) {
    if (feedbackMessages.length >= 5) feedbackMessages = [];
    feedbackMessages.push(message);
    feedbackDiv.innerHTML = feedbackMessages.join("<br>");
}

function handleGuess() {
    const guess = Number(input.value);

    if (!guess || guess < 1 || guess > 100) {
        addFeedback("❌ Please enter a valid number.");
        congrats.classList.add("hidden");
        input.value = "";
        input.focus();
        return;
    }

    attempts++;
    attemptsLabel.textContent = "Attempts: " + attempts;

    if (guess === secretNumber) {
        feedbackMessages = [];
        feedbackDiv.innerHTML = "";
        congratsText.innerHTML = `o(≧▽≦)o Correct! You guessed it in ${attempts} attempts.<br>
          <span class="stars">✩₊˚.⋆☾⋆⁺₊✧</span>`;

        congrats.classList.remove("hidden");
        input.disabled = true;
        submitBtn.disabled = true;

        // 👉 FRONTEND INTEGRATION: send score to backend
        fetch("https://guessnumbergame-feqq.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ player: "Anonymous", attempts })
        })
        .then(res => res.json())
        .then(data => console.log("Score saved:", data))
        .catch(err => console.error("Error saving score:", err));

        // 👉 Optionally fetch leaderboard right after
        fetch("https://guessnumbergame-feqq.onrender.com")
          .then(res => res.json())
          .then(data => {
              const leaderboardDiv = document.getElementById("leaderboard");
              leaderboardDiv.innerHTML = data.map(
                  s => `<p>${s.player}: ${s.attempts} attempts</p>`
              ).join("");
          });
    } else if (guess < secretNumber) {
        addFeedback("(╥ω╥) Too low! Try again.");
        congrats.classList.add("hidden");
    } else {
        addFeedback("(⊙_⊙) Too high! Try again.");
        congrats.classList.add("hidden");
    }

    input.value = "";
    input.focus();
}


document.getElementById("submitBtn").addEventListener("click", handleGuess);
input.addEventListener("keypress", e => { if (e.key === "Enter") handleGuess(); });
document.getElementById("resetBtn").addEventListener("click", startNewGame);

// Start game initially
startNewGame();

