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
      if (event.key !== ' ') {
        return;
      }
      const expandCollapse = (element) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        element.click();
      };
      const findCorrespondingExpandButton = (element) => {
        return Array.from(element.children).find(
          (child) => child.classList.contains('nav-list-expander')
        );
      };
      if (event.target.classList.contains('nav-list-expander')) {
        expandCollapse(event.target);
      } else if (event.target.tagName === 'A') {
        const { parentElement } = event.target;
        let correspondingExpandButton;
        if (parentElement.classList.contains('nav-category')) {
          correspondingExpandButton = findCorrespondingExpandButton(parentElement.parentElement)
        } else if (parentElement.classList.contains('nav-list-item')) {
          correspondingExpandButton = findCorrespondingExpandButton(parentElement);
        } else {
          return;
        }
        if (correspondingExpandButton) {
          expandCollapse(correspondingExpandButton);
        }
      }
    });
});
