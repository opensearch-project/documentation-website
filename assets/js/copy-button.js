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
    const firstSpaceIndex = textToCopy.indexOf(" ");
    const httpMethod = textToCopy.substring(0, firstSpaceIndex);

    // The body starts at the first "{" or "[" after the request line. Both have to be
    // checked so that a JSON array body keeps its opening "[" out of the path.
    const bodyIndex = findBodyIndex(textToCopy);
    let body;
    let path;
    if (bodyIndex == -1) {
        body = "";
        path = textToCopy.substring(firstSpaceIndex + 1);
    }
    else {
        body = textToCopy.substring(bodyIndex);
        path = textToCopy.substring(firstSpaceIndex + 1, bodyIndex).trim();
    }

    // A cluster running the Security plugin uses TLS, so the request needs https, the
    // admin credentials, and -k to accept the self-signed demo certificate.
    var result = "curl";
    if (security) {
        result += " -k -u 'admin:<custom-admin-password>'";
    }
    result += " -X" + httpMethod + " \"" + (security ? "https" : "http") + "://localhost:9200";
    if (!(path.startsWith("/"))) {
        result += "/"; 
    }
    result += path + "\"";

    if (body.length > 0) {
        result += " -H 'Content-Type: application/json' -d'\n" + body + "\n'";
    }

    return result;
}

function findBodyIndex(textToCopy) {
    const requestLineEnd = textToCopy.indexOf("\n");
    if (requestLineEnd == -1) {
        return -1;
    }

    const curlyIndex = textToCopy.indexOf("{", requestLineEnd);
    const bracketIndex = textToCopy.indexOf("[", requestLineEnd);
    if (curlyIndex == -1) {
        return bracketIndex;
    }
    if (bracketIndex == -1) {
        return curlyIndex;
    }

    return Math.min(curlyIndex, bracketIndex);
}
