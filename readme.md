# RBMV

RBMV is a dependency injector for require.js users to make Backbone views easy to unit test. No need for a headless browsers and it works with any testing framework.

## Installation

```
npm install rbmv
```

## API

### constructor

First you have to require RBMV. The rest of the documentation will assume you already loaded RBMV as a module dependency.

#### Default Configuration

```javascript
  var rbmv = require("rbmv");
```

### rbmv(url,dependencies)
 
without defined dependencies  
               
```javascript
var rbmv = require("rbmv"); 
var mockedView = rbmv(__dirname + "path/to/view");
```

with defined dependencies

```javascript
var rbmv = require("rbmv"); 

var mockedView = rbmv(__dirname + "path/to/view",{
   _ : require("path/to/underscore"),
   custom : {
     method : function(arg){
       return args;
     }  
   } 
});
``` 

Dependencies are optional. If any dependencies are missing then rbmv creates dummy objects with an extend method. 

### Full Example  
        
Backbone View with requirejs module dependencies

```javascript
define([
  "modules/common/views/baseview",
  "modules/common/utils",
  "templates/list"
  "underscore"
  ],
  function (BaseView, utils, list, _) {

  return BaseView.extend({

    template: _.template(list),

    initialize : function () {},

	controllerParse : function(data){
		_.each(data,function(v,k){
			v.looped = true;
		});
		return data;
	},
	
	render :function(){
		this.$el.html(this.template(this.controllerParse(this.collection.toJSON())))
	}
	  
});
``` 

In this view, you would like to test the method controllerParse. You want to instantiate the view without worrying about the dependencies. This view is only dependent on underscore and the template to instantiate. We pass in a mock template and underscore.


```javascript
var rbmv = require("rbmv"); 
var mockedView = rbmv(__dirname + "path/to/view",{ 
  list : "<div></div>",  
   _ : require("underscore")
});                        

var mockData = [{name:'one'},{name:'two'}];
var result = mockedView.controllerParse(mockData);
//result is [{name:'one',looped:true},{name:'two',looped:true}]

``` 

You can use rbmv to create a view as a testable object and have access to all the defined methods within the view. Note that we injected underscore and the template as a dependencies with the same name as the arguments in the view i.e. _ and list   
    
### Credit 

I have used the underscore extend method so thanks to the underscore team.

### Licence

MIT
