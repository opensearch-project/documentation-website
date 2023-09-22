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
    
    /**
     * This function configures the aria-expanded attributes on the navigation items.
     * Liquid's limited features make this challenging to do cleanly at build time
     * requiring searching forward through the tree to determine if something in the
     * depth of the currently rendering tree node has a descendant that is active.
     */
    function configureAriaAttributes() {

      const setSubTreeAriaExpanded = (listItem, isExpanded) => {
        const listItemAnchors = listItem.querySelectorAll('a');
        listItemAnchors.forEach((element) => {
          const parentLi = element.parentElement;
          if (parentLi) {
            const childUl = Array.from(parentLi.children).filter(element => element.tagName === 'UL')[0];
            if (childUl) {
              // If there is a child UL of the anchor element's parent LI then set the aria-expanded
              // Otherwise delete the attribute, because there is no child UL to expand / collapse.
              element.setAttribute('aria-expanded', isExpanded);
            } else {
              element.removeAttribute('aria-expanded');
            }
          }
        });
      };

      const topLevelUls = Array.from(navParent.children).filter(element => element.tagName === 'UL');
      topLevelUls.forEach((element) => {
        const listItems = Array.from(element.children).filter(element => element.tagName === 'LI');
        listItems.forEach((element) => {
          const active = element.querySelector('a.active');
          if (active) {
            setSubTreeAriaExpanded(element, true);
          } else {
            setSubTreeAriaExpanded(element, false);
          }
        });
      });
    }

    // Give keyboard focus to the active navigation item, and ensure
    // it is scrolled into view.
    const activeNavItem = navParent.querySelector('a.active');
    if (activeNavItem) {

      configureAriaAttributes();

      // The active navigation item needs to have the tabindex="0" wheras all of the other items
      // are excluded from the TAB order according.
      activeNavItem.setAttribute('tabindex', '0');
      navParent.querySelectorAll('a:not(.active)').forEach((element) => {
        element.setAttribute('tabindex', '-1');
      });

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
    
    navParent.addEventListener('keydown', (event) => {

      const handleSpaceKey = () => {

        //
        // Space key functionality
        // For reference: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/
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

        const toggleExpandCollapseState = () => {
          const parentLi = currentlyFocusedNavItem.parentElement;
          if (parentLi) {
            const expander = Array.from(parentLi.children).find(element => element.classList.contains('nav-list-expander'));
            if (expander) {
              expander.click();
              Array.from(parentLi.children).forEach((element) => {
                const ariaExpanded = element.getAttribute('aria-expanded');
                if (ariaExpanded === 'true') {
                  element.setAttribute('aria-expanded', 'false');
                } else {
                  element.setAttribute('aria-expanded', 'true');
                }
              });
            }
          }
        };

        if (event.key === 'ArrowUp') {
          if (currentlyFocusedNavItemIndex > 0) {
            allNavItems[currentlyFocusedNavItemIndex - 1].focus();
          }
        } else if (event.key === 'ArrowDown') {
          if (currentlyFocusedNavItemIndex < allNavItems.length - 1) {
            allNavItems[currentlyFocusedNavItemIndex + 1].focus();
          }
        } else if (event.key === 'ArrowLeft') {
          if (currentlyFocusedNavItem.getAttribute('aria-expanded') === 'true') {
            toggleExpandCollapseState();
          } else {
            const parentLi = currentlyFocusedNavItem.parentElement;
            if (parentLi) {
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
        } else if (event.key === 'ArrowRight') {
          const ariaExpanded = currentlyFocusedNavItem.getAttribute('aria-expanded');
          if (ariaExpanded === 'false' || ariaExpanded === null) {
            toggleExpandCollapseState();
          } else {
            const parentLi = currentlyFocusedNavItem.parentElement;
            if (parentLi) {
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
