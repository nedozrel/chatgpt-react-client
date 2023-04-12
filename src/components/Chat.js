import { useEffect, useState } from 'react';
import ChatInput from './ChatInput';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


function Chat() {
  const [allMessages, setAllMessages] = useState([]);
  const [lastUserMessage, setLastMessage] = useState(null);
  const [lastBotMessage, setLastBotMessage] = useState(null);


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
    const allMessagesLength = allMessages.length
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


  return (
    <div className="chat">
      {/* Передаем функцию addUserMessage в ChatInput */}
      <ChatInput addUserMessage={addUserMessage}/>
      {/* Отображаем все сообщения */}
      {allMessages.map((message, index) => (
        <div key={index} className={`message message__${message.role}`}>
          {message.content}
        </div>
      ))}
    </div>
  );
}

export default Chat;