document.addEventListener('DOMContentLoaded', () => {
    const navParent = document.getElementById('site-nav');
    if (!navParent) {
      return;
    }

    // The business logic on navigation items in layouts/default.html and _includes/nav.html 
    // is much too complex to reliably make this determination correctly without overly complicating 
    // something that is already overly complicated. So, this will make the corrections at runtime.
    navParent.querySelectorAll('ul').forEach((element) => {
      const hasNestedList = element.querySelector('ul');
      if (hasNestedList) {
        element.setAttribute('role', 'tree');
      } else {
        element.setAttribute('role', 'group');
      }
    });

    // Give keyboard focus to the active navigation item, and ensure
    // it is scrolled into view.
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
    

    function toggleAriaAttributes(event) {
      const findParentLI = (element) => {
        if (!element) {
          return null;
        }
        if (element.tagName === 'LI') {
          return element;
        } else {
          return findParentLI(element.parentElement);
        }
      };
      const findChildUL = (element) => {
        if (!element) {
          return null;
        }
        if (element.tagName === 'UL') {
          return element;
        } else {
          return findChildUL(element.nextElementSibling);
        }
      };
      const { currentTarget } = event;
      const currentlyExpanded = currentTarget.getAttribute('aria-expanded');
      let expanded = 'false';
      if (currentlyExpanded === 'true') {
        expanded = 'false';
      } else {
        expanded = 'true';
      }
      currentTarget.setAttribute('aria-expanded', expanded);
      const parentLi = findParentLI(currentTarget.parentElement);
      if (parentLi) {
        const toggledUL = findChildUL(parentLi.firstElementChild);
        if (toggledUL) {
          toggledUL.setAttribute('aria-expanded', expanded);
        }
      }
    }

    navParent.querySelectorAll('a[role="button"]').forEach((element) => {
      element.addEventListener('click', toggleAriaAttributes);
    });

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
        // Preventing the default action prevents jankiness in the default scrolling
        // of the navigation panel, and is left to the browser to handle it when
        // .focus() is invoked instead.
        event.preventDefault();

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
        const allNavItems = Array.from(
          navParent.querySelectorAll('a')
        ).filter(element => element.getBoundingClientRect().height > 0);

        const currentlyFocusedNavItemIndex = allNavItems.indexOf(currentlyFocusedNavItem);
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
          if (currentlyFocusedNavItemIndex > 0) {
            allNavItems[currentlyFocusedNavItemIndex - 1].focus();
          }
        } else {
          if (currentlyFocusedNavItemIndex < allNavItems.length - 1) {
            allNavItems[currentlyFocusedNavItemIndex + 1].focus();
          }
        }
      };

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          handleArrowKey();
          break;
        case ' ':
          handleSpaceKey();
          break;
      }
    });
});
