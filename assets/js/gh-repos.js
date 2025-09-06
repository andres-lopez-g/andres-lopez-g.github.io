

(function () {
  const GH_USER = '{{ site.github_username | default: site.github.owner_name | default: "andres-lopez-g" }}';
  const lang = (document.documentElement.getAttribute('lang') || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
  const t = {
    es: {
      stars: 'estrellas',
      forks: 'forks',
      updated: 'actualizado',
      noRepos: 'No hay repositorios para mostrar ahora mismo.',
      view: 'Ver'
    },
    en: {
      stars: 'stars',
      forks: 'forks',
      updated: 'updated',
      noRepos: 'No repositories to show right now.',
      view: 'View'
    }
  }[lang];

  function fmtDate(d) {
    try {
      return new Date(d).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'short', day: '2-digit' });
    } catch { return d; }
  }

  function createCard(r) {
    const desc = r.description ? r.description.replace(/</g, '&lt;') : '';
    return `
      <article class="repo-card">
        <h3><a href="${r.html_url}" target="_blank" rel="noopener">${r.name}</a></h3>
        ${desc ? `<p>${desc}</p>` : ''}
        <div class="repo-meta">
          <span title="${r.stargazers_count} ${t.stars}"><i class="fa fa-star"></i> ${r.stargazers_count}</span>
          <span title="${r.forks_count} ${t.forks}"><i class="fa fa-code-fork"></i> ${r.forks_count}</span>
          <span title="${t.updated} ${fmtDate(r.pushed_at)}"><i class="fa fa-clock"></i> ${fmtDate(r.pushed_at)}</span>
        </div>
      </article>
    `;
  }

  async function loadRepos() {
    const container = document.getElementById('gh-repos-list');
    if (!container) return;

    try {
      const res = await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`);
      if (!res.ok) throw new Error(res.statusText);
      const all = await res.json();

      // Heurística: repos no archivados, con algo de actividad; ordenar por estrellas y actualización
      const items = all
        .filter(r => !r.archived)
        .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (new Date(b.pushed_at) - new Date(a.pushed_at)))
        .slice(0, 6);

      container.innerHTML = items.length
        ? items.map(createCard).join('')
        : `<p>${t.noRepos}</p>`;

      // Actualiza el enlace al perfil por si cambiamos el usuario en _config.yml
      const profile = document.getElementById('gh-profile-link');
      if (profile) profile.href = `https://github.com/${GH_USER}`;
    } catch (e) {
      container.innerHTML = `<p>${t.noRepos}</p>`;
      // Silencioso para no romper la página si hay rate limit
    }
  }

  document.addEventListener('DOMContentLoaded', loadRepos);
})();