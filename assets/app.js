const projects = [
  {
    slug: "hbrygo-github-io",
    title: "hbrygo.github.io",
    summary: "A simple portfolio website listing projects and project pages.",
    mainRepo: "https://github.com/hbrygo/hbrygo.github.io",
    readme: [
      "This project hosts a lightweight portfolio website.",
      "It includes a central index page and one page per project.",
      "All pages share a single JavaScript file and a single CSS file."
    ]
  }
];

function renderIndex() {
  const list = document.getElementById("projects-list");
  if (!list) return;

  projects.forEach((project) => {
    const item = document.createElement("li");
    item.className = "card";
    item.innerHTML = `
      <h2>${project.title}</h2>
      <p>${project.summary}</p>
      <p><a href="/${project.slug}/">Open project page</a></p>
    `;
    list.appendChild(item);
  });
}

function renderProject() {
  const page = document.getElementById("project-page");
  if (!page) return;

  const slug = document.body.dataset.project;
  const project = projects.find((entry) => entry.slug === slug);

  if (!project) {
    page.innerHTML = "<h1>Project not found</h1><p><a href=\"/\">Back to index</a></p>";
    return;
  }

  document.title = `${project.title} | hbrygo Portfolio`;
  page.innerHTML = `
    <h1>${project.title}</h1>
    <p>${project.summary}</p>
    <p><strong>Main repository:</strong> <a href="${project.mainRepo}">${project.mainRepo}</a></p>
    <h2>README</h2>
    <ul>
      ${project.readme.map((line) => `<li>${line}</li>`).join("")}
    </ul>
    <p><a href="/">Back to all projects</a></p>
  `;
}

renderIndex();
renderProject();
