import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import { Configuration, OpenAIApi } from 'openai';

import '../css/Chat.css';

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function Chat() {
  const [allMessages, setAllMessages] = useState([]);
  const [lastUserMessage, setLastMessage] = useState(null);
  const [lastBotMessage, setLastBotMessage] = useState(null);
  const [chatMessagesMargin, setChatMessagesMargin] = useState(70);

  const chatInputRef = useRef(null);

  const addUserMessage = (messageText) => {
    const newMessage = {role: 'user', content: messageText};
    setLastMessage(newMessage);
  };

  useEffect(() => {
    if (!lastBotMessage) return;
    setAllMessages([...allMessages, lastBotMessage]);
  }, [lastBotMessage]);

  useEffect(() => {
    if (!lastUserMessage) return;
    setAllMessages([...allMessages, lastUserMessage]);
  }, [lastUserMessage]);

  useEffect(() => {
    const allMessagesLength = allMessages.length;
    if (allMessagesLength === 0) return;
    if (allMessages[allMessagesLength - 1] === lastBotMessage) return;

    const getCompletion = async () => {
      try {
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: allMessages,
        });
        setLastBotMessage(completion.data.choices[0].message);
      } catch (error) {
        console.error(error);
      }
    };
    getCompletion();
  }, [allMessages]);

  useEffect(() => {
    if (chatInputRef.current) {
      setChatMessagesMargin(chatInputRef.current.offsetHeight + 10);
    }
  }, [chatInputRef.current?.offsetHeight]);

  return (
    <div className="chat">
      <div className={`chat__messages`} style={{marginBottom: chatMessagesMargin}}>
        {
          allMessages.map((message, index) => (
            <div key={index} className={`message chat__message message_${message.role}`}>
              <div className="message__bubble">
                <div className={`message-text message__text`}>
                  {message.content}
                </div>
              </div>
            </div>))
        }
      </div>
      <ChatInput
        addUserMessage={addUserMessage}
        ref={chatInputRef}
      />
    </div>
  );
}

export default Chat
;