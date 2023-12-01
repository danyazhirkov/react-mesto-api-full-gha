import { useState } from "react";
import { Link } from "react-router-dom";

import AuthForm from "./AuthForm";

function Register({ handleRegister }) {
    const [formValue, setFormValue] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValue({
            ...formValue,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        handleRegister(formValue);
    };

    return (
        <div className="auth">
            <AuthForm
                name={"register"}
                title={"Регистрация"}
                buttonText={"Зарегистрироваться"}
                onSubmit={handleSubmit}
            >
                <input
                    className="auth__input auth__input_type_email"
                    type="email"
                    name="email"
                    id="user-email"
                    value={formValue.email}
                    onChange={handleChange}
                    placeholder="Email"
                    minLength={5}
                    maxLength={40}
                    required
                />

                <input
                    className="auth__input auth__input_type_password"
                    type="password"
                    name="password"
                    id="user-password"
                    value={formValue.password}
                    onChange={handleChange}
                    placeholder="Пароль"
                    minLength={5}
                    maxLength={30}
                    required
                />
            </AuthForm>

            <div className="auth__redirect">
                <p className="auth__redirect_subtitle">
                    Уже зарегистрированы?{" "}
                    <Link to="/sign-in" className="auth__redirect_link">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
