JavaScript's classes are syntactic sugar over the inheritance model. 
They introduced a new way of defining object-oriented inheritance that existed in JavaScript. 
They also introduced a simpler way of extending and defining an object prototype.

Create a Rectangle class, with a constructor to specify dimensions, an area method, and a static method to clone a Rectangle instance:

class Rectangle {
    constructor (w, h) {
        this.w = w;
        this.h = h;
    }
    get area () {
        return this.w * this.h;
    }
    static clone(r) {
        return new Rectangle(r.w, r.h);
    }
}

Unlike the previous, and still possible, prototype definition, using this syntax will force a stricter development. More specifically:
- There's no hoisting, which means the class must be defined before usage
- There's no prototype redefinition