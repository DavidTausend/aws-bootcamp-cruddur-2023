import './ProfileAvatar.css';

export default function ProfileAvatar({ id }) {
  const backgroundImage = id != null ? `url("https://assets.hallotausend.com/avatars/${id}.jpg")` : "none";

  const styles = {
    backgroundImage,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div 
      className="profile-avatar"
      style={styles}
    ></div>
  );
}
