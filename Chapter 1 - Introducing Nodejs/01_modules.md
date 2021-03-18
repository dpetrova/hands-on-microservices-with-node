You develop Node.js code in separate files, called modules. There are three module types:
- Core modules, which you can load anywhere
- Dependency modules, which you can also load anywhere
- Local modules, which you need to load based on the relative path:

    const settings = require("./settings");

Modules are loaded synchronously and cached. So, a repeated load will actually not be a load; instead, Node.js will pass you a reference to the already loaded module.
You don't need to specify the file extension since Node.js will look for .js and .json files.
A module is nothing more than an object. The module developers decide what to expose and what not to.
When you load a module, the code inside can have timers and I/O operations just like your own code. 
Even without you initializing it, it can run immediately after you load it.