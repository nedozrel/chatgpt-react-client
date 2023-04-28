import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';

import '../css/Chat.css';

// TODO: сообщениям нужны айдишники, чтобы при одинаковом тексте сообщения не считались одинаковыми
function Chat({
  openai,
  setInfoTooltipPopupOpen,
  setIsValid,
  setInfoToolText,
}) {
  const [allMessages, setAllMessages] = useState([
    { role: 'user', content: 'Запрос от Пользователя' },
    { role: 'assistant', content: 'Ответ от Бота' },
    { role: 'user', content: 'Запрос от Пользователя' },
    { role: 'error-user ', content: 'Неверный токен' },
    { role: 'assistant', content: 'Ответ от Бота' },
    { role: 'error-assistant', content: 'Ошибка со стороны сервера' },
    { role: 'user', content: 'Запрос от Пользователя' },
    { role: 'error-assistant', content: 'Ошибка со стороны сервера' },
  ]);
  const [lastUserMessage, setLastUserMessage] = useState(null);
  const [lastBotMessage, setLastBotMessage] = useState(null);

  const prevLastUserMessageRef = useRef(null);
  const prevLastBotMessageRef = useRef(null);
  const chatMessagesRef = useRef(null);

  const addUserMessage = (messageText) => {
    const newMessage = { role: 'user', content: messageText };
    setLastUserMessage(newMessage);
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
    const allMessagesLength = allMessages.length;
    if (allMessagesLength === 0) return;
    // Чтобы бот не отвечал на свои же сообщения
    if (allMessages[allMessagesLength - 1] === prevLastBotMessageRef.current)
      return;

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
        openInfoTooltip(false, 'Неверный токен');
        setInfoTooltipPopupOpen(true);
        console.error(error);
      }
    };
    getCompletion();
  }, [allMessages]);

  const openInfoTooltip = (valid, text) => {
    setIsValid(valid);
    text && setInfoToolText(text);
    setInfoTooltipPopupOpen(true);
  };

  return (
    <>
      <div className="chat">
        <div className={`chat__messages`} ref={chatMessagesRef}>
          {allMessages.map((message, index) => (
            <div key={index} className={`message message_role_${message.role}`}>
              <p className={`message__text message__text_role_${message.role}`}>
                {message.content}
              </p>
            </div>
          ))}
        </div>
        <ChatInput addUserMessage={addUserMessage} />
      </div>
    </>
  );
}

export default Chat;
