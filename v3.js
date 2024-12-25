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
      // Checks if both models have completed all their questions
      return this.currentModelIndex >= this.models.length && this.currentQuestionIndex >= this.questions[this.models[0]].length;
    }
  
    nextQuestion() {
      // Move to the next question for the current model or switch models
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
      // Set the model based on gender
      this.questionManager.currentModelIndex = gender === 'male' ? 0 : 1;
      this.loadNextQuestion();
    }
  
    start() {
      UIManager.renderGenderSelection();
    }
  
    answer(answer) {
      this.questionManager.saveAnswer(answer);
  
      // Proceed to the next question if there is one for the current model
      if (this.questionManager.hasNextQuestion()) {
        this.questionManager.nextQuestion();
        this.loadNextQuestion();
      } else {
        // Mark model as complete when all questions for the model have been answered
        if (this.questionManager.currentModel === 'modelA') {
          this.modelAComplete = true;
        } else if (this.questionManager.currentModel === 'modelB') {
          this.modelBComplete = true;
        }
  
        // After completing one model, switch to the next model
        if (this.modelAComplete && !this.modelBComplete) {
          // Switch to model B if model A is complete and model B isn't
          UIManager.showToast('تم استلام الأسئلة')
          this.questionManager.currentModelIndex = 1; // Model B
          this.questionManager.currentQuestionIndex = 0; // Reset to the first question of model B
          this.loadNextQuestion();
        } else if (this.modelBComplete && !this.modelAComplete) {
          UIManager.showToast('تم استلام الأسئلة')
          // Switch to model A if model B is complete and model A isn't
          this.questionManager.currentModelIndex = 0; // Model A
          this.questionManager.currentQuestionIndex = 0; // Reset to the first question of model A
          this.loadNextQuestion();
        } else {
          // If both models are complete, save answers and calculate the agreement
          this.questionManager.saveToLocalStorage();
          UIManager.showToast('تم استلام الأسئلة', () => {
            const percentage = this.questionManager.calculateAgreement();
            console.log('Calculated Agreement:', percentage);
            UIManager.renderAgreementPercentage(percentage); // Display the agreement percentage
          });
        }
      }
    }
  
    loadNextQuestion() {
      const question = this.questionManager.currentQuestion;
  
      // Only render a question if there is one available
      if (question && !this.questionManager.isComplete()) {
        const questionIndex = this.questionManager.currentQuestionIndex;
        UIManager.renderQuestion(question, questionIndex);
      } else {
        // If no questions are left, calculate and display the agreement percentage
        const percentage = this.questionManager.calculateAgreement();
        UIManager.renderAgreementPercentage(percentage);
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
  