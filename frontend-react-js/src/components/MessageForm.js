import React, { useState } from "react";
import process from 'process';
import { useParams } from 'react-router-dom';
import { post } from 'lib/Requests';
import FormErrors from 'components/FormErrors';

function useFormSubmit() {
  const [errors, setErrors] = useState([]);

  const handleFormSubmit = async (message, params, setMessages) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/messages`;
    let payload_data = { message };

    if (params.handle) {
      payload_data.handle = params.handle;
    } else {
      payload_data.message_group_uuid = params.message_group_uuid;
    }

    post(url, payload_data,{
      auth: true,
      setErrors: setErrors,
      success: function (data) {
        console.log('data:', data);
        if (data.message_group_uuid) {
          console.log('redirect to message group');
          window.location.href = `/messages/${data.message_group_uuid}`;
        } else {
          setMessages(current => [...current, data]);
        }
        setErrors(data.errors || []);
    }  
    });
  };

  return { errors, handleFormSubmit };
}

export default function ActivityForm(props) {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  const params = useParams();
  const classes = []
  classes.push('count');
  if (1024 - count < 0) {
    classes.push('err');
  }

  const { errors, handleFormSubmit } = useFormSubmit();

  const onsubmit = async (event) => {
    event.preventDefault();
    handleFormSubmit(message, params, props.setMessages);
  }

  const textarea_onchange = (event) => {
    setCount(event.target.value.length);
    setMessage(event.target.value);
  }

  return (
    <form
      className='message_form'
      onSubmit={onsubmit}
    >
      <textarea
        type="text"
        placeholder="send a direct message..."
        value={message}
        onChange={textarea_onchange}
      />
      <div className='submit'>
        <div className={classes.join(' ')}>{1024 - count}</div>
        <button type='submit'>Message</button>
      </div>
      <FormErrors errors={errors} />
    </form>
  );
}