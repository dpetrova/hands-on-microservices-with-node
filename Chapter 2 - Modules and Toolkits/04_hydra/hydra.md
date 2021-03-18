Hydra is a framework that facilitates building distributed microservices. 
Hydra leverages the power of Express and helps you create microservices or communicate with microservices.

It will, out of the box, enable you to:
- Do service registration and service discovery, allowing your microservices to discover and be discoverable
- Communicate with microservices and load balance communication between multiple instances, taking care of failed instances and automatically rerouting requests to other running instances
- Monitor instances, checking whether the microservice is available and operating normally

1. Hydra has a dependency that is not installable directly using the NPM. Hydra uses Redis to accomplish its goal. 
Look for information on the Redis website at https://redis.io/ to install it on your operating system before continuing.
- Download for Windows .zip, or .msi from: https://github.com/microsoftarchive/redis/releases
- start Redis service as navigate to folder where Redis is installed and click redis-server.exe
or in Task Manager start Redis in Services tab

2. install Hydra command-line tools:
npm install -g yo generator-fwsp-hydra hydra-cli

3. We now need to configure the connection to Redis. We do this by creating a configuration. Type in the command and follow the instructions:
hydra-cli config local

4. let's create a very simple microservice, just to see what the workflow is like. Hydra has a scaffolding tool using yeoman. To create a service, type the following command and follow the instructions:
yo fwsp-hydra

On the name of the service, just type hello (-service will be append automatically). Just hit Enter to the rest of the questions to use the defaults.

5. Enter the folder that was created and install the dependencies:
cd hello-service
npm install

6. Start the service:
npm start

The service has started and has been attached to a local IP (192.168.1.2) and port (17872)

7. Test in browser:
http://localhost:17872/v1/hello

it should produce: 
{"statusCode":200,"statusMessage":"OK","statusDescription":"Request succeeded without error","result":{"greeting":"Welcome to Hydra Express!"}}