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