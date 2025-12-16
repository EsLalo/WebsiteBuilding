(() => {
  // Map difficulty (case-insensitive) to filenames
  const FILES_BY_DIFFICULTY = {
    easy:   "easy_questions.json",
    medium: "medium_questions.json",
    hard:   "hard_questions.json",
    xtreme: "xtreme_questions.json",
    cscfinal: "cscfinalreview.json",
  };

  // Only run on the game page
  const gameRoot    = document.getElementById("game");
  const questionEl  = document.getElementById("question");
  if (!gameRoot || !questionEl) return;

  const choices         = Array.from(document.getElementsByClassName("choice-text"));
  const progressText    = document.getElementById("progressText");
  const scoreText       = document.getElementById("score");
  const progressBarFull = document.getElementById("progressBarFull");
  const loader          = document.getElementById("loader");

  // Optional audio UI (make sure these exist in game.html)
  // <button id="playClip" type="button" class="button" style="display:none;">▶️ Play Clip</button>
  // <audio id="qAudio" preload="metadata"></audio>
  const playBtn = document.getElementById("playClip");
  const qAudio  = document.getElementById("qAudio");

  // Read difficulty and choose file with fallback
  const rawDifficulty = (localStorage.getItem("difficulty") || "Easy").trim();
  const key           = rawDifficulty.toLowerCase();
  let questionsFile   = FILES_BY_DIFFICULTY[key] || FILES_BY_DIFFICULTY.easy;

  console.log("[game] Difficulty:", rawDifficulty, "->", questionsFile);

  // State
  let currentQuestion    = {};
  let acceptingAnswers   = false;
  let score              = 0;
  let questionCounter    = 0;
  let availableQuestions = [];
  let questions          = [];

  // Constants
  const CORRECT_BONUS = 1;
  let   MAX_QUESTIONS = 0; // Will be set based on loaded questions

  // Fetch questions
  fetch(questionsFile)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${questionsFile} (${res.status})`);
      return res.json();
    })
    .then(loaded => {
      // Normalize JSON to expected shape
      questions = loaded.map(q => ({
        question: q.question,
        choice1:  q.choice1 || null,
        choice2:  q.choice2 || null,
        choice3:  q.choice3 || null,
        choice4:  q.choice4 || null,
        answer:   Number(q.answer),    // 1..4
        audio:    q.audio || null,     // optional, keep LOWERCASE everywhere
        image: q.image || null,
        freeform: q.freeform || null,   // optional freeform answer
      }));
      startGame();
    })
    .catch(err => {
      console.warn("[game] Could not load selected difficulty:", err);
      if (questionsFile !== FILES_BY_DIFFICULTY.easy) {
        // Fallback to Easy
        const fallback = FILES_BY_DIFFICULTY.easy;
        return fetch(fallback)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to load fallback ${fallback} (${res.status})`);
            return res.json();
          })
          .then(loaded => {
            questions = loaded.map(q => ({
              question: q.question,
              choice1:  q.choice1 || null,
              choice2:  q.choice2 || null,
              choice3:  q.choice3 || null,
              choice4:  q.choice4 || null,
              answer:   Number(q.answer),
              audio:    q.audio || null, // <-- fixed
              image: q.image || null,
              freeform: q.freeform || null,
            }));
            startGame();
          })
          .catch(finalErr => {
            console.error("[game] Fallback also failed:", finalErr);
            if (loader) loader.classList.add("hidden");
            gameRoot.classList.remove("hidden");
            questionEl.innerText = `Could not load questions for "${rawDifficulty}". Check that ${questionsFile} exists.`;
          });
      } else {
        if (loader) loader.classList.add("hidden");
        gameRoot.classList.remove("hidden");
        questionEl.innerText = `Could not load "${questionsFile}".`;
      }
    });

  function startGame() {
    questionCounter     = 0;
    score               = 0;
    availableQuestions  = [...questions];
    MAX_QUESTIONS       = availableQuestions.length; // Use all available questions from the JSON file

    getNewQuestion();
    gameRoot.classList.remove("hidden");
    if (loader) loader.classList.add("hidden");
  }

  function getNewQuestion() {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      try { if (qAudio) qAudio.pause(); } catch {}
      localStorage.setItem("mostRecentScore", score);
      return window.location.assign("end.html"); // relative path
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    if (progressBarFull) {
      progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    }

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];

    // Show/hide choices based on whether it's an IF question    
    const isFR =
      typeof currentQuestion.freeform === "string" &&
      currentQuestion.freeform.trim() !== "";

    const isTF = 
      (!currentQuestion.choice3 || currentQuestion.choice3.trim()==="")&&
      (!currentQuestion.choice4 || currentQuestion.choice4.trim()==="") &&
      !isFR;
      


    const c1 = document.querySelector('[data-number="1"]').parentElement; // .choice-container
    const c2 = document.querySelector('[data-number="2"]').parentElement; // .choice-container
    const c3 = document.querySelector('[data-number="3"]').parentElement; // .choice-container
    const c4 = document.querySelector('[data-number="4"]').parentElement; // .choice-container

    const freeformInput = document.getElementById("freeforminput");
    const inputButton = document.getElementById("inputbutton");


    if(isFR){
      c1.style.display = "none";
      c2.style.display = "none";
      c3.style.display = "none";
      c4.style.display = "none";
      freeformInput.style.display = "block";
      inputButton.style.display = "block";
      freeformInput.value = "";
    }else if(isTF){
      c1.style.display = "flex";
      c2.style.display = "flex";
      c3.style.display = "none";
      c4.style.display = "none";
      freeformInput.style.display = "none";
      inputButton.style.display = "none";
    } else{
      c1.style.display = "flex";
      c2.style.display = "flex";
      c3.style.display = "flex";
      c4.style.display = "flex";
      freeformInput.style.display = "none";
      inputButton.style.display = "none";
    }


    const img = document.getElementById("picture");
    if(img){
      img.style.display="none";
      img.onload = () => {img.style.display="block"};
      img.onerror =() =>{
        console.warn("Image failed to load", currentQuestion.image);
        img.style.display="none";
      };
      if(typeof currentQuestion.image === "string" && currentQuestion.image.trim()){
        img.src = currentQuestion.image.trim();
        img.alt = currentQuestion.question || "Question Image";
      } else{
        img.removeAttribute("src");
        img.style.display ="none";
      }

    }

    // Render Q & choices
    questionEl.innerText = currentQuestion.question;
    choices.forEach(choice => {
      const number = choice.dataset["number"]; // "1".."4"
      choice.innerText = currentQuestion["choice" + number] ?? "";
    });

    // AUDIO per-question (optional)
    if (qAudio && playBtn) {
      try { qAudio.pause(); } catch {}
      qAudio.currentTime = 0;

      console.log("[game] currentQuestion:", currentQuestion);
      console.log("[audio] field value:", currentQuestion.audio);

      if (typeof currentQuestion.audio === "string" && currentQuestion.audio.trim()) {
        qAudio.src = currentQuestion.audio.trim();
        playBtn.style.display = "inline-block";
        playBtn.textContent = "▶️ Play Clip";
        playBtn.disabled = false;
      } else {
        qAudio.removeAttribute("src");
        playBtn.style.display = "none";
      }

      // Wire play button once
      if (!playBtn._wired) {
        playBtn._wired = true;
        playBtn.addEventListener("click", async () => {
          try {
            if (qAudio.paused) {
              await qAudio.play();
              playBtn.textContent = "⏸️ Pause";
            } else {
              qAudio.pause();
              playBtn.textContent = "▶️ Play Clip";
            }
          } catch (e) {
            console.error("Audio play error:", e);
            playBtn.textContent = "🔁 Try Again";
          }
        });
        qAudio.addEventListener("ended", () => {
          playBtn.textContent = "▶️ Play Clip";
        });
      }
    }

    // Remove used question
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
  }
  const freeformInput = document.getElementById("freeforminput");
  const inputButton = document.getElementById("inputbutton");

  inputButton.addEventListener("click", () => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;

    const userAnswer = submitFreeformAnswer(freeformInput.value);

    const correctAnswer = submitFreeformAnswer(currentQuestion.freeform);

    const isCorrect = userAnswer === correctAnswer;

    console.log("User answer:", userAnswer);
    console.log("Correct answer:", correctAnswer);
    console.log("Is correct?", isCorrect);

    if(isCorrect){ 
      incrementScore(CORRECT_BONUS);
      freeformInput.style.borderColor = "green";
    } else{
      freeformInput.style.borderColor = "red";
    }

    setTimeout(() => {
      freeformInput.style.borderColor = "none";
      getNewQuestion();
    }, 1200);
  });

  choices.forEach(choice => {
    choice.addEventListener("click", e => {
      if (!acceptingAnswers) return;
      acceptingAnswers = false;

      const selectedChoice = e.target;
      const selectedAnswer = Number(selectedChoice.dataset["number"]);
      const classToApply = selectedAnswer === currentQuestion.answer ? "correct" : "incorrect";

      if (classToApply === "correct") incrementScore(CORRECT_BONUS);

      const container = selectedChoice.parentElement; // .choice-container
      container.classList.add(classToApply);

      setTimeout(() => {
        container.classList.remove(classToApply);
        getNewQuestion();
      }, 1000);
    });
  });

  function incrementScore(num) {
    score += num;
    if (scoreText) scoreText.innerText = String(score);
  }
  function submitFreeformAnswer(str){
    if(!str) return "";
    return str.trim().toLowerCase();
  }
})();
