Template literals are string literals that allow embedded expressions. Another advantage of these literals is that they can be written in multiple lines:

function hello(name) {
    console.log(`Hello ${name}`);
}

It's not a simple variable substitution, since it evaluates expressions of any kind:

function hello(name, age) {
    console.log(`hi ${name}, you were born in ${(new Date).getFullYear() - age}`);
}