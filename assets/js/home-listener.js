const contributeButton = document.getElementById('contribute');

contributeButton.addEventListener('click', function(event) {
    window.open('https://github.com/opensearch-project', '_blank');
});

window.addEventListener("DOMContentLoaded", function (e) {
    TimeMe.startTimer(window.location.pathname);
});

window.addEventListener("beforeunload", function (e) {
    TimeMe.stopTimer(window.location.pathname);
});