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

ConfirmationPage.js

        import './ConfirmationPage.css';
        import React, { useState, useEffect } from "react";
        import { useParams } from 'react-router-dom';
        import {ReactComponent as Logo} from '../components/svg/logo.svg';
        import { Auth } from 'aws-amplify';

        export default function ConfirmationPage() {
          const [email, setEmail] = useState('');
          const [code, setCode] = useState('');
          const [errors, setErrors] = useState('');
          const [codeSent, setCodeSent] = useState(false);
          const params = useParams();

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
