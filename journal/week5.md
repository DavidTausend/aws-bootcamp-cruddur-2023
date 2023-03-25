# Week 5 — DynamoDB and Serverless Caching

## DynamoDB

Amazon DynamoDB is a fully-managed NoSQL database service provided by Amazon Web Services (AWS). It is designed to be highly scalable, highly available, and fault-tolerant, making it a popular choice for building applications that require fast and predictable performance.

DynamoDB uses a key-value data model, where data is stored in tables with a primary key that uniquely identifies each item in the table. It supports both document and key-value data models, and provides flexible querying capabilities using secondary indexes.

DynamoDB is designed to automatically scale to handle high levels of traffic and data volume. It can scale up or down based on demand, and can handle billions of requests per day with low latency and high throughput. It also provides data replication and backup features for durability and data protection.

Overall, DynamoDB is a highly performant and scalable NoSQL database service that is well-suited for applications that require high availability and low latency access to large volumes of data.

## Non-relational databases 

Non-relational databases (also known as NoSQL databases) are a type of database management system that do not use the traditional tabular relations found in relational databases. Instead, they use a variety of data models that can handle large amounts of unstructured or semi-structured data.

NoSQL databases are designed to be highly scalable and distributed, allowing for efficient storage and retrieval of large datasets across multiple machines. They are often used for applications that require high performance, such as real-time data analysis, social networking, and content management systems.

There are several types of NoSQL databases, each with its own strengths and weaknesses. Some common types include document databases, key-value stores, graph databases, and column-family stores. Each type is optimized for a specific type of data or use case, such as storing complex hierarchical data in a document database or managing large amounts of time-series data in a column-family store.

## Relational databases

Relational databases are a type of database management system that use a structure based on tables and relationships between them to store and manage data. The data is organized into tables with columns and rows, where each column represents a data attribute or field, and each row represents a record or instance of the data.

Relational databases use a language called SQL (Structured Query Language) to interact with the data. SQL is used to perform operations such as creating tables, adding and modifying data, and querying the database to retrieve specific information.

One of the key advantages of a relational database is that it allows for the easy organization and management of large amounts of structured data. The relationships between tables can be used to enforce data integrity and consistency, which helps ensure that the data is accurate and reliable.

Relational databases are commonly used in a wide range of applications, including customer relationship management systems, financial software, inventory management systems, and many others. Popular examples of relational database management systems include MySQL, Oracle, and Microsoft SQL Server.

## Best security practice for Dynamodb 



+ Use IAM roles and policies: Use Identity and Access Management (IAM) to manage access to DynamoDB resources. IAM roles and policies provide granular control over permissions, allowing you to limit access to specific actions and resources.
+ Use encryption: DynamoDB provides encryption at rest and in transit. Use encryption to protect sensitive data stored in DynamoDB, as well as data in transit between your application and DynamoDB.
+ Use VPC endpoints: Use Amazon VPC endpoints to securely access DynamoDB without exposing it to the public internet. VPC endpoints provide a private connection to DynamoDB within your VPC, which can help improve security and reduce network latency.
+ Implement multi-factor authentication (MFA): Use multi-factor authentication (MFA) to add an extra layer of security to your AWS account. MFA requires a user to provide two forms of authentication, such as a password and a token, to access resources.
Monitor access and activity: Use CloudTrail and other monitoring tools to track access to DynamoDB resources and monitor activity for signs of unauthorized access or suspicious behavior.
+ Implement network security best practices: Implement network security best practices such as network segmentation, firewall rules, and intrusion detection and prevention systems to help protect your environment.
+ Stay up-to-date on security best practices: Stay informed about the latest security best practices and apply security patches and updates to your environment as needed.

## Serverless Caching

Serverless caching refers to a technique of using a cloud-based caching service to store and retrieve frequently accessed data in a serverless architecture. In a serverless architecture, applications are built using functions that run in response to events, such as user requests, without the need for a dedicated server or infrastructure.

Caching is the process of storing data in a high-speed storage layer for quick access. By using a serverless caching service, such as Amazon ElastiCache or Azure Cache for Redis, developers can offload the responsibility of managing and scaling the caching infrastructure, as well as ensure that the cache is always available and performant.

When a function is triggered in a serverless architecture, it can check the cache for the requested data. If the data is available in the cache, it can be retrieved quickly, without the need for additional processing or data retrieval from a database or other source. This can significantly improve the performance and scalability of serverless applications, while also reducing costs by minimizing the amount of processing and data retrieval required.

Overall, serverless caching is a powerful technique for building serverless applications that require fast and reliable access to frequently accessed data. By leveraging cloud-based caching services, developers can build highly performant and scalable serverless architectures with minimal infrastructure overhead.




