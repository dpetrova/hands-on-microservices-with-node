The spread syntax allows an iterable to be expanded in places where arguments (in functions) or elements (in arrays) are expected. 
It's very useful when, for example, a function accepts an initial set of arguments and then an unlimited one:

const concat = (separator, ...parts) => (parts.join(separator));
concat(", ", 1, 2, 3); // "1, 2, 3"

This example is especially important in arrow functions since you don't have access to the arguments object. 
It's also quite useful to merge arrays, as in the following example:

const a = [ 1, 2, 3 ];
const b = [ 4, 5, 6 ];
[ ...a, ...b ]; // [ 1, 2, 3, 4, 5, 6 ]