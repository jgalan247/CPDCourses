// AI Tools for Teachers - Main JavaScript

// Progress Management
function getProgress() {
    const defaultProgress = {
        module1: { started: false, activities: [], completed: false },
        module2: { started: false, activities: [], completed: false },
        module3: { started: false, activities: [], completed: false }
    };

    try {
        const saved = localStorage.getItem('cpd_progress');
        return saved ? JSON.parse(saved) : defaultProgress;
    } catch (e) {
        console.error('Error loading progress:', e);
        return defaultProgress;
    }
}

function saveProgress(progress) {
    try {
        localStorage.setItem('cpd_progress', JSON.stringify(progress));
        updateProgressDisplay();
    } catch (e) {
        console.error('Error saving progress:', e);
    }
}

function markActivityComplete(module, activityId) {
    const progress = getProgress();
    if (!progress[module].activities.includes(activityId)) {
        progress[module].activities.push(activityId);
    }
    progress[module].started = true;
    saveProgress(progress);
}

function markModuleComplete(module) {
    const progress = getProgress();
    progress[module].completed = true;
    progress[module].started = true;
    saveProgress(progress);
}

function isActivityComplete(module, activityId) {
    const progress = getProgress();
    return progress[module].activities.includes(activityId);
}

function calculateModuleProgress(module, totalActivities = 5) {
    const progress = getProgress();
    const completedActivities = progress[module].activities.length;
    return Math.round((completedActivities / totalActivities) * 100);
}

function updateProgressDisplay() {
    // Update individual module progress
    ['module1', 'module2', 'module3'].forEach(module => {
        const percentage = calculateModuleProgress(module);
        const progressBar = document.getElementById(`${module}-progress-bar`);
        const progressText = document.getElementById(`${module}-progress-text`);

        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${percentage}%`;
    });

    // Update overall progress
    const overall = Math.round((
        calculateModuleProgress('module1') +
        calculateModuleProgress('module2') +
        calculateModuleProgress('module3')
    ) / 3);

    const overallBar = document.getElementById('overall-progress-bar');
    const overallText = document.getElementById('overall-progress-text');

    if (overallBar) overallBar.style.width = `${overall}%`;
    if (overallText) overallText.textContent = `${overall}%`;
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
        localStorage.removeItem('cpd_progress');
        localStorage.removeItem('activity_responses');
        updateProgressDisplay();
        location.reload();
    }
}

// Activity Response Management
function saveActivityResponse(activityId, data) {
    try {
        const responses = JSON.parse(localStorage.getItem('activity_responses') || '{}');
        responses[activityId] = {
            data: data,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('activity_responses', JSON.stringify(responses));
    } catch (e) {
        console.error('Error saving activity response:', e);
    }
}

function getActivityResponse(activityId) {
    try {
        const responses = JSON.parse(localStorage.getItem('activity_responses') || '{}');
        return responses[activityId]?.data || null;
    } catch (e) {
        console.error('Error loading activity response:', e);
        return null;
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Scroll Progress Bar
function updateScrollProgress() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    }
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
}

// Intersection Observer for Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and sections
    document.querySelectorAll('.card-hover, .outcome-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Activity Completion Tracking
function setupActivityTracking() {
    // Track checkbox activities
    document.querySelectorAll('[data-activity-checkbox]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const activityId = this.dataset.activityId;
            const module = this.dataset.module;

            if (this.checked) {
                markActivityComplete(module, activityId);
            }
        });
    });
}

// Load saved responses on page load
function loadSavedResponses() {
    // Load text area responses
    document.querySelectorAll('textarea[data-activity-id]').forEach(textarea => {
        const activityId = textarea.dataset.activityId;
        const savedData = getActivityResponse(activityId);
        if (savedData && savedData.response) {
            textarea.value = savedData.response;
        }
    });

    // Load checkbox states
    document.querySelectorAll('input[type="checkbox"][data-activity-id]').forEach(checkbox => {
        const activityId = checkbox.dataset.activityId;
        if (isActivityComplete(checkbox.dataset.module, activityId)) {
            checkbox.checked = true;
        }
    });

    // Load radio button states
    document.querySelectorAll('input[type="radio"][data-activity-id]').forEach(radio => {
        const activityId = radio.dataset.activityId;
        const savedData = getActivityResponse(activityId);
        if (savedData && savedData.selection === radio.value) {
            radio.checked = true;
        }
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 z-50 ${
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Export functions for global use
window.CPD = {
    getProgress,
    saveProgress,
    markActivityComplete,
    markModuleComplete,
    isActivityComplete,
    calculateModuleProgress,
    updateProgressDisplay,
    resetProgress,
    saveActivityResponse,
    getActivityResponse,
    showNotification
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    updateProgressDisplay();
    initSmoothScroll();
    initAnimations();
    setupActivityTracking();
    loadSavedResponses();

    // Update scroll progress on scroll
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    console.log('✅ AI Tools for Teachers - Initialized');
});
