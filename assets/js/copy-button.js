const copyLabels = document.querySelectorAll('.copy-label');
const copyCurlLabels = document.querySelectorAll('.copy-curl-label');

addButtons(copyLabels, false);
addButtons(copyCurlLabels, true);

function addButtons(labels, curl) {
    labels.forEach((copyLabel) => {
        const snippet = copyLabel.parentNode.previousElementSibling;
        const text = snippet.innerText.trim();

        var buttonWrap = document.createElement('div');
        buttonWrap.className = 'copy-button-wrap';
        buttonWrap.appendChild(createButton(text, 'Copy', 'Copy snippet to clipboard', false));
        if (curl) {           
            buttonWrap.appendChild(createButton(text, 'Copy as cURL', 'Copy snippet as cURL', true));
        }
        
        snippet.style.marginBottom = 0;
        snippet.style.paddingBottom = 0;
        snippet.parentNode.replaceChild(buttonWrap, snippet.nextElementSibling);
    });
}

function createButton(textToCopy, buttonText, buttonAriaLabel, curl) {
    var copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.type = 'button';
    copyButton.innerText = buttonText;
    copyButton.ariaLabel = buttonAriaLabel;

    if (curl) {
        copyButton.setAttribute('data-text', addCurl(textToCopy));
    }
    else {
        copyButton.setAttribute('data-text', textToCopy);
    }

    return copyButton;
}

function addCurl(textToCopy) {
    const firstSpaceIndex = textToCopy.indexOf(" ");
    const httpMethod = textToCopy.substring(0, firstSpaceIndex);

    const firstCurlyIndex = textToCopy.indexOf("{");
    let body;
    let path;
    if (firstCurlyIndex == -1) {
        body = "";
        path = textToCopy.substring(firstSpaceIndex + 1);
    }
    else {
        body = textToCopy.substring(firstCurlyIndex); 
        path = textToCopy.substring(firstSpaceIndex + 1, firstCurlyIndex).trim();
    }

    var result = "curl -X" + httpMethod + " \"http://localhost:9200";
    if (!(path.startsWith("/"))) {
        result += "/"; 
    }
    result += path + "\"";

    if (body.length > 0) {
        result += " -H 'Content-Type: application/json' -d'\n" + body + "'";
    }

    return result;
}