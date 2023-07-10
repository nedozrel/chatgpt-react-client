import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';

import '../css/Chat.css';

// TODO: сообщениям нужны айдишники, чтобы при одинаковом тексте сообщения не считались одинаковыми
function Chat({
  openai,
  setIsSetApiKeyPopupOpen,
  isDisabledTextArea,
  setIsDisabledTextArea,
}) {
  const [allMessages, setAllMessages] = useState([]);
  const [lastUserMessage, setLastUserMessage] = useState(null);
  const [lastBotMessage, setLastBotMessage] = useState(null);

  const prevLastUserMessageRef = useRef(null);
  const prevLastBotMessageRef = useRef(null);
  const chatMessagesRef = useRef(null);

  const addUserMessage = (messageText) => {
    const newMessage = { role: 'user', content: messageText };
    setLastUserMessage(newMessage);
  };

  const addErrorMessage = ({ role, messageText, onClick }) => {
    const error = { role: role, content: messageText, onClick };
    setAllMessages([...allMessages, error]);
  };

  const addUserErrorMessage = ({ messageText, onClick }) => {
    addErrorMessage({ role: 'error-user', messageText, onClick });
  };

  useEffect(() => {
    if (!Object.is(prevLastUserMessageRef.current, lastUserMessage)) {
      setAllMessages([...allMessages, lastUserMessage]);
      prevLastUserMessageRef.current = lastUserMessage;
    } else if (!Object.is(prevLastBotMessageRef.current, lastBotMessage)) {
      setAllMessages([...allMessages, lastBotMessage]);
      prevLastBotMessageRef.current = lastBotMessage;
    }
  }, [lastBotMessage, lastUserMessage, allMessages]);

  useEffect(() => {
    if (chatMessagesRef)
      chatMessagesRef.current?.lastChild?.scrollIntoView({
        behavior: 'smooth',
      });
  }, [allMessages]);

  useEffect(() => {
    const getCompletion = async () => {
      try {
        // TODO: модалочку какую то надо на ошибки.
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          // TODO: мониторить размер allMessages, не должен превышать 4к токенов. А как понять сколько он токенов?
          // Мб есть метод для провреки количества токенов?
          // Мб закэтчить ответ связанный с количеством токенов и в случае него уменьшать отправляемый allMessages?
          messages: allMessages,
        });
        setLastBotMessage(completion.data.choices[0].message);
      } catch (error) {
        if (
          !(
            [
              "Cannot read properties of undefined (reading 'createChatCompletion')",
              'Request failed with status code 401',
            ].indexOf(error.message) === '-1'
          )
        ) {
          setIsDisabledTextArea(true);
          localStorage.clear();
          addUserErrorMessage({
            messageText: 'Неверный токен',
            onClick: () => {
              setIsSetApiKeyPopupOpen(true);
            },
          });
        }
        console.log(error.message);
        console.error(error);
      }
    };

    const allMessagesLength = allMessages.length;
    if (allMessagesLength === 0) return;
    // Чтобы бот не отвечал на свои же сообщения
    if (allMessages[allMessagesLength - 1] === prevLastUserMessageRef.current) {
      getCompletion();
    }
  }, [allMessages]);

  return (
    <>
      <div className="chat">
        <div className={`chat__messages`} ref={chatMessagesRef}>
          {allMessages.map((message, index) => (
            <div
              onClick={message.onClick && message.onClick}
              key={index}
              className={`message message_role_${message.role}`}
            >
              <p className={`message__text message__text_role_${message.role}`}>
                {message.content}
              </p>
            </div>
          ))}
        </div>
        <ChatInput
          addUserMessage={addUserMessage}
          disabled={isDisabledTextArea}
        />
      </div>
    </>
  );
}

export default Chat;
