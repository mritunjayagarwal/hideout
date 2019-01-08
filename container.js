const dependable = require('dependable');
const path = require('path');
const container = dependable.container();
const myModules = [
    ['_', 'lodash'],
    ['passport', 'passport'],
    ['async', 'async'],
    ['Tweet', './models/tweet'],
    ['User', './models/user']
];

myModules.forEach(function(val){
    container.register(val[0], function(){
        return require(val[1]);
    });
});

container.load(path.join(__dirname, '/controllers'));
container.load(path.join(__dirname, '/helpers'));

container.register(container, function(){
    return container;
});

module.exports = container;