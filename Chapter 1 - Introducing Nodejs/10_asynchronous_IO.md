The main purpose and the initial idea behind Node.js was to be able to handle asynchronous I/O effectively. 
To achieve that goal, Node.js has a very good toolkit. It's built around libuv, which empowers the JavaScript language to do asynchronous I/O.
Although it's true that your code runs in a single thread, as soon as your code needs to open a file or make an HTTP request, it uses other threads to do so.

The Event Loop is a loop mechanism that is responsible for handling asynchronous I/O code. 
The code you write synchronously runs immediately. 
The rest, like connecting to a third-party API, a database, or opening a file, will be queued in the poll. 
After that, if any timeout occurs (by a setTimeout or setInterval), they run. After that, run the I/O callbacks, if any. 
Finally, the close callbacks are executed. 

If you're writing code to perform some processor-intensive calculations, with big number manipulation or with fraction precision, Node.js will perform poorly. 
You may need to find modules to help you address these disadvantages by moving its weak points out of the JavaScript context.
If you still want to use Node.js for performance tasks, try creating a C++ module and use that instead. You can then pass the calculations to this module and still be able to use Node.js for other tasks that you would normally need more code for in C++.