import { useEffect, useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import TokenForm from './TokenForm';
import Chat from './Chat';
import ChatList from './ChatList';
import '../css/app.css';
import pen from '../images/svg/pen.svg';
let configuration;
let openai;

function App() {
  const [isSetApiKeyPopupOpen, setIsSetApiKeyPopupOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey'));
  const [isDisabledTextArea, setIsDisabledTextArea] = useState(false);

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

  return (
    <>
     {apiKey && <div className="app">
        <ChatList />
        <button className="app__chat-header">
          <img className="app__chat-pen" src={pen} alt="pen" />
          Задать поведение
        </button>
        <div className="app__chat">
          <Chat
            openai={openai}
            setIsSetApiKeyPopupOpen={setIsSetApiKeyPopupOpen}
            isDisabledTextArea={isDisabledTextArea}
            setIsDisabledTextArea={setIsDisabledTextArea}
          />
        </div>
      </div>}
      <TokenForm
        isOpen={isSetApiKeyPopupOpen}
        onClose={() => {
          setIsSetApiKeyPopupOpen(false);
          setIsDisabledTextArea(false);
        }}
        setApi={setApiKey}
      />
    </>
  );
}

export default App;
