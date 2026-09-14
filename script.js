const GITHUB_USERNAME = 'g3edes';
const API_BASE_URL = 'https://api.github.com';

const featuredProjects = [
    'journey-tcc',
    'pokemon-go-api',
    'planify',
    'api_jest',
    'bmi_kotlin_ab',
    'alpha_corp'
];

const projectEmojis = {
    'journey-tcc': '🌐',
    'pokemon-go-api': '🎮',
    'planify': '📅',
    'api_jest': '🧪',
    'bmi_kotlin_ab': '⚖️',
    'alpha_corp': '🔬'
};

const projectCategories = {
    'pokemon-go-api': { pt: 'Frontend', en: 'Frontend' },
    'planify': { pt: 'Frontend', en: 'Frontend' },
    'journey-tcc': { pt: 'Full Stack', en: 'Full Stack' },
    'api_jest': { pt: 'Backend', en: 'Backend' },
    'bmi_kotlin_ab': { pt: 'Mobile', en: 'Mobile' },
    'alpha_corp': { pt: 'IoT/Python', en: 'IoT/Python' },
};

let currentLanguage = localStorage.getItem('language') || 'pt';

document.addEventListener('DOMContentLoaded', () => {
    setLanguage(currentLanguage);
    initLanguageSwitcher();
    initMobileMenu();
    loadProjects();
    initFormHandler();
    initScrollAnimations();
});

function initLanguageSwitcher() {
    const langBtns = document.querySelectorAll('.lang-btn');

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
            localStorage.setItem('language', lang);
        });
    });
}

function setLanguage(lang) {
    currentLanguage = lang;

    // Update lang attribute
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';

    // Update all elements with data-pt and data-en
    document.querySelectorAll('[data-pt][data-en]').forEach(el => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = lang === 'en' ? el.getAttribute('data-en-placeholder') : el.getAttribute('data-pt-placeholder');
        } else {
            el.textContent = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-pt');
        }
    });

    // Update lang button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

async function loadProjects() {
    const workGrid = document.getElementById('workGrid');

    try {
        const response = await fetch(`${API_BASE_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        const data = await response.json();

        const projects = data
            .filter(repo => !repo.fork && repo.language && featuredProjects.includes(repo.name.toLowerCase()))
            .map(repo => ({
                id: repo.id,
                name: repo.name,
                description: repo.description || (currentLanguage === 'en' ? 'A creative digital project' : 'Um projeto digital criativo'),
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                url: repo.html_url,
                homepage: repo.homepage,
                updated: new Date(repo.updated_at),
                category: projectCategories[repo.name.toLowerCase()] || { pt: 'Projeto', en: 'Project' },
            }))
            .sort((a, b) => b.updated - a.updated);

        workGrid.innerHTML = '';

        if (projects.length === 0) {
            const loadingText = currentLanguage === 'en' ? 'Loading projects...' : 'Carregando projetos...';
            workGrid.innerHTML = `<div class="work-loading">${loadingText}</div>`;
            return;
        }

        projects.forEach((project, index) => {
            const card = createProjectCard(project);
            card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
            workGrid.appendChild(card);
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);

    } catch (error) {
        console.error('Error loading projects:', error);
        const errorText = currentLanguage === 'en' ? 'Error loading projects. Check GitHub API.' : 'Erro ao carregar projetos. Verifique GitHub API.';
        workGrid.innerHTML = `<div class="work-loading">${errorText}</div>`;
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'work-card';

    const emoji = projectEmojis[project.name.toLowerCase()] || '📦';
    const category = typeof project.category === 'object'
        ? project.category[currentLanguage]
        : project.category;
    const demoText = currentLanguage === 'en' ? 'Live Demo' : 'Demonstração';
    const githubText = currentLanguage === 'en' ? 'GitHub' : 'GitHub';

    card.innerHTML = `
        <div class="work-image">${emoji}</div>
        <div class="work-content">
            <h3 class="work-title">${escapeHtml(project.name)}</h3>
            <p class="work-description">${escapeHtml(project.description.substring(0, 100))}${project.description.length > 100 ? '...' : ''}</p>
            <div class="work-tech">
                <span class="tech-tag">${project.language}</span>
                <span class="tech-tag">${category}</span>
            </div>
            <div class="work-links">
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="work-link">${githubText}</a>
                ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener noreferrer" class="work-link">${demoText}</a>` : ''}
            </div>
        </div>
    `;

    return card;
}

function initFormHandler() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        const subject = currentLanguage === 'en' ? 'Contact from Portfolio' : 'Contato do Portfólio';
        const mailtoLink = `mailto:gsilvaguedes4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

        window.location.href = mailtoLink;
        form.reset();
    });
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.about-card, .skill-column, .contact-method').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
