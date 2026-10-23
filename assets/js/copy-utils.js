// Converts a Dev Tools request into a cURL command. Shared by the Copy as cURL buttons.

// Convert """ and escape the characters that JSON requires
function handleTripleQuotes(text) {
    return text.replace(/"""([\s\S]*?)"""/g, function(_, content) {
        let escaped = content.replace(/\\/g, '\\\\');
        escaped = escaped.replace(/"/g, '\\"');
        escaped = escaped.replace(/\n/g, '\\n');
        escaped = escaped.replace(/\r/g, '\\r');
        escaped = escaped.replace(/\t/g, '\\t');
        return '"' + escaped + '"';
    });
}

// Avoid single quotation mark ending the shell string
function escapeSingleQuotes(text) {
    return text.replace(/'/g, "'\\''");
}

function convertToCurl(textToCopy, security) {
    const firstSpaceIndex = textToCopy.indexOf(" ");
    const httpMethod = textToCopy.substring(0, firstSpaceIndex);

    const bodyIndex = findBodyIndex(textToCopy);
    let body;
    let path;
    if (bodyIndex == -1) {
        body = "";
        path = textToCopy.substring(firstSpaceIndex + 1).trim();
    }
    else {
        body = textToCopy.substring(bodyIndex);
        path = textToCopy.substring(firstSpaceIndex + 1, bodyIndex).trim();
    }

    // Add https, admin credentials, and -k for clusters with Security plugin 
    var result = "curl";
    if (security) {
        result += " -k -u 'admin:<custom-admin-password>'";
    }
    result += " -X" + httpMethod + " \"" + (security ? "https" : "http") + "://localhost:9200";
    if (!(path.startsWith("/"))) {
        result += "/";
    }
    result += addPretty(path) + "\"";

    if (body.length > 0) {
        result += " -H 'Content-Type: application/json' -d'\n" + escapeSingleQuotes(handleTripleQuotes(body)) + "\n'";
    }

    return result;
}

// Add the pretty parameter if needed
function addPretty(path) {
    if (/[?&]pretty(=|&|$)/.test(path)) {
        return path;
    }
    return path + (path.includes("?") ? "&" : "?") + "pretty";
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

window.CopyUtils = {
    handleTripleQuotes,
    escapeSingleQuotes,
    convertToCurl
};
