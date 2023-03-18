# Week 5 — DynamoDB and Serverless Caching

## DynamoDB

Amazon DynamoDB is a fully-managed NoSQL database service provided by Amazon Web Services (AWS). It is designed to be highly scalable, highly available, and fault-tolerant, making it a popular choice for building applications that require fast and predictable performance.

DynamoDB uses a key-value data model, where data is stored in tables with a primary key that uniquely identifies each item in the table. It supports both document and key-value data models, and provides flexible querying capabilities using secondary indexes.

DynamoDB is designed to automatically scale to handle high levels of traffic and data volume. It can scale up or down based on demand, and can handle billions of requests per day with low latency and high throughput. It also provides data replication and backup features for durability and data protection.

Overall, DynamoDB is a highly performant and scalable NoSQL database service that is well-suited for applications that require high availability and low latency access to large volumes of data.


## Serverless Caching

Serverless caching refers to a technique of using a cloud-based caching service to store and retrieve frequently accessed data in a serverless architecture. In a serverless architecture, applications are built using functions that run in response to events, such as user requests, without the need for a dedicated server or infrastructure.

Caching is the process of storing data in a high-speed storage layer for quick access. By using a serverless caching service, such as Amazon ElastiCache or Azure Cache for Redis, developers can offload the responsibility of managing and scaling the caching infrastructure, as well as ensure that the cache is always available and performant.

When a function is triggered in a serverless architecture, it can check the cache for the requested data. If the data is available in the cache, it can be retrieved quickly, without the need for additional processing or data retrieval from a database or other source. This can significantly improve the performance and scalability of serverless applications, while also reducing costs by minimizing the amount of processing and data retrieval required.

Overall, serverless caching is a powerful technique for building serverless applications that require fast and reliable access to frequently accessed data. By leveraging cloud-based caching services, developers can build highly performant and scalable serverless architectures with minimal infrastructure overhead.





