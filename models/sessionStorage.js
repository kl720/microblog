var format = require('util').format;
var map = {};
var sessionStorage = {};

sessionStorage.setItem = function(key, value) {
    if (key && value) {
        // util.format is available in Node.js 0.6+
        if (arguments.length > 2 && format) {
            var args = Array.prototype.slice.call(arguments, 1);
            value = format.apply(undefined, args);
        }
        
        if(key=='error')
        {
        	this.removeItem('success');
        }
        else if(key=='success')
        {
        	
        	this.removeItem('error');
        }
        
        return (map[key] = value);
    }
}
sessionStorage.getItem = function(key) {
    if (key && map.hasOwnProperty(key)) {
        return map[key];
    } else {
        return null;
    }
}
sessionStorage.removeItem = function(key) {
    if (key && map.hasOwnProperty(key)) {
        delete map[key];
    }
}
module.exports = sessionStorage;