import React from "react";

function ImagePopup({ card, id, isOpen, onClose }) {
    return (
        <div
            className={`popup popup_image ${isOpen ? "popup_opened" : ""}`}
            id={id}
        >
            <div className="popup__background">
                <img className="popup__photo" src={card.link} alt={card.name} />
                <p className="popup__subtitle">{card.name}</p>
                <button
                    className="popup__button-image"
                    type="button"
                    onClick={onClose}
                />
            </div>
        </div>
    );
}

export default ImagePopup;
