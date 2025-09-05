(() => {
    document.addEventListener('DOMContentLoaded', () => {
        //
        // Search field behaviors
        //
        const elInput = document.getElementById('search-input');
        const elResults = document.getElementById('search-results')?.querySelector?.('.top-banner-search--field-with-results--field--wrapper--search-component--search-results-wrapper') ?? null;
        const elOverlay = document.querySelector('.top-banner-search--overlay');
        const elSpinner = document.querySelector('.top-banner-search--field-with-results--field--wrapper--search-component--search-spinner');
        if (!elInput || !elResults || !elOverlay) return;
        
        const CLASSNAME_SPINNING = 'spinning';
        const CLASSNAME_HIGHLIGHTED = 'highlighted';

        const canSmoothScroll = 'scrollBehavior' in document.documentElement.style;

        //Extract version from the URL path
        const urlPath = window.location.pathname;
        const versionMatch = urlPath.match(/(\d+\.\d+)/);
        const docsVersion = versionMatch ? versionMatch[1] : elInput.getAttribute('data-docs-version');

        let _showingResults = false,
            animationFrame,
            debounceTimer,
            lastQuery;

        const abortControllers = [];

        elInput.addEventListener('input', e => {
            debounceInput();
        });

        elInput.addEventListener('keydown', e => {
            switch (e.key) {
                case 'Esc':
                case 'Escape':
                    hideResults(true);
                    elInput.value = '';
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    highlightNextResult(false);
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    highlightNextResult();
                    break;

                case 'Enter':
                    e.preventDefault();
                    navToResult();
                    break;
            }
        });

        elInput.addEventListener('focus', e => {
            if (!_showingResults && elResults.textContent) showResults();
        });

        elResults.addEventListener('pointerenter', e => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(() => {
                highlightResult(e.target?.closest('.top-banner-search--field-with-results--field--wrapper--search-component--search-results--result'));
            });
        }, true);

        elResults.addEventListener('focus', e => {
            highlightResult(e.target?.closest('.top-banner-search--field-with-results--field--wrapper--search-component--search-results--result'));
        }, true);

        const debounceInput = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(doSearch, 300);
        };

        const abortPreviousCalls = () => {
            while (abortControllers.length) abortControllers.pop()?.abort?.();
        };

        const getBreadcrumbs = result => {
            const crumbs = [...result.ancestors].filter(crumb => crumb && crumb.trim());

            if (result.type === 'DOCS') crumbs.unshift(`OpenSearch ${result.versionLabel || result.version}`);
            else if (result.type) crumbs.unshift(result.type);

            return sanitizeText(crumbs.join(' › '));
        }

        const doSearch = async () => {
            const query = elInput.value.replace(/[^a-z0-9-_. ]+/ig, ' ');
            if (query.length < 3) return hideResults(true);
            if (query === lastQuery) return;

            recordEvent('search', {
                search_term: query,
                docs_version: docsVersion
            });

            lastQuery = query;

            abortPreviousCalls();

            elSpinner?.classList.add(CLASSNAME_SPINNING);
            if (!_showingResults) document.documentElement.classList.add('search-active');

            try {
                const controller = new AbortController();
                abortControllers.unshift(abortControllers);
                const startTime = Date.now();
                const response = await fetch(`https://search-api.opensearch.org/search?q=${query}&v=${docsVersion}`, { signal: controller.signal });
                const data = await response.json();
                const searchResultClassName = 'top-banner-search--field-with-results--field--wrapper--search-component--search-results--result';
                recordEvent('view_search_results', {
                    search_term: query,
                    docs_version: docsVersion,
                    duration: Date.now() - startTime,
                    results_num: data?.results?.length || 0
                });

                if (!Array.isArray(data?.results) || data.results.length === 0) {
                    return showNoResults();
                }
                const chunks = data.results.map(result => result
                    ? `
                    <div class="${searchResultClassName}">
                        <a href="${sanitizeAttribute(result.url)}">
                            <cite>${getBreadcrumbs(result)}</cite>
                            ${sanitizeText(result.title || 'Unnamed Document')}
                        </a>
                        <span>${sanitizeText(result.content?.replace?.(/\n/g, '&hellip; '))}</span>
                    </div>
                    `
                    : ''
                );

                emptyResults();
                elResults.appendChild(document.createRange().createContextualFragment(chunks.join('')));
                showResults();
            } catch (ex) {
                showNoResults();
            }

            elSpinner?.classList.remove(CLASSNAME_SPINNING);
        }

        const hideResults = destroy => {
            _showingResults = false;

            elSpinner?.classList.remove(CLASSNAME_SPINNING);
            document.documentElement.classList.remove('search-active');
            elResults.setAttribute('aria-expanded', 'false');
            document.body.removeEventListener('pointerdown', handlePointerDown, false);

            if (destroy) {
                abortPreviousCalls();
                emptyResults();
                lastQuery = '';
            }
        };

        const showResults = () => {
            if (!_showingResults) {
                _showingResults = true;
                document.documentElement.classList.add('search-active');
                elResults.setAttribute('aria-expanded', 'true');
                document.body.addEventListener('pointerdown', handlePointerDown, false);
            }

            elResults.scrollTo(0, 0);
        };

        const showNoResults = () => {
            emptyResults();
            const resultElement = document.createElement('div');
            resultElement.classList.add('search-page--results--no-results');
            resultElement.appendChild(document.createRange().createContextualFragment('<span>No results found.</span>'));
            elResults.appendChild(resultElement);
            showResults();
            elSpinner?.classList.remove(CLASSNAME_SPINNING);
        };

        const emptyResults = () => elResults.replaceChildren();

        const sanitizeText = text => {
            return text?.replace?.(/</g, '&lt;');
        };

        const sanitizeAttribute = text => {
            return text?.replace?.(/[>"]+/g, '');
        };

        const handlePointerDown = e => {
            const matchSelectors = [
                '.top-banner-search--field-with-results--field--wrapper--search-component--input-wrap',
                '.top-banner-search--field-with-results--field--wrapper--search-component--input-wrap *',
                '.top-banner-search--field-with-results--field--wrapper--search-component--search-results',
                '.top-banner-search--field-with-results--field--wrapper--search-component--search-results *',
            ].join(', ');
            if (e.target.matches(matchSelectors)) return;

            e.preventDefault();

            elInput.blur();
            hideResults();
        };

        const highlightResult = node => {
            const searchResultClassName = 'top-banner-search--field-with-results--field--wrapper--search-component--search-results--result';
            if (!node || !_showingResults || node.classList.contains(CLASSNAME_HIGHLIGHTED)) return;

            elResults.querySelectorAll(`.${searchResultClassName}.highlighted`).forEach(el => {
                el.classList.remove(CLASSNAME_HIGHLIGHTED);
            });
            node.classList.add(CLASSNAME_HIGHLIGHTED);
            elInput.focus();
        };

        const highlightNextResult = (down = true) => {
            const searchResultClassName = 'top-banner-search--field-with-results--field--wrapper--search-component--search-results--result';
            const highlighted = elResults.querySelector(`.${searchResultClassName}.highlighted`);
            let nextResult;
            if (highlighted) {
                highlighted.classList.remove(CLASSNAME_HIGHLIGHTED);
                nextResult = highlighted[down ? 'nextElementSibling' : 'previousElementSibling']
            } else {
                nextResult = elResults.querySelector(`.${searchResultClassName}:${down ? 'first' : 'last'}-child`);
            }

            if (nextResult) {
                nextResult.classList.add(CLASSNAME_HIGHLIGHTED);
                if (down) {
                    if (canSmoothScroll) {
                        nextResult.scrollIntoView({ behavior: "smooth", block: "end" });
                    } else {
                        nextResult.scrollIntoView(false)
                    }
                } else if (
                    nextResult.offsetTop < elResults.scrollTop ||
                    nextResult.offsetTop + nextResult.clientHeight > elResults.scrollTop + elResults.clientHeight
                ) {
                    if (canSmoothScroll) {
                        elResults.scrollTo({ behavior: "smooth", top: nextResult.offsetTop, left: 0 });
                    } else {
                        elResults.scrollTo(0, nextResult.offsetTop);
                    }
                }
            } else {
                elResults.scrollTo(0, 0);
            }
        };

        const navToResultsPage = () => {
            const query = encodeURIComponent(elInput.value);
            window.location.href = `/${docsVersion}/search.html?q=${query}`;
        }

        const navToResult = () => {
            const searchResultClassName = 'top-banner-search--field-with-results--field--wrapper--search-component--search-results--result';
            const element = elResults.querySelector(`.${searchResultClassName}.highlighted a[href]`);
            if (element) {
                element.click?.();
            } else {
                navToResultsPage();
            }
        };

        const recordEvent = (name, data) => {
            try {
                gtag?.('event', name, data);
            } catch (e) {
                // Do nothing
            }
        };
    });
})();


