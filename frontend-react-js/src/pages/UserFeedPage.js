import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import DesktopNavigation from 'components/DesktopNavigation';
import DesktopSidebar from 'components/DesktopSidebar';
import ActivityFeed from 'components/ActivityFeed';
import ActivityForm from 'components/ActivityForm';
import { checkAuth } from 'lib/CheckAuth';
import ProfileHeading from 'components/ProfileHeading';
import ProfileForm from 'components/ProfileForm';
import { get } from 'lib/Requests';

export default function UserFeedPage() {
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState([]);
  const [popped, setPopped] = useState([]);
  const [poppedProfile, setPoppedProfile] = useState([]);
  const [user, setUser] = useState(null);
  const dataFetchedRef = React.useRef(false);

  const params = useParams();

  const loadData = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/activities/@${params.handle}`;
    get(url,{
      auth: false,
      function (data) {
        console.log('setprofile', data.profile);
        setProfile(data.profile);
        setActivities(data.activities);
    }
    });
  };

  useEffect(() => {
    //prevents double call
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    loadData();
    checkAuth(setUser);
  }, [loadData]);

  return (
    <article>
      <DesktopNavigation user={user} active={'profile'} setPopped={setPopped} />
      <div className='content'>
        <ActivityForm popped={popped} setActivities={setActivities} />
        <ProfileForm
          profile={profile}
          popped={poppedProfile}
          setPopped={setPoppedProfile}
        />
        <div className='activity_feed'>
          <ProfileHeading setPopped={setPoppedProfile} profile={profile} />
          <ActivityFeed activities={activities} />
        </div>
      </div>
      <DesktopSidebar user={user} />
    </article>
  );
}