import { baseCohortUrl, myToken } from "./utils";

class Api {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }

    _request(urlEndpoint, options) {
        return fetch(this._url + urlEndpoint, options).then(
            this._getResponseData
        );
    }

    _getResponseData(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    }

    getInitialCards() {
        return this._request("/cards", {
            method: "GET",
            headers: this._headers,
        });
    }

    getUserData() {
        return this._request("/users/me", {
            method: "GET",
            headers: this._headers,
        });
    }

    updateUserData(userData) {
        return this._request("/users/me", {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify(userData),
        });
    }

    sendingCard(userData) {
        return fetch(`${this._url}/cards`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(userData),
        }).then((res) => this._getResponseData(res));
    }

    _likeCard(cardId) {
        return this._request(`/cards/${cardId}/likes`, {
            method: "PUT",
            headers: this._headers,
        });
    }

    _unlikeCard(cardId) {
        return this._request(`/cards/${cardId}/likes`, {
            method: "DELETE",
            headers: this._headers,
        });
    }

    changeLikeCardStatus(cardId, isLiked) {
        return isLiked ? this._likeCard(cardId) : this._unlikeCard(cardId);
    }

    deleteCard(cardId) {
        return this._request(`/cards/${cardId}`, {
            method: "DELETE",
            headers: this._headers,
        });
    }

    updateUserAvatar(data) {
        return this._request("/users/me/avatar", {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify({
                avatar: data["avatar"],
            }),
        });
    }
}

const api = new Api({
    url: baseCohortUrl,
    headers: {
        authorization: myToken,
        "Content-Type": "application/json",
    },
});

export default api;
