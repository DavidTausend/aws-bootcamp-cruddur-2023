import './ActivityItem.css';

import ActivityContent  from '../components/ActivityContent';
import ActivityActionReply  from '../components/ActivityActionReply';
import ActivityActionRepost  from '../components/ActivityActionRepost';
import ActivityActionLike  from '../components/ActivityActionLike';
import ActivityActionShare  from '../components/ActivityActionShare';
import { click } from '@testing-library/user-event/dist/click';
import { useNavigate } from "react-router-dom";

export default function ActivityItem(props) {
  const navigate = useNavigate();
  const click = (event) => {
    event.preventDefault()
    const url = `/@${props.activity.handle}/status/${props.activity.uuid}`
    navigate(url);
    return false;
  }

const activity_main = (
      <div className="activity_main">
        <ActivityContent activity={props.activity} />
        <div className="activity_actions">
          <ActivityActionReply setReplyActivity={props.setReplyActivity} activity={props.activity} setPopped={props.setPopped} activity_uuid={props.activity.uuid} count={props.activity.replies_count}/>
          <ActivityActionRepost activity_uuid={props.activity.uuid} count={props.activity.reposts_count}/>
          <ActivityActionLike activity_uuid={props.activity.uuid} count={props.activity.likes_count}/>
          <ActivityActionShare activity_uuid={props.activity.uuid} />
        </div>
      </div>
)
  let item
  if (props.expanded === true ){
    item = (
    <div className='activity_item expanded'>
      {activity_main}
    </div>)
  }else {
    item = (<div className='activity_item' onClick={click}>
      {activity_main}
    </div>)
  }
  return ((item)); 
}