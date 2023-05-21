# Week 5 — DynamoDB and Serverless Caching

## DynamoDB

Amazon DynamoDB is a fully-managed NoSQL database service provided by Amazon Web Services (AWS). It is designed to be highly scalable, highly available, and fault-tolerant, making it a popular choice for building applications that require fast and predictable performance.


## Best security practice for Dynamodb 

+ Use IAM roles and policies: Use Identity and Access Management (IAM) to manage access to DynamoDB resources. IAM roles and policies provide granular control over permissions, allowing you to limit access to specific actions and resources.
+ Use encryption: DynamoDB provides encryption at rest and in transit. Use encryption to protect sensitive data stored in DynamoDB, as well as data in transit between your application and DynamoDB.
+ Use VPC endpoints: Use Amazon VPC endpoints to securely access DynamoDB without exposing it to the public internet. VPC endpoints provide a private connection to DynamoDB within your VPC, which can help improve security and reduce network latency.
+ Implement multi-factor authentication (MFA): Use multi-factor authentication (MFA) to add an extra layer of security to your AWS account. MFA requires a user to provide two forms of authentication, such as a password and a token, to access resources.
Monitor access and activity: Use CloudTrail and other monitoring tools to track access to DynamoDB resources and monitor activity for signs of unauthorized access or suspicious behavior.
+ Implement network security best practices: Implement network security best practices such as network segmentation, firewall rules, and intrusion detection and prevention systems to help protect your environment.
+ Stay up-to-date on security best practices: Stay informed about the latest security best practices and apply security patches and updates to your environment as needed.


## Correctly Implementing Timezones for ISO 8601

Note: Make sure that you are runing your local DynamoDB Database.

Create the following file frontend-react-js/src/lib/DateTimeFormats.js and add the following code:

    import { DateTime } from 'luxon';

    export function format_datetime(value) {
      const datetime = DateTime.fromISO(value, { zone: 'utc' })
      const local_datetime = datetime.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      return local_datetime.toLocaleString(DateTime.DATETIME_FULL)
    }

    export function message_time_ago(value){
      const datetime = DateTime.fromISO(value, { zone: 'utc' })
      const created = datetime.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      const now     = DateTime.now()
      console.log('message_time_group',created,now)
      const diff_mins = now.diff(created, 'minutes').toObject().minutes;
      const diff_hours = now.diff(created, 'hours').toObject().hours;

      if (diff_hours > 24.0){
        return created.toFormat("LLL L");
      } else if (diff_hours < 24.0 && diff_hours > 1.0) {
        return `${Math.floor(diff_hours)}h`;
      } else if (diff_hours < 1.0) {
        return `${Math.round(diff_mins)}m`;
      } else {
        console.log('dd', diff_mins,diff_hours)
        return 'unknown'
      }
    }

    export function time_ago(value){
      const datetime = DateTime.fromISO(value, { zone: 'utc' })
      const future = datetime.setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
      const now     = DateTime.now()
      const diff_mins = now.diff(future, 'minutes').toObject().minutes;
      const diff_hours = now.diff(future, 'hours').toObject().hours;
      const diff_days = now.diff(future , 'days').toObject().days;

      if (diff_hours > 24.0){
        return `${Math.floor(diff_days)}d`;
      } else if (diff_hours < 24.0 && diff_hours > 1.0) {
        return `${Math.floor(diff_hours)}h`;
      } else if (diff_hours < 1.0) {
        return `${Math.round(diff_mins)}m`;
      }
    }



Replace the following code in backend-flask/lib/ddb.py with the code below:

Replace code:

               now = datetime.now(timezone.utc).astimezone().isoformat()
                     created_at = now

New code:

            created_at = datetime.now().isoformat()

Replace the following code in bin/ddb/seed with the code below: 

Replace code:

            now = datetime.now(timezone.utc).astimezone()

New code: 

            now = datetime.now()
    
Replace code:

            created_at = (now + timedelta(minutes=i)).isoformat()

New code:

            created_at = (now - timedelta(days=1) + timedelta(minutes=i))
    
Replace code:

            created_at=created_at,
    
New code:

            created_at=created_at.isoformat(),

    
Go to frontend-react-js/src/components/ActivityContent.js and work on the following code:

Import the DateTimeFormats to ActivityContent.js, add the following code:

        import { format_datetime, time_ago } from '../lib/DateTimeFormats';

