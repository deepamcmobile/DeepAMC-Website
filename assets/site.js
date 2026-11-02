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
