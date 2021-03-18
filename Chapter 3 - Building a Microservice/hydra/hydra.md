1. Hydra has a dependency that is not installable directly using the NPM. Hydra uses Redis to accomplish its goal. 
Look for information on the Redis website at https://redis.io/ to install it on your operating system before continuing.
- Download for Windows .zip, or .msi from: https://github.com/microsoftarchive/redis/releases
- start Redis service as navigate to folder where Redis is installed and click redis-server.exe
or in Task Manager start Redis in Services tab

2. install Hydra command-line tools:
npm install -g yo generator-fwsp-hydra hydra-cli

3. We now need to configure the connection to Redis. We do this by creating a configuration. Type in the command and follow the instructions:
hydra-cli config local

4. Hydra has a scaffolding command that helps to bootstrap our service quickly. 
Run the command and follow the instructions:
yo fwsp-hydra

fwsp-hydra generator v0.3.1   yeoman-generator v2.0.2   yo v2.0.1
? Name of the service (`-service` will be appended automatically) imagini
? Your full name? Diogo Resende
? Your email address? dresende@thinkdigital.pt
? Your organization or username? (used to tag docker images) dresende
? Host the service runs on?
? Port the service runs on? 3000
? What does this service do? Image thumbnail and manipulation
? Does this service need auth? No
? Is this a hydra-express service? Yes
? Set up a view engine? No
? Set up logging? No
? Enable CORS on serverResponses? No
? Run npm install? No
   create imagini-service/specs/test.js
   create imagini-service/specs/helpers/chai.js
   create imagini-service/.editorconfig
   create imagini-service/.eslintrc
   create imagini-service/.gitattributes
   create imagini-service/.nvmrc
   create imagini-service/.gitignore
   create imagini-service/package.json
   create imagini-service/README.md
   create imagini-service/imagini-service.js
   create imagini-service/config/sample-config.json
   create imagini-service/config/config.json
   create imagini-service/scripts/docker.js
   create imagini-service/routes/imagini-v1-routes.js

Done!

'cd imagini-service' then 'npm install' and 'npm start'

Test in browser:
http://localhost:3000/v1/imagini