window.doResultsPageSearch = async (query, type, version) => {
    const searchResultsContainer = document.getElementById('searchPageResultsContainer');

    try {
        const response = await fetch(`https://search-api.opensearch.org/search?q=${query}&v=${version}&t=${type}`);
        const data = await response.json();
        // Clear any previous search results
        searchResultsContainer.innerHTML = '';

        if (data.results && data.results.length > 0) {
            data.results.forEach(result => {
              const resultElement = document.createElement('div');
              resultElement.classList.add('search-page--results--display--container--item');

              const contentCite = document.createElement('cite');
              const crumbs = [...result.ancestors].filter(crumb => crumb && crumb.trim());
              if (result.type === 'DOCS') crumbs.unshift(`OpenSearch ${result.versionLabel || result.version}`);
              else if (result.type) crumbs.unshift(result.type);
              contentCite.textContent = crumbs.join(' › ')?.replace?.(/</g, '&lt;');
              contentCite.style.fontSize = '.8em';

              const titleLink = document.createElement('a');
              titleLink.href = result.url;
              titleLink.classList.add('search-page--results--display--container--item--link');
              titleLink.textContent = result.title;
              
              const contentSpan = document.createElement('span');
              contentSpan.textContent = result.content;
              contentSpan.style.display = 'block';

              resultElement.appendChild(contentCite);
              resultElement.appendChild(titleLink);
              resultElement.appendChild(contentSpan);

              // Append the result element to the searchResultsContainer
              searchResultsContainer.appendChild(resultElement);
            });
        } else {
          const noResultsElement = document.createElement('div');
          noResultsElement.textContent = 'No results found.';
          searchResultsContainer.appendChild(noResultsElement);
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
        searchResultsContainer.innerHTML = 'An error occurred while fetching search results. Please try again later.';
    }
}
