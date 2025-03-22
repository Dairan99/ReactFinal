import { useQuery } from "@tanstack/react-query"
import { IRandomMovie } from "../data/IRandomMovie"
import { validateResponse } from "../utils/validateResponse"
import { useEffect, useRef, useState } from "react"
import AuthForm from "./AuthForm"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { openAuthForm } from "../store/slices"

export interface RootState {
	auth: {
	  userName: string | null;
	  openAuthForm: boolean;
	};
  }

const Header = () => {
	const [searchMovie, setSearchMovie] = useState("")
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [activePage, setActivePage] = useState("home")
	const dispatch = useDispatch();
	const dropdownRef = useRef<HTMLUListElement>(null)
  	const userName = useSelector((state: RootState) => state.auth?.userName);
	const isAuthFormOpen = useSelector((state: RootState) => state.auth?.openAuthForm);
	

	const {data, isLoading, error} = useQuery<IRandomMovie[]>({
		queryKey:['searchMovie', searchMovie],
		queryFn:async () => { 
			if (!searchMovie) return []
			const response = await fetch(`https://cinemaguide.skillbox.cc/movie?title=${encodeURIComponent(searchMovie)}`)
			validateResponse(response);
			const data = await response.json()
			return data
		},
		enabled: !!searchMovie,
	})

	const getRatingColor = (rating:number) => {
		if (rating < 5.0) {
			return 'red'; 
		} else if (rating < 7.5) {
			return 'grey'; 
		} else if (rating < 8.5) {
			return 'var(--color-forest-green)'; 
		} else {
			return 'var(--color-lucky)'; 
		}
	}

	const handlePageChange = (page:string) => {
		setActivePage(page)
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchMovie(event.target.value)
		setIsDropdownOpen(event.target.value.length > 0)
	}

	const handleClickOutside = (event:MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsDropdownOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleInputReset = () => {
		setSearchMovie("")
		setIsDropdownOpen(false)
	}

	const handleButtonAuthForm = () => {
		dispatch(openAuthForm()); // Открытие формы аутентификации
		setActivePage("home")
	  };

	  console.log("Имя пользователя:", userName)

    return (
        <div className='header'>
			<div className='container'>
				<div className="header__content">
					<div className='header__wrapper'>
						<svg className='header__icon' width='24' height='32'aria-hidden='true'>
							<use xlinkHref='/public/sprite.svg#icon-logo'></use>
						</svg>
						<svg className='header__icon-small' width='18' height='18'aria-hidden='true'>
							<use xlinkHref='/public/sprite.svg#icon-logo-small'></use>
						</svg>
						 <Link className="header__logo-name" to={"/"}>маруся</Link>
					</div>
						<nav className="main-nav">
						   <Link className={`main-nav__main${activePage === "home" ? '-active' : ''}`} to={"/"} onClick={() => handlePageChange("home")}>Главная</Link>
						   <Link className={`main-nav__genre${activePage === "genres" ? '-active' : ''}`} to={"/genres"} onClick={() => handlePageChange("genres")}>Жанры</Link>
						   <div className="main-nav__wrapper-mobile">
						   	<svg className="main-nav__icon-genre" width="20" height="20" aria-hidden="true">
								<use xlinkHref="/public/sprite.svg#icon-genre"></use>
							</svg>
							<svg className="main-nav__icon-search-mobile" width="21" height="21" aria-hidden="true">
								<use xlinkHref="/public/sprite.svg#icon-search-mobile"></use>
							</svg>
							<svg className="main-nav__icon-account" width="16" height="21" aria-hidden="true">
								<use xlinkHref="/public/sprite.svg#icon-account"></use>
							</svg>
						   </div>
							<div className="main-nav__wrapper">
								<input className="main-nav__search" placeholder="Поиск" value={searchMovie} onChange={handleInputChange}></input>
								{searchMovie && (<svg className="main-nav__icon-cross" width="14" height="14" aria-hidden="true" onClick={handleInputReset}>
									<use xlinkHref="/public/sprite.svg#icon-cross"></use>
								</svg>)}
								<svg className="main-nav__icon" width="24" height="24" aria-hidden="true">
									<use xlinkHref="/public/sprite.svg#icon-search"></use>
								</svg>
							</div>
						</nav>
							{userName ? 
							(<Link className={`header__account${activePage === "account" ? '-active' : ''}`} to={`/about-account`} onClick={() => handlePageChange("account")}>{userName}</Link>)
							 :
							(<button className="header__enter" type="button" onClick={handleButtonAuthForm}>Войти</button>)}
				</div>
			
			{isLoading && <p>Загрузка...</p>}
			{error && <p>Ошибка: {error.message}</p>}
			

			{isDropdownOpen && (
				<ul className="header__search-list" ref={dropdownRef}>
					{data && data.length > 0 && data.slice(0,5).map((movie) => {
						const hours = Math.floor(movie.runtime / 60);
						const minutes = Math.floor(movie.runtime % 60);
						const ratingColor = getRatingColor(movie.tmdbRating)
						return (
							<Link className="header__search-link" key={movie.id} to={`/movie/${movie.id}`}>
							<li className="header__search-item" key={movie.title} onClick={handleInputReset}>
							<img className="header__search-img" src={movie.posterUrl} alt={movie.title} />
							<div className="header__search-wrapper">
								<div className="header__search-info">
									<div className="header__search-rating" style={{background:ratingColor}}>
										<svg className='header__icon-star' width='10' height='10'>
											<use xlinkHref='/public/sprite.svg#icon-star-small'></use>
										</svg>
										<span className="header__search-count">{movie.tmdbRating.toFixed(1)}</span>
									</div>
									<span className="header__search-year">{movie.releaseYear}</span>
									<span className="header__search-genres">{movie.genres.join(",")}</span>
									<span className="header__search-time">{hours} ч {minutes} мин</span>
								</div>
							<h3 className="header__search-title">{movie.title}</h3>
							</div>
						</li>
						</Link>
						)
					})}
				</ul>
			)}
			{isAuthFormOpen  && 
			(<AuthForm />)}
			</div>
		</div>
    )
}

export default Header