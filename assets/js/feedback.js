const feedbackButtons = document.querySelectorAll('.feedback-button');

feedbackButtons.forEach((button) => {
    button.addEventListener('click', function onClick(event) {
        gtag('event', 'feedback_click', { 
            'helpful': button.value
        });
        // find the hidden feedback text
        sibling = button.nextElementSibling;

        while (!(sibling.classList.contains('text-small') && sibling.classList.contains('hidden'))) {
            sibling = sibling.nextElementSibling;
        }
        // show the hidden feedback text
        if (sibling != null) {
            sibling.classList.remove('hidden');
        }

        // disable the feedback buttons
        button.disabled = true;
        var buttonSibling;
        if (button.id === 'yes') {
            buttonSibling = button.nextElementSibling;
        }
        else {
            buttonSibling = button.previousElementSibling;
        }
        if (buttonSibling != null) {
            buttonSibling.disabled = true;
        }
    });
});