const translations = {
  en: {
    siteTitle: "hbrygo Portfolio",
    siteIntro: "All projects are listed below.",
    featuredProjects: "Featured project pages",
    githubProjects: "Public GitHub repositories",
    openProjectPage: "Open project page",
    mainRepository: "Main repository",
    readme: "README",
    backToAllProjects: "Back to all projects",
    projectNotFound: "Project not found",
    backToIndex: "Back to index",
    loadingProjects: "Loading public repositories...",
    projectsLoadError: "Unable to load public repositories right now.",
    noPublicProjects: "No public repositories found.",
    repository: "Repository",
    updatedOn: "Updated on",
    liveDemo: "Live demo",
    switchLanguage: "Français"
  },
  fr: {
    siteTitle: "Portfolio hbrygo",
    siteIntro: "Tous les projets sont listés ci-dessous.",
    featuredProjects: "Pages projets mises en avant",
    githubProjects: "Dépôts GitHub publics",
    openProjectPage: "Ouvrir la page du projet",
    mainRepository: "Dépôt principal",
    readme: "README",
    backToAllProjects: "Retour à tous les projets",
    projectNotFound: "Projet introuvable",
    backToIndex: "Retour à l'accueil",
    loadingProjects: "Chargement des dépôts publics...",
    projectsLoadError: "Impossible de charger les dépôts publics pour le moment.",
    noPublicProjects: "Aucun dépôt public trouvé.",
    repository: "Dépôt",
    updatedOn: "Mis à jour le",
    liveDemo: "Démo en ligne",
    switchLanguage: "English"
  }
};

const projects = [
  {
    slug: "hbrygo-github-io",
    title: "hbrygo.github.io",
    summary: {
      en: "A simple portfolio website listing projects and project pages.",
      fr: "Un site portfolio simple qui liste les projets et leurs pages dédiées."
    },
    mainRepo: "https://github.com/hbrygo/hbrygo.github.io",
    readme: {
      en: [
        "This project hosts a lightweight portfolio website.",
        "It includes a central index page and one page per project.",
        "All pages share a single JavaScript file and a single CSS file."
      ],
      fr: [
        "Ce projet héberge un site portfolio léger.",
        "Il contient une page d'accueil centrale et une page par projet.",
        "Toutes les pages partagent un seul fichier JavaScript et un seul fichier CSS."
      ]
    }
  }
];

const githubUsername = "hbrygo";
let githubRepos = null;
let currentLanguage =
  localStorage.getItem("portfolio-language") ||
  (navigator.language && navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en");

if (!translations[currentLanguage]) {
  currentLanguage = "en";
}

function t(key) {
  return translations[currentLanguage][key];
}

function formatDate(value) {
  return new Intl.DateTimeFormat(currentLanguage === "fr" ? "fr-FR" : "en-US", {
    dateStyle: "medium"
  }).format(new Date(value));
}

function renderLanguageToggle() {
  const button = document.getElementById("language-toggle");
  if (!button) return;
  button.textContent = t("switchLanguage");
}

function renderStaticText() {
  document.documentElement.lang = currentLanguage;

  const siteTitle = document.getElementById("site-title");
  const siteIntro = document.getElementById("site-intro");
  const featuredTitle = document.getElementById("featured-projects-title");
  const githubTitle = document.getElementById("github-projects-title");

  if (siteTitle) siteTitle.textContent = t("siteTitle");
  if (siteIntro) siteIntro.textContent = t("siteIntro");
  if (featuredTitle) featuredTitle.textContent = t("featuredProjects");
  if (githubTitle) githubTitle.textContent = t("githubProjects");
}

function renderIndex() {
  const list = document.getElementById("projects-list");
  if (!list) return;

  list.innerHTML = "";
  projects.forEach((project) => {
    const item = document.createElement("li");
    item.className = "card";
    item.innerHTML = `
      <h3>${project.title}</h3>
      <p>${project.summary[currentLanguage]}</p>
      <p><a href="/${project.slug}/">${t("openProjectPage")}</a></p>
    `;
    list.appendChild(item);
  });
}

async function fetchPublicRepos() {
  if (githubRepos) return githubRepos;

  const response = await fetch(
    `https://api.github.com/users/${githubUsername}/repos?type=public&sort=updated&per_page=100`
  );
  if (!response.ok) {
    throw new Error("GitHub repositories could not be loaded");
  }

  const data = await response.json();
  githubRepos = data.filter((repo) => !repo.private);
  return githubRepos;
}

async function renderGitHubProjects() {
  const list = document.getElementById("github-projects-list");
  const loading = document.getElementById("github-projects-loading");
  if (!list || !loading) return;

  list.innerHTML = "";
  loading.textContent = t("loadingProjects");

  try {
    const repos = await fetchPublicRepos();

    if (repos.length === 0) {
      loading.textContent = t("noPublicProjects");
      return;
    }

    loading.textContent = "";
    repos.forEach((repo) => {
      const item = document.createElement("li");
      item.className = "card";
      item.innerHTML = `
        <h3>${repo.name}</h3>
        ${repo.description ? `<p>${repo.description}</p>` : ""}
        <p><strong>${t("repository")}:</strong> <a href="${repo.html_url}">${repo.html_url}</a></p>
        <p>${t("updatedOn")}: ${formatDate(repo.updated_at)}</p>
        ${repo.homepage ? `<p><a href="${repo.homepage}">${t("liveDemo")}</a></p>` : ""}
      `;
      list.appendChild(item);
    });
  } catch (error) {
    loading.textContent = t("projectsLoadError");
  }
}

function renderProject() {
  const page = document.getElementById("project-page");
  if (!page) return;

  const slug = document.body.dataset.project;
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    page.innerHTML = `<h1>${t("projectNotFound")}</h1><p><a href="/">${t("backToIndex")}</a></p>`;
    return;
  }

  document.title = `${project.title} | ${t("siteTitle")}`;
  page.innerHTML = `
    <h1>${project.title}</h1>
    <p>${project.summary[currentLanguage]}</p>
    <p><strong>${t("mainRepository")}:</strong> <a href="${project.mainRepo}">${project.mainRepo}</a></p>
    <h2>${t("readme")}</h2>
    <ul>
      ${project.readme[currentLanguage].map((line) => `<li>${line}</li>`).join("")}
    </ul>
    <p><a href="/">${t("backToAllProjects")}</a></p>
  `;
}

function rerender() {
  renderLanguageToggle();
  renderStaticText();
  renderIndex();
  renderProject();
  renderGitHubProjects();
}

const languageToggle = document.getElementById("language-toggle");
if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    currentLanguage = currentLanguage === "fr" ? "en" : "fr";
    localStorage.setItem("portfolio-language", currentLanguage);
    rerender();
  });
}

rerender();
