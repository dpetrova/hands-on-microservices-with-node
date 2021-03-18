Let's create an image processing microservice. 
We'll start with a simple thumbnail service, and then we'll evolve to make some simple image transformations. 
We'll be covering how to:
- Build a microservice using Express
- Use external modules to manipulate images
- Build our previous microservice in Hydra and Seneca

The microservice name is very important, as it gives identity. Let's name it "imagini", the Latin name for image.

IMPORTANT!!!
If you have issues with installing dependences, sharp, node-gyp:
- Install the current version of Python
- Install Visual C++ Build Environment: Visual Studio Build Tools (using "Visual C++ build tools" workload)
- Install Visual Studio 2019 Community
- Launch cmd as Administrator: npm config set msvs_version 2017
- Install node-gyp as launch cmd as Administrator: npm install -g node-gyp
- Install dependences in project as usual (npm install)
