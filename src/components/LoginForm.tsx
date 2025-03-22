import { z } from "zod";
import { queryClient } from "../utils/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../api/login";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { closeAuthForm } from "../store/slices";

const CrateValidLogin = z.object({
    email:z.string().email("Введите коректный Email"),
    password:z.string().min(8, "Введите не менее 8 символов")
})

type CreateLoginForm = z.infer<typeof CrateValidLogin>

interface ILoginForm {
    setAuthType: (type: "register" | "auth") => void;
}

export const LoginForm = ({ setAuthType }: ILoginForm) => {
    const dispatch = useDispatch()

    const {register, handleSubmit, formState: {errors}} = useForm<CreateLoginForm>({
        resolver:zodResolver(CrateValidLogin)
    })

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            console.log("Вход успешен, инвалидация запросов...");
            queryClient.invalidateQueries({queryKey:["users", "me"]})
            dispatch(closeAuthForm())
        },
        onError: (error) => {
            console.error("Ошибка входа:", error);
        }
      }, queryClient)
      

    return (
        <form className="auth-form" onSubmit={handleSubmit((data) => {
            loginMutation.mutate(data)
        })}>
                <button className="auth-form__close" onClick={() => dispatch(closeAuthForm())}>
                    <svg className="auth-form__icon-cross" width="18" height="18" aria-hidden="true">
                        <use xlinkHref="/public/sprite.svg#icon-cross-black"></use>
                    </svg>
                </button>
                <div className="auth-form__content">
                    <div className="auth-form__logo">
                        <svg className='auth-form__icon-logo' width='24' height='32'aria-hidden='true'>
                                <use xlinkHref='/public/sprite.svg#icon-logo'></use>
                        </svg>
                        <span className="auth-form__logo-name">маруся</span>
                    </div>
                    <div className="auth-form__wrapper-input">
                        <div className="auth-form__input">
                            <input className="auth-form__field" type="email" placeholder="Электронная почта" {...register("email")}></input>
                            {errors.email && <span style={{color:"red"}}>{errors.email.message}</span>}
                            <svg className='auth-form__icon' width='22' height='19'aria-hidden='true'>
                                <use xlinkHref='/sprite.svg#icon-email'></use>
                            </svg>
                        </div>
                        <div className="auth-form__input">
                            <input className="auth-form__field" type="password" placeholder="Пароль" {...register("password")}></input>
                            {errors.password && <span style={{color:"red"}}>{errors.password.message}</span>}
                            <svg className='auth-form__icon' width='22' height='13'aria-hidden='true'>
                                <use xlinkHref='/sprite.svg#icon-password'></use>
                            </svg>
                        </div>
                    </div>
                    <button className="auth-form__button btn" type="submit">Войти</button>
                    <button className="auth-form__register btn" type="button" onClick={() => setAuthType("register")}>Регистрация</button>
                </div>
        </form>
    )
}