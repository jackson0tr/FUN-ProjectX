class ModelA {
  constructor(questions) {
    this.questions = questions.map(question => ({ question, answer: null }));
  }

  processAnswer(index, answer) {
    if (index >= 0 && index < this.questions.length) {
      this.questions[index].answer = answer;
    } else {
      console.error(`Index ${index} is out of bounds for ModelA`);
    }
  }
}

class ModelB {
  constructor(questions) {
    this.questions = questions.map(question => ({ question, answer: null }));
  }

  processAnswer(index, answer) {
    if (index >= 0 && index < this.questions.length) {
      this.questions[index].answer = answer;
    } else {
      console.error(`Index ${index} is out of bounds for ModelB`);
    }
  }
}

function checkResults(modelA, modelB) {
  let result = '';
  let points = 0;
  const totalQuestions = Math.max(modelA.questions.length, modelB.questions.length);
  let questionsWithAnswers = [];

  for (let i = 0; i < totalQuestions; i++) {
    const answerA = modelA.questions[i]?.answer;
    const answerB = modelB.questions[i]?.answer;

    if (answerA === undefined || answerB === undefined) {
      continue;
    }

    questionsWithAnswers.push({
      question: modelA.questions[i]?.question || modelB.questions[i]?.question,
      answerA: answerA,
      answerB: answerB
    });

    if (answerA === 'نعم' && answerB === 'لا') {
      result = 'نعم';
      points++;
    } else if (answerA === 'نعم' && answerB === 'نعم') {
      result = 'نعم';
      points++;
    } else if (answerA === 'لا' && answerB === 'لا') {
      result = 'نعم';
      points++;
    } else if (answerA === 'لا' && answerB === 'نعم') {
      result = 'لا';
    }
  }

  return { result, points, questionsWithAnswers };
}

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const modelA = new ModelA(data.modelA);
    const modelB = new ModelB(data.modelB);

    let currentModel = null;
    let currentQuestionIndex = 0;

    function startModel(gender) {
      const formContainer = document.getElementById('formContainer');
      formContainer.innerHTML = '';

      if (gender === 'male') {
        currentModel = modelA;
      } else {
        currentModel = modelB;
      }

      loadNextQuestion();
    }

    function loadNextQuestion() {
      const formContainer = document.getElementById('formContainer');
      const currentQuestion = currentModel.questions[currentQuestionIndex];

      if (!currentQuestion) {
        const { result, points, questionsWithAnswers } = checkResults(modelA, modelB);

        formContainer.innerHTML = `
          <h2>النتيجة: ${result}</h2>
          <p>إجمالي النقاط: ${points}</p>
          <h3>تفاصيل الأسئلة والإجابات:</h3>
          <ul>
            ${questionsWithAnswers.map(q => `
              <li>
                <p><strong>السؤال:</strong> ${q.question}</p>
                <p><strong>إجابة A:</strong> ${q.answerA}</p>
                <p><strong>إجابة B:</strong> ${q.answerB}</p>
              </li>
            `).join('')}
          </ul>
        `;
        return;
      }

      formContainer.innerHTML = `
        <h2>السؤال ${currentQuestionIndex + 1}</h2>
        <p class="question">${currentQuestion.question}</p>
        <div class="btn-container">
          <button id="yesButton">نعم</button>
          <button id="noButton">لا</button>
        </div>
      `;

      document.getElementById('yesButton').addEventListener('click', () => answerQuestion('نعم'));
      document.getElementById('noButton').addEventListener('click', () => answerQuestion('لا'));
    }

    function answerQuestion(answer) {
      currentModel.processAnswer(currentQuestionIndex, answer);
      currentQuestionIndex++;
      loadNextQuestion();
    }

    function handleGenderSelection(gender) {
      startModel(gender);
    }

    document.getElementById('maleButton').addEventListener('click', () => handleGenderSelection('male'));
    document.getElementById('femaleButton').addEventListener('click', () => handleGenderSelection('female'));
  })
  .catch(error => console.error('Error loading the JSON data:', error));
