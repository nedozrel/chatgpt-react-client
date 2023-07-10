import iconPlus from '../images/svg/plus.svg';
import iconMessages from '../images/svg/messages.svg';
import '../css/ChatList.css';

function ChatList() {
  return (
    <>
      <button className="chat-list__add-button">
        <img className="chat-list__icon-plus" src={iconPlus} alt="plus" />
        Добавить чат
      </button>
      <ul className="chat-list">
        <li className="chat-list__item">
          <article className="chat-item">
            <img
              className="chat-item__icon-messages"
              src={iconMessages}
              alt="messages"
            />
            <h2 className="chat-item__name">Название чата</h2>
            <p className="chat-item__info-message">Последнее:</p>
            <p className="chat-item__last-message">
              На краю дороги стоял дуб дуб дуб дуб
            </p>
          </article>
        </li>
        <li className="chat-list__item">
          <article className="chat-item">
            <img
              className="chat-item__icon-messages"
              src={iconMessages}
              alt="messages"
            />
            <h2 className="chat-item__name">Название чата</h2>
            <p className="chat-item__info-message">Последнее:</p>
            <p className="chat-item__last-message">
              На краю дороги стоял дуб дуб дуб дуб
            </p>
          </article>
        </li>
        <li className="chat-list__item">
          <article className="chat-item">
            <img
              className="chat-item__icon-messages"
              src={iconMessages}
              alt="messages"
            />
            <h2 className="chat-item__name">Название чата</h2>
            <p className="chat-item__info-message">Последнее:</p>
            <p className="chat-item__last-message">
              На краю дороги стоял дуб дуб дуб дуб
            </p>
          </article>
        </li>
      </ul>
    </>
  );
}

export default ChatList;
