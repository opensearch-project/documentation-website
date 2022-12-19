const feedbackButtons = document.querySelectorAll('.feedback-button');

feedbackButtons.forEach((button) => {
    button.addEventListener('click', function onClick(event) {
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
    });
});
