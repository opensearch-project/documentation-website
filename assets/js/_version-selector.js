/* During build, DOC_VERSIONS is prefixed to convey all the versions available, informed by `_data/versions.json`
 * Example:
 *    const DOC_VERSIONS = ["2.1","1.1"];
 *    const DOC_VERSIONS_ARCHIVED = ["2.0","1.0"];
 *
 * DOC_VERSION_LATEST will pick `latest`, or in its absence the `current` version.
 *    const DOC_VERSION_LATEST = "2.1";
 */
const PREFIX = "OpenSearch ";
const tpl = `
    <style>
    :host {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        font-size: 1em;
        user-select: none;
        margin: 3px;
        text-align: left;
    }
    
    * {
        box-sizing: border-box;
    }
    
    #root {
        text-decoration: none;
        color: #FFFFFF;
        background-color: #00509c;
        background-image: var(--normal-bg);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        padding: 0.3em 3em 0.3em 1em;
        margin: 0;
        
        position: relative;
        display: block;
        z-index: 2;
        cursor: pointer;
    }
    
    #root:hover {
        background-image: var(--hover-bg);
    }
    
    #root:focus {
        outline: none;
    }
    
    :host(:not([aria-expanded="true"])) #root:focus,
    #root:focus:hover {
        box-shadow: 0 0 0 3px rgba(0, 0, 255, 0.25);
    }
    
    #root:before {
        content: "";
        position: absolute;
        top: 5px;
        bottom: 5px;
        width: 0;
        border-width: 0 1px;
        border-color: #000 rgba(0, 0, 0, .2) #000 rgba(255, 255, 255, .6);
        right: 2em;
        border-style: solid;
        background-blend-mode: multiply;
    }
    
    #root > svg {
        position: absolute;
        right: .5em;
        top: .6em;
    }
    
    #dropdown {
        position: absolute;
        min-width: calc(100% - 2px);
        top: 100%;
        left: 0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25), 0 4px 10px rgba(0, 0, 0, 0.12);
        
        margin: -5px 1px 0 1px;
        padding-top: 5px;
        white-space: nowrap;
        border-radius: 0 0 4px 4px;
        
        background: #fff;
        z-index: 1;
    }
    
    :host(:not([aria-expanded="true"])) #dropdown {
        display: none;
    }
    
    #spacer {
        appearance: none;
        visibility: hidden;
        pointer-events: none;
        height: 0;
        margin: 0 1px;
        overflow: hidden;
    }
    
    #spacer > a,
    #dropdown > a {
        display: block;
        white-space: nowrap;
        padding: 0.3em calc(3em - 1px) 0.3em calc(1em - 1px);
        border-bottom: 1px solid #eee;
        text-decoration: none;
        color: var(--link-color);
        position: relative;
        line-height: 1.6em;
    }
    
    #dropdown > a:last-child {
        border: 0;
    }
    
    #dropdown > a:hover {
        background: #efefef;
    }
    
    a.latest:after {
        content: "LATEST";
        position: absolute;
        right: .4rem;
        font-size: 0.6em;
        font-weight: 700;
        top: 50%;
        transform: translateY(-50%);
        color: #999;
    }
    
    #spacer > a.archived,
    #spacer > a.show-archived,
    #dropdown > a.archived,
    #dropdown > a.show-archived {
        font-size: .8em;
        text-transform: uppercase;
        color: #999;
        font-weight: 700;
        line-height: 2em;
        display: flex;
        align-items: center;
        padding-top: .375em;
        padding-bottom: .375em;
        padding-left: calc(1.25em - 1px);
        gap: .3em;
        cursor: pointer;
    }
    
    #dropdown > a.show-archived {
        border: 0;
    }
    
    #dropdown > a.show-archived ~ a,
    #dropdown > a.show-archived[aria-expanded="true"] {
        display: none;
        cursor: unset;
    }
    
    #dropdown > a.show-archived[aria-expanded="true"] ~ a {
        display: block;
    }
    </style>
    <a id="root" role="button" aria-labelledby="selected" aria-controls="dropdown" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6l6-6"/></g></svg>
      <span id="selected"></span>
    </a>
    <div id="dropdown" role="navigation"></div>
    <div id="spacer" aria-hidden="true"></div>
`;

class VersionSelector extends HTMLElement {
    static get observedAttributes() {
        return ['selected'];
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open', delegatesFocus: true});
        this._onBlur = (e => {
            this._expand(false);
            this.removeEventListener('blur', this._onBlur);
        }).bind(this);
    }

    async connectedCallback() {
        const {shadowRoot} = this;
        const frag = this._makeFragment(tpl);

        frag.querySelector('#selected').textContent = `${PREFIX}${this.getAttribute('selected')}.x`;

        const pathName = location.pathname.replace(/\/docs(\/((latest|\d+\.\d+)\/?)?)?/, '');
        const versionsDOMNodes = DOC_VERSIONS.map((v, idx) => `<a href="/docs/${v}/${pathName}"${v === DOC_VERSION_LATEST ? ' class="latest"' : ''}>${PREFIX}${v}.x</a>`);
        if (Array.isArray(DOC_VERSIONS_ARCHIVED) && DOC_VERSIONS_ARCHIVED.length) {
            versionsDOMNodes.push(
                `<a class="show-archived"><span>Show archived</span><svg xmlns="http://www.w3.org/2000/svg" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6l6-6"/></g></svg></a>`,
                `<a class="archived">Archived</a>`,
                ...DOC_VERSIONS_ARCHIVED.map((v, idx) => `<a href="/docs/${v}/${pathName}">${PREFIX}${v}.x</a>`)
            );
        }

        const versionsDOMText = versionsDOMNodes.join('');

        frag.querySelector('#dropdown').appendChild(this._makeFragment(versionsDOMText));
        frag.querySelector('#spacer').appendChild(this._makeFragment(versionsDOMText));

        shadowRoot.appendChild(frag);

        this._instrument(shadowRoot);
    }

    _instrument(shadowRoot) {
        shadowRoot.querySelector('#root').addEventListener('click', e => {
            this._expand(this.getAttribute('aria-expanded') !== 'true');
        });

        const showNode = shadowRoot.querySelector('#dropdown .show-archived');
        showNode?.addEventListener('click', e => {
            showNode.setAttribute('aria-expanded', 'true');
        });

        /* On some devices, `blur` is fired on the component before navigation occurs when choosing a version from the
         * dropdown; this ends up hiding the dropdown and preventing the navigation. The `pointerup` on the anchor
         * element is always fired before the `blur` is dispatched on the component and that is used here to trigger
         * the navigation before the dropdown is hidden.
         */
        shadowRoot.querySelector('#dropdown').addEventListener('pointerup', e => {
            const {target} = e;
            e.preventDefault();
            if (target.matches('a[href]') && target.href) document.location.href = target.href;
        });
    }

    _expand(flag) {
        this.setAttribute('aria-expanded', flag);
        if (flag) this.addEventListener('blur', this._onBlur);
    }

    _makeFragment(html) {
        return document.createRange().createContextualFragment(html);
    }
}

customElements.define('version-selector', VersionSelector);
