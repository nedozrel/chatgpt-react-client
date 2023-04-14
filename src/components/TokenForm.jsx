import { useState } from 'react';
import '../css/Popup.css';

function TokenForm({ isOpen, onClose, setApi }) {
  const [formValue, setFormValue] = useState({
    apiKey: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('apiKey', formValue.apiKey);
    setFormValue({ apiKey: '' });
    setApi(formValue.apiKey);
    onClose();
  }

  return (
    <section className={`popup${isOpen ? ' popup_opened' : ''}`}>
      <div className="popup__inner">
        <h2 className="popup__title">Установить OPENAI API KEY</h2>
        <form
          className="popup__form"
          onSubmit={handleSubmit}
          name="edit-api-key"
        >
          <input
            className="popup__form-input"
            required
            id="apiKey"
            name="apiKey"
            placeholder="OPENAI API KEY"
            type="text"
            value={formValue.apiKey}
            onChange={handleChange}
          />
          <button className="popup__form-button-submit" type="submit">
            Подтвердить
          </button>
        </form>
      </div>
    </section>
  );
}

export default TokenForm;
