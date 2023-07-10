import '../css/Popup.css';
import error from '../images/svg/error.svg';
import success from '../images/svg/success.svg';

function InfoTooltip({ isOpen, onClose, isValid, text }) {
  return (
    <section
      className={`popup popup_el_info-tolltip${isOpen ? ' popup_opened' : ''}`}
    >
      <button
        className="popup__button-close"
        type="button"
        aria-label="Закрыть поп-ап"
        onClick={onClose}
      ></button>
      <div className="popup__inner">
        {
          <img
            className="popup__image popup__image_el_info-tolltip"
            src={isValid ? success : error}
            alt={isValid ? 'Успешно' : 'Ошибка'}
          />
        }
        <h2 className="popup__title popup__title_el_info-tolltip">
          {text ? text : isValid ? 'Успешно!' : 'Что-то пошло не так!'}
        </h2>
      </div>
    </section>
  );
}

export default InfoTooltip;
