import { useDispatch } from "react-redux"
import { closeSuccessRegister } from "../store/slices"

const RegisterSuccess = () => {
    const dispatch = useDispatch()

    return (
        <div className="register-success">
            <div className="register-success__wrapper">
                <button className="register-success__button btn" onClick={() => dispatch(closeSuccessRegister()) }>
                    <svg className="register-success__icon-cross" width="18" height="18" aria-hidden="true">
                        <use xlinkHref="/public/sprite.svg#icon-cross-black"></use>
                    </svg>
                </button>
                <span className="register-success__text">Регистрация прошла успешно</span>
            </div>
        </div>
    )
}

export default RegisterSuccess