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
      return this.currentModelIndex >= this.models.length;
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
      this.answers = []; // Clear temporary answers
    }
  
    calculateAgreement() {
      const storedAnswers = JSON.parse(localStorage.getItem('answers')) || [];
      const modelAAnswers = storedAnswers.filter((a) => a.model === 'modelA');
      const modelBAnswers = storedAnswers.filter((a) => a.model === 'modelB');
  
      let agreementCount = 0;
  
      modelAAnswers.forEach((a, index) => {
        const bAnswer = modelBAnswers[index]?.answer;
        if (
          (a.answer && bAnswer) || // Both Yes
          (!a.answer && !bAnswer) || // Both No
          (!a.answer && bAnswer) // No (A) and Yes (B)
        ) {
          agreementCount++;
        }
      });
  
      return Math.round((agreementCount / modelAAnswers.length) * 100);
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
      }, 2000);
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
        this.questionManager.saveToLocalStorage();
        UIManager.showToast('تم استلام الأسئلة', () => {
          if (this.questionManager.isComplete()) {
            const percentage = this.questionManager.calculateAgreement();
            console.log('Calculated Agreement:', percentage);
            UIManager.renderAgreementPercentage(percentage);
          } else {
            this.questionManager.nextQuestion();
            this.loadNextQuestion();
          }
        });
      }
    }
  
    loadNextQuestion() {
      const question = this.questionManager.currentQuestion;
      if (question) {
        const questionIndex = this.questionManager.currentQuestionIndex;
        UIManager.renderQuestion(question, questionIndex);
      }
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
  