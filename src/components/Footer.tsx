const Footer = () => {
    return (
        <div className="footer">
            <div className="container">
                <div className="footer__content">
                    <a className="footer__link" href="#">
                        <svg className="footer__icon" width="19" height="11">
                            <use xlinkHref="/ReactFinal/sprite.svg#icon-vk"></use>
                        </svg>
                    </a>
                    <a className="footer__link" href="#">
                        <svg className="footer__icon" width="16" height="12">
                            <use xlinkHref="/ReactFinal/sprite.svg#icon-youtube"></use>
                        </svg>
                    </a>
                    <a className="footer__link" href="#">
                        <svg className="footer__icon" width="12" height="19">
                            <use xlinkHref="/ReactFinal/sprite.svg#icon-ok"></use>
                        </svg>
                    </a>
                    <a className="footer__link" href="#">
                        <svg className="footer__icon" width="17" height="15">
                            <use xlinkHref="/ReactFinal/sprite.svg#icon-tg"></use>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Footer