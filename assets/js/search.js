(() => {
    const elInput = document.getElementById('search-input');
    const elResults = document.getElementById('search-results');
    const elOverlay = document.querySelector('.search-overlay');
    const elSpinner = document.querySelector('.search-spinner');
    if (!elInput || !elResults || !elOverlay) return;

    const CLASSNAME_SPINNING = 'spinning';
    const CLASSNAME_HIGHLIGHTED = 'highlighted';

    const canSmoothScroll = 'scrollBehavior' in document.documentElement.style;

    const docsVersion = elInput.getAttribute('data-docs-version');

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
                navToHighlightedResult();
                break;
        }
    });

    elInput.addEventListener('focus', e => {
        if (!_showingResults && elResults.textContent) showResults();
    });

    elResults.addEventListener('pointerenter', e => {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(() => {
            highlightResult(e.target?.closest('.custom-search-result'));
        });
    }, true);

    elResults.addEventListener('focus', e => {
        highlightResult(e.target?.closest('.custom-search-result'));
    }, true);

    const debounceInput = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(doSearch, 300);
    };

    const abortPreviousCalls = () => {
        while (abortControllers.length) abortControllers.pop()?.abort?.();
    };

    const getBreadcrumbs = result => {
        const crumbs = [...result.ancestors];

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
            const response = await fetch(`https://search-api.opensearch.org/search?q=${query}&v=${docsVersion}`, {signal: controller.signal});
            const data = await response.json();

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
                <div class="custom-search-result">
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
        elResults.appendChild(document.createRange().createContextualFragment('<span>No results found!</span>'));
        showResults();
        elSpinner?.classList.remove(CLASSNAME_SPINNING);
    };

    const emptyResults = () => {
        //ToDo: Replace with `elResults.replaceChildren();` when https://caniuse.com/?search=replaceChildren shows above 90% can use it
        while (elResults.firstChild) elResults.firstChild.remove();
    };

    const sanitizeText = text => {
        return text?.replace?.(/</g, '&lt;');
    };

    const sanitizeAttribute = text => {
        return text?.replace?.(/[>"]+/g, '');
    };

    const handlePointerDown = e => {
        if (e.target.matches('.search-input-wrap, .search-input-wrap *, .search-results, .search-results *')) return;

        e.preventDefault();

        elInput.blur();
        hideResults();
    };

    const highlightResult = node => {
        if (!node || !_showingResults || node.classList.contains(CLASSNAME_HIGHLIGHTED)) return;

        elResults.querySelectorAll('.custom-search-result.highlighted').forEach(el => {
            el.classList.remove(CLASSNAME_HIGHLIGHTED);
        });
        node.classList.add(CLASSNAME_HIGHLIGHTED);
        elInput.focus();
    };

    const highlightNextResult = (down = true) => {
        const highlighted = elResults.querySelector('.custom-search-result.highlighted');
        let nextResult;
        if (highlighted) {
            highlighted.classList.remove(CLASSNAME_HIGHLIGHTED);
            nextResult = highlighted[down ? 'nextElementSibling' : 'previousElementSibling']
        } else {
            nextResult = elResults.querySelector(`.custom-search-result:${down ? 'first' : 'last'}-child`);
        }

        if (nextResult) {
            nextResult.classList.add(CLASSNAME_HIGHLIGHTED);
            if (down) {
                if (canSmoothScroll) {
                    nextResult.scrollIntoView({behavior: "smooth", block: "end"});
                } else {
                    nextResult.scrollIntoView(false)
                }
            } else if (
                nextResult.offsetTop < elResults.scrollTop ||
                nextResult.offsetTop + nextResult.clientHeight > elResults.scrollTop + elResults.clientHeight
            ) {
                if (canSmoothScroll) {
                    elResults.scrollTo({behavior: "smooth", top: nextResult.offsetTop, left: 0});
                } else {
                    elResults.scrollTo(0, nextResult.offsetTop);
                }
            }
        } else {
            elResults.scrollTo(0, 0);
        }
    };

    const navToHighlightedResult = () => {
        elResults.querySelector('.custom-search-result.highlighted a[href]')?.click?.();
    };

    const recordEvent = (name, data) => {
        try {
            gtag?.('event', name, data);
        } catch (e) {
            // Do nothing
        }

    }
})();