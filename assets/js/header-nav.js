document.querySelector('.menu-button')?.addEventListener('click', el => {
   const siteNavigation = document.querySelector('div[role="navigation"].nav-menu-on');
   siteNavigation?.classList?.toggle?.('active');
   el.currentTarget.classList?.toggle?.('active');
});
