const copyLabels = document.querySelectorAll('.copy-label');
const copyCurlLabels = document.querySelectorAll('.copy-curl-label');

addButtons(copyLabels, false);
addButtons(copyCurlLabels, true);

function addButtons(labels, curl) {
    labels.forEach((copyLabel) => {
        const snippet = copyLabel.parentNode.previousElementSibling;
        const text = snippet.innerText.trim();

        const security = copyLabel.dataset.security == 'true';

        var buttonWrap = document.createElement('div');
        buttonWrap.className = 'copy-button-wrap';
        buttonWrap.appendChild(createButton(text, 'Copy', 'Copy snippet to clipboard', false, security));
        if (curl) {
            buttonWrap.appendChild(createButton(text, 'Copy as cURL', 'Copy snippet as cURL', true, security));
        }

        // Check if the next sibling after the copy label is a playground label
        var nextSibling = copyLabel.nextElementSibling;
        if (nextSibling && nextSibling.classList.contains('try-in-playground-label')) {
            var playButton = document.createElement('button');
            playButton.className = 'copy-button playground-button';
            playButton.type = 'button';
            playButton.innerText = 'Try in Playground';
            playButton.ariaLabel = 'Open query in OpenSearch Playground';
            playButton.setAttribute('data-action', 'open_playground');
            playButton.setAttribute('data-query', text);
            buttonWrap.appendChild(playButton);
            nextSibling.remove();
        }
        
        snippet.style.marginBottom = 0;
        snippet.style.paddingBottom = 0;
        snippet.parentNode.replaceChild(buttonWrap, snippet.nextElementSibling);
    });
}

function createButton(textToCopy, buttonText, buttonAriaLabel, curl, security) {
    var copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.type = 'button';
    copyButton.innerText = buttonText;
    copyButton.ariaLabel = buttonAriaLabel;

    copyButton.setAttribute('data-action', curl ? 'copy_as_curl' : 'copy_code');
    copyButton.setAttribute('data-text', curl ? addCurl(textToCopy, security) : textToCopy);

    return copyButton;
}

function addCurl(textToCopy, security) {
    return window.CopyUtils.convertToCurl(textToCopy, security);
}
