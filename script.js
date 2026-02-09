// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Add shadow to nav on scroll
    const nav = document.querySelector('.nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Dashboard modal functions
function openDashboard(type) {
    const modal = document.getElementById('dashboardModal');
    const frame = document.getElementById('dashboardFrame');
    
    // Sample Power BI embed URLs (replace with your actual embed URLs)
    const dashboards = {
        sales: 'https://app.powerbi.com/view?r=sample_sales_dashboard',
        financial: 'https://app.powerbi.com/view?r=sample_financial_dashboard',
        customer: 'https://app.powerbi.com/view?r=sample_customer_dashboard',
        operations: 'https://app.powerbi.com/view?r=sample_operations_dashboard'
    };
    
    // For demo purposes, show a placeholder
    frame.innerHTML = `
        <div style="background: #1a1a1a; padding: 3rem; border-radius: 8px; text-align: center;">
            <h2 style="color: #00d4ff; margin-bottom: 1rem;">${type.charAt(0).toUpperCase() + type.slice(1)} Dashboard</h2>
            <p style="color: #b0b0b0; margin-bottom: 2rem;">
                To embed your actual Power BI dashboard:
            </p>
            <ol style="color: #808080; text-align: left; max-width: 600px; margin: 0 auto; line-height: 2;">
                <li>Open your dashboard in Power BI Service</li>
                <li>Click "File" → "Embed" → "Publish to web"</li>
                <li>Copy the iframe embed code</li>
                <li>Replace the placeholder in script.js with your embed URL</li>
            </ol>
            <p style="color: #00d4ff; margin-top: 2rem; font-size: 0.9rem;">
                For now, this is a placeholder. Your actual dashboard will appear here.
            </p>
        </div>
    `;
    
    // To use actual Power BI embed, uncomment this:
    // frame.innerHTML = `<iframe src="${dashboards[type]}" frameborder="0" allowFullScreen="true"></iframe>`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDashboard() {
    const modal = document.getElementById('dashboardModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDashboard();
    }
});

// Close modal on background click
document.getElementById('dashboardModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'dashboardModal') {
        closeDashboard();
    }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
        
        // To integrate with a real service (like Formspree):
        // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // });
        
        console.log('Form submitted:', formData);
    });
}

// Theme toggle (optional future feature)
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Future: implement light/dark theme toggle
        alert('Theme toggle feature - coming soon!');
    });
}

// Skill bars animation on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.getElementById('about');
if (skillsSection) {
    observer.observe(skillsSection);
}

// Animate elements on scroll
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Apply to cards
document.querySelectorAll('.project-card, .dashboard-card, .testimonial-card, .blog-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(card);
});

console.log('Portfolio loaded! 🚀');
console.log('Theme: Dark Mode');
console.log('Features: Power BI Dashboards, Testimonials, Blog, Contact Form');
// ========================================
// AI Chat Assistant Implementation
// ========================================

// Configuration
const API_CONFIG = {
    // For development: Use localhost
    // For production: Set your edge server URL
    baseURL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000'
        : 'https://your-edge-server.com/api', // Update this for production
    endpoints: {
        chat: '/v1/chat/completions',
        health: '/health'
    }
};

// Chat state
const chatState = {
    messages: [],
    isConnected: false,
    isTyping: false
};

// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const clearChatBtn = document.getElementById('clearChatBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

// Initialize chat
async function initializeChat() {
    console.log('Initializing AI Chat...');
    
    // Check API health
    await checkAPIHealth();
    
    // Setup event listeners
    setupEventListeners();
    
    // Auto-resize textarea
    setupTextareaAutoResize();
}

// Check API health
async function checkAPIHealth() {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.health}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            chatState.isConnected = true;
            updateStatus('online', `Connected to ${data.model}`);
            console.log('API Health:', data);
        } else {
            throw new Error('API not responding');
        }
    } catch (error) {
        console.error('API Health Check Failed:', error);
        chatState.isConnected = false;
        updateStatus('offline', 'API Offline - Using Demo Mode');
        showDemoModeMessage();
    }
}

// Update connection status
function updateStatus(status, text) {
    statusIndicator.className = `status-indicator ${status}`;
    statusText.textContent = text;
}

// Setup event listeners
function setupEventListeners() {
    // Send button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Enter key to send (Shift+Enter for new line)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Clear chat button
    clearChatBtn.addEventListener('click', clearChat);
    
    // Suggested prompt buttons
    document.querySelectorAll('.prompt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.getAttribute('data-prompt');
            chatInput.value = prompt;
            sendMessage();
        });
    });
}

