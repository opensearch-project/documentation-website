const contributeButton = document.getElementById('contribute');

if (contributeButton && contributeButton.addEventListener) {
    contributeButton.addEventListener('click', function(event) {
        window.open('https://github.com/opensearch-project', '_blank');
    });
}