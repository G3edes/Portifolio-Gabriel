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

const projectCategories = {
    'pokemon-go-api': 'frontend',
    'pdpm-mytrips': 'mobile',
    'planify': 'frontend',
    'semaforo-micropython': 'mobile',
    'journey-tcc': 'fullstack',
    'api_jest': 'backend',
    'api_whatsapp': 'frontend',
    'api_do_zapzap': 'backend',
    'alpha_corp': 'mobile',
    'bmi_kotlin_ab': 'mobile',
};

let allProjects = [];

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    loadProjects();
    loadUserStats();
    initFormHandler();
});

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

async function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');

    try {
        const response = await fetch(`${API_BASE_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        const data = await response.json();

        allProjects = data
            .filter(repo => !repo.fork && repo.language && featuredProjects.includes(repo.name.toLowerCase()))
            .map(repo => ({
                id: repo.id,
                name: repo.name,
                description: repo.description || 'Sem descrição',
                language: repo.language || 'N/A',
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                url: repo.html_url,
                homepage: repo.homepage,
                updated: new Date(repo.updated_at),
                category: projectCategories[repo.name.toLowerCase()] || 'other',
            }))
            .sort((a, b) => b.updated - a.updated);

        renderProjects(allProjects);
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        projectsGrid.innerHTML = '<div class="loading">Erro ao carregar projetos. Tente novamente mais tarde.</div>';
    }
}

function renderProjects(projects) {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';

    if (projects.length === 0) {
        projectsGrid.innerHTML = '<div class="loading">Nenhum projeto encontrado.</div>';
        return;
    }

    projects.forEach(project => {
        const card = createProjectCard(project);
        projectsGrid.appendChild(card);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-category', project.category);

    const languageColors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Kotlin': '#7F52FF',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'TypeScript': '#2b7489',
    };

    const langColor = languageColors[project.language] || '#999999';

    card.innerHTML = `
        <div class="project-image" style="background: linear-gradient(135deg, ${langColor} 0%, ${adjustBrightness(langColor, -30)} 100%);">
            <div style="font-size: 3rem;">📦</div>
        </div>
        <div class="project-content">
            <h3 class="project-name">${escapeHtml(project.name)}</h3>
            <p class="project-description">${escapeHtml(project.description.substring(0, 100))}${project.description.length > 100 ? '...' : ''}</p>
            <span class="project-language">${project.language}</span>
            <div class="project-stats">
                <span class="stat-item">⭐ ${project.stars}</span>
                <span class="stat-item">🍴 ${project.forks}</span>
            </div>
            <div class="project-actions">
                <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="github-link">GitHub</a>
                ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener noreferrer" class="demo-link">Demo</a>` : ''}
            </div>
        </div>
    `;

    return card;
}

async function loadUserStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${GITHUB_USERNAME}`);
        const user = await response.json();

        const repoCount = document.getElementById('repoCount');
        const followerCount = document.getElementById('followerCount');
        const followingCount = document.getElementById('followingCount');

        if (repoCount) repoCount.textContent = user.public_repos;
        if (followerCount) followerCount.textContent = user.followers;
        if (followingCount) followingCount.textContent = user.following;
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

function initFormHandler() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        const mailtoLink = `mailto:gsilvaguedes4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nome: ${name}\nEmail: ${email}\n\n${message}`)}`;

        window.location.href = mailtoLink;

        form.reset();
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

function adjustBrightness(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
        0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}
