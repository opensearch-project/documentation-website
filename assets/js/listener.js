const yesButton = document.getElementById('yes');
const noButton = document.getElementById('no');
const numCharsLabel = document.getElementById('num-chars');
const sendButton = document.getElementById('send');
const commentTextArea = document.getElementById('comment');
const thankYouText = document.getElementById('thank-you');

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
    else if (target.matches('.copy-button')) {
        window.navigator.clipboard.writeText(target.getAttribute('data-text'));
    }
    else if (target.matches('.btn-contribute')) {
        window.open('https://github.com/opensearch-project', '_blank');
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
