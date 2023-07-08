import './Home.css'
import { useNavigate } from 'react-router-dom'; 
import WeChatLogo from '../img/WeChat.png'

const Home = ({ username, setUsername, room, setRoom, socket }) => {
  const navigate = useNavigate();

  const joinRoom = () => {
    if (room !== '' && username !== '') {
      socket.emit('join_room', { username, room });
    }

    
    navigate('/chat', { replace: true });
  };

  return (
    <div className={'container'}>
      <div className={'formContainer'}>
        <h1>{`Chatter`}     <img src={WeChatLogo} alt='' style={{ width: '50px', height: '50px' }}></img></h1>
        <input
          className={'input'}
          placeholder='Username...'
          onChange={(e) => setUsername(e.target.value)}
        />

        <select
          className={'input'}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option>-- Select Room --</option>
          <option value='Family'>Family</option>
          <option value='Friends'>Friends</option>
          <option value='Work'>Work</option>
          <option value='Coding'>Coding</option>
          <option value='School'>School</option>
          <option value='Sports'>Sports</option>
        </select>

        <button
          className='btn btn-secondary'
          style={{ width: '100%' }}
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;