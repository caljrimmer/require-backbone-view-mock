/**
* Require Mock
*
* Takes any Backbone View and allows mocked dependency injection. It returns an object with all methods public.
*
* Example:
* var requireMock = require("path/to/requireMock");
*
* var view = requireMock("path/to/view",{
*   _ : require("path/to/underscore"),
*   custom : {
*     method : function(arg){
*       return args;
*     }  
*   } 
* });
* 
* view will now have all its methods made public to unit test.
*
**/

var fs = require('fs');

//Grab the required file
//Pull out url and mocked dependencies

var Mock = function(url,deps){
  var file = fs.readFileSync(__dirname + '/' + url, 'utf8');
  var obj = getControllers(file,deps);
  return obj;
}

//Underscore Extend Function
//Extend added as default to all empty dependencies
var extend = function(obj) { 
  
  var isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };    
  
  
  if (!isObject(obj)) return obj;
  var source, prop;
  for (var i = 1, length = arguments.length; i < length; i++) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProperty.call(source, prop)) {
        obj[prop] = source[prop];
      }
    }
  }  
  return obj; 
};  

//Finds dependenies in required file
//syncs supplied dependcies with expected dependencies
//if no supplied dependcies it returns a blank object (+ extend methdd)
var getControllers = function(data,deps){

  var getArguments = function(func){
    return func.toString()
      .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
      .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
      .split(/,/)
  }

  var define = function(dep,func){
    if(!deps){
      deps = {};
    }
    var args = getArguments(func);
    var newArray = [];
    args.forEach(function(arg){
      if(deps[arg]){
        newArray.push(deps[arg])
      }else{
        newArray.push({ extend : extend });  
      }
      
    });
    return func.apply(this,newArray);
  }
  return eval(data);

}

module.exports = Mock;