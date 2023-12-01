import React from "react";

function PopupWithForm({
    name,
    title,
    isOpen,
    onClose,
    onSubmit,
    buttonText,
    ...props
}) {
    return (
        <div className={`popup ${isOpen ? "popup_opened" : ""}`}>
            <div className="popup__container">
                <button
                    className="popup__close-button"
                    name="popupCloseButton"
                    type="button"
                    aria-label="Закрыть окно"
                    onClick={onClose}
                />

                <h2 className="popup__title">{title}</h2>

                <form
                    className="form"
                    name={name}
                    id={name}
                    onSubmit={onSubmit}
                >
                    {props.children}

                    <button className="form__submit-button" type="submit">
                        {buttonText}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PopupWithForm;
