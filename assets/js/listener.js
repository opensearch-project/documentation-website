document.addEventListener('click', function(event) {
    const { target } = event;
    if (target.matches('.feedback-issue')) {
        gtag('event', 'submit_issue_click');
    }
    else if (target.matches('.feedback-edit')) {
        gtag('event', 'edit_page_click');
    }
    else if (target.matches('.feedback-button')) {
        // enable the send button
        document.getElementById('send').disabled = false;
    }
    else if (target.matches('.send-button')) {
        sendFeedback(target);
    }
    else if (target.matches('.copy-button')) {
        window.navigator.clipboard.writeText(target.getAttribute('data-text'));
    }
    else if (target.matches('.btn-contribute')) {
        window.open('https://github.com/opensearch-project', '_blank');
    }
});

document.getElementById("comment").addEventListener("input", function() {
    const text = this.value.trim();
    const sendButton = this['nextElementSibling'];
    
    if (!document.getElementById('yes').checked && !document.getElementById('no').checked) {
        text.length > 0 ? sendButton.disabled = false : sendButton.disabled = true;
    }
});

function sendFeedback(button) {
    // get and send the `helpful` value
    let helpful = 'none';
    if (document.getElementById('yes').checked) {
        helpful = 'yes';
    }
    else if (document.getElementById('no').checked) {
        helpful = 'no';
    }

    if (helpful !== 'none') {
        gtag('event', 'feedback_click', { 
            'helpful': helpful
        });
    }

    // get and send the comment
    const comment = document.getElementById('comment').value.trim();
    if(comment.length > 0) {
        gtag('event', 'feedback_comment', { 
            'comment': comment,
            'helpful': helpful
        });
    }

    // show the hidden feedback text
    const parent = button.parentElement;
    const index = [...parent.children].indexOf(button) + 1;
    const sibling = parent.parentElement.querySelector(`:nth-child(${index}) ~ .thank-you`);
    sibling?.classList.remove('hidden');

    // disable the feedback buttons
    document.getElementById('yes').disabled = true;
    document.getElementById('no').disabled = true;

    // disable the text area
    document.getElementById('comment').disabled = true;

    // disable the send button
    button.disabled = true;
}
