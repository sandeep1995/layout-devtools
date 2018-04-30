# datatable-devtools

Devtools extension for datatable

----
> datatable-devtools is a chrome devtools extension to vizualize datatable dom nodes in a DAG

----
## prerequisite
1. dom must have a *div* with *data-fbdata* attribute
2. *data-fbdata* contains name of the root node
3. __data__ property of this div has the root datatable object attached to it


## usage
1. Clone the repository
2. npm install - Install all the dependencies
3. npm run build - generate the dist folder
4. Open chrome://extensions
5. Enable developer mode
6. Load dist folder as an unpacked extension
7. Open any page with <div data-fbdata="name"></div> where name is the name of the root node

----
A new tab named 'FusionBoardNodes' is now available under devtools with the DAG representation
