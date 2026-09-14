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
    'pokemon-go-api': 'Frontend',
    'planify': 'Frontend',
    'journey-tcc': 'Full Stack',
    'api_jest': 'Backend',
    'bmi_kotlin_ab': 'Mobile',
    'alpha_corp': 'IoT/Python',
};

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    loadProjects();
    initFormHandler();
    initScrollAnimations();
});

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
                description: repo.description || 'A creative digital project',
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                url: repo.html_url,
                homepage: repo.homepage,
                updated: new Date(repo.updated_at),
                category: projectCategories[repo.name.toLowerCase()] || 'Project',
            }))
            .sort((a, b) => b.updated - a.updated);

        workGrid.innerHTML = '';

        if (projects.length === 0) {
            workGrid.innerHTML = '<div class="work-loading">Loading projects...</div>';
            return;
        }

        projects.forEach((project, index) => {
            const card = createProjectCard(project);
            card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
            workGrid.appendChild(card);
        });

        // Add animation
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
        workGrid.innerHTML = '<div class="work-loading">Error loading projects. Check GitHub API.</div>';
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'work-card';

    const emoji = projectEmojis[project.name.toLowerCase()] || '📦';

    card.innerHTML = `
        <div class="work-image">${emoji}</div>
        <div class="work-content">
            <h3 class="work-title">${escapeHtml(project.name)}</h3>
            <p class="work-description">${escapeHtml(project.description.substring(0, 100))}${project.description.length > 100 ? '...' : ''}</p>
            <div class="work-tech">
                <span class="tech-tag">${project.language}</span>
                <span class="tech-tag">${project.category}</span>
            </div>
            <div class="work-links">
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="work-link">GitHub</a>
                ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener noreferrer" class="work-link">Live Demo</a>` : ''}
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

        const mailtoLink = `mailto:gsilvaguedes4@gmail.com?subject=Contact from Portfolio&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

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

// Add smooth scroll behavior for nav links
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
