const feedbackIssueLinks = document.querySelectorAll('.feedback-issue');
addLinkListener(feedbackIssueLinks, 'submit_issue_click');

const feedbackEditLinks = document.querySelectorAll('.feedback-edit');
addLinkListener(feedbackEditLinks, 'edit_page_click');

function addLinkListener(links, eventName) {
    links.forEach((link) => {
        link.addEventListener('click', function onClick(event) {
            gtag('event', eventName);
        });
    });
}