document.addEventListener('click', function(event) {
    const { target } = event;
    if (target.matches('.feedback-issue')) {
        gtag('event', 'submit_issue_click');
    }
    else if (target.matches('.feedback-edit')) {
        gtag('event', 'edit_page_click');
    }
    else if (target.matches('.feedback-button')) {
        sendFeedback(target);
    }
    else if (target.matches('.send-button')) {
        sendComments(target);
    }
    else if (target.matches('.copy-button')) {
        window.navigator.clipboard.writeText(target.getAttribute('data-text'));
    }
});

document.getElementById("comment").addEventListener("input", function() {
    const text = this.value.trim();
    if(text.length > 0) {
      // send text to GA
      const sendButton = this['nextElementSibling'];
      sendButton.disabled = false;
      sendButton['nextElementSibling']?.classList.add('hidden');
    } 
    else {
      this['nextElementSibling'].disabled = true;
    }
  });

function sendFeedback(button) {
    gtag('event', 'feedback_click', { 
        'helpful': button.value
    });
    // show the hidden feedback text
    /*const parent = button.parentElement;
    const index = [...parent.children].indexOf(button) + 1;
    const sibling = parent.querySelector(`:nth-child(${index}) ~ .text-small.hidden`);*/

    const parent = button.parentElement.parentElement;
    const index = [...parent.children].indexOf(button.parentElement) + 1;
    const sibling = parent.parentElement.querySelector(`:nth-child(${index}) ~ .thank-you`);
    sibling?.classList.remove('hidden');

    // disable the feedback buttons
    button.disabled = true;
    button[button.id === 'yes' ? 'nextElementSibling' : 'previousElementSibling']?.setAttribute('disabled', true);
}

function sendComments(button) {
    gtag('event', 'feedback_comment', { 
        'comment': button.value
    });
    // show the hidden feedback text
    /*const parent = button.parentElement;
    const index = [...parent.children].indexOf(button) + 1;
    const sibling = parent.querySelector(`:nth-child(${index}) ~ .text-small.hidden`);*/

    const parent = button.parentElement.parentElement;
    const index = [...parent.children].indexOf(button.parentElement) + 1;
    const sibling = parent.parentElement.querySelector(`:nth-child(${index}) ~ .thank-you`);
    sibling?.classList.remove('hidden');

    // disable the feedback buttons
    button.disabled = true;
    button[button.id === 'yes' ? 'nextElementSibling' : 'previousElementSibling']?.setAttribute('disabled', true);
}
