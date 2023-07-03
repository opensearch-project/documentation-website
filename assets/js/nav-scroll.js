document.addEventListener('DOMContentLoaded', () => {
    const navParent = document.getElementById('site-nav');
    if (!navParent) {
      return;
    }
    const activeNavItem = navParent.querySelector('a.active');
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
      //
      // Space key functionality
      // For reference: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation-hybrid/
      //
      if (event.key !== ' ') {
        return;
      }

      const expandCollapse = (element) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        element.click();
      };

      if (event.target.classList.contains('nav-list-expander')) {
        // If the event target is the expand/collapse arrow then toggle the state of the sub tree.
        expandCollapse(event.target);
      } else if (event.target.tagName === 'A') {
        // If the event target is a link then follow the link.
        event.target.click();
      }
    });
});