// Setup textarea auto-resize
function setupTextareaAutoResize() {
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
}

// Send message
async function sendMessage() {
    const message = chatInput.value.trim();
    
    if (!message || chatState.isTyping) return;
    
    // Clear input
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Remove welcome message if present
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    // Add user message to chat
    addMessage('user', message);
    
    // Add to state
    chatState.messages.push({ role: 'user', content: message });
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get AI response
    if (chatState.isConnected) {
        await getAIResponse(message);
    } else {
        // Demo mode response
        await getDemoResponse(message);
    }
    
    // Hide typing indicator
    hideTypingIndicator();
}

// Get AI response from API
async function getAIResponse(userMessage) {
    try {
        const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.chat}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: chatState.messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const assistantMessage = data.message.content;
        
        // Add assistant message to chat
        addMessage('assistant', assistantMessage);
        
        // Add to state
        chatState.messages.push({ role: 'assistant', content: assistantMessage });
        
    } catch (error) {
        console.error('Error getting AI response:', error);
        addMessage('assistant', '⚠️ Sorry, I encountered an error. The API might be unavailable. Please check if the FastAPI service is running on your edge server.');
    }
}

// Demo mode response (when API is offline)
async function getDemoResponse(userMessage) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoResponses = {
        'skills': "I'm a developer with expertise in JavaScript, HTML & CSS, React, Node.js, and Git. I've also built this AI chat interface using FastAPI and modern LLM integration!",
        'projects': "I've worked on various projects including this portfolio website with an integrated AI assistant. The AI backend is powered by a FastAPI microservice running on an edge server with Ollama for local LLM hosting.",
        'ai': "This AI assistant is powered by a FastAPI microservice that I built. It uses OpenAI-compatible endpoints and can connect to Ollama or other LLM backends. The service runs on edge servers for better privacy and control.",
        'default': "This is demo mode! To enable full AI capabilities, make sure the FastAPI microservice is running. Check out the API documentation for deployment instructions. You can ask me about my skills, projects, or how this AI system works!"
    };
    
    let response = demoResponses.default;
    
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('skill') || lowerMessage.includes('experience')) {
        response = demoResponses.skills;
    } else if (lowerMessage.includes('project')) {
        response = demoResponses.projects;
    } else if (lowerMessage.includes('ai') || lowerMessage.includes('work') || lowerMessage.includes('assistant')) {
        response = demoResponses.ai;
    }
    
    addMessage('assistant', response);
    chatState.messages.push({ role: 'assistant', content: response });
}

// Add message to chat UI
function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageContent.appendChild(messageTime);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    chatState.isTyping = true;
    sendBtn.disabled = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typingIndicator';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';
    
    const typingContent = document.createElement('div');
    typingContent.className = 'typing-indicator';
    typingContent.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    typingDiv.appendChild(avatar);
    typingDiv.appendChild(typingContent);
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
    chatState.isTyping = false;
    sendBtn.disabled = false;
}

// Clear chat
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatState.messages = [];
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">🤖</div>
                <h3>Welcome back!</h3>
                <p>Chat history cleared. Start a new conversation!</p>
                <div class="suggested-prompts">
                    <button class="prompt-btn" data-prompt="Tell me about your skills and experience">About your skills</button>
                    <button class="prompt-btn" data-prompt="What projects have you worked on?">Your projects</button>
                    <button class="prompt-btn" data-prompt="Explain how this AI assistant works">How does this work?</button>
                </div>
            </div>
        `;
        
        // Re-attach event listeners to new prompt buttons
        document.querySelectorAll('.prompt-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                chatInput.value = prompt;
                sendMessage();
            });
        });
    }
}

// Show demo mode message
function showDemoModeMessage() {
    const demoMessage = document.createElement('div');
    demoMessage.className = 'error-message';
    demoMessage.innerHTML = `
        <strong>📡 Demo Mode Active</strong><br>
        The FastAPI service is not running. Chat will work in demo mode with pre-configured responses.
        To enable full AI capabilities, start the API server: <code>python api/main.py</code>
    `;
    
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.insertAdjacentElement('afterend', demoMessage);
    }
}

// Initialize chat when DOM is loaded
if (document.getElementById('chatMessages')) {
    document.addEventListener('DOMContentLoaded', initializeChat);
    console.log('AI Chat Assistant module loaded ✅');
}

