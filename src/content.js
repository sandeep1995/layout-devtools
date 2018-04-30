window.addEventListener('message', (event) => {
    // Send data when source is window
    if (event.source !== window) {
        return;
    }
    const message = event.data;
    if (typeof message !== 'object' || message === null) {
        return;
    }
    // Send message to background page
    chrome.runtime.sendMessage(message);
});

// On receiving message from background, inject script.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let injectedScript = document.createElement('script');

    injectedScript.setAttribute('nodeid', request.request.nodeid);
    injectedScript.setAttribute('highlight', request.request.highlight);
    injectedScript.setAttribute('unhighlight', request.request.unhighlight);
    injectedScript.setAttribute('width', request.request.width);
    injectedScript.setAttribute('height', request.request.height);

    injectedScript.src = chrome.extension.getURL('script.js');
    injectedScript.onload = function remove() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(injectedScript);
});
