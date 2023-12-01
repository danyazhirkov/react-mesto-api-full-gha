import PopupWithForm from "./PopupWithForm";
import { useRef, useEffect } from "react";

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isLoading }) {
    const avatarRef = useRef("");

    useEffect(() => {
        avatarRef.current.value = "";
    }, [isOpen]);

    function handleSubmit(e) {
        e.preventDefault();

        onUpdateAvatar({
            avatar: avatarRef.current.value,
        });
    }

    return (
        <PopupWithForm
            name="avatar"
            title="Обновить аватар"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            buttonText={isLoading ? "Сохранение..." : "Сохранить"}
        >
            <input
                type="url"
                id="avatar-input-error"
                className="form__item form__item_input-avatar"
                name="avatar"
                placeholder="Ссылка на аватар"
                required
                ref={avatarRef}
            />
            <span className="form__item-error" />
        </PopupWithForm>
    );
}
export default EditAvatarPopup;
