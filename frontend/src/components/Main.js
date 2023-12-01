import vectorEditProfile from "../images/Vector.svg";
import vectorAddButton from "../images/add.svg";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { useContext } from "react";

function Main({
    cards,
    onEditProfile,
    onAddPlace,
    onEditAvatar,
    onCardClick,
    onCardLike,
    onCardDelete,
}) {
    const currentUser = useContext(CurrentUserContext);

    return (
        <main className="main">
            <section className="profile">
                <button
                    className="profile__avatar-button"
                    onClick={onEditAvatar}
                >
                    <img
                        src={currentUser.avatar}
                        className="profile__avatar"
                        alt="Аватарка"
                    />
                </button>
                <div className="profile__info">
                    <div className="profile__items">
                        <h1 className="profile__name">{currentUser.name}</h1>
                        <p className="profile__description">
                            {currentUser.about}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="profile__edit-button"
                        onClick={onEditProfile}
                    >
                        <img
                            src={vectorEditProfile}
                            className="profile__edit-image"
                            alt="Вектор"
                        />
                    </button>
                </div>
                <button
                    type="button"
                    className="profile__add-button"
                    onClick={onAddPlace}
                >
                    <img
                        src={vectorAddButton}
                        className="profile__vector"
                        alt="кнопка"
                    />
                </button>
            </section>
            <section className="elements">
                {cards.map((card) => (
                    <Card
                        card={card}
                        key={card._id}
                        link={card.link}
                        name={card.name}
                        likes={card.likes.length}
                        onCardClick={onCardClick}
                        onCardLike={onCardLike}
                        onCardDelete={onCardDelete}
                    />
                ))}
            </section>
        </main>
    );
}

export default Main;
