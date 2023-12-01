import usePopupClose from '../hooks/usePopupClose';

import iconSuccess from '../images/success.png';
import iconNotSuccess from '../images/not-success.png';

function InfoTooltip({ isOpen, onClose, tooltip }) {

	usePopupClose(isOpen, onClose);

	return (
		<div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
			<div className="popup__container popup__container_type_tooltip">

				<button
					className="popup__close-button"
					name="popupCloseButton"
					type="button"
					aria-label="Закрыть окно"
					onClick={onClose}
				/>

				<img
					className="popup__info-icon"
					src={tooltip.image ? iconSuccess : iconNotSuccess}
					alt={tooltip.text}
				/>

				<h2
					className="popup__info-title">
					{tooltip.text}
				</h2>

			</div>
		</div>
	);

};

export default InfoTooltip;