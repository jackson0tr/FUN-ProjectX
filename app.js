class QuestionManager {
  constructor(questions, sessionId = null) {
    this.questions = questions;
    this.models = Object.keys(questions);
    this.currentModelIndex = 0;
    this.currentQuestionIndex = 0;
    this.answers = [];
    this.sessionId = sessionId || this.generateSessionId();
  }

  setModelsForGender(gender) {
    this.models = gender === 'male' ? ['modelA'] : ['modelB'];
    this.currentModelIndex = 0;
    this.currentQuestionIndex = 0;
  }

  generateSessionId() {
    return `session-${Math.random().toString(36).substr(2, 9)}`;
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
      sessionId: this.sessionId,
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

  getStoredAnswers() {
    const storedAnswers = JSON.parse(localStorage.getItem('answers')) || [];
    const sessionAnswers = storedAnswers.filter(answer => answer.sessionId === this.sessionId);
    console.log("Stored answers:", storedAnswers);
    console.log("Session answers:", sessionAnswers);
    return sessionAnswers;
  }

  calculateAgreement(sessionId) {
    // const answersFromLocalStorage = JSON.parse(localStorage.getItem('answers')) || [];
    const answersFromLocalStorage = this.getStoredAnswers();
    console.log("Answers from localStorage:", answersFromLocalStorage);
    const modelAAnswers = answersFromLocalStorage.filter(answer => answer.model === 'modelA' && answer.sessionId === sessionId);
    const modelBAnswers = answersFromLocalStorage.filter(answer => answer.model === 'modelB' && answer.sessionId === sessionId);


    if (modelAAnswers.length !== modelBAnswers.length) {
      console.log('Model A and Model B answer lengths do not match');
    }

    // console.log("Answers in localStorage:", localStorage.getItem('answers'));
    console.log("answersFromLocalStorage:", answersFromLocalStorage);
    console.log("Model A Answers:", modelAAnswers);
    console.log("Model B Answers:", modelBAnswers);

    let totalPoints = 0;
    console.log("Total Points:", totalPoints);

    for (let i = 0; i < modelAAnswers.length; i++) {
      const aAnswer = modelAAnswers[i].answer;
      const bAnswer = modelBAnswers[i]?.answer;

      console.log(`Comparing answers for index ${i}: modelA answer = ${aAnswer}, modelB answer = ${bAnswer}`);

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

  static notify(message) {
    alert(message);
  }

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
      <h1>
      <a href="profile.html" class="back-to-profile">العودة الي الملف الشخصي</a>
      </h1>
      <div>
    `;
  }

  static renderCopyUrl() {
    const formContainer = document.getElementById('formContainer');
    formContainer.innerHTML = `
      <h1>في انتظار الطرف الأخر</h1>
      <h1 id="copyUrlButton" class="back-to-profile">نسخ رابط السؤال</h1>
      <h1>
      <a href="profile.html" class="back-to-profile">العودة الي الملف الشخصي</a>
      </h1>
      <div>
    `;

    const copyButton = document.getElementById('copyUrlButton');
    if (copyButton) {
      copyButton.addEventListener('click', () => {
        window.app.copyUrl();
        console.log(app);
      });
    }
  }

  static toggleForms() {
    const signUpButton = document.getElementById('showSignUp');
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');

    if (signUpButton) {
      signUpButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginForm && signUpForm) {
          loginForm.style.display = 'none';
          signUpForm.style.display = 'block';
        }
      });
    }
  }

}

class App {
  constructor(questionManager) {
    this.questionManager = questionManager;
    this.userGender = null;
    this.modelAComplete = false;
    this.modelBComplete = false;
    this.isLoggedIn = localStorage.getItem('accessToken') !== null;
    this.userEmail = null;
    this.sessionId = new URLSearchParams(window.location.search).get('sessionId');
    // this.questionManager.sessionId = this.sessionId;
  }


  setGender(gender) {
    this.userGender = gender;
    this.questionManager.setModelsForGender(gender);
    this.loadNextQuestion();

  }

  start() {
    console.log("Starting app...");
    if (this.sessionId) {
      this.questionManager.sessionId = this.sessionId;
      console.log("Session ID found:", this.sessionId);
      this.loadSessionQuestions();
    } else {
      if (this.isLoggedIn) {
        console.log("User already logged in, proceeding to profile.");
        UIManager.renderGenderSelection();
      } else {
        console.log("User not logged in, show login/signup form.");
      }
    }
  }

  loadSessionQuestions() {
    const urlParams = new URLSearchParams(window.location.search);
    const senderGender = urlParams.get('senderGender');
    if (senderGender) {
      this.questionManager.setModelsForGender(senderGender === 'male' ? 'female' : 'male');
    } else {
      console.error('Sender gender is missing in URL parameters.');
    }
    const answersFromUrl = this.extractAnswersFromUrl(urlParams);
    this.storeAnswersInLocalStorage(answersFromUrl);
    this.loadNextQuestion();
  }

  extractAnswersFromUrl(urlParams) {
    const answers = [];
    this.questionManager.models.forEach(model => {
      if (this.questionManager.questions[model]) {
        const modelAnswers = urlParams.get(model)?.split(',');
        if (modelAnswers) {
          modelAnswers.forEach((answer, index) => {
            answers.push({
              model,
              questionIndex: index,
              answer: answer === 'true',
            });
          });
        }
      } else {
        console.error(`Model ${model} does not exist in questions.`);
      }
    });
    return answers;
  }

  storeAnswersInLocalStorage(answers) {
    const storedAnswers = JSON.parse(localStorage.getItem('answers')) || [];
    localStorage.setItem('answers', JSON.stringify([...storedAnswers, ...answers]));

  }

  generateModelLink() {
    const queryParams = new URLSearchParams();
    queryParams.set("sessionId", this.questionManager.sessionId);
    queryParams.set("senderGender", this.userGender);

    this.questionManager.answers.forEach((answer) => {
      const encryptedAnswer = btoa(answer.answer);
      // const encryptedQuestionIndex = btoa(answer.questionIndex);
      // queryParams.set(`${answer.model}-${encryptedQuestionIndex}`, encryptedAnswer);
      queryParams.set(`${answer.model}-${answer.questionIndex}`, encryptedAnswer);
    });

    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?${queryParams.toString()}`;

    return link;
  }

  completeModel() {
    if (this.questionManager.isComplete()) {
      this.questionManager.saveToLocalStorage();

      if (this.userGender === 'male') {
        this.modelAComplete = true;
      } else {
        this.modelBComplete = true;
      }

      if (this.modelAComplete && this.modelBComplete) {
        const percentage = this.questionManager.calculateAgreement();
        UIManager.notify(`Agreement calculated: ${percentage}%`);
        UIManager.renderAgreementPercentage(percentage);
      } else {
        UIManager.renderCopyUrl(this.generateModelLink());
      }
    } else {
      UIManager.renderCopyUrl(this.generateModelLink());
    }
  }

  copyUrl() {
    const url = this.generateModelLink();
    navigator.clipboard.writeText(url).then(() => {
      UIManager.showToast('تم نسخ الرابط بنجاح!');
    }).catch(err => {
      alert('فشل في نسخ الرابط!');
    });
  }

  handleLoginSuccess(user) {
    this.isLoggedIn = true;
    this.userEmail = user.email;
    const token = this.generateAccessToken(user);
    console.log("Token saved to localStorage");
    console.log("handle Login Success")
    UIManager.showToast('تسجيل دخول ناجح', () => {
      this.start();
    });
  }

  generateAccessToken(user) {
    const token = btoa(user.email + ":" + new Date().getTime());
    console.log("Generated token:", token);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem('accessToken', token);
      console.log("Stored Token:", localStorage.getItem('accessToken'));
      console.log("LocalStorage Generated");
      console.log(localStorage.getItem('accessToken'));
    } else {
      console.error("localStorage is not supported in this environment.");
    }
    setTimeout(() => localStorage.removeItem('accessToken'), 30 * 24 * 60 * 60 * 1000);
    return token;
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.isLoggedIn = false;
    window.location.href = "index.html";
  }

  answer(value) {
    this.questionManager.saveAnswer(value);
    this.questionManager.nextQuestion();
    this.loadNextQuestion();
  }

  loadNextQuestion() {
    const question = this.questionManager.currentQuestion;
    const questionIndex = this.questionManager.currentQuestionIndex;

    if (question) {
      UIManager.renderQuestion(question, questionIndex);
    } else {
      this.questionManager.saveToLocalStorage();
      if (this.sessionId) {
        console.log("sessionId", this.sessionId);
        const percentage = this.questionManager.calculateAgreement(this.sessionId);
        console.log("PERCENTAGE", percentage);
        if (percentage !== null) {
          UIManager.renderAgreementPercentage(percentage);
        } else {
          UIManager.renderCopyUrl(this.questionManager.sessionId);
        }
      } else {
        UIManager.renderCopyUrl(this.questionManager.sessionId);
      }
    }
  }

  clearLocalStorage() {
    localStorage.removeItem('answers');
    console.log('Local storage cleared');
  }

  redirectToProfile() {
    window.location.href = "profile.html";
  }

}

fetch('data.json')
  .then((response) => response.json())
  .then((data) => {
    const questionManager = new QuestionManager(data);
    const app = new App(questionManager);
    window.app = app;
    app.start();

    UIManager.toggleForms();
  })
  .catch((error) => console.error('Error loading questions:', error));

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1XuwIjJXCPZZwbYftHMQRNTidgIHLlCM",
  authDomain: "engage-a9f91.firebaseapp.com",
  projectId: "engage-a9f91",
  storageBucket: "engage-a9f91.firebasestorage.app",
  messagingSenderId: "205051675032",
  appId: "1:205051675032:web:50014729792af97bec6bed",
  measurementId: "G-L6CV0B4741"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();

const googleLogin = document.getElementById("google-login-btn");
if (googleLogin) {
  googleLogin.addEventListener("click", async function () {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      console.log("USER:", user);
      window.app.handleLoginSuccess(user);
      console.log("Login successful!");
    } catch (error) {
      console.error("Error during Google login:", error);
      alert(`Login failed: ${error.message}`);
    }
  });
} else {
  console.error("Google login button not found in the DOM.");
}