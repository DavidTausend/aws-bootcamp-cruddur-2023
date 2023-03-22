import { Auth } from 'aws-amplify';

const checkAuth = async (setUser) => {
    try {
      const user = await Auth.currentAuthenticatedUser({
        bypassCache: false 
      });
      const cognito_user = await Auth.currentAuthenticatedUser();
      setUser({
        display_name: cognito_user.attributes.name,
        handle: cognito_user.attributes.preferred_username
      })
    } catch (err) {
      console.log(err);
    }
  };

  export default checkAuth;