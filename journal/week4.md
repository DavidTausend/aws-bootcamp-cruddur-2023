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


## Database dependencies

Add the following dependencies to our backend-flask/requirements.txt:

 psycopg[binary]
 psycopg[pool]

## Create Database files

Create database schema:

        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
         DROP TABLE IF EXISTS public.users;
         DROP TABLE IF EXISTS public.activities;


         CREATE TABLE public.users (
           uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
           display_name text,
           handle text,
           email text,
           cognito_user_id text,
           created_at TIMESTAMP default current_timestamp NOT NULL
         );

         CREATE TABLE public.activities (
           uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
           user_uuid UUID NOT NULL,
           message text NOT NULL,
           replies_count integer DEFAULT 0,
           reposts_count integer DEFAULT 0,
           likes_count integer DEFAULT 0,
           reply_to_activity_uuid integer,
           expires_at TIMESTAMP,
           created_at TIMESTAMP default current_timestamp NOT NULL
         );

Create Seed for the database:

        -- this file was manually created
         INSERT INTO public.users (display_name, handle, cognito_user_id)
         VALUES
           ('Andrew Brown', 'andrewbrown' ,'MOCK'),
           ('Andrew Bayko', 'bayko' ,'MOCK');

         INSERT INTO public.activities (user_uuid, message, expires_at)
         VALUES
           (
             (SELECT uuid from public.users WHERE users.handle = 'andrewbrown' LIMIT 1),
             'This was imported as seed data!',
             current_timestamp + interval '10 day'


## Database Scripts

To make our life easy we will create the following scripts:

Connect to the database:

        #! /usr/bin/bash 
        psql $CONNECTION_URL

Create database:

        #! /usr/bin/bash 

         CYAN='\033[1;36m'
         NO_COLOR='\033[0m'
         LABEL="db-create"
         printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

         NO_DB_CONNECTION_URL=$(sed 's/\/cruddur//g' <<<"$CONNECTION_URL")
         
Drop the database:

        #! /usr/bin/bash 

         CYAN='\033[1;36m'
         NO_COLOR='\033[0m'
         LABEL="db-drop"
         printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

         NO_DB_CONNECTION_URL=$(sed 's/\/cruddur//g' <<<"$CONNECTION_URL")

Load database schema:

        #! /usr/bin/bash 
         CYAN='\033[1;36m'
         NO_COLOR='\033[0m'
         LABEL="db-schema-load"
         printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

         echo "== db-schema-load"

         schema_path="$(realpath .)/db/schema.sql"
         echo $schema_path

         if [ "$1" = "prod" ]; then
           echo "using production"
           CON_URL=$PROD_CONNECTION_URL
         else
           CON_URL=$CONNECTION_URL
         fi

        psql $CONNECTION_URL cruddur < $schema_path

Seed the information:

        #! /usr/bin/bash 

         CYAN='\033[1;36m'
         NO_COLOR='\033[0m'
         LABEL="db-seed"
         printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

         seed_path="$(realpath .)/db/seed.sql"
         echo $seed_path

         if [ "$1" = "prod" ]; then
           echo "using production"
           CON_URL=$PROD_CONNECTION_URL
         else
           CON_URL=$CONNECTION_URL
         fi

         psql $CONNECTION_URL cruddur < $seed_path

Create database schema:

        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
         DROP TABLE IF EXISTS public.users;
         DROP TABLE IF EXISTS public.activities;


         CREATE TABLE public.users (
           uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
           display_name text,
           handle text,
           cognito_user_id text,
           created_at TIMESTAMP default current_timestamp NOT NULL
         );

         CREATE TABLE public.activities (
           uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
           user_uuid UUID NOT NULL,
           message text NOT NULL,
           replies_count integer DEFAULT 0,
           reposts_count integer DEFAULT 0,
           likes_count integer DEFAULT 0,
           reply_to_activity_uuid integer,
           expires_at TIMESTAMP,
           created_at TIMESTAMP default current_timestamp NOT NULL
         );
 
 
Create database seesions:

        #! /usr/bin/bash 

         CYAN='\033[1;36m'
         NO_COLOR='\033[0m'
         LABEL="db-sessions"
         printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

         if [ "$1" = "prod" ]; then
           echo "using production"
           \URL=$PROD_CONNECTION_URL
         else
           URL=$CONNECTION_URL
         fi

         NO_DB_URL=$(sed 's/\/cruddur//g' <<<"$URL")
         psql $NO_DB_URL -c "select pid as process_id, \
                usename as user,  \
                datname as db, \
                client_addr, \
                application_name as app,\
                state \

Setup database:

        #! /usr/bin/bash 
         -e # stop if it fails at any point

         CYAN='\033[1;36m'
         NO_COLOR='\033[0m'
         LABEL="db-setup"
         printf "${CYAN}==== ${LABEL}${NO_COLOR}\n"

         bin_path="$(realpath .)/bin"

         source "$bin_path/db-drop"
         source "$bin_path/db-create"
         source "$bin_path/db-schema-load"
         source "$bin_path/db-seed"
         
         
        
## Query the database

Create backend-flask/lib/db.py to query the database:

        from psycopg_pool import ConnectionPool
         import os

         def query_wrap_object(template):
           sql = f"""
           (SELECT COALESCE(row_to_json(object_row),'{{}}'::json) FROM (
           {template}
           ) object_row);
           """
           return sql

         def query_wrap_array(template):
           sql = f"""
           (SELECT COALESCE(array_to_json(array_agg(row_to_json(array_row))),'[]'::json) FROM (
           {template}
           ) array_row);
           """
           return sql

         connection_url = os.getenv("CONNECTION_URL")
         pool = ConnectionPool(connection_url)

Add the following code in backend-flask/services/home_activities.py:

        span.set_attribute("app.now", now.isoformat())
               #Postgress
               sql = query_wrap_array("""
               SELECT
                 activities.uuid,
                 users.display_name,
                 users.handle,
                 activities.message,
                 activities.replies_count,
                 activities.reposts_count,
                 activities.likes_count,
                 activities.reply_to_activity_uuid,
                 activities.expires_at,
                 activities.created_at
               FROM public.activities
               LEFT JOIN public.users ON users.uuid = activities.user_uuid
               ORDER BY activities.created_at DESC
               """)
               with pool.connection() as conn:
                 with conn.cursor() as cur:
                  cur.execute(sql)
                  # this will return a tuple
                  # the first field being the data

## Automate the connection with the RDS in AWS

To do the automate the task we need to get the IP of gitpod and sende it to the Security group where our RDS is.

Create the following script to update gitpod IP in our RDS:

        #! /usr/bin/bash 

         CYAN='\033[1;36m'
         NO_COLOR='\033[0m'
         LABEL="rds-update-sq-rule"
         printf "${CYAN}==== ${LABEL}${NO_COLOR}\n"

         aws ec2 modify-security-group-rules \
             --group-id $DB_SG_ID \
             --security-group-rules "SecurityGroupRuleId=$DB_SG_RULE_ID,SecurityGroupRule=                      {Description=GITPOD,IpProtocol=tcp,FromPort=5432,ToPort=5432,CidrIpv4=$GITPOD_IP/32}"

Add the following in .gitpod.yml to get gitpod IP and everytime that gitpod starts it will automatically update with our RDS:

        command: | 
          export GITPOD_IP=$(curl ifconfig.me)       
          source  "$THEIA_WORKSPACE_ROOT/backend-flask/rds-update-sg-rule"
          
         
## Add Lambda function in AWS to connect and add Information to the Database


        import json
        import psycopg2

        def lambda_handler(event, context):
            user = event['request']['userAttributes']
            user_display_name = user['name']
            user_email = user['email']
            user_handel = user['preferred_username']
            user_cognito_id= user['sub']
            try:
                conn = psycopg2.connect(os.getenv('CONNECTION_URL'))
                cur = conn.cursor()

                sql = f"""
                  "INSERT INTO users (
                    display_name,
                    email,
                    handle,
                    cognito_user_id
                    )
                  VALUES(
                    {user_display_name},
                    {user_email},
                    {user_handle},
                    {user_cognito_id}
                 )"
                """
                cur.execute(sql)
                conn.commit() 

            except (Exception, psycopg2.DatabaseError) as error:
                print(error)

            finally:
                if conn is not None:
                    cur.close()
                    conn.close()
                    print('Database connection closed.')

            return event


## Other improvements

### Save email while signing in and confirming

ConfirmationPage.js

        import './ConfirmationPage.css';
        import React, { useState, useEffect } from "react";
        import { useParams } from 'react-router-dom';
        import { useSearchParams } from "react-router-dom";
        import {ReactComponent as Logo} from '../components/svg/logo.svg';
        import { Auth } from 'aws-amplify';

        export default function ConfirmationPage() {
          const [email, setEmail] = useState('');
          const [code, setCode] = useState('');
          const [errors, setErrors] = useState('');
          const [codeSent, setCodeSent] = useState(false);
          const params = useParams();
          const [searchParams, setSearchParams] = useSearchParams();

          const code_onchange = (event) => {
            setCode(event.target.value);
          }

          const email_onchange = (event) => {
            setEmail(event.target.value);
          }

          const resend_code = async () => {
            console.log('resend_code');
          }

          const onsubmit = (event) => {
            event.preventDefault();
            setErrors('')
            Auth.confirmSignUp(email, code)
              .then(() => {
                window.location.href = "/signin"
              })
              .catch((error) => {
                setErrors(error.message)
              });
          }

          useEffect(() => {
            const storedEmail = localStorage.getItem('email');
            if (storedEmail) {
              setEmail(storedEmail);
            }
          }, []);

          useEffect(() => {
            if (params.email) {
              setEmail(params.email)
            }
          }, [params.email]);

          useEffect(() => {
            const paramemail = searchParams.get('email');
            console.log(paramemail)
            if (paramemail) {
              setEmail(paramemail)
            }
          }, [searchParams]);

          let el_errors;
          if (errors){
            el_errors = <div className='errors'>{errors}</div>;
          }

          const code_button = codeSent
            ? <div className="sent-message">A new activation code has been sent to your email</div>
            : <button className="resend" onClick={resend_code}>Resend Activation Code</button>;

          return (
            <article className="confirm-article">
              <div className='recover-info'>
                <Logo className='logo' />
              </div>
              <div className='recover-wrapper'>
                <form className='confirm_form' onSubmit={onsubmit}>
                  <h2>Confirm your Email</h2>
                  <div className='fields'>
                    <div className='field text_field email'>
                      <label>Email</label>
                      <input
                        type="text"
                        value={email}
                        onChange={email_onchange} 
                      />
                    </div>
                    <div className='field text_field code'>
                     <label>Confirmation Code</label>
                     <input
                       type="text"
                       value={code}
                       onChange={code_onchange} 
                     />
                    </div>
                  </div>
                  {el_errors}
                  <div className='submit'>
                    <button type='submit'>Confirm Email</button>
                  </div>
                </form>
              </div>
              {code_button}
            </article>
          );
        }

  SignupPage.js
  
        import './SignupPage.css';
        import React, { useState } from "react";
        import {ReactComponent as Logo} from '../components/svg/logo.svg';
        import { Link } from "react-router-dom";
        import { Auth } from 'aws-amplify';

        export default function SignupPage() {
          const [formData, setFormData] = useState({
            name: '',
            email: '',
            username: '',
            password: '',
          });
          const [errors, setErrors] = useState('');

          const handleInputChange = (event) => {
            const { name, value } = event.target;
            setFormData((prevState) => ({
              ...prevState,
              [name]: value,
            }));
          };

          const handleSubmit = async (event) => {
            event.preventDefault();
            setErrors('')
            try {
              const { user } = await Auth.signUp({
                username: formData.email,
                password: formData.password,
                attributes: {
                  name: formData.name,
                  email: formData.email,
                  preferred_username: formData.username,
                },
                autoSignIn: {
                  enabled: true,
                }
              });
              localStorage.setItem('email', formData.email);
              window.location.href = `/confirm`
            } catch (error) {
              console.log(error);
              setErrors(error.message)
            }
            return false
          }

          const errorElement = errors ? <div className='errors'>{errors}</div> : null;

          return (
            <article className='signup-article'>
              <div className='signup-info'>
                <Logo className='logo' />
              </div>
              <div className='signup-wrapper'>
                <form 
                  className='signup_form'
                  onSubmit={handleSubmit}
                >
                  <h2>Sign up to create a Cruddur account</h2>
                  <div className='fields'>
                    <div className='field text_field name'>
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className='field text_field email'>
                      <label>Email</label>
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className='field text_field username'>
                      <label>Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange} 
                      />
                    </div>

                    <div className='field text_field password'>
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                  {errorElement}
                  <div className='submit'>
                    <button type='submit'>Sign Up</button>
                  </div>
                </form>
                <div className="already-have-an-account">
                  <span>
                    Already have an account?
                  </span>
                  <Link to="/signin">Sign in!</Link>
                </div>
              </div>
            </article>
          );
        }
        
Source: 
https://www.youtube.com/watch?v=UourWxz7iQg&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=45
https://www.youtube.com/watch?v=UourWxz7iQg&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=46
https://www.youtube.com/watch?v=UourWxz7iQg&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=47
https://www.youtube.com/watch?v=UourWxz7iQg&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=48
https://www.youtube.com/watch?v=UourWxz7iQg&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=49
