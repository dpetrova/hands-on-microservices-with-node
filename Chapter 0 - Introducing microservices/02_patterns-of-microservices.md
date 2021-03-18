# Decomposable
The main pattern behind a microservice architecture is the ability to have loosely coupled services. These services are decomposed, separated into smaller parts.
Each service should be small but complete, meaning it should run a set of functions in a given context. Those functions should represent all the functions you need or need to support for that context. What this means is that if you have a service that handles meeting events, all meeting event functions should be done using that service, whether it's creating an event, changing, removing, or getting information about a specific event. This ensures that an implementation change to events will affect that service only.

# Autonomous
In a microservice architecture, each service should be autonomous. A small team should be able to run it without the other services that make your application. That team should also be able to develop autonomously and make changes to implementation without affecting the application.
The development team should be able to:
- Test, creating business logic and unit tests to ensure the service functions work as expected
- Deploy, upgrading functionality, without restarting other services in the process

# Scalable
A service should be scalable. At least two instances should be able to run in parallel, enabling failure tolerance and maintenance downtime. A service can also, later on, scale geographically, be near your customers, and improve apparent performance and application response.

# Communicable
Usually, services communicate over HTTP using a REST-compliant API. HTTP is also a mature communication transport layer. It's a stateless protocol, giving developers and operations many features, such as:
- Caching commonly used and often updated resources
- Proxying and routing requests
- Securing communication over TLS

