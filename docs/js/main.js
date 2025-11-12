// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Progress tracking (saves to localStorage)
const PROGRESS_KEY = 'cpd_progress';

function getProgress() {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {
        module1: { started: false, completed: false, activities: [] },
        module2: { started: false, completed: false, activities: [] },
        module3: { started: false, completed: false, activities: [] }
    };
}

function saveProgress(progress) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function markActivityComplete(module, activityId) {
    const progress = getProgress();
    if (!progress[module].activities.includes(activityId)) {
        progress[module].activities.push(activityId);
    }
    progress[module].started = true;
    saveProgress(progress);
    updateProgressUI();
}

function markModuleComplete(module) {
    const progress = getProgress();
    progress[module].completed = true;
    saveProgress(progress);
    updateProgressUI();
}

function updateProgressUI() {
    // This will be expanded in module pages
    const progress = getProgress();
    console.log('Progress updated:', progress);
}

// Interactive quiz/activity handler
function createInteractiveQuiz(quizData) {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    let currentQuestion = 0;
    let score = 0;

    function renderQuestion() {
        const question = quizData[currentQuestion];
        quizContainer.innerHTML = `
            <div class="quiz-question">
                <h3>Question ${currentQuestion + 1} of ${quizData.length}</h3>
                <p>${question.question}</p>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" data-index="${index}">
                            ${option}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.querySelectorAll('.quiz-option').forEach(button => {
            button.addEventListener('click', (e) => {
                const selectedIndex = parseInt(e.target.dataset.index);
                checkAnswer(selectedIndex, question.correct);
            });
        });
    }

    function checkAnswer(selected, correct) {
        if (selected === correct) {
            score++;
            showFeedback(true);
        } else {
            showFeedback(false);
        }

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                renderQuestion();
            } else {
                showResults();
            }
        }, 1500);
    }

    function showFeedback(isCorrect) {
        const feedback = document.createElement('div');
        feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.textContent = isCorrect ? '✓ Correct!' : '✗ Incorrect';
        quizContainer.appendChild(feedback);
    }

    function showResults() {
        quizContainer.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <p>You scored ${score} out of ${quizData.length}</p>
                <button class="btn btn-primary" onclick="location.reload()">Retake Quiz</button>
            </div>
        `;
    }

    renderQuestion();
}

// Activity timer
function startTimer(duration, displayElement) {
    let timer = duration;
    let minutes, seconds;

    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        displayElement.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            displayElement.textContent = "Time's up!";
            playSound('complete');
        }
    }, 1000);

    return interval;
}

// Sound effects (optional)
function playSound(type) {
    // Can be expanded with actual audio files
    console.log(`Playing ${type} sound`);
}

// Expandable sections
document.addEventListener('DOMContentLoaded', () => {
    const expandables = document.querySelectorAll('.expandable-trigger');
    expandables.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const isExpanded = content.style.display === 'block';
            content.style.display = isExpanded ? 'none' : 'block';
            trigger.classList.toggle('expanded');
        });
    });
});

// Form validation for activities
function validateActivityForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Save activity responses to localStorage
function saveActivityResponse(activityId, data) {
    const responses = JSON.parse(localStorage.getItem('activity_responses') || '{}');
    responses[activityId] = {
        data: data,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('activity_responses', JSON.stringify(responses));
}

// Retrieve saved responses
function getActivityResponse(activityId) {
    const responses = JSON.parse(localStorage.getItem('activity_responses') || '{}');
    return responses[activityId] || null;
}

// Progress indicator for module pages
window.addEventListener('scroll', () => {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    }
});

// Export functions for use in module pages
window.CPD = {
    markActivityComplete,
    markModuleComplete,
    getProgress,
    createInteractiveQuiz,
    startTimer,
    validateActivityForm,
    saveActivityResponse,
    getActivityResponse
};

console.log('CPD Course JavaScript loaded successfully');
