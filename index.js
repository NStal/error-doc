var createError = require("./create-error.js")
function ErrorDocument(){
    this.Errors = {};
}
ErrorDocument.prototype.define = function(name,obj){
    // "ParentError:SubCustomError" or
    // "CustomErrorError"
    var arr = name.split(":");
    var obj = obj || {};
    var parent,name,EC;
    if(arr.length == 1){
        name = arr[0];
        this.checkErrorNotExists(name); 
        obj.name = obj.name || name
        EC = createError(name,obj);
    }else{
        parent = arr[0];
        name = arr[1];
        this.checkErrorNotExists(name);
        this.checkParentErrorExists(parent); 
        obj.name = obj.name || name
        EC = createError(this.Errors[parent],name,obj);
    }
    EC.humanReadableName = name;
    this.Errors[name] = EC;
    return this;
}
ErrorDocument.prototype.use = function(EC){
    this.checkErrorNotExists(EC.humanReadableName);
    this.Errors[EC.humanReadableName] = EC;
    return this;
}
ErrorDocument.prototype.inherit = function(errors,excepts){
    var excepts = excepts || [];
    for(name in errors){
        if(!errors.hasOwnProperty(name)){
            return;
        }
        if(excepts.indexOf(name) >= 0){
            continue
        }
        if(this.Errors[name]){
            if(this.Errors[name] !== errors[name]){
                throw new module.exports.Errors.InheritConflict("Conflict when inherit errors of error: "+name);
            }
            // same error continue
            continue;
        }
        this.Errors[name] = errors[name];
    }
    return this;
}
ErrorDocument.prototype.checkErrorNotExists  = function(name){
    if(this.Errors[name]){
        throw new module.exports.Errors.ErrorExists("Can't overwrite existsing error: "+name);
    }
}

ErrorDocument.prototype.checkParentErrorExists  = function(parent){
    if(!this.Errors[parent]){
        throw new module.exports.Errors.InvalidParentError("Parent error " + parent + " not defined");
    }
}
ErrorDocument.prototype.generate = function(){
    return this.Errors;
}
ErrorDocument.create = function(){
    return new ErrorDocument()
}
module.exports = ErrorDocument
module.exports.Errors = module.exports.create()
// used by this module
    .define("InvalidParentError")
    .define("ErrorExists")
    .define("InheritConflict")
// some common errors
    .define("IOError")
    .define("Timeout")
    .define("ProgrammerError") 
    .generate()
