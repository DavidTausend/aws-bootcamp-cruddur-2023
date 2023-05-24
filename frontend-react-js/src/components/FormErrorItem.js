export default function FormErrorItem(props) {
    const render_error = () => {
        switch (props.err_code){
            case 'generic_500':
              return "An error has occured"
              break;
            //Replies
            case 'cognito_user_id_blank':
              return "The user was not provided"
              break;
            case 'activity_uuid_blank':
              return "The post id cannot be blank"
              break;
            case 'message_blank':
              return "The message cannot be blank"
              break;
            case 'message_exceed_max_chars_1024':
              return "The message is too long, it should be less than 1024 characters"
              break;
            //Users
            case 'message_group_uuid_blank':
              return "The message is too long, it should be less than 1024 characters"
              break;
            case 'user_reciever_handle_blank':
              return "You need to send a message to a valid user"
              break;
            //Profile
            case 'display_name_blank':
              return "The display name cannot be blank"
              break;
            default: 
              // In teh case for error return from cognito they
              // directly 
              return props.err_code
              break;
        }
    }
    return (
        <div className="errorItem">
            {render_error()}
        </div>
    )
}