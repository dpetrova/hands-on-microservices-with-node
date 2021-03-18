Arrow functions are a shorter expression function syntax without their own function scope, meaning this reference will point to the parent scope. 
This helps developers avoid saving a reference to the parent scope so they are able to reach it later on.

function start() {
  this.uptime = process.uptime();
  setTimeout(() => {
    console.log(this.uptime);
  }, 5000);
}
start();

It also helps to write less code for simple operation functions, for example, on array methods. 
Arrow functions are quite useful when it comes to manipulating arrays of information, whether for filtering, transforming, or reducing them to single values:

let double = function (value) {
    return value * 2;
};

[ 1, 2, 3 ].map(double);     // [ 2, 4, 6 ]
[ 1, 2, 3 ].map(v => v * 2); // [ 2, 4, 6 ]