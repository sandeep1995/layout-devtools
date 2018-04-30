import * as dag from 'hierarcial-data-representation/src/';

(() => {
    // load injected script file
    const xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL('/script.js'), false);
    xhr.send();
    const script = xhr.responseText;
    // inject into inspectedWindow
    chrome.devtools.inspectedWindow.eval(script);
})();

// Establish a connection with background
const port = chrome.runtime.connect({
    name: 'panel',
});

port.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId,
    text: 'checking',
});

port.onMessage.addListener((msg) => {
    if (document.querySelector('#chart svg')) {
        document.querySelector('#chart svg').remove();
    }

    // get the node tree structure in nodehierarchy variable
    const treeConfig = JSON.parse(msg.nodeTree);

    // Render Dag
    let Dag = dag.default;
    let dagFn = Dag('#chart');

    let config = {
        margin: {
            top: 50,
            right: 0,
            bottom: 0,
            left: 250,
        },

        width: 500,
        height: 1000,
        nodeSize: 35,

        children: 'children',
    };

    window.tree = dagFn(treeConfig, config);

    tree.render();

    tree.nodeName(d => d.data._id);

    tree.pathName('_parentCut');

    tree.on('click', (evt) => {
        let { width, height } = evt.data.boundBox;

        port.postMessage({
            name: 'update',
            nodeid: evt.data._id,
            highlight: true,
            width,
            height,
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.nodeName !== 'circle') {
            port.postMessage({ name: 'update', unhighlight: true });
        }
    });
});
