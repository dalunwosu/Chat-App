import React, { useState, useEffect, useRef } from "react";
import './Messages.css';

const Messages = ({ socket }) => {
  const [messagesReceived, setMessagesReceived] = useState([]);

  const messagesColumnRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  useEffect(() => {
    socket.on("last_100_messages", (last100Messages) => {
      console.log("Last 100 messages:", JSON.parse(last100Messages));
      last100Messages = JSON.parse(last100Messages);

      last100Messages = sortMessagesByDate(last100Messages);
      setMessagesReceived((state) => [...last100Messages, ...state]);
    });

    return () => socket.off("last_100_messages");
  }, [socket]);

  useEffect(() => {
    messagesColumnRef.current.scrollTop =
      messagesColumnRef.current.scrollHeight;
  }, [messagesReceived]);

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    );
  }

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className={"messagesColumn"} ref={messagesColumnRef}>
      {messagesReceived.map((msg, i) => (
        <div
          className={`message`}
          key={i}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className={"msgMeta"}>
              {msg.username.charAt(0).toUpperCase() +
                msg.username.slice(1).toLowerCase()}
            </span>
            <span className={"msgMeta"}>
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>
          <p className={"msgText"}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;