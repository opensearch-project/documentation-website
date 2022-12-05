const feedbackButtons = document.querySelectorAll('.feedback-button');

feedbackButtons.forEach((button) => {
    button.addEventListener('click', function onClick(event) {
        var url = window.location.href;
        console.log(url);
        console.log(button.value);
        gtag('event', 'feedback', { 
            'event_category': url, 
            'event_action': button.value
        });
    });
});
