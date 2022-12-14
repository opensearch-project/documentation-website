let siteNav = document.querySelector('.site-nav');

document.addEventListener('DOMContentLoaded', () => {
    const scroll = localStorage.getItem('scroll');
    if (scroll !== null) {
        siteNav.scrollTop = parseInt(scroll);
    }
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('scroll', siteNav.scrollTop);
});
