import PopupWithForm from "./PopupWithForm";

function DeletePlacePopup({ card, isOpen, onClose, onCardDelete, isLoading }) {
    function handleSubmit(e) {
        e.preventDefault();
        onCardDelete(card);
    }
    return (
        <PopupWithForm
            name="confirm"
            title="Вы уверены?"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={handleSubmit}
            buttonText={isLoading ? "Сохранение..." : "Да"}
        ></PopupWithForm>
    );
}

export default DeletePlacePopup;
