import { useMutation, useQuery } from "@tanstack/react-query"
import { fetchMe } from "../api/fetchMe"
import { logout } from "../api/logout"
import { queryClient } from "../utils/queryClient"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { IFavoritesData, receivingFavorites } from "../api/receivingFavorites"
import { removeFavorites } from "../api/removeFavorites"

interface DataAccount {
    name:string,
    surname:string,
    email:string
}

const AboutAccount = () => {
    const navigate = useNavigate()
    const [toggleFavorites, setToggleFavorites] = useState(true)

    const {data, isLoading, isError} = useQuery<DataAccount | undefined>({
        queryFn: () => fetchMe(),
        queryKey:["users", "me"],
        retry:false
    })

    const {data:favouritesData} = useQuery<IFavoritesData[]>({
        queryFn: () => receivingFavorites(),
        queryKey:["favorites"],
        enabled:toggleFavorites
    })

    const deleteFavorites = useMutation({
        mutationFn:removeFavorites,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["favorites"]})
        }
    })

    const logoutMutation = useMutation({
        mutationFn:logout,
        onSuccess: () => {
            navigate("/")
            queryClient.invalidateQueries({queryKey:["users", "me"]})
        }
    })

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    const handleDelete = (filmId:number) => {
        deleteFavorites.mutate(filmId)
    }

    if (isLoading) return <div>Загрузка...</div>
    if (isError) return <div>Ошибка при загрузке данных о пользовотеле</div>

    if (!data) {
        return <div>Данные о пользователе не найдены.</div>;
    }

    const {name, surname, email} = data

    const initials = `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase()

    return (
        <section className="about-account">
            <div className="container">
                <div className="about-account__wrapper">
                    <h1 className="about-account__title">Мой аккаунт</h1>
                    <div className="about-account__tabs">
                        <button className="about-account__text" type="button" onClick={() => setToggleFavorites(true)}>
                                <svg className='about-account__icon' width='20' height='18' aria-hidden="true">
									<use xlinkHref='/public/sprite.svg#icon-heart'></use>
								</svg>
                            Избранные фильмы
                        </button>
                        <button className="about-account__text" type="button" onClick={() => setToggleFavorites(false)}>
                            <svg className='about-account__icon' width='16' height='22'aria-hidden='true'>
                                <use xlinkHref='/public/sprite.svg#icon-user'></use>
                            </svg>
                            Настройка аккаунта
                        </button>
                    </div>
                    {toggleFavorites ? (
                        <div className="about-account__favorites">
                            <ul className="about-account__favorites-list">
                                                    {favouritesData?.map((film) => (
                                                        <li key={film.id} className="about-account__favorites-item">
                                                        <Link to={`/movie/${film.id}`}>
                                                            <img className="about-account__favorites-image" src={film.posterUrl} />
                                                        </Link>
                                                        <button className="about-account__favorites-delete" type="button" onClick={() => handleDelete(film.id)}>
                                                            <svg className='about-account__icon-cross' width='20' height='19'aria-hidden='true'>
                                                                <use xlinkHref='/public/sprite.svg#icon-cross-black'></use>
                                                            </svg>
                                                        </button>
                                                        </li>
                                                    ))}
                                                </ul>
                        </div>
                    ) : (<div className="about-account__info-wrapper">
                        <div className="about-account__data">
                                <span className="about-account__initials">{initials}</span>
                                    <div className="about-account__data-wrapper">
                                        <span className="about-account__data-title">Имя Фамилия</span>
                                        <span className="about-account__data-name">{name} {surname}</span>
                                    </div>   
                        </div>
                        <div className="about-account__data">
                                <span className="about-account__icon-info">
                                    <svg className='about-account__icon-email' width='22' height='19'aria-hidden='true'>
                                        <use xlinkHref='/sprite.svg#icon-email'></use>
                                    </svg>
                                </span>
                                    <div className="about-account__data-wrapper">
                                        <span className="about-account__data-title">Электронная почта</span>
                                        <span className="about-account__data-name">{email}</span>
                                    </div>  
                        </div>
                        <button className="about-account__button btn" onClick={handleLogout}>Выйти из аккаунта</button>
                    </div>)}
                    
                    
                </div>
            </div>
        </section>
    )
}

export default AboutAccount