import PopupWithForm from "./PopupWithForm";
import { useState, useEffect } from "react";

function AddPlacePopup({ isOpen, onClose, onAddPlace, isLoading }) {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeLink(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        onAddPlace({
            name,
            link,
        });
    }

    useEffect(() => {
        setName("");
        setLink("");
    }, [isOpen]);

    return (
        <PopupWithForm
            name="add"
            title="Новое место"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            buttonText={isLoading ? "Сохранение..." : "Сохранить"}
        >
            <input
                type="text"
                id="name-input-second-error"
                className="form__item form__item_input-name form__item_input-name_second"
                name="title"
                placeholder="Название"
                minLength={2}
                maxLength={30}
                required
                onChange={handleChangeName}
                value={name || ""}
            />
            <span className="form__item-error" />
            <input
                type="url"
                id="url-input-error"
                className="form__item form__item_input-description form__item_input-description_second"
                name="link"
                placeholder="Ссылка на картинку"
                required
                onChange={handleChangeLink}
                value={link || ""}
            />
            <span className="form__item-error" />
        </PopupWithForm>
    );
}

export default AddPlacePopup;
