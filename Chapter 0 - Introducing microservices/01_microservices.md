Microservices are a variation of SOA (Service Oriented Architecture).
Microservices come to the rescue by defining a simple strategy: break every complex service into a small, simpler service that is aiming for common functionality. 
The idea is that services should be small and lightweight - so small that they can be easily maintained, developed, and tested, 
and so lightweight that they can be responsive and scale more easily.

There are several advantages of using this architecture:
- Maintenance: Services, when separate, become easier to develop, test, and deploy because they should be simpler and small
- Design enforcement: A proper and good design is enforced on the application being developed
- Knowledge encapsulation: Services will have specific objectives, such as delivering emails, which will lead to service re-usage and knowledge about specific tasks    being grouped together in services
- Replaceable: Services become easier to swap because their functionality and communication is well-known
- Technology agnostic: Each service can be developed using the best tools and languages to build it correctly
- Performant: Services are small and lightweight, and, as mentioned previously, use the best tools available
- Upgradable: Services should be interchangeable and upgradable separately
- Productivity: When complexity starts to grow, productivity will be better than in a monolith application

There are also costs associated with this architecture, namely:
- Dependencies: Because of this architecture being technology agnostic, different dependencies for different services may arise
- Complexity: For small applications, the bootstrap complexity is bigger compared to the monolith
- End-to-end testing: It becomes more complex to test the application from end to end as the number of services to inter-connect is definitely bigger than in a monolith application