// DOM Elements
const loadingScreen = document.querySelector('.loading-screen');
const scrollProgress = document.querySelector('.scroll-progress');
const navbar = document.querySelector('.navbar');
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioGrid = document.getElementById('portfolioGrid');
const modal = document.getElementById('portfolioModal');
const modalClose = document.querySelector('.close');
const contactForm = document.getElementById('contactForm');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const skillBars = document.querySelectorAll('.skill-progress');

// Portfolio Data (will be loaded from server)
let portfolioData = [];
let currentFilter = 'all';
let currentTestimonial = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);

    loadPortfolioData();
    initializeEventListeners();
    animateOnScroll();
    startTestimonialSlider();
});

// Load Portfolio Data
async function loadPortfolioData() {
    try {
        const response = await fetch('/api/portfolio');
        portfolioData = await response.json();
        renderPortfolio();
    } catch (error) {
        console.error('Error loading portfolio data:', error);
        // Fallback data
        portfolioData = [
            {
                id: 1,
                title: 'Brand Identity Design',
                category: 'branding',
                image: 'https://via.placeholder.com/400x300/1a1a2e/16213e?text=Brand+Identity',
                description: 'Complete brand identity package including logo, color scheme, and brand guidelines.'
            },
            {
                id: 2,
                title: 'Social Media Campaign',
                category: 'social',
                image: 'https://via.placeholder.com/400x300/1a1a2e/16213e?text=Social+Media',
                description: 'Engaging social media graphics for a product launch campaign.'
            },
            {
                id: 3,
                title: 'Logo Design',
                category: 'logo',
                image: 'https://via.placeholder.com/400x300/1a1a2e/16213e?text=Logo',
                description: 'Modern and minimalist logo design for a tech startup.'
            },
            {
                id: 4,
                title: 'Banner Advertisement',
                category: 'banner',
                image: 'https://via.placeholder.com/400x300/1a1a2e/16213e?text=Banner',
                description: 'Eye-catching banner design for digital advertising campaign.'
            },
            {
                id: 5,
                title: 'Corporate Branding',
                category: 'branding',
                image: 'https://via.placeholder.com/400x300/1a1a2e/16213e?text=Corporate',
                description: 'Professional branding package for a corporate client.'
            },
            {
                id: 6,
                title: 'Product Logo',
                category: 'logo',
                image: 'https://via.placeholder.com/400x300/1a1a2e/16213e?text=Product',
                description: 'Creative logo design for a new product line.'
            }
        ];
        renderPortfolio();
    }
}

// Render Portfolio
function renderPortfolio() {
    const filteredData = currentFilter === 'all' 
        ? portfolioData 
        : portfolioData.filter(item => item.category === currentFilter);

    portfolioGrid.innerHTML = filteredData.map(item => `
        <div class="portfolio-item" data-id="${item.id}" data-category="${item.category}">
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <span class="portfolio-category">${item.category}</span>
            </div>
        </div>
    `).join('');

    // Add click events to portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            const portfolioItem = portfolioData.find(p => p.id === id);
            openPortfolioModal(portfolioItem);
        });
    });
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Mobile Navigation
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offset = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Portfolio Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderPortfolio();
        });
    });

    // Modal
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Contact Form
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                showNotification('Error sending message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error sending message. Please try again.', 'error');
        }
    });

    // Testimonial Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToTestimonial(index);
        });
    });

    // Scroll Events
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        updateNavbar();
        animateOnScroll();
    });
}

// Scroll Progress
function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
}

// Update Navbar on Scroll
function updateNavbar() {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.8)';
        navbar.style.boxShadow = 'none';
    }
}

// Portfolio Modal
function openPortfolioModal(item) {
    document.getElementById('modalImage').src = item.image;
    document.getElementById('modalTitle').textContent = item.title;
    document.getElementById('modalDescription').textContent = item.description;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Testimonial Slider
function startTestimonialSlider() {
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        goToTestimonial(currentTestimonial);
    }, 5000);
}

function goToTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
    currentTestimonial = index;
}

// Animate on Scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .skill-item, .tool-icon, .contact-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });

    // Animate skill bars when in view
    skillBars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const skill = bar.dataset.skill;
            bar.style.width = skill + '%';
        }
    });
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: linear-gradient(135deg, #10b981, #059669);' : 'background: linear-gradient(135deg, #ef4444, #dc2626);'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Intersection Observer for animations
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .skill-item, .tool-icon, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Smooth reveal for sections
const revealSections = document.querySelectorAll('section');
const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, revealOptions);

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease';
    sectionObserver.observe(section);
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Dynamic year in footer
document.addEventListener('DOMContentLoaded', () => {
    const year = new Date().getFullYear();
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        footerText.innerHTML = `&copy; ${year} Ismail. All rights reserved.`;
    }
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 2000);
    }
});

// Mouse move effect for cards
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.service-card, .portfolio-item');
    
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 30;
        const angleY = (centerX - x) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    });
});

// Reset card transform on mouse leave
document.addEventListener('mouseleave', () => {
    const cards = document.querySelectorAll('.service-card, .portfolio-item');
    cards.forEach(card => {
        card.style.transform = '';
    });
});
