function circularJSONStringify(obj) {
    const cache = [];
    const result = JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache.length = 0;
    return result;
}

let layoutDom = document.querySelector('.d2ad88af-7050-4c1c-b407-42745cfe3bd7');
let layoutTree = layoutDom.__logicalTree;
let layout = layoutDom._layout;

let nodeTree = circularJSONStringify(layoutTree);

if (!layoutDom.____devtool_dag_rendered) {
    window.postMessage({ type: 'TREE_DATA', nodeTree, operation: 'initialize' }, '*');
    layoutDom.____devtool_dag_rendered = true;
}


if (document.currentScript) {
    let script = document.currentScript;
    let name = script.getAttribute('name');
    let nodeid = script.getAttribute('nodeid');
    let unhighlight = script.getAttribute('unhighlight');

    switch (name) {
    case 'delete':
        layout.deleteNode(nodeid);
        if (unhighlight === 'true') {
            layout.unHighlight();
        }
        nodeTree = circularJSONStringify(layout.tree);
        window.postMessage({ type: 'TREE_DATA', nodeTree, operation: 'delete' }, '*');
        break;
    case 'update':
        let highlight = script.getAttribute('highlight');
        let width = script.getAttribute('width');
        let height = script.getAttribute('height');
        if (highlight && nodeid) {
            let highlightText = `${nodeid}\n${width}X${height}`;
            layout.highlight(nodeid, highlightText);
        }
        if (unhighlight === 'true') {
            layout.unHighlight();
        }
        break;
    case 'layoutDefinition':
        let configLayout = layout.exportLayoutDefinition(nodeid);
        if (unhighlight === 'true') {
            layout.unHighlight();
        }
        let layoutDef = configLayout;
        window.postMessage({ type: 'TREE_DATA', layoutDef, operation: 'layoutDef' }, '*');
        break;
    case 'updateNode':
        let config = script.getAttribute('config');
        config = JSON.parse(config);
        config._id = nodeid;
        config.ratioWeight = Number(config.ratioWeight);
        layout.updateNode(config);
        if (unhighlight === 'true') {
            layout.unHighlight();
        }
        nodeTree = circularJSONStringify(layout.tree);
        window.postMessage({ type: 'TREE_DATA', nodeTree, operation: 'updateNode' }, '*');
        break;
    case 'nodeInfo':
        let nodeInfo = layout.getNode(nodeid);
        if (unhighlight === 'true') {
            layout.unHighlight();
        }
        window.postMessage({ type: 'TREE_DATA', nodeInfo, operation: 'layoutNodeInfo' }, '*');
        break;
    case 'addNode':
        let configNodeArray = script.getAttribute('config');
        configNodeArray = JSON.parse(configNodeArray);
        configNodeArray.forEach((element) => {
            if (!element.lanes) {
                element.lanes = [];
            }
        });
        layout.addNode(nodeid, configNodeArray);
        if (unhighlight === 'true') {
            layout.unHighlight();
        }
        nodeTree = circularJSONStringify(layout.tree);
        window.postMessage({ type: 'TREE_DATA', nodeTree, operation: 'addNode' }, '*');
        break;
    }
}
