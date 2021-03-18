Destructuring is the convenient method of constructing (target) or extracting (source) properties from an object. 
It gives the developer the ability to pick specific object properties from arguments or swap variable values, for example:

// head = 1, tail = [ 2, 3, 4]
let [ head, ...tail ] = [ 1, 2, 3, 4 ];

let { users: list } = { users: [ "john", "jane" ] }; // list = [ "john", "jane" ]

You can also have more complex destructuring in assignments and function arguments. You can also assign default values:

class Rectangle {
    constructor({ width = 100, height = 50 } = {}) {
        this.width = width;
        this.height = height;
    }
}