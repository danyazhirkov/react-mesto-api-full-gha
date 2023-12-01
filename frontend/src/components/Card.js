import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";

function Card({ card, onCardClick, onCardDelete, onCardLike }) {
    const currentUser = useContext(CurrentUserContext);

    const isOwn = card.owner._id === currentUser._id;
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    const cardLikeButtonClassName = `element__button-heart ${
        isLiked && "element__button-heart_theme-dark"
    }`;

    function handleClick() {
        onCardClick(card);
    }

    function handleDeleteClick(e) {
        e.stopPropagation();
        onCardDelete(card);
    }

    function handleLikeClick() {
        onCardLike(card);
    }

    return (
        <div className="element">
            <img
                src={card.link}
                className="element__photo"
                alt={card.name}
                onClick={handleClick}
            />
            {isOwn && (
                <button
                    type="button"
                    className="element__button-trash"
                    onClick={handleDeleteClick}
                />
            )}
            <div className="element__description">
                <h2 className="element__name">{card.name}</h2>
                <div className="element__likes-stuff">
                    <button
                        type="button"
                        className={cardLikeButtonClassName}
                        onClick={handleLikeClick}
                    ></button>
                    <div className="element__like-counter">
                        {card.likes.length}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Card;
