function AuthForm({ title, name, onSubmit, buttonText, ...props }) {

	return (
		<div className="auth__container">

			<h1 className="auth__title">{title}</h1>

			<form
				className={`auth__form auth__form_${name}`}
				name={name}
				onSubmit={onSubmit}>

				{props.children}

				<button
					className="auth__button"
					type="submit">
					{buttonText}
				</button>
			</form>

		</div>
	);

};

export default AuthForm;