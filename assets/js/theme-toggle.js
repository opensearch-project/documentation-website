const THEME_KEY = 'opensearch-docs-theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DARK_THEME;
  }
  return LIGHT_THEME;
}

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (e) {
    return null;
  }
}

function getPreferredTheme() {
  // Precedence: stored theme > system theme > light theme
  const stored = getStoredTheme();
  if (stored) {
    return stored;
  }
  return getSystemTheme();
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
  const currentTheme = getPreferredTheme();
  const nextTheme = getNextTheme(currentTheme);
  applyTheme(nextTheme);
  updateToggleButton(nextTheme);
}

// prevent flashing
const initialTheme = getPreferredTheme();
applyTheme(initialTheme);

// initialize UI elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = getPreferredTheme();
  updateToggleButton(currentTheme);

  const toggleButtons = document.querySelectorAll('#theme-toggle');
  toggleButtons.forEach(button => {
    button.addEventListener('click', handleThemeToggle);
  });
});