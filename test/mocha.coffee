ErrorDoc = require "../"
describe "error doc",()->
    it "test Error doc",(done)->
        Errors = ErrorDoc.create()
            .define("IOError")
            .define("LogicError")
            .define("NetworkError","IOError")
            .define("InvalidParameter","LogicError",{message:"You are so stupid to provide a valid parameters I guess",code:5})
            .define("NetworkTimeout","NetworkError")
            .generate()
        ioError = new Errors.IOError("message")
        invalidParameter = new Errors.InvalidParameter(null,{code:10})
        nto = new Errors.NetworkTimeout()
        if ioError.message isnt "message"
            throw new Error "bad message set"
        networkError = new Errors.NetworkError("message",{via:{name:"hehe"}})
        if networkError.via.name isnt "hehe"
            throw new Error "invalid meta set"
        if networkError not instanceof Errors.IOError
            throw new Error "fail to inherit errors"
        if invalidParameter instanceof Errors.IOError
            throw new Error "invalid parameter should be logic error"
        if invalidParameter.message isnt "You are so stupid to provide a valid parameters I guess"
            throw new Error "predefined meta no take effect"
        if invalidParameter.code isnt 10
            console.debug invalidParameter
            throw new Error "fail to overwrite predefined error props"
        if nto not instanceof Errors.IOError
            throw new Error "inherit twice not working"
        done()
