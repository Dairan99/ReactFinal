import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { queryClient } from "../utils/queryClient";
import { registerUser } from "../api/register";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { closeAuthForm, setSuccessRegister } from "../store/slices";

const CreateValidRegistr = z.object({
    email:z.string().email("Введите коректный Email"),
    name:z.string().min(3, "Введите не менее 3 символов"),
    surname:z.string().min(5, "Введите не менее 5 символов"),
    password:z.string().min(8, "Введите не менее 8 символов"),
    confrimPassword:z.string().min(8, "Введите верный пароль")
}).refine((data) => data.password === data.confrimPassword, {
    message: "Пароли не совпадают",
    path:["confrimPassword"]
})

type CreateRegisterForm = z.infer<typeof CreateValidRegistr>

interface IRegister {
    setAuthType:(type: "auth" | "register") => void,
}

export const RegisterForm = ({setAuthType }: IRegister) => {
    const dispatch = useDispatch()
    const [serverError, setServerError] = useState<string | null>(null)

    const { register, handleSubmit, formState: {errors}} = useForm<CreateRegisterForm>({
        resolver: zodResolver(CreateValidRegistr)
      })

    const registerMutation = useMutation({
        mutationFn:registerUser,
        onError:(error: any) => {
            setServerError(error.message)
            dispatch(setSuccessRegister(false));
        },
        onSuccess: async () => {
            console.log("Регистрация успешна"); // Отладочное сообщение
            setServerError(null);
            setAuthType("auth");
            dispatch(closeAuthForm());
            await queryClient.invalidateQueries({ queryKey: ["users", "me"] });
            dispatch(setSuccessRegister(true));
        },
    },queryClient)

    return (
        <form className="register-form" onSubmit={handleSubmit((data) => {
            setServerError(null)
            registerMutation.mutate(data)
        })}>
            <button className="register-form__close" onClick={() => dispatch(closeAuthForm()) }>
                <svg className="register-form__icon-cross" width="18" height="18" aria-hidden="true">
				    <use xlinkHref="/public/sprite.svg#icon-cross-black"></use>
			    </svg>
            </button>
            <div className="register-form__content">
                <div className="register-form__logo">
                    <svg className='register-form__icon-logo' width='24' height='32'aria-hidden='true'>
                        <use xlinkHref='/public/sprite.svg#icon-logo'></use>
                    </svg>
                    <span className="register-form__logo-name">маруся</span>
                </div>
                <h2 className="register-form__title">Регистрация</h2>
                <div className="register-form__wrapper-input">
                    <div className="register-form__input">
                        <input className="register-form__field" type="email" placeholder="Электронная почта" {...register("email")}></input>
                        {errors.email && <span style={{color:"red"}}>{errors.email.message}</span>}
                        {serverError && <span style={{color:"red"}}>{serverError}</span>}
                        <svg className='register-form__icon' width='22' height='19'aria-hidden='true'>
                            <use xlinkHref='/public/sprite.svg#icon-email'></use>
                        </svg>
                    </div>
                    <div className="register-form__input">
                        <input className="register-form__field" type="text" placeholder="Имя" {...register("name")}></input>
                        {errors.name && <span style={{color:"red"}}>{errors.name.message}</span>}
                        <svg className='register-form__icon' width='16' height='22'aria-hidden='true'>
                            <use xlinkHref='/public/sprite.svg#icon-user'></use>
                        </svg>
                    </div>
                    <div className="register-form__input">
                        <input className="register-form__field" type="text" placeholder="Фамилия"{...register("surname")}></input>
                        {errors.surname && <span style={{color:"red"}}>{errors.surname.message}</span>}
                        <svg className='register-form__icon' width='16' height='22'aria-hidden='true'>
                            <use xlinkHref='/public/sprite.svg#icon-user'></use>
                        </svg>
                    </div>
                    <div className="register-form__input">
                        <input className="register-form__field" type="password" placeholder="Пароль" {...register("password")}></input>
                        {errors.password && <span style={{color:"red"}}>{errors.password.message}</span>}
                        <svg className='register-form__icon' width='22' height='13'aria-hidden='true'>
                            <use xlinkHref='/public/sprite.svg#icon-password'></use>
                        </svg>
                    </div>
                    <div className="register-form__input">
                        <input className="register-form__field" type="password" placeholder="Подтвердите пароль" {...register("confrimPassword")}></input>
                        {errors.confrimPassword && <span style={{color:"red"}}>{errors.confrimPassword.message}</span>}
                        <svg className='register-form__icon' width='22' height='13'aria-hidden='true'>
                            <use xlinkHref='/public/sprite.svg#icon-password'></use>
                        </svg>
                    </div>
                </div>
                <button className="register-form__button  btn" type="submit">Создать аккаунт</button>
                <button className="register-form__auth btn" type="button" onClick={() => setAuthType("auth")}>У меня есть пароль</button>
            </div>
        </form>
    )
}