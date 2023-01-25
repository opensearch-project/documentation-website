let siteNav = document.querySelector('.site-nav');
const key = 'scroll';

document.addEventListener('DOMContentLoaded', () => {
    const scroll = JSON.parse(sessionStorage.getItem(key));

    const currentDate = new Date();
    
    if (scroll !== null && currentDate.getTime() < scroll.expiry) {
      siteNav.scrollTop = parseInt(scroll.value);
    }
    else {
      sessionStorage.removeItem(key);
    }
});

window.addEventListener('beforeunload', () => {
  const currentDate = new Date();

  // add the scroll value that expires after one day
  const scroll = {
    value: siteNav.scrollTop,
    expiry: currentDate.getTime() + 24 * 60 * 60 * 1000,
  }
  
  sessionStorage.setItem(key, JSON.stringify(scroll));
});