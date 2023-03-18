# Week 4 — Postgres and RDS

PostgreSQL, commonly referred to as Postgres, is an open-source relational database management system (RDBMS) that emphasizes on features such as extensibility and SQL compliance. It was first released in 1996 and has since then gained popularity as a robust, reliable and scalable database system.

Amazon RDS (Relational Database Service) is a managed database service provided by Amazon Web Services (AWS) that makes it easy to set up, operate, and scale a relational database in the cloud. RDS provides fully managed database services for several popular relational database engines including PostgreSQL. With RDS, users can easily deploy, operate and scale their PostgreSQL databases in the cloud with features such as automated backups, easy database scaling, and high availability.

## Best security practice for RDS

+ Use strong passwords: Use strong, complex passwords for your RDS instances and make sure to rotate them regularly.
+ Use SSL encryption: Enable SSL encryption to encrypt data in transit between your application and the RDS instance.
+ Enable Multi-Factor Authentication (MFA): Enable MFA for your RDS instances to add an extra layer of security to your AWS account.
+ Restrict access with Security Groups: Use Security Groups to restrict access to your RDS instances to specific IP addresses or ranges.
+ Use IAM for authentication and authorization: Use AWS Identity and Access Management (IAM) to manage user access and permissions to your RDS instances.
+ Monitor for security threats: Use AWS CloudTrail to monitor and log all API calls made to your RDS instances, and use Amazon CloudWatch to monitor for any security threats.
+ Regularly update RDS and its components: Keep your RDS instances up-to-date by regularly applying security patches and updates to the database engine, operating system, and other components.
+ Enable encryption at rest: Use encryption at rest to encrypt data stored on your RDS instances.
+ Regularly audit database activities: Regularly audit your database activities to detect any suspicious activities, such as unauthorized access or modifications to your data.

## Other improvements

### Save email while signing up



  
