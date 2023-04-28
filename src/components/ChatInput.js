import { useEffect, useRef, useState } from 'react';

function ChatInput({addUserMessage}) {
  const [inputText, setInputText] = useState('');
  const textAreaRef = useRef(null);

  const changeTextareaSize = (textArea) => {
    const minTextareaHeight = 23;
    const maxTextareaHeight = 92;
    textArea.style.height = 'auto'; // сбрасываем фиксированную высоту, чтобы определить реальную высоту текста
    textArea.style.height = `${Math.min(Math.max(textArea.scrollHeight, minTextareaHeight), maxTextareaHeight)}px`; // устанавливаем высоту textarea в зависимости от ее содержимого
  };

  useEffect(() => {
    if (textAreaRef.current)
      changeTextareaSize(textAreaRef.current);
  }, [inputText, textAreaRef]);

  const sendMessage = (message) => {
    setInputText('');
    addUserMessage(message);
  };

  const handleTextareaChange = (e) => {
    setInputText(e.target.value);
  };

  const handleTextareaFocus = (e) => {
    changeTextareaSize(e.target);
  };

  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText.trim());
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
        placeholder="Введите текст..."
        tabIndex="0"
        className="chat-input__textarea "
        onChange={e => handleTextareaChange(e)}
        onKeyDown={e => handleTextareaKeyDown(e)}
        onFocus={e => handleTextareaFocus(e)}
        value={inputText}
        ref={textAreaRef}
      />
      <button
        className="chat-input__btn-send"
        onClick={() => handleButtonClick()}>
      </button>
    </div>
  );
}

export default ChatInput;
