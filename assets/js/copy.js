const httpMethods = ["POST", "GET", "PUT", "PATCH", "DELETE", "HEAD"];

const snippets = document.querySelectorAll('pre.highlight');

snippets.forEach(function (snippet) {
    const textToCopy = snippet.innerText.trim();
    if (!(textToCopy.startsWith("{") || textToCopy.startsWith("$"))) {
        var buttonWrap = document.createElement('div');
        buttonWrap.className = 'copy-button-wrap';
        buttonWrap.appendChild(createButton(textToCopy, 'Copy', 'Copy snippet to clipboard', false));

        // See if a code snippet is an HTTP request and add the copy as curl button
        var found = false;

        for (let i = 0; i < httpMethods.length && !found; i++) {
            if (textToCopy.startsWith(httpMethods[i])) { 
                var curlNeeded = true;

                // See if there is more than one HTTP method in the snippet; then no copy as curl needed
                for (let j = 0; j < httpMethods.length; j++) { 
                    if (textToCopy.substring(textToCopy.indexOf(httpMethods[i]) + httpMethods[i].length + 1).indexOf(httpMethods[j]) != -1) {            
                        curlNeeded = false;
                        break;
                    }
                }
                if (curlNeeded) {
                    buttonWrap.appendChild(createButton(textToCopy, 'Copy as cURL', 'Copy snippet as cURL', true));
                }
                found = true;
            }
        }
        snippet.append(buttonWrap);
    }
});

function createButton(textToCopy, buttonText, buttonAriaLabel, curl) {
    var copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.type = 'button';
    copyButton.innerText = buttonText;
    copyButton.ariaLabel = buttonAriaLabel;

    if (curl) {
        copyButton.addEventListener('click', function onClick() {
            // Copy snippet as curl
            window.navigator.clipboard.writeText(addCurl(textToCopy));
        });
    }
    else {
        copyButton.addEventListener('click', function onClick() {
            // Copy snippet to clipboard
            window.navigator.clipboard.writeText(textToCopy);
        });
    }

    return copyButton;
}

function addCurl(textToCopy) {
    const firstSpaceIndex = textToCopy.indexOf(" ");
    const httpMethod = textToCopy.substring(0, firstSpaceIndex);
    
    const firstCurlyIndex = textToCopy.indexOf("{");
    var body;
    var path;
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