Delete the old code not needed:

    const format_time_created_at = (value) => {
        // format: 2050-11-20 18:32:47 +0000
        const past = DateTime.fromISO(value)
        const now     = DateTime.now()
        const diff_mins = now.diff(past, 'minutes').toObject().minutes;
        const diff_hours = now.diff(past, 'hours').toObject().hours;

        if (diff_hours > 24.0){
          return past.toFormat("LLL L");
        } else if (diff_hours < 24.0 && diff_hours > 1.0) {
          return `${Math.floor(diff_hours)}h ago`;
        } else if (diff_hours < 1.0) {
          return `${Math.round(diff_mins)}m ago`;
        }
      };

      const format_time_expires_at = (value) => {
        // format: 2050-11-20 18:32:47 +0000
        const future = DateTime.fromISO(value)
        const now     = DateTime.now()
        const diff_mins = future.diff(now, 'minutes').toObject().minutes;
        const diff_hours = future.diff(now, 'hours').toObject().hours;
        const diff_days = future.diff(now, 'days').toObject().days;

        if (diff_hours > 24.0){
          return `${Math.floor(diff_days)}d`;
        } else if (diff_hours < 24.0 && diff_hours > 1.0) {
          return `${Math.floor(diff_hours)}h`;
        } else if (diff_hours < 1.0) {
          return `${Math.round(diff_mins)}m`;
        }
      };


Replace the following code with the code below:

Replace code:

            expires_at = <div className="expires_at" title={props.activity.expires_at}>
  
New code:

        expires_at = <div className="expires_at" title={format_datetime(props.activity.expires_at)}>
  
Replace code:

      <span className='ago'>{format_time_expires_at(props.activity.expires_at)}</span>

New code:

      <span className='ago'>{time_ago(props.activity.expires_at)}</span>
  
Replace code:

       <div className="created_at" title={props.activity.created_at}>
       <span className='ago'>{format_time_created_at(props.activity.created_at)}</span> 

New code:

        <div className="created_at" title={format_datetime(props.activity.created_at)}>
        <span className='ago'>{time_ago(props.activity.created_at)}</span> 


Go the following path frontend-react-js/src/components/MessageGroupItem.js and work with the following code:
       
Delete the not needed code:

    import { DateTime } from 'luxon';

    export default function MessageItem(props) {

      const format_time_created_at = (value) => {
        // format: 2050-11-20 18:32:47 +0000
        const created = DateTime.fromISO(value)
        const now     = DateTime.now()
        const diff_mins = now.diff(created, 'minutes').toObject().minutes;
        const diff_hours = now.diff(created, 'hours').toObject().hours;

        if (diff_hours > 24.0){
          return created.toFormat("LLL L");
        } else if (diff_hours < 24.0 && diff_hours > 1.0) {
          return `${Math.floor(diff_hours)}h`;
        } else if (diff_hours < 1.0) {
          return `${Math.round(diff_mins)}m`;
        }
      };

                                
Import DateTimeFormats adding the following line:

         import { format_datetime, message_time_ago } from '../lib/DateTimeFormats';
                                    
Replace code: 

          <Link className='message_item' to={`/messages/@`+props.message.handle}>
          <div className='message_avatar'></div>

 New code:
 
          <div className='message_item'>
          <link className='message_avatar' to={`/messages/@`+props.message.handle}></link>
 
 Replace code:
 
           <div className="created_at" title={props.message.created_at}>
           <span className='ago'>{format_time_created_at(props.message.created_at)}</span> 
           </Link>

 New code:
           <div className="created_at" title={format_datetime(props.message.created_at)}>
           <span className='ago'>{message_time_ago(props.message.created_at)}</span>  
           </div>
      
 

Source:
https://www.youtube.com/watch?v=5oZHNOaL8Og&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=50
https://www.youtube.com/watch?v=gFPljPNnK2Q&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=51
https://www.youtube.com/watch?v=pIGi_9E_GwA&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=52
https://www.youtube.com/watch?v=pIGi_9E_GwA&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=53
https://www.youtube.com/watch?v=dWHOsXiAIBU&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=54
https://www.youtube.com/watch?v=dWHOsXiAIBU&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=55
https://www.youtube.com/watch?v=g21EZ54c8iw&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=68
