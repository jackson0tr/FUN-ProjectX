class QuestionManager {
  constructor(questions) {
    this.questions = questions;
    this.models = Object.keys(questions);
    this.currentModelIndex = 0;
    this.currentQuestionIndex = 0;
    this.answers = [];
  }

  get currentModel() {
    return this.models[this.currentModelIndex];
  }

  get currentQuestion() {
    const modelQuestions = this.questions[this.currentModel];
    return modelQuestions?.[this.currentQuestionIndex] || null;
  }

  hasNextQuestion() {
    const modelQuestions = this.questions[this.currentModel];
    return this.currentQuestionIndex < modelQuestions.length - 1;
  }

  isComplete() {
    return (
      this.currentModelIndex >= this.models.length &&
      this.currentQuestionIndex >= this.questions[this.models[0]].length
    );
  }

  nextQuestion() {
    if (this.hasNextQuestion()) {
      this.currentQuestionIndex++;
    } else {
      this.currentQuestionIndex = 0;
      this.currentModelIndex++;
    }
  }

  saveAnswer(answer) {
    const questionId = `${this.currentModel}-${this.currentQuestionIndex}`;
    this.answers.push({
      id: questionId,
      model: this.currentModel,
      questionIndex: this.currentQuestionIndex,
      answer,
    });
  }

  saveToLocalStorage() {
    const storedAnswers = JSON.parse(localStorage.getItem('answers')) || [];
    localStorage.setItem('answers', JSON.stringify([...storedAnswers, ...this.answers]));
    this.answers = [];
  }

  calculateAgreement() {
    const storedAnswers = JSON.parse(localStorage.getItem('answers')) || [];
    const modelAAnswers = storedAnswers.filter((a) => a.model === 'modelA');
    const modelBAnswers = storedAnswers.filter((a) => a.model === 'modelB');

    let totalPoints = 0;

    for (let i = 0; i < modelAAnswers.length; i++) {
      const aAnswer = modelAAnswers[i].answer;
      const bAnswer = modelBAnswers[i]?.answer;

      switch (i) {
        case 0:
          if (aAnswer === false && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === false && bAnswer === true) {
            // no point
          } else if (aAnswer === true && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === true) {
            totalPoints++;
          }
          break;
        case 1:
          if (aAnswer === false && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === false && bAnswer === true) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === false) {
            // no point
          } else if (aAnswer === true && bAnswer === true) {
            totalPoints++;
          }
          break;
        case 2:
          if (aAnswer === false && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === false && bAnswer === true) {
            // no point
          } else if (aAnswer === true && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === true) {
            totalPoints++;
          }
          break;
        case 3:
          if (aAnswer === false && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === false && bAnswer === true) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === false) {
            // no point
          } else if (aAnswer === true && bAnswer === true) {
            totalPoints++;
          }
          break;
        case 4:
          if (aAnswer === false && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === false && bAnswer === true) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === true) {
            // no point
          }
          break;
        case 5:
          if (aAnswer === false && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === false && bAnswer === true) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === true) {
            // no point
          }
          break;
        case 6:
          if (aAnswer === false && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === false && bAnswer === true) {
            // no point
          } else if (aAnswer === true && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === true) {
            totalPoints++;
          }
          break;
        case 7:
          if (aAnswer === false && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === false && bAnswer === true) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === false) {
            // no point
          } else if (aAnswer === true && bAnswer === true) {
            totalPoints++;
          }
          break;
        case 8:
          if (aAnswer === false && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === false && bAnswer === true) {
            // no point
          } else if (aAnswer === true && bAnswer === false) {
            totalPoints++;
          } else if (aAnswer === true && bAnswer === true) {
            totalPoints++;
          }
          break;
        default:
          break;
      }
    }

    return Math.round((totalPoints / modelAAnswers.length) * 100);
  }

}

class UIManager {
  static renderGenderSelection() {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
      <h1>الرجاء اختيار النوع</h1>
      <div class="btn-container">
        <button onclick="app.setGender('male')">ذكر</button>
        <button onclick="app.setGender('female')">أنثى</button>
      </div>
    `;
  }

  static renderQuestion(question, questionIndex) {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
      <h1>السؤال ${questionIndex + 1}</h1>
      <p class="question">${question}</p>
      <div class="btn-container">
        <button onclick="app.answer(true)">نعم</button>
        <button onclick="app.answer(false)">لا</button>
      </div>
    `;
  }

  static showToast(message, callback) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
      document.body.removeChild(toast);
      if (callback) callback();
    }, 1000);
  }

  static renderAgreementPercentage(percentage) {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
      <h1>نتيجة التوافق</h1>
      <p class="question">نسبة التوافق بين النموذجين هي: <strong>${percentage}%</strong></p>
    `;
  }
}

class App {
  constructor(questionManager) {
    this.questionManager = questionManager;
    this.userGender = null;
    this.modelAComplete = false;
    this.modelBComplete = false;
  }

  setGender(gender) {
    this.userGender = gender;
    this.questionManager.currentModelIndex = gender === 'male' ? 0 : 1;
    this.loadNextQuestion();
  }

  start() {
    UIManager.renderGenderSelection();
  }

  answer(answer) {
    this.questionManager.saveAnswer(answer);

    if (this.questionManager.hasNextQuestion()) {
      this.questionManager.nextQuestion();
      this.loadNextQuestion();
    } else {
      if (this.questionManager.currentModel === 'modelA') {
        this.modelAComplete = true;
      } else if (this.questionManager.currentModel === 'modelB') {
        this.modelBComplete = true;
      }

      if (this.modelAComplete && !this.modelBComplete) {
        UIManager.showToast('تم استلام الأسئلة');
        this.questionManager.currentModelIndex = 1;
        this.questionManager.currentQuestionIndex = 0;
        this.loadNextQuestion();
      } else if (this.modelBComplete && !this.modelAComplete) {
        UIManager.showToast('تم استلام الأسئلة');
        this.questionManager.currentModelIndex = 0;
        this.questionManager.currentQuestionIndex = 0;
        this.loadNextQuestion();
      } else {
        this.questionManager.saveToLocalStorage();
        UIManager.showToast('تم استلام الأسئلة', () => {
          const percentage = this.questionManager.calculateAgreement();
          UIManager.renderAgreementPercentage(percentage);
          this.clearLocalStorage();
        });
      }
    }
  }

  loadNextQuestion() {
    const question = this.questionManager.currentQuestion;

    if (question && !this.questionManager.isComplete()) {
      const questionIndex = this.questionManager.currentQuestionIndex;
      UIManager.renderQuestion(question, questionIndex);
    } else {
      const percentage = this.questionManager.calculateAgreement();
      UIManager.renderAgreementPercentage(percentage);
      this.clearLocalStorage();
    }
  }

  clearLocalStorage() {
    localStorage.removeItem('answers');
    console.log('Local storage cleared');
  }
}

fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    const questionManager = new QuestionManager(data);
    window.app = new App(questionManager);
    app.start();
  })
  .catch((error) => console.error('Error loading questions:', error));
