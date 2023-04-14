import { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import InfoTooltipPopup from './InfoTooltip';
import TokenForm from './TokenForm';
import { Configuration, OpenAIApi } from 'openai';

import '../css/Chat.css';

let configuration;
let openai;

// TODO: сообщениям нужны айдишники, чтобы при одинаковом тексте сообщения не считались одинаковыми
function Chat() {
  const [isValid, setIsValid] = useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);
  const [infoToolText, setInfoToolText] = useState(null);

  const [isSetApiKeyPopupOpen, setIsSetApiKeyPopupOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey'));

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

  const checkApiKey = () => {
    if (apiKey) {
      configuration = new Configuration({
        apiKey,
      });
      openai = new OpenAIApi(configuration);
    } else {
      setIsSetApiKeyPopupOpen(true);
    }
  };

  useEffect(checkApiKey, [apiKey]);

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
            <div
              key={index}
              className={`message chat__message message_${message.role}`}
            >
              <div className="message__bubble">
                <div className={`message-text message__text`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
        <ChatInput addUserMessage={addUserMessage} />
      </div>
      <InfoTooltipPopup
        isOpen={isInfoTooltipPopupOpen}
        onClose={() => {
          setInfoTooltipPopupOpen(false);
          setTimeout(() => {
            setInfoToolText(null);
          }, 300);
        }}
        isValid={isValid}
        text={infoToolText}
      />
      <TokenForm
        isOpen={isSetApiKeyPopupOpen}
        onClose={() => {
          setIsSetApiKeyPopupOpen(false);
        }}
        setApi={setApiKey}
      />
    </>
  );
}

export default Chat;
