Seneca is a framework designed to help you develop message-based microservices. 
It has two distinct characteristics:
- Transport agnostic: Communication and message transport is separated from your service logic and it's easy to swap transports
- Pattern matching: Messages are JSON objects and each function exposes what sort of messages they can handle based on object properties

As in Express, Seneca also has middleware that you can install and use. In this case, the middleware is called plugins. 
By default, Seneca includes a number of core plugins for transport, and both HTTP and TCP transports are supported.

There are also storage plugins for persistent data and there's support for several database servers, both relational and non-relational. 
Seneca exposes an object-relational mapping (ORM)-like interface to manage data entities.
