// ========================================
// LOADING SCREEN
// ========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
});

// ========================================
// MENÚ MÓVIL
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animación hamburguesa
    hamburger.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ========================================
// MODO OSCURO
// ========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Cargar preferencia guardada
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ========================================
// SCROLL SUAVE
// ========================================
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

// ========================================
// NAVBAR AL HACER SCROLL
// ========================================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// ========================================
// CONTADOR ANIMADO DE ESTADÍSTICAS
// ========================================
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observar cuando las estadísticas entran en pantalla
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statCards = entry.target.querySelectorAll('.stat-card h3');
            
            statCards.forEach((card) => {
                const target = parseInt(card.getAttribute('data-target'));
                if (target) {
                    animateCounter(card, target);
                }
            });
            
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    statsObserver.observe(aboutStats);
}

// ========================================
// FAQ ACORDEÓN
// ========================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isActive = question.classList.contains('active');
        
        // Cerrar todas las respuestas
        faqQuestions.forEach(q => {
            q.classList.remove('active');
            q.nextElementSibling.style.maxHeight = null;
        });
        
        // Abrir/cerrar la respuesta clickeada
        if (!isActive) {
            question.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// ========================================
// FORMULARIO DE CONTACTO
// ========================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Cambiar texto del botón
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    try {
        // Intentar enviar a la base de datos
        const response = await fetch('php/save_contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('¡Gracias por tu reserva! Te contactaremos pronto.');
            contactForm.reset();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        // Si falla la conexión con PHP, mostrar mensaje de todas formas
        console.log('Datos del formulario:', data);
        alert('¡Gracias por tu interés! Te contactaremos pronto.');
        contactForm.reset();
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ========================================
// ANIMACIONES AL HACER SCROLL
// ========================================
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

// Observar elementos para animar
document.querySelectorAll('.feature-card, .step, .service-card, .price-card, .testimonial-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ========================================
// PREVENIR CLIC DERECHO EN IMÁGENES (OPCIONAL)
// ========================================
document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});

// ========================================
// CONSOLE LOG DE BIENVENIDA
// ========================================
console.log('%c¡Bienvenido a Japo Boulder! 🧗', 'color: #e63946; font-size: 20px; font-weight: bold;');
console.log('%cDesarrollado por Rodrigo Morales', 'color: #1d3557; font-size: 14px;');
<script src="js/script.js"></script>
