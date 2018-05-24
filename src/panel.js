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

// refreshing devtools when inspected page is refreshed
chrome.tabs.onUpdated.addListener((tabId, changes, tabObject) => {
    if (changes.status === 'complete') {
        window.location.reload();
    }
});

/**
 * function to re-render the tree
 */
function render() {
    tree.render();
    tree.nodeName(d => d.data._id);
    tree.pathName('instance1', '_parentCut');
}

port.onMessage.addListener((msg) => {
    if (document.querySelector('#chart svg')) {
        document.querySelector('#chart svg').remove();
    }

    if (msg.operation === 'initialize') {
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
        render();
    } else if (msg.operation === 'delete') {
        tree.updateData(JSON.parse(msg.nodeTree));
        render();
    } else if (msg.operation === 'updateNode') {
        tree.updateData(JSON.parse(msg.nodeTree));
        render();
    } else if (msg.operation === 'addNode') {
        tree.updateData(JSON.parse(msg.nodeTree));
        render();
    } else if (msg.operation === 'layoutDef') {
        window.nodeLayoutDef = JSON.stringify(JSON.parse(msg.layoutDef));
        let paragraph = document.createElement('p');
        paragraph.setAttribute('id', 'configPara');
        let nodeLayoutConfig = document.createTextNode(JSON.stringify(JSON.parse(msg.layoutDef), null, '\t'));
        paragraph.appendChild(nodeLayoutConfig);
        document.getElementById('configCard').appendChild(paragraph);
        document.getElementById('configCard').style.display = 'block';
        document.getElementsByClassName('card')[0].style.display = 'block';
        document.getElementById('copylayoutDefinition').style.display = 'block';

        render();

        let menuBox = document.querySelector('.menu');
        menuBox.style.display = 'none';
        let close = document.querySelector('.close');
        close.style.display = 'none';
        let add = document.querySelector('.add');
        add.style.display = 'none';
        let update = document.querySelector('.update');
        update.style.display = 'none';
    } else if (msg.operation === 'layoutNodeInfo') {
        let paragraph1 = document.createElement('p');
        paragraph1.setAttribute('id', 'nodeDetailsPara');
        let nodeLayoutInfo = document.createTextNode(`Node ID: ${JSON.stringify(msg.nodeInfo._id)}`);
        paragraph1.appendChild(nodeLayoutInfo);
        let paragraph2 = document.createElement('p');
        paragraph2.setAttribute('id', 'nodeDetailsPara1');
        let nodeLayoutInfo1 = document.createTextNode(`Children: ${JSON.stringify(msg.nodeInfo.lanes)}`);
        paragraph2.appendChild(nodeLayoutInfo1);
        document.getElementById('NodeConfigCard').appendChild(paragraph1);
        document.getElementById('NodeConfigCard').appendChild(paragraph2);
        document.getElementById('NodeConfigCard').style.display = 'block';
        document.getElementsByClassName('nodeCard')[0].style.display = 'block';

        render();

        let menuBox = document.querySelector('.menu');
        menuBox.style.display = 'none';
        let close = document.querySelector('.close');
        close.style.display = 'none';
        let add = document.querySelector('.add');
        add.style.display = 'none';
        let update = document.querySelector('.update');
        update.style.display = 'none';
    }

    // Initializing the node value variable to pass the variable to eventlisteners
    if (msg.operation === 'initialize') {
        let nodeValue = null;

        // Click event listener on Nodes.
        document.addEventListener('click', (e) => {
            if (e.target.className.baseVal === 'node') {
                let { width, height } = e.target.__data__.data.boundBox;
                port.postMessage({
                    name: 'update',
                    nodeid: e.target.__data__.data._id,
                    highlight: true,
                    width,
                    height,
                });
            } else if (e.target.id === 'layoutDefinition') {
                let menuBox = document.querySelector('.menu');
                menuBox.style.display = 'none';
                let close = document.querySelector('.close');
                close.style.display = 'none';
                let add = document.querySelector('.add');
                add.style.display = 'none';
                let update = document.querySelector('.update');
                update.style.display = 'none';
                port.postMessage({ name: 'layoutDefinition', unhighlight: true, nodeid: nodeValue });
                nodeValue = null;
            } else if (e.target.id === 'deleteNode') {
                let menuBox = document.querySelector('.menu');
                menuBox.style.display = 'none';
                let close = document.querySelector('.close');
                close.style.display = 'none';
                let add = document.querySelector('.add');
                add.style.display = 'none';
                let update = document.querySelector('.update');
                update.style.display = 'none';
                port.postMessage({ name: 'delete', unhighlight: true, nodeid: nodeValue });
                nodeValue = null;
            } else if (e.target.id === 'updateNode' || e.target.id === 'updateNodecircle') {
                let menuBox = document.querySelector('.menu');
                menuBox.style.display = 'none';
                let editBox = document.querySelector('.EditNode');
                editBox.style.display = 'block';
            } else if (e.target.id === 'submitUpdatedNode') {
                if (document.getElementById('cut').value === '' || document.getElementById('ratioWeight').value === '') {
                    alert('Please Enter all the fields!');
                } else {
                    let editBox = document.querySelector('.EditNode');
                    editBox.style.display = 'none';
                    let update = document.querySelector('.update');
                    update.style.display = 'none';
                    let add = document.querySelector('.add');
                    let close = document.querySelector('.close');
                    add.style.display = 'none';
                    close.style.display = 'none';
                    let nodeConfig = {
                        cut: document.getElementById('cut').value,
                        ratioWeight: document.getElementById('ratioWeight').value,
                    };
                    port.postMessage({
                        name: 'updateNode', unhighlight: true, nodeid: nodeValue, config: JSON.stringify(nodeConfig),
                    });
                    nodeValue = null;
                }
            } else if (e.target.id === 'submitUpdatedNodeCancel') {
                let editBox = document.querySelector('.EditNode');
                editBox.style.display = 'none';
                let update = document.querySelector('.update');
                update.style.display = 'none';
                let add = document.querySelector('.add');
                let close = document.querySelector('.close');
                add.style.display = 'none';
                close.style.display = 'none';
                document.getElementById('cut').value = '';
                document.getElementById('ratioWeight').value = '';
            } else if (e.target.id === 'nodeInfo') {
                port.postMessage({ name: 'nodeInfo', unhighlight: true, nodeid: nodeValue });
                nodeValue = null;
                let menuBox = document.querySelector('.menu');
                menuBox.style.display = 'none';
            } else if (e.target.id === 'addNode') {
                let menuBox = document.querySelector('.menu');
                menuBox.style.display = 'none';
                let editBox = document.querySelector('.AddNode');
                editBox.style.display = 'block';
            } else if (e.target.id === 'submitAddNode') {
                if (document.getElementById('nodeChildren').value === '') {
                    alert('Please Enter all the fields!');
                } else {
                    let editBox = document.querySelector('.AddNode');
                    editBox.style.display = 'none';
                    let close = document.querySelector('.close');
                    close.style.display = 'none';
                    let add = document.querySelector('.add');
                    add.style.display = 'none';
                    let update = document.querySelector('.update');
                    update.style.display = 'none';
                    port.postMessage({
                        name: 'addNode', unhighlight: true, nodeid: nodeValue, config: document.getElementById('nodeChildren').value,
                    });
                    nodeValue = null;
                }
            } else if (e.target.id === 'submitAddNodeCancel') {
                let editBox = document.querySelector('.AddNode');
                editBox.style.display = 'none';
                let add = document.querySelector('.add');
                let close = document.querySelector('.close');
                let update = document.querySelector('.update');
                update.style.display = 'none';
                add.style.display = 'none';
                close.style.display = 'none';
                document.getElementById('nodeChildren').value = '';
            } else if (e.target.id === 'copylayoutDefinition') {
                let dummy = document.createElement('input');
                document.body.appendChild(dummy);
                dummy.setAttribute('value', window.nodeLayoutDef);
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                window.nodeLayoutDef = null;
                if (document.getElementById('configCard') !== null) { document.getElementById('configCard').style.display = 'none'; }
                if (document.getElementById('card') !== null) { document.getElementsByClassName('card')[0].style.display = 'none'; }
                if (document.getElementById('copylayoutDefinition') !== null) { document.getElementById('copylayoutDefinition').style.display = 'none'; }
                if (document.getElementById('configPara') !== null) { document.getElementById('configPara').remove(); }
                document.getElementById('copyAlert').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('copyAlert').style.display = 'none';
                }, 1000);
            } else {
                let menuBox = document.querySelector('.menu');
                menuBox.style.display = 'none';
                let close = document.querySelector('.close');
                let add = document.querySelector('.add');
                let update = document.querySelector('.update');
                close.style.display = 'none';
                add.style.display = 'none';
                update.style.display = 'none';

                if (document.getElementById('configCard') !== null) { document.getElementById('configCard').style.display = 'none'; }
                if (document.getElementsByClassName('card')[0] !== null) { document.getElementsByClassName('card')[0].style.display = 'none'; }
                if (document.getElementById('copylayoutDefinition') !== null) { document.getElementById('copylayoutDefinition').style.display = 'none'; }
                if (document.getElementById('configPara') !== null) { document.getElementById('configPara').remove(); }
                if (document.getElementById('nodeConfigCard') !== null) { document.getElementById('nodeConfigCard').style.display = 'none'; }
                if (document.getElementsByClassName('nodeCard')[0] !== null) { document.getElementsByClassName('nodeCard')[0].style.display = 'none'; }
                if (document.getElementById('nodeDetailsPara') !== null) { document.getElementById('nodeDetailsPara').remove(); }
                if (document.getElementById('nodeDetailsPara1') !== null) { document.getElementById('nodeDetailsPara1').remove(); }


                port.postMessage({ name: 'update', unhighlight: true });
            }
        });

        // Context menu Event Listener on Nodes.
        document.addEventListener('contextmenu', (e) => {
            if (document.getElementById('configCard') !== null) { document.getElementById('configCard').style.display = 'none'; }
            if (document.getElementsByClassName('card')[0] !== null) { document.getElementsByClassName('card')[0].style.display = 'none'; }
            if (document.getElementById('copylayoutDefinition') !== null) { document.getElementById('copylayoutDefinition').style.display = 'none'; }
            if (document.getElementById('configPara') !== null) { document.getElementById('configPara').remove(); }
            if (document.getElementById('nodeConfigCard') !== null) { document.getElementById('nodeConfigCard').style.display = 'none'; }
            if (document.getElementsByClassName('nodeCard')[0] !== null) { document.getElementsByClassName('nodeCard')[0].style.display = 'none'; }
            if (document.getElementById('nodeDetailsPara') !== null) { document.getElementById('nodeDetailsPara').remove(); }
            if (document.getElementById('nodeDetailsPara1') !== null) { document.getElementById('nodeDetailsPara1').remove(); }

            let menuBox = document.querySelector('.menu');
            if (e.target.className.baseVal === 'node') {
                e.preventDefault();
                nodeValue = e.target.__data__.data._id;
                const left = e.clientX;
                const top = e.clientY;
                menuBox.style.left = `${left}px`;
                menuBox.style.top = `${top}px`;
                menuBox.style.display = 'block';
                if (e.target.__data__.parent === null) {
                    let deleteMenu = document.querySelector('#deleteNode');
                    deleteMenu.style.display = 'none';
                } else {
                    let deleteMenu = document.querySelector('#deleteNode');
                    deleteMenu.style.display = 'block';
                }
            } else {
                menuBox.style.display = 'none';
            }
        }, false);

        // Mouse Hovering events in Panel.HTML page
        document.addEventListener('mouseover', (e) => {
            if (e.target.className.baseVal === 'node') {
                let close = document.querySelector('.close');
                let add = document.querySelector('.add');
                let update = document.querySelector('.update');
                add.style.display = 'block';
                update.style.display = 'block';
                let dimension = e.target.getClientRects();
                let x = dimension[0].right;
                let y = dimension[0].top;
                close.style.left = `${x + window.pageXOffset}px`;
                close.style.top = `${y + window.pageYOffset}px`;
                add.style.left = `${x + 20 + window.pageXOffset}px`;
                add.style.top = `${y + window.pageYOffset}px`;
                update.style.left = `${x + 33 + window.pageXOffset}px`;
                update.style.top = `${y + (window.pageYOffset - 6)}px`;
                nodeValue = e.target.__data__.data._id;
                if (e.target.__data__.parent === null) {
                    close.style.display = 'none';
                    add.style.left = `${x + window.pageXOffset}px`;
                    update.style.left = `${x + 13 + window.pageXOffset}px`;
                } else {
                    close.style.display = 'block';
                }
            }
        });
    }
});

