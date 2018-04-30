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
let layout = layoutDom.__layout;

let nodeTree = circularJSONStringify(layoutTree);

if (!layoutDom.____devtool_dag_rendered) {
    window.postMessage({ type: 'TREE_DATA', nodeTree }, '*');
    layoutDom.____devtool_dag_rendered = true;
}


if (document.currentScript) {
    let script = document.currentScript;
    let nodeid = script.getAttribute('nodeid');
    let highlight = script.getAttribute('highlight');
    let unhighlight = script.getAttribute('unhighlight');
    let width = script.getAttribute('width');
    let height = script.getAttribute('height');
    if (highlight && nodeid) {
        let highlightText = `${nodeid}\n${width}X${height}`;
        layout.highlight(nodeid, highlightText);
    }

    if (unhighlight === 'true') {
        layout.unHighlight();
    }
}
