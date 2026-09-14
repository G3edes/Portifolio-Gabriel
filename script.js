const GITHUB_USERNAME = 'g3edes';
const API_BASE_URL = 'https://api.github.com';

const featuredProjects = [
    'journey_tcc',
    'pokemon_tcg_api',
    'planify',
    'api_jest',
    'bmi_kotlin_ab',
    'alpha_corp',
    'habitflow',
    'kotlin-api'
];

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    loadProjects();
    loadRepoCount();
});

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

async function loadRepoCount() {
    try {
        const res = await fetch(`${API_BASE_URL}/users/${GITHUB_USERNAME}`);
        const user = await res.json();
        const el = document.getElementById('repoCount');
        if (el && user.public_repos) el.textContent = `${user.public_repos}+`;
    } catch (e) {
        console.error('Erro ao carregar estatísticas do GitHub:', e);
    }
}

async function loadProjects() {
    const grid = document.getElementById('projectsGrid');

    try {
        const res = await fetch(`${API_BASE_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        const data = await res.json();

        let projects = data
            .filter(repo => !repo.fork && repo.language)
            .map(repo => ({
                name: repo.name,
                description: repo.description || 'Projeto pessoal desenvolvido para estudo e prática.',
                language: repo.language,
                url: repo.html_url,
                homepage: repo.homepage,
                updated: new Date(repo.updated_at),
                featured: featuredProjects.includes(repo.name.toLowerCase()),
            }))
            .sort((a, b) => {
                if (a.featured !== b.featured) return b.featured - a.featured;
                return b.updated - a.updated;
            })
            .slice(0, 8);

        grid.innerHTML = '';

        if (projects.length === 0) {
            grid.innerHTML = '<div class="loading">Nenhum projeto encontrado.</div>';
            return;
        }

        projects.forEach(project => grid.appendChild(createProjectCard(project)));
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        grid.innerHTML = '<div class="loading">Erro ao carregar projetos do GitHub.</div>';
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const initials = project.name
        .replace(/[-_]/g, ' ')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('');

    card.innerHTML = `
        <div class="project-top">
            <div class="project-icon">${initials}</div>
            <div class="project-name">${escapeHtml(formatName(project.name))}</div>
        </div>
        <p class="project-description">${escapeHtml(project.description)}</p>
        <div class="project-tags">
            <span class="project-tag">${escapeHtml(project.language)}</span>
        </div>
        <div class="project-links">
            <a href="${project.url}" target="_blank" rel="noopener noreferrer">Código</a>
            ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener noreferrer">Demo</a>` : ''}
        </div>
    `;

    return card;
}

function formatName(name) {
    return name.replace(/[-_]/g, ' ');
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});
