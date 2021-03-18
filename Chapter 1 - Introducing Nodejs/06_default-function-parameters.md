There's no longer the need to use logical operators or check argument types to define default argument values. 
They can be defined directly in the prototype:

function pad(text, len, char = " ") {
    return text.substr(0, len) +
           (text.length < len ? char.repeat(text.length - len) : "");
}
pad("John", 10, "=");

Default arguments in JavaScript are evaluated at call time, not when defining the function. This means a new object is created every time:

function add(value, list = []) {    
    list.push(value);    
    return list;
}
add(1); // [ 1 ]
add(2); // [ 2 ] , not [ 1, 2 ]