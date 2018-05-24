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
    injectedScript.setAttribute('name', request.request.name);

    injectedScript.setAttribute('nodeid', request.request.nodeid);
    injectedScript.setAttribute('highlight', request.request.highlight);
    injectedScript.setAttribute('unhighlight', request.request.unhighlight);
    injectedScript.setAttribute('width', request.request.width);
    injectedScript.setAttribute('height', request.request.height);
    injectedScript.setAttribute('dag', request.request.tree);
    injectedScript.setAttribute('config', request.request.config);

    injectedScript.src = chrome.extension.getURL('script.js');
    injectedScript.onload = function remove() {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(injectedScript);
});

// Changes the extension icon if inspected page contains class given below
if (document.querySelector('.d2ad88af-7050-4c1c-b407-42745cfe3bd7')) {
    // send message to background script
    chrome.runtime.sendMessage({ newIconPath: 'images/icon2.png' });
}
