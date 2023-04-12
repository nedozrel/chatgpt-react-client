import { useState } from 'react';


function ChatInput({addUserMessage}) {
  const [inputText, setInputText] = useState('');

  const sendMessage = (message) => {
    setInputText('');
    addUserMessage(message)
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage(inputText);
    }
  };

  const handleButtonClick = () => {
    sendMessage(inputText);
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        className="chat-input__input"
        onChange={e => handleInputChange(e)}
        onKeyDown={e => handleInputKeyDown(e)}
        value={inputText}
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