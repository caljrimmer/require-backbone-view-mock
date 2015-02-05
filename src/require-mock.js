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

//Jquery Extend Function
//Extend added as default to all empty dependencies
var extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;

    // Skip the boolean and the target
    target = arguments[ i ] || {};
    i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
    target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if ( i === length ) {
    target = this;
    i--;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : [];

          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = jQuery.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
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