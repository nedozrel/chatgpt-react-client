import { useState } from 'react';

// TODO: По хорошему взорвать бы все это говно и сделать заново, стили и верстку так точно
function ChatInput({addUserMessage}) {
  const [inputText, setInputText] = useState('');
  const minTextareaHeight = 20;
  const maxTextareaHeight = 120;

  const sendMessage = (message) => {
    setInputText('');
    addUserMessage(message);
  };

  const changeTextareaSize = (input) => {
    input.style.height = 'auto'; // сбрасываем фиксированную высоту, чтобы определить реальную высоту текста
    input.style.height = `${Math.min(Math.max(input.scrollHeight, minTextareaHeight), maxTextareaHeight)}px`; // устанавливаем высоту textarea в зависимости от ее содержимого

  };

  const handleTextareaChange = (e) => {
    changeTextareaSize(e.target);
    setInputText(e.target.value);
  };

  const handleTextareaFocus = (e) => {
    changeTextareaSize(e.target);
  };

  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText.trim());
      // TODO: почему то не работает, надо сделать чтоб инпут менял размер при отправке
      changeTextareaSize(e.target);
    }
  };

  const handleButtonClick = () => {
    sendMessage(inputText);
  };

  return (
    <div className="chat-input">
      <textarea
        autoFocus
        rows="1"
        placeholder="Send a message..."
        tabIndex="0"
        className="chat-input__input"
        onChange={e => handleTextareaChange(e)}
        onKeyDown={e => handleTextareaKeyDown(e)}
        onFocus={e => handleTextareaFocus(e)}
        value={inputText}
        // Тут тоже наверное стоит сделать ref и через него менять размер
      />
      <button
        className="chat-input__btn-send"
        onClick={() => handleButtonClick()}>
        send
      </button>
    </div>
  );
}

export default ChatInput;
