import { useEffect, useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import InfoTooltipPopup from './InfoTooltip';
import TokenForm from './TokenForm';
import Chat from './Chat';
import ChatList from './ChatList';
import '../css/app.css';
import pen from '../images/svg/pen.svg';
let configuration;
let openai;

function App() {
  const [isValid, setIsValid] = useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);
  const [infoToolText, setInfoToolText] = useState(null);

  const [isSetApiKeyPopupOpen, setIsSetApiKeyPopupOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey'));
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
      <div className="app">
        <ChatList />
        <button className="app__chat-header">
          <img className="app__chat-pen" src={pen} alt="pen" />
          Задать поведение
        </button>
        <div className="app__chat">
          <Chat
            openai={openai}
            setInfoTooltipPopupOpen={setInfoTooltipPopupOpen}
            setIsValid={setIsValid}
            setInfoToolText={setInfoToolText}
          />
        </div>
      </div>
      {/* <TokenForm
        isOpen={isSetApiKeyPopupOpen}
        onClose={() => {
          setIsSetApiKeyPopupOpen(false);
        }}
        setApi={setApiKey}
      />
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
      /> */}
    </>
  );
}

export default App;
