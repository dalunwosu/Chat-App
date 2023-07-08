import './Rooms-and-Users.css'
import WeChatLogo from '../img/WeChat.png'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({ socket, username, room }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      console.log(data);
      setRoomUsers(data);
    });

    return () => socket.off('chatroom_users');
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit('leave_room', { username, room, __createdtime__ });
    navigate('/', { replace: true });
  };

  return (
    <div className={'roomAndUsersColumn'}>
       <h1>{`Chatter`}     <img src={WeChatLogo} alt='' style={{ width: '50px', height: '50px' }}></img></h1>
      <h2 className={'roomTitle'}>Room: {room}</h2>

      <div>
        {roomUsers.length > 0 && <h5 className={'usersTitle'}>Users:</h5>}
        <ul className={'usersList'}>
          {roomUsers.map((user) => (
            <li
              style={{
                fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
              }}
              key={user.id}
            >
              
              {user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase()}
            </li>
          ))}
        </ul>
      </div>

      <button className='btn btn-outline' onClick={leaveRoom}>
        Leave
      </button>
    </div>
  );
};

export default RoomAndUsers;