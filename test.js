ErrorDoc = require("./index.js")
ParentErrors = ErrorDoc.create()
    .use(ErrorDoc.Errors.IOError)
    .define("IOError:NetworkIOError")
    .generate()
nioe = new ParentErrors.NetworkIOError
ioe = new ParentErrors.IOError
console.assert(ioe instanceof ParentErrors.IOError)
console.assert(nioe instanceof ParentErrors.NetworkIOError)
console.assert(nioe instanceof ParentErrors.IOError)

console.log("done without error");
