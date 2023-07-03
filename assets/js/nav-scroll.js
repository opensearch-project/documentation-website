document.addEventListener('DOMContentLoaded', () => {
    const findParentNavElement = (element) => {
        if (element === null) {
            return null;
        } else if (element.tagName === 'NAV') {
            return element;
        } else {
            return findParentNavElement(element.parentElement);
        }
    };
    const navParent = document.querySelector('body main .side-bar nav#site-nav');
    if (!navParent) {
      return;
    }
    const activeNavItem = document.querySelector('.nav-list-item.active a.nav-list-link.active');
    if (activeNavItem) {
      const activeItemTop = activeNavItem.getBoundingClientRect().y;
      if (activeItemTop < 0) {
        navParent.scrollTo(0, activeItemTop);
        activeNavItem.focus();
      } else {
        activeNavItem.focus();
      }
    } else {
      const firstNavItem = navParent.querySelector('ul.nav-list > li.nav-list-item:nth-of-type(1) > a.nav-list-link');
      if (firstNavItem) {
        firstNavItem.focus();
      }
    }
    
    navParent.addEventListener('keydown', (event) => {
      // Check that the target element has a the class name of nav-list-expander.
      if (event.target.classList.contains('nav-list-expander')) {
        // Check that the key pressed was the space key.
        if (event.key === ' ') {
          event.preventDefault();
          event.target.click();
          event.stopImmediatePropagation();
          event.stopPropagation();
        }
      }
    });
});
