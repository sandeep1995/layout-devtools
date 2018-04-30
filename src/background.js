/* eslint-disable */
let connections = {};

// Receive message from content script and relay to the devTools page for the current tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    chrome.browserAction.setIcon({
        path: request.newIconPath,
        tabId: sender.tab.id,
    });

    // Messages from content scripts should have sender.tab set
    if (sender.tab && request.type === 'TREE_DATA') {
        const tabId = sender.tab.id;
        if (tabId in connections) {
            connections[tabId].postMessage(request);
        } else {
            console.log('Tab not found in connection list.');
        }
    } else {
        console.log('sender.tab not defined.');
    }
    return true;
});

chrome.runtime.onConnect.addListener((port) => {
    // Listen to messages sent from the DevTools page
    port.onMessage.addListener((request) => {
        // Register initial connection
        if (request.name === 'init') {
            connections[request.tabId] = port;

            port.onDisconnect.addListener(() => {
                delete connections[request.tabId];
            });

        } else if (request.name === 'update') {
            /* Receive message from devtools panel and
            relay to the content script of the current tab */
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { request }, (response) => {});
            });
            
        }
    });
});
