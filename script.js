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