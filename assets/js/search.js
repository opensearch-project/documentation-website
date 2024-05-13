import * as UBI from "./ubi.js";

(() => {

    document.addEventListener('DOMContentLoaded', () => {
        UBI.initialize();
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
                highlightResult(e.target?.closest('.top-banner-search--field-with-results--field--wrapper--search-component--search-results--result'));
            });
        }, true);

        elResults.addEventListener('focus', e => {
            highlightResult(e.target?.closest('.top-banner-search--field-with-results--field--wrapper--search-component--search-results--result'));
        }, true);

        elResults.addEventListener('click', e => {
            clickResult(e.target?.closest('.top-banner-search--field-with-results--field--wrapper--search-component--search-results--result'));
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
            UBI.clearCache();

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
                const [qid, result_ids] = UBI.cacheQueryResults(data.results);
                let ubi_event = makeUbiEvent('search', 'search_results', {
                    id:UBI.hash(query),
                    query:query,
                    result_ids:result_ids
                });
                UBI.logEvent(ubi_event);

                const chunks = data.results.map(result => result
                    ? `
                    <div class="${searchResultClassName}">
                        <a id="${UBI.hash(result.url)}" href="${sanitizeAttribute(result.url)}"> 
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

            const link = node.querySelector('a');
            if(link){
                //xxyy logUbiEvent('item_hover', link);
            }

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

        const clickResult = node => {
            const searchResultClassName = 'top-banner-search--field-with-results--field--wrapper--search-component--search-results--result';
            if (!node || !_showingResults) return;

            const link = node.querySelector('a');
            if(link){
                logUbiEvent('item_click', link);
            }

            return true;
        };

        const navToHighlightedResult = () => {
            const searchResultClassName = 'top-banner-search--field-with-results--field--wrapper--search-component--search-results--result';
            const link = elResults.querySelector(`.${searchResultClassName}.highlighted a[href]`);
            if(link != null)
                link.click?.();
        };

        /**
         * Find item and position clicked
         * Modifies the ubi event data if the item is found
         * @param {*} ubi_event 
         * @param {*} link 
         * @returns 
         */
        const setUbiClickData = (ubi_event, link) => {
            ubi_event.event_attributes.position = new UBI.UbiPosition({x:link.offsetLeft, y:link.offsetTop});

            if(link.hasAttribute('id')){
                let id = link.id;
                //try to find the item ordinal within the result list
                let result_ids = sessionStorage.getItem('result_ids');
                if(result_ids != null && result_ids.length > 0){
                    result_ids = result_ids.split(',');
                    let ordinal = result_ids.findIndex(i=>i===id);
                    //if found, ordinal starts at 1
                    if(ordinal != -1){
                        ubi_event.event_attributes.position.ordinal = ordinal + 1;
                        if(ubi_event.message == undefined || ubi_event.message == null){
                            ubi_event.message = `Clicked item ${ordinal+1} out of ${result_ids.length}`
                        }
                        
                        try{
                            let search_results = JSON.parse(sessionStorage.getItem('search_results'));
                            let obj = search_results[id];
                            if(obj != null){
                                ubi_event.event_attributes.object = obj;
                                ubi_event.event_attributes.position.trail = getBreadcrumbs(obj);
                            }
                        }catch(e){
                            console.warn(e);
                        }
                    }
                }
            }
            return ubi_event;
        };


        const makeUbiEvent = (name, event_type, data) => {
            let e = new UBI.UbiEvent(name);
            if(name == 'search'){
                e.message_type = 'QUERY';
                e.message = data.search_term;
                e.event_attributes.object = data;
            } else if(name == 'item_click') {
                e = setUbiClickData(e, data);
            } else {
                switch(event_type) {
                    case "event1":
                    break;
                    case "event2":
                    break;
                    default:{
                        if(e.event_attributes.object == null)
                            e.event_attributes.object = data;
                    }
                }
            }
            return e;
        }


        const logUbiEvent = (name, data) => {
            let event = makeUbiEvent(name, 'default', data)
            UBI.logEvent(event);
        };


        const recordEvent = (name, data) => {
            try {
                gtag?.('event', name, data);
                logUbiEvent(name, data);
            } catch (e) {
                // Do nothing
                //xxyy
                console.warn(e);
            }
        };
    });
})();
