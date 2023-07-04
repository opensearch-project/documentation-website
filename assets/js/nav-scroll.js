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

      const handleSpaceKey = () => {

        //
        // Space key functionality
        // For reference: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation-hybrid/
        //

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
      };

      const handleArrowKey = () => {
        let currentlyFocusedNavItem = navParent.querySelector('a:focus');
        if (!currentlyFocusedNavItem) {
          const activeNavItem = navParent.querySelector('a.active');
          if (activeNavItem) {
            currentlyFocusedNavItem = activeNavItem;
          } else {
            // Nothing is focused, nor active. Default to the first item.
            navParent.querySelector('a.nav-list-link').focus();
            return;
          }
        }
        const allNavItems = Array.from(navParent.querySelectorAll('a'));
        const currentlyFocusedNavItemIndex = allNavItems.indexOf(currentlyFocusedNavItem);
        if (event.key === 'ArrowUp') {
          if (currentlyFocusedNavItemIndex > 0) {
            allNavItems[currentlyFocusedNavItemIndex - 1].focus();
          }
        } else {
          if (currentlyFocusedNavItemIndex < allNavItems.length - 1) {
            allNavItems[currentlyFocusedNavItemIndex + 1].focus();
          }
        }
      };

      
      if (event.key === ' ') {
        handleSpaceKey();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        handleArrowKey();
      }
    });
});
