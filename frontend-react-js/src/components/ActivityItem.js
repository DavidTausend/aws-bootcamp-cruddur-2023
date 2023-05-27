import './ActivityItem.css';

import ActivityContent  from '../components/ActivityContent';
import ActivityActionReply  from '../components/ActivityActionReply';
import ActivityActionRepost  from '../components/ActivityActionRepost';
import ActivityActionLike  from '../components/ActivityActionLike';
import ActivityActionShare  from '../components/ActivityActionShare';
import { click } from '@testing-library/user-event/dist/click';
import { addListener } from 'process';
import { useHistory } from "react-router-dom";

export default function ActivityItem(props) {
  const history = useHistory();
  const click = (event) => {
    event.preventDefault()
    history.push('/route');
    return false;
  }
  return (
    <div className='activity_item' onClick={click} to={`/@${props.activity.handle}/status/${props.activity.uuid}`}>
      <div className="activity_main">
        <ActivityContent activity={props.activity} />
        <div className="activity_actions">
          <ActivityActionReply setReplyActivity={props.setReplyActivity} activity={props.activity} setPopped={props.setPopped} activity_uuid={props.activity.uuid} count={props.activity.replies_count}/>
          <ActivityActionRepost activity_uuid={props.activity.uuid} count={props.activity.reposts_count}/>
          <ActivityActionLike activity_uuid={props.activity.uuid} count={props.activity.likes_count}/>
          <ActivityActionShare activity_uuid={props.activity.uuid} />
        </div>
      </div>
    </div>
  ); 
}