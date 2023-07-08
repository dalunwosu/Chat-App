import './Chat.css';
import RoomAndUsersColumn from '../Rooms-and-Users/Rooms-and-Users';
import SendMessage from '../Send-Message/Send-Messsage';
import MessagesReceived from '../Messages/Messages'

const Chat = ({ username, room, socket }) => {
  return (
    <div className='chatContainer'>
      <RoomAndUsersColumn socket={socket} username={username} room={room} />

      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;