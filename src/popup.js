// Establish communication with background script
let port = chrome.extension.connect({
    name: 'popup',
});
port.postMessage('init');

let flag;
port.onMessage.addListener((msg) => {
    if (msg === 'activate') {
        flag = true;
        document.querySelector('h4').innerText = 'This page uses FusionBoard Charts';
    } else {
        document.querySelector('h4').innerText = 'This page does not uses FusionBoard Charts';
    }
});
