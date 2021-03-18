A Promise is an object that represents the completion or failure of an asynchronous operation. 
The Promise can be chained to perform serial operations, run in parallel until all operations execute, or even race operations and wait only for the first completion or failure:

Promise.race([
    new Promise((resolve, reject) => {
        // some possibly long operation
    }),
    new Promise((resolve, reject) => {
        setTimeout(reject, 5000);
    })
]).then(() => {
    console.log("success!");
}, () => {
    console.log("failed");
});

Basically, you can indicate that a function is asynchronously using the "async/await" keywords. The function will then return a Promise when called. 
When the function returns a value, the Promise is resolved with that value. 
If the function throws an error, the Promise is rejected.

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

async function run() {
  await delay(1000);
  console.log("done");
}

run();