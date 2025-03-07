const yesButton = document.getElementById('yes');
const noButton = document.getElementById('no');
const numCharsLabel = document.getElementById('num-chars');
const sendButton = document.getElementById('send');
const commentTextArea = document.getElementById('comment');
const thankYouText = document.getElementById('thank-you');
const nav = document.getElementById('site-nav');
const versionPanel = document.getElementById('version-panel');
document.addEventListener('DOMContentLoaded', updateTextArea);

document.addEventListener('click', function(event) {
    const { target } = event;
    if (target.matches('.feedback-issue')) {
        gtag('event', 'submit_issue_click');
    }
    else if (target.matches('.feedback-edit')) {
        gtag('event', 'edit_page_click');
    }
    else if (target.matches('.feedback-forum')) {
        gtag('event', 'forum_link_click');
    }
    else if (target.matches('.feedback-button')) {
        sendButton.disabled = false;
    }
    else if (target.matches('.send-button')) {
        sendFeedback();
    }
    // else if (target.matches('.copy-button')) {
    //     window.navigator.clipboard.writeText(target.getAttribute('data-text'));
    // }
});

nav.addEventListener('scroll',(e)=>{  
    if(nav.scrollTop > 0){
      versionPanel.classList.add("nav-shadow");
    }else{
      versionPanel.classList.remove("nav-shadow");
    }
  });

commentTextArea.addEventListener('input', updateTextArea);

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
    // Get all tab content and buttons
    var tabContent = event.target.closest('.code-tabs').getElementsByClassName('tab');
    var tabButtons = event.target.closest('.code-tabs').getElementsByClassName('tab-button');
    
    // Hide all tabs
    for (var i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    
    // Remove active class from all buttons
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }
    
    // Show the selected tab
    document.getElementById(tabId).style.display = "block";
    event.currentTarget.className += " active";
}

// Add click handlers when document is ready
document.addEventListener('DOMContentLoaded', function() {
    var tabButtons = document.getElementsByClassName('tab-button');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].addEventListener('click', function(e) {
            switchTab(e, this.getAttribute('data-tab'));
        });
    }
});

function copyCode(button) {
    // Find the code block
    const codeBlock = button.parentElement.querySelector('pre');
    const code = codeBlock.textContent;

    // Copy the code
    window.navigator.clipboard.writeText(code).then(() => {
        // Visual feedback
        button.textContent = 'Copied!';
        button.classList.add('copied');

        // Reset button after 2 seconds
        setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        button.textContent = 'Failed to copy';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    });
}
