const snippets = document.querySelectorAll('pre.highlight');

snippets.forEach(function (snippet) {
    const textToCopy = snippet.innerText;
    if (!(textToCopy.trimStart().startsWith("{") || textToCopy.trimStart().startsWith("$"))) {
        createButton(textToCopy, snippet);
    }
});

function createButton(textToCopy, snippet) {
    var copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.type = 'button';
    copyButton.innerText = 'Copy';
    copyButton.ariaLabel = 'Copy snippet to clipboard';

    copyButton.addEventListener('click', function onClick() {
        // Copy snippet to clipboard
        window.navigator.clipboard.writeText(textToCopy);
    });

    snippet.append(copyButton);
}
