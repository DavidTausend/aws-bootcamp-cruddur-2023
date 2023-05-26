import './ActivityShow.css';
import React from "react";
//import { trace } from '@opentelemetry/api';
import { useParams } from 'react-router-dom';
import DesktopNavigation  from 'components/DesktopNavigation';
import DesktopSidebar     from 'components/DesktopSidebar';
import ActivityForm from 'components/ActivityForm';
import ReplyForm from 'components/ReplyForm';
import Replies from 'components/Replies';
import ActivityItem from 'components/ActivityItem';

import {get} from 'lib/Requests';
import {checkAuth} from 'lib/CheckAuth';

export default function ActivityShowPage() {
  const [activity, setActivity] = React.useState(null);
  const [replies, setReplies] = React.useState([]);
  const [popped, setPopped] = React.useState(false);
  const [poppedReply, setPoppedReply] = React.useState(false);
  const [replyActivity, setReplyActivity] = React.useState({});
  const [user, setUser] = React.useState(null);
  const dataFetchedRef = React.useRef(false);
  //const tracer = trace.getTracer();
  const params = useParams();

  const loadData = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/@${params.handle}/status${params.activity_uuid}`
    get(url,null,function(data){
      setActivity(data.activity)
      setReplies(data.replies)
    })
  }
  //React.useEffect(() => {
  //  if (dataFetchedRef.current) return;
  //  dataFetchedRef.current = true;
  
 //   tracer.startActiveSpan('HomeFeedPage', (span) => {
 //     tracer.startActiveSpan('load_data', (span) => {
 //       span.setAttribute('endpoint', '/api/activities/home');
 //       loadData();
 //       span.end()
 //     })
//      tracer.startActiveSpan('check_auth', (span) => {
 //       span.setAttribute('endpoint', '/api/auth');
 //       checkAuth(setUser);
  //      span.end()
  //    })
  //    span.end()
  //  })
 // }, [])
  

  React.useEffect(()=>{
    //prevents double call
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    loadData();
    checkAuth(setUser);
  }, [])

  return (
    <article>
      <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
      <div className='content'>
        <ActivityForm  
          popped={popped}
          setPopped={setPopped} 
          setActivities={setActivities} 
        />
        <ReplyForm 
          activity={replyActivity} 
          popped={poppedReply} 
          setPopped={setPoppedReply} 
          setActivities={setActivities} 
          activities={activities} 
        />
        <div className='activity_feed'>
          <div className='activity_feed_heading'>
            <div className='title'>Home</div>
          </div> 
          <ActivityItem 
            setReplyActivity={setReplyActivity} 
            setPopped={setPoppedReply} 
            key={activity.uuid} 
            activity={activity} 
          />
          <Replies
            title="Home" 
            setReplyActivity={setReplyActivity} 
            setPopped={setPoppedReply} 
            activities={activities} 
          />
          </div>
        </div>
        <DesktopSidebar user={user} />
    </article>
  );
}