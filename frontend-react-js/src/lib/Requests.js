import {getAccessToken} from 'lib/CheckAuth';

async function request(method,url,payload_data,success){
    let res
    try {
      await getAccessToken()
      const access_token = localStorage.getItem("access_token")
      attrs = {
      method: method,
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }

      if(method !== 'GET'){
        attrs.body = JSON.stringify(payload_data)
      }
       
      res = await fetch(url, attrs)
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
export function get(url,success){
    request('GET',url,null,success)
    
}
export function destroy(url,payload_data,success){
  request('DELETE',url,payload_data,success)
}