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
      // If the active item is not in view, then scroll it into view.
      const VERSION_WRAPPER_HEIGHT = 80;
      const parentRect = navParent.getBoundingClientRect();
      const activeRect = activeNavItem.getBoundingClientRect();

      if (activeRect.top < (parentRect.top + VERSION_WRAPPER_HEIGHT)) {
        const distanceToScroll = activeRect.top - parentRect.top - VERSION_WRAPPER_HEIGHT;
        navParent.scrollTo(0, distanceToScroll);
      } else if (activeRect.bottom > window.visualViewport.height) {
        const distanceToScroll = activeRect.bottom - window.visualViewport.height + VERSION_WRAPPER_HEIGHT;
        navParent.scrollTo(0, distanceToScroll);
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

        //
        // Arrow key navigation implementation.
        // For reference: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/
        //
        
        const currentlyFocusedNavItem = navParent.querySelector('a:focus');
        if (!currentlyFocusedNavItem) {
          // If no item is focused then do nothing.
          return;
        }

        // Preventing the default action prevents jankiness in the default scrolling
        // of the navigation panel, and is left to the browser to handle it when
        // .focus() is invoked instead.
        event.preventDefault();

        // Get all of the navigation items that are visible, and that are NOT the expand/collapse arrow.
        const allNavItems = Array.from(
          navParent.querySelectorAll('a:not(.nav-list-expander)')
        ).filter(element => element.getBoundingClientRect().height > 0);

        const currentlyFocusedNavItemIndex = allNavItems.indexOf(currentlyFocusedNavItem);
        if (event.key === 'ArrowUp') {
          if (currentlyFocusedNavItemIndex > 0) {
            allNavItems[currentlyFocusedNavItemIndex - 1].focus();
          }
        } else if (event.key === 'ArrowDown') {
          if (currentlyFocusedNavItemIndex < allNavItems.length - 1) {
            allNavItems[currentlyFocusedNavItemIndex + 1].focus();
          }
        } else if (event.key === 'ArrowLeft') {
          if (currentlyFocusedNavItem.getAttribute('role') === 'button')  {
            if (currentlyFocusedNavItem.getAttribute('aria-expanded') === 'true') {
              currentlyFocusedNavItem.click();
            }
          } else {
            const parentLi = currentlyFocusedNavItem.parentElement;
            if (parentLi) {
              const expander = Array.from(parentLi.children).find(element => element.classList.contains('nav-list-expander'));
              if (expander?.getAttribute?.('aria-expanded') === 'true') {
                expander.click();
              } else {
                if (currentlyFocusedNavItemIndex > 0) {
                  // The parent of the target <a> is a <li> which is a child of a <ul> which is a child of a <li>.
                  // This <li> should have a <a> that is the parent to focus unless the current is the top.
                  const listWrapperLi = currentlyFocusedNavItem?.parentElement?.parentElement?.parentElement;
                  if (listWrapperLi) {
                    const parentListAnchor = listWrapperLi.querySelectorAll('a:not(.nav-list-expander)')[0];
                    if (parentListAnchor) {
                      parentListAnchor.focus();
                    }
                  }
                }
              }
            }
          }
        } else if (event.key === 'ArrowRight') {
          if (currentlyFocusedNavItem.getAttribute('role') === 'button')  {
            const ariaExpanded = currentlyFocusedNavItem.getAttribute('aria-expanded');
            if (ariaExpanded === 'false' || ariaExpanded === null) {
              currentlyFocusedNavItem.click();
            }
          } else {
            const parentLi = currentlyFocusedNavItem.parentElement;
            if (parentLi) {
              const expander = Array.from(parentLi.children).find(element => element.classList.contains('nav-list-expander'));
              const ariaExpanded = expander.getAttribute('aria-expanded');
              if (ariaExpanded === 'false' || ariaExpanded === null) {
                expander.click();
              } else {
                const childList = Array.from(parentLi.children).find(element => element.tagName === 'UL');
                if (childList) {
                  const childListAnchor = childList.querySelectorAll('a:not(.nav-list-expander)')[0];
                  if (childListAnchor) {
                    childListAnchor.focus();
                  }
                }
              }
            }
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
