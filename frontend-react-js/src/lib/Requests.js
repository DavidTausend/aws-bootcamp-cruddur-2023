import {getAccessToken} from 'lib/CheckAuth';

async function request(method,url,payload_data,success){
    let res
    try {
      await getAccessToken()
      const access_token = localStorage.getItem("access_token")
      res = await fetch(url, {
      method: method,
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload_data),
      });
      let data = await res.json();
      if (res.status === 200) {
        success()
      } else {
        setErrors(data)
        console.log(res)
      }
    } catch (err) {
      setErrors(['generic_${res.status}'])
      console.log(err);
    }
}
export function post(url,payload_dat,success){
    request('POST',url,payload_data,success)
    
}
export function put(url,payload_data,success){
    request('PUT',url,payload_data,success)
    
}
export function get(url,payload_data,success){
    request('GET',url,payload_data,success)
    
}