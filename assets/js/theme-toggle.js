const THEME_KEY = 'opensearch-docs-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || LIGHT_THEME;
  } catch (e) {
    // localStorage might not be available in some contexts
    return LIGHT_THEME;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    // localStorage might not be available in some contexts
    console.warn('Could not store theme preference:', e);
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

function getNextTheme(currentTheme) {
  return currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
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
  const currentTheme = getStoredTheme();
  const nextTheme = getNextTheme(currentTheme);
  applyTheme(nextTheme);
  updateToggleButton(nextTheme);
}

const storedTheme = getStoredTheme();
applyTheme(storedTheme);

// initialize UI elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  updateToggleButton(getStoredTheme());

  const toggleButtons = document.querySelectorAll('#theme-toggle');
  toggleButtons.forEach(button => {
    button.addEventListener('click', handleThemeToggle);
  });
});