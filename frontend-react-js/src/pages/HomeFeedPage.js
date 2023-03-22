import './HomeFeedPage.css';
import React, { useEffect, useRef, useState } from "react";
import { trace } from '@opentelemetry/api';

import DesktopNavigation from '../components/DesktopNavigation';
import DesktopSidebar from '../components/DesktopSidebar';
import ActivityFeed from '../components/ActivityFeed';
import ActivityForm from '../components/ActivityForm';
import ReplyForm from '../components/ReplyForm';
import checkAuth from '../lib/CheckAuth';

export default function HomeFeedPage() {
  const [activities, setActivities] = useState([]);
  const [popped, setPopped] = useState(false);
  const [poppedReply, setPoppedReply] = useState(false);
  const [replyActivity, setReplyActivity] = useState({});
  const [user, setUser] = useState(null);
  const dataFetchedRef = useRef(false);
  const tracer = trace.getTracer();

  const loadData = async () => {
    try {
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/home`
      const res = await fetch(backend_url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        },
        method: "GET"
      });
      let resJson = await res.json();
      if (res.status === 200) {
        setActivities(resJson)
      } else {
        console.log(res)
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
  
    tracer.startActiveSpan('HomeFeedPage', (span) => {
      tracer.startActiveSpan('load_data', (span) => {
        span.setAttribute('endpoint', '/api/activities/home');
        loadData();
        span.end()
      })
      tracer.startActiveSpan('check_auth', (span) => {
        span.setAttribute('endpoint', '/api/auth');
        checkAuth(setUser);
        span.end()
      })
      span.end()
    })
  }, []);



  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    loadData();
    checkAuth(setUser);
  }, []);


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
        <ActivityFeed 
          title="Home" 
          setReplyActivity={setReplyActivity} 
          setPopped={setPoppedReply} 
          activities={activities} 
        />
      </div>
      <DesktopSidebar user={user} />
    </article>
  );
}