const snippets = document.querySelectorAll('.copy-div + .highlighter-rouge');
const copyButtons = document.querySelectorAll('.copy-button');

copyButtons.forEach((copyButton, i) => {
  copyButton.addEventListener('click', function onClick() {
        // Copy snippet to clipboard
        window.navigator.clipboard.writeText(snippets[i].innerText);
    });
});
