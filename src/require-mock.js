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
  var file = fs.readFileSync(url, 'utf8');
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

//Backbone mock as default extend for empty dependency
var createBackbone = function(){
  return {
    Model : {
      extend : extend
    },
    Collection : {
      extend : extend
    },
    View : {
      extend : extend
    }
  }
}; 
 
//This method is used if the require is included inline via being passed in define(require);
var createRequire = function(reqDeps){
  this.requireDeps = reqDeps;
  var that = this;
  return function(url){
    var transform = createBackbone();
    for(var prop in that.requireDeps) {
      if(that.requireDeps.hasOwnProperty(prop)){
        if(url === prop){
          transform = that.requireDeps[prop];  
        } 
      }
    }
    return transform;
  }
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
    var newArray = [];
    
    //If no custom Dendencies
    if(!deps){
      deps = {};
    }

    //If require is passed in the define to allow inline require statements
    //Backbone must be supplied as a custom Dependency 
    if(!arguments[1] && deps.hasOwnProperty('require')){
      func = arguments[0];
    }

    var args = getArguments(func);
    args.forEach(function(arg){
      if(deps[arg]){
        if(arg === "require"){
          deps[arg] = new createRequire(deps[arg]);
        }
        newArray.push(deps[arg]);
      }else{
        newArray.push({ extend : extend });  
      }
    });

    return func.apply(this,newArray);

  }

  return eval(data);

}

module.exports = Mock;