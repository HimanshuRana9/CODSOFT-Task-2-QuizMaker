let currentQuestionIndex = 0;
let score = 0;
let quiz = JSON.parse(localStorage.getItem("quiz")) || [];

const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-btn");

if (document.getElementById("quiz-form")) {
  // Create form script
  const form = document.getElementById("quiz-form");
  const questionList = document.getElementById("question-list");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const question = document.getElementById("question").value;
    const options = [
      document.getElementById("option1").value,
      document.getElementById("option2").value,
      document.getElementById("option3").value,
      document.getElementById("option4").value
    ];
    const answer = parseInt(document.getElementById("answer").value);

    quiz.push({ question, options, answer });
    localStorage.setItem("quiz", JSON.stringify(quiz));
    form.reset();
    showSavedQuestions();
  });

  function showSavedQuestions() {
    questionList.innerHTML = "";
    quiz.forEach((q, index) => {
      const li = document.createElement("li");
      li.textContent = `Q${index + 1}: ${q.question}`;
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => {
        quiz.splice(index, 1);
        localStorage.setItem("quiz", JSON.stringify(quiz));
        showSavedQuestions();
      };
      li.appendChild(delBtn);
      questionList.appendChild(li);
    });
  }

  showSavedQuestions();
} else if (questionElement) {
  // Quiz script
  function showQuestion() {
    if (quiz.length === 0) {
      questionElement.innerText = "No quiz found. Please create one first.";
      optionsContainer.innerHTML = "";
      nextButton.style.display = "none";
      return;
    }

    const currentQuestion = quiz[currentQuestionIndex];
    questionElement.innerText = `Q${currentQuestionIndex + 1}: ${currentQuestion.question}`;
    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.innerText = option;
      button.classList.add("option-btn");
      button.addEventListener("click", () => selectOption(index));
      optionsContainer.appendChild(button);
    });
  }

  function selectOption(selectedIndex) {
    const currentQuestion = quiz[currentQuestionIndex];
    const buttons = document.querySelectorAll(".option-btn");

    buttons.forEach((btn, index) => {
      btn.disabled = true;
      if (index === selectedIndex) {
        btn.classList.add("selected");
      }
      if (index === currentQuestion.answer) {
        btn.classList.add("correct");
      } else if (index === selectedIndex && index !== currentQuestion.answer) {
        btn.classList.add("incorrect");
      }
    });

    if (selectedIndex === currentQuestion.answer) score++;
    nextButton.style.display = "inline-block";
  }

  function showResult() {
    questionElement.innerText = `Quiz Completed! Your Score: ${score}/${quiz.length}`;
    optionsContainer.innerHTML = "";
    nextButton.innerText = "Restart";
    nextButton.onclick = restartQuiz;
  }

  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerText = "Next";
    nextButton.onclick = handleNext;
    showQuestion();
  }

  function handleNext() {
    currentQuestionIndex++;
    nextButton.style.display = "none";
    if (currentQuestionIndex < quiz.length) {
      showQuestion();
    } else {
      showResult();
    }
  }

  nextButton.onclick = handleNext;
  showQuestion();
}