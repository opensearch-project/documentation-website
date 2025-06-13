const yesButton = document.getElementById('yes');
const noButton = document.getElementById('no');
const numCharsLabel = document.getElementById('num-chars');
const sendButton = document.getElementById('send');
const commentTextArea = document.getElementById('comment');
const thankYouText = document.getElementById('thank-you');
const nav = document.getElementById('site-nav');
const versionPanel = document.getElementById('version-panel');

// Single click event listener for the entire document
document.addEventListener('click', function(event) {
    const { target } = event;

    // Handle old-style buttons first
    if (target.matches('.copy-button') && target.hasAttribute('data-text')) {
        window.navigator.clipboard.writeText(target.getAttribute('data-text'));
        return; // Exit early to avoid multiple handlers
    }

    // Handle new-style buttons and other clicks
    const clickHandlers = {
        '.feedback-issue': () => gtag('event', 'submit_issue_click'),
        '.feedback-edit': () => gtag('event', 'edit_page_click'),
        '.feedback-forum': () => gtag('event', 'forum_link_click'),
        '.feedback-button': () => sendButton.disabled = false,
        '.send-button': () => sendFeedback(),
        '.tab-button': () => switchTab(event, target.getAttribute('data-tab')),
        '.copy-code-button': () => copyCode(target),
        '.copy-curl-button': () => copyAsCurl(target)
    };

    for (const [selector, handler] of Object.entries(clickHandlers)) {
        if (target.matches(selector)) {
            handler();
            break;
        }
    }
});

// Event listeners
document.addEventListener('DOMContentLoaded', updateTextArea);

commentTextArea.addEventListener('input', updateTextArea);

nav.addEventListener('scroll', (e) => {
    if (nav.scrollTop > 0) {
        versionPanel.classList.add('nav-shadow');
    } else {
        versionPanel.classList.remove('nav-shadow');
    }
});

function updateTextArea() {
    const text = commentTextArea.value.trim();
    
    if (!yesButton.checked && !noButton.checked) {
        text.length > 0 ? sendButton.disabled = false : sendButton.disabled = true;
    }

    // calculate the number of characters remaining
    counter = 350 - commentTextArea.value.length;
    numCharsLabel.innerText = counter + " characters left";
}


function sendFeedback() {
    let helpful = 'none';
    if (yesButton.checked) {
        helpful = 'yes';
    }
    else if (noButton.checked) {
        helpful = 'no';
    }
    
    let comment = commentTextArea.value.trim();
    if(comment.length == 0) {
        comment = 'none';
    }

    if (helpful === 'none' && comment === 'none') return;

    // split the comment into 100-char parts because of GA limitation on custom dimensions
    const commentLines = ["", "", "", ""];
    for (let i = 0; i <= (comment.length - 1)/100; i++) {
        commentLines[i] = comment.substring(i * 100, Math.min((i + 1)*100, comment.length));
    }

    gtag('event', 'feedback_click', { 
        'helpful': helpful,
        'comment': commentLines[0],
        'comment_2': commentLines[1],
        'comment_3': commentLines[2],
        'comment_4': commentLines[3],
    });

    // show the hidden feedback text
    thankYouText.classList.remove('hidden');

    // disable the feedback buttons
    yesButton.disabled = true;
    noButton.disabled = true;

    // disable the text area
    commentTextArea.disabled = true;

    // disable the send button
    sendButton.disabled = true;
}

function switchTab(event, tabId) {
    const container = event.target.closest('.code-tabs');
    const tabContent = container.getElementsByClassName('tab');
    const tabButtons = container.getElementsByClassName('tab-button');
    
    // Remove active class from all tabs and buttons
    Array.from(tabContent).forEach(tab => {
        tab.classList.remove('active');
    });
    
    Array.from(tabButtons).forEach(button => {
        button.classList.remove('active');
    });
    
    // Add active class to selected tab and button
    const selectedTab = container.querySelector(`#${tabId}`);
    selectedTab.classList.add('active');
    event.target.classList.add('active');
}

function copyCode(button) {
    const codeBlock = button.closest('.code-container').querySelector('pre');
    const code = codeBlock.textContent.trim(); 
    window.navigator.clipboard.writeText(code);
}

function copyAsCurl(button) {
    const codeBlock = button.closest('.code-container').querySelector('pre');
    const code = codeBlock.textContent.trim(); 
    
    const lines = code.split('\n');
    const [method, path] = lines[0].trim().split(' ');
    const body = lines.slice(1).join('\n');
    
    const formattedPath = path.startsWith('/') ? path : '/' + path;
    const curlCommand = body 
        ? `curl -X ${method} "localhost:9200${formattedPath}" -H "Content-Type: application/json" -d '\n${body}\n'`
        : `curl -X ${method} "localhost:9200${formattedPath}"`;
        
    window.navigator.clipboard.writeText(curlCommand);
}