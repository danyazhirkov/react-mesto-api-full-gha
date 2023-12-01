import PopupWithForm from "./PopupWithForm";
import { useState, useContext, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isLoading }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const currentUser = useContext(CurrentUserContext);

    function handleSubmit(e) {
        e.preventDefault();

        onUpdateUser({
            name,
            about: description,
        });
    }

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
    }

    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, isOpen]);

    return (
        <PopupWithForm
            name="profile"
            title="Редактировать профиль"
            titleButton="Сохранить"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            buttonText={isLoading ? "Сохранение..." : "Сохранить"}
        >
            <input
                type="text"
                id="name-input-error"
                className="form__item form__item_input_name"
                name="name"
                placeholder="name"
                minLength={2}
                maxLength={40}
                required
                onChange={handleChangeName}
                value={name || ""}
            />
            <span className="form__item-error" />
            <input
                type="text"
                id="description-input-error"
                className="form__item form__item_input_description"
                name="description"
                placeholder="description"
                minLength={2}
                maxLength={200}
                required
                onChange={handleChangeDescription}
                value={description || ""}
            />
            <span className="form__item-error" />
        </PopupWithForm>
    );
}

export default EditProfilePopup;
