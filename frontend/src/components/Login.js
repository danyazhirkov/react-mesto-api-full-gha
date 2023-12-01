import { useState } from "react";
import AuthForm from "./AuthForm";

function Login({ handleLogin }) {
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

        handleLogin(formValue);
    };

    return (
        <div className="auth">
            <AuthForm
                name={"login"}
                title={"Вход"}
                buttonText={"Войти"}
                onSubmit={handleSubmit}
            >
                <input
                    className="auth__input auth__input_type_email"
                    type="email"
                    name="email"
                    id="user-email"
                    value={formValue.email || ""}
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
                    value={formValue.password || ""}
                    onChange={handleChange}
                    placeholder="Пароль"
                    minLength={5}
                    maxLength={30}
                    required
                />
            </AuthForm>
        </div>
    );
}

export default Login;
