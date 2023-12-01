import Header from "./Header.js";
import Footer from "./Footer.js";
import Main from "./Main.js";
import ImagePopup from "./ImagePopup.js";
import React, { useState, useEffect } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/Api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import DeletePlacePopup from "./DeletePlacePopup";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as Auth from "../utils/Auth";
import Register from "./Register";
import Login from "./Login";

function App() {
    const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
    const [isImagePopupOpen, setImagePopupOpen] = useState(false);
    const [isConfirmPopupOpen, setConfirmPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [deletePlace, setDeletePlace] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({ email: "", password: "" });
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    const [successInfoTooltip, setSuccessInfoTooltip] = useState({
        image: "",
        text: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        handleCheckToken();
    }, []);

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) =>
                    state.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch(() => console.error(`Получение данных по лайкам, App`));
    }

    function handleDeleteCard(card) {
        setIsLoading(true);
        api.deleteCard(card._id)
            .then(() => {
                setCards((state) => state.filter((c) => c._id !== card._id));
            })
            .then(closeAllPopups)
            .catch(() => console.error(`Удаление карточки, App`))
            .finally(() => setIsLoading(false));
    }

    const handleEditProfileClick = () => {
        setEditProfilePopupOpen(true);
    };

    const handleAddCardClick = () => {
        setAddPlacePopupOpen(true);
    };

    const handleEditAvatarClick = () => {
        setEditAvatarPopupOpen(true);
    };

    const handleConfirmDeleteClick = (card) => {
        setConfirmPopupOpen(true);
        setDeletePlace(card);
    };

    const closeAllPopups = () => {
        setEditProfilePopupOpen(false);
        setAddPlacePopupOpen(false);
        setEditAvatarPopupOpen(false);
        setImagePopupOpen(false);
        setConfirmPopupOpen(false);
        setIsInfoTooltipOpen(false);
    };

    const isOpen =
        isEditAvatarPopupOpen ||
        isInfoTooltipOpen ||
        isEditProfilePopupOpen ||
        isAddPlacePopupOpen ||
        isImagePopupOpen;

    useEffect(() => {
        function closeByEscape(evt) {
            if (evt.key === "Escape") {
                closeAllPopups();
            }
        }
        if (isOpen) {
            document.addEventListener("keydown", closeByEscape);
            return () => {
                document.removeEventListener("keydown", closeByEscape);
            };
        }
    }, [isOpen]);

    const handleCardClick = (card) => {
        setSelectedCard({
            ...selectedCard,
            name: card.name,
            link: card.link,
        });
        setImagePopupOpen(true);
    };

    useEffect(() => {
        if (isLoggedIn) {
            api.getUserData()
                .then((userData) => setCurrentUser(userData))
                .catch(() => console.error(`Получение данных пользователя, App`));
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            api.getInitialCards()
                .then((cards) => setCards(cards))
                .catch(() => console.error(`Получение карточек, App`));
        }
    }, [isLoggedIn]);

    const handleLogin = (userData) => {
        const { email, password } = userData;
        Auth.login({ email, password })
            .then((data) => {
                localStorage.setItem("jwt", data.token);
                setUserData({ email, password });
                setLoggedIn(true);
                navigate("/");
            })
            .catch(() => {
                setIsInfoTooltipOpen(true);
                setSuccessInfoTooltip({
                    image: false,
                    text: "Что-то пошло не так! Попробуйте ещё раз.",
                });
                console.error(`Войти в аккаунт, App`);
            });
    };

    const handleRegister = (userData) => {
        const { email, password } = userData;
        Auth.register({ email, password })
            .then((res) => {
                setIsInfoTooltipOpen(true);
                setSuccessInfoTooltip({
                    image: true,
                    text: "Вы успешно зарегистрировались!",
                });
                navigate("/sign-in");
            })
            .catch(() => {
                setIsInfoTooltipOpen(true);
                setSuccessInfoTooltip({
                    image: false,
                    text: "Что-то пошло не так! Попробуйте ещё раз.",
                });
                console.error(`Зарегистрировать аккаунт, App`);
            });
    };

    const handleCheckToken = () => {
        const jwt = localStorage.getItem("jwt");

        if (jwt) {
            Auth.checkToken(jwt)
                .then((res) => {
                    if (!res.data) {
                        return;
                    }
                    setUserData({ email: res.data.email });
                    setLoggedIn(true);
                    navigate("/");
                })
                .catch(() => {
                    setLoggedIn(false);
                    console.error(`Проверить jwt-токен на валидность, App`);
                });
        }
    };

    function handleSignOut() {
        localStorage.removeItem("jwt");
        setLoggedIn(false);
        navigate("/sign-in");
    }

    function handleUpdateUser(userData) {
        setIsLoading(true);
        api.updateUserData(userData)
            .then(setCurrentUser)
            .then(closeAllPopups)
            .catch(() => console.error(`Обновление данных профиля, App`))
            .finally(() => setIsLoading(false));
    }

    function handleUpdateAvatar(avatarLink) {
        setIsLoading(true);
        api.updateUserAvatar(avatarLink)
            .then(setCurrentUser)
            .then(closeAllPopups)
            .catch(() => console.error(`Обновление аватарки, App`))
            .finally(() => setIsLoading(false));
    }

    function handleAppPlaceSubmit(userData) {
        setIsLoading(true);
        api.sendingCard(userData)
            .then((newCard) => setCards([newCard, ...cards]))
            .then(closeAllPopups)
            .catch(() => console.error(`Добавление новой карточки, App`))
            .finally(() => setIsLoading(false));
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <div className="page__content">
                    <Header
                        loggedIn={isLoggedIn}
                        userData={userData}
                        handleSignOut={handleSignOut}
                    />
                    <Routes>
                        <Route
                            path="/sign-up"
                            element={
                                <Register handleRegister={handleRegister} />
                            }
                        />
                        <Route
                            path="/sign-in"
                            element={<Login handleLogin={handleLogin} />}
                        />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute
                                    element={Main}
                                    loggedIn={isLoggedIn}
                                    onEditAvatar={handleEditAvatarClick}
                                    onEditProfile={handleEditProfileClick}
                                    onAddPlace={handleAddCardClick}
                                    onCardClick={handleCardClick}
                                    onCardLike={handleCardLike}
                                    onCardDelete={handleConfirmDeleteClick}
                                    cards={cards}
                                    isLoading={isLoading}
                                />
                            }
                        />
                        <Route
                            path="*"
                            element={
                                isLoggedIn ? (
                                    <Navigate to="/" />
                                ) : (
                                    <Navigate to="/sign-in" replace />
                                )
                            }
                        />
                    </Routes>
                </div>
                <Footer />
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                    isLoading={isLoading}
                />
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                    isLoading={isLoading}
                />
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onAddPlace={handleAppPlaceSubmit}
                    isLoading={isLoading}
                />
                <ImagePopup
                    id="popup_image"
                    card={selectedCard}
                    isOpen={isImagePopupOpen}
                    onClose={closeAllPopups}
                />
                <DeletePlacePopup
                    isOpen={isConfirmPopupOpen}
                    onClose={closeAllPopups}
                    onCardDelete={handleDeleteCard}
                    card={deletePlace}
                    isLoading={isLoading}
                />
                <InfoTooltip
                    isOpen={isInfoTooltipOpen}
                    onClose={closeAllPopups}
                    tooltip={successInfoTooltip}
                />
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
