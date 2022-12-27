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
    else if (target.matches('.copy-button')) {
        window.navigator.clipboard.writeText(target.getAttribute('data-text'));
    }
});

function sendFeedback(button) {
    gtag('event', 'feedback_click', { 
        'helpful': button.value
    });
    // show the hidden feedback text
    const parent = button.parentElement;
    const index = [...parent.children].indexOf(button) + 1;
    const sibling = parent.querySelector(`:nth-child(${index}) ~ .text-small.hidden`);
    sibling?.classList.remove('hidden');

    // disable the feedback buttons
    button.disabled = true;
    button[button.id === 'yes' ? 'nextElementSibling' : 'previousElementSibling']?.setAttribute('disabled', true);
}
