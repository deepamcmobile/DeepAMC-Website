const themeStorageKey = 'deepamc-theme';
const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');

function savedTheme() {
  try { return localStorage.getItem(themeStorageKey); } catch (_) { return null; }
}

function applyTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  if (persist) {
    try { localStorage.setItem(themeStorageKey, theme); } catch (_) { /* stockage indisponible */ }
  }
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    const dark = theme === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? 'Activer le mode clair' : 'Activer le mode sombre');
    toggle.setAttribute('title', dark ? 'Mode clair' : 'Mode sombre');
    toggle.querySelector('.theme-icon').textContent = dark ? '☀' : '☾';
  }
}

applyTheme(savedTheme() || (themeMedia.matches ? 'dark' : 'light'));

const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.type = 'button';
  themeToggle.innerHTML = '<span class="theme-icon" aria-hidden="true"></span>';
  const menuButton = siteHeader.querySelector('.menu-button');
  siteHeader.insertBefore(themeToggle, menuButton || siteHeader.querySelector('nav'));
  applyTheme(document.documentElement.dataset.theme || 'light');
  themeToggle.addEventListener('click', () => {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });
}

themeMedia.addEventListener('change', (event) => {
  if (!savedTheme()) applyTheme(event.matches ? 'dark' : 'light');
});

const button = document.querySelector('.menu-button');
const navigation = document.querySelector('#main-navigation');

if (button && navigation) {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    navigation.classList.toggle('open', !expanded);
  });
}

const downloadCounters = document.querySelectorAll('[data-download-count]');
if (downloadCounters.length) {
  fetch('https://api.deepamc.app/api/v1/downloads/stats')
    .then((response) => {
      if (!response.ok) throw new Error('Statistiques indisponibles');
      return response.json();
    })
    .then((stats) => {
      const formatter = new Intl.NumberFormat('fr-FR');
      downloadCounters.forEach((element) => {
        const value = Number(stats[element.dataset.downloadCount] || 0);
        element.textContent = `${formatter.format(value)} téléchargement${value === 1 ? '' : 's'} enregistré${value === 1 ? '' : 's'}`;
      });
    })
    .catch(() => {
      downloadCounters.forEach((element) => {
        element.textContent = 'Nombre de téléchargements momentanément indisponible';
      });
    });
}
