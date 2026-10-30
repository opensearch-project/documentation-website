const THEME_KEY = 'opensearch-docs-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

function getCurrentTheme() {
  return document.documentElement.hasAttribute('data-skin') ? DARK_THEME : LIGHT_THEME;
}

function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    // apply default light theme
  }
}

function applyTheme(theme) {
  if (theme === DARK_THEME) {
    document.documentElement.setAttribute('data-skin', 'dark');
  } else {
    document.documentElement.removeAttribute('data-skin');
  }
  storeTheme(theme);
}

function updateToggleButton(theme) {
  const toggleButtons = document.querySelectorAll('#theme-toggle');
  toggleButtons.forEach(button => {
    const title = theme === LIGHT_THEME ? 'Switch to dark mode' : 'Switch to light mode';
    button.setAttribute('title', title);
    button.setAttribute('aria-label', title);
  });
}

function handleThemeToggle() {
  const currentTheme = getCurrentTheme();
  const nextTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
  applyTheme(nextTheme);
  updateToggleButton(nextTheme);
}

// initialize UI elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = getCurrentTheme();
  updateToggleButton(currentTheme);

  const toggleButtons = document.querySelectorAll('#theme-toggle');
  toggleButtons.forEach(button => {
    button.addEventListener('click', handleThemeToggle);
  });
});