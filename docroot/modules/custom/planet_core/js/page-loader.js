document.addEventListener('DOMContentLoaded', () => {
  // Create and inject loader markup
  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.innerHTML = '<img src="/resources/icons/loader.svg" alt="Loading..." />';
  document.body.prepend(loader);
  // Reveal page and remove loader
  document.documentElement.classList.remove('loader-active');
  setTimeout(() => loader.remove(), 300);
});