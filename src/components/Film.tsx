import { useState } from "react";
import { IRandomMovie } from "../data/IRandomMovie";
import { validateResponse } from "../utils/validateResponse";
import { useMutation, useQuery } from "@tanstack/react-query";
import TrailerModal from "./TrailerModal";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Header";
import { addFavorites } from "../api/addFavorites";
import { removeFavorites } from "../api/removeFavorites";
import { queryClient } from "../utils/queryClient";
import { openAuthForm } from "../store/slices";


const Film = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [trailerUrl, setTrailerUrl] = useState("")
	const [isFavorited, setIsFavorited] = useState(false)
	const [imageLoading, setImageLoading] = useState<boolean>(true)
	const {userName} = useSelector((state:RootState) => state.auth)
	const dispatch = useDispatch()

	const {data, isLoading, error, refetch} = useQuery<IRandomMovie>({
		queryKey:['randomMovie'],
		queryFn:async () => {
            const response = await fetch('https://cinemaguide.skillbox.cc/movie/random');
            validateResponse(response);
            const data = await response.json();
            return data;
        }, 
        retry: false,
	})

	const mutationAdd = useMutation({
		mutationFn: addFavorites,
		onSuccess: () => {
			setIsFavorited(true)	
			queryClient.invalidateQueries({queryKey:["favorites"]});
		},
		onError: (error) => {
			console.log("Ошибка при добовление фильма в избранное", error);
		}
	})

	const mutationRemove = useMutation({
		mutationFn: removeFavorites,
		onSuccess: () => {
			setIsFavorited(false)
			queryClient.invalidateQueries({queryKey:["favorites"]});
		},
		onError: (error) => {
			console.log("Ошибка при удаление фильма из избранного", error);
		}
	})

	const toggleFavorite = () => {
		if (!userName) {
			dispatch(openAuthForm())
		} else {
			if (userName && data) {
				if (isFavorited) {
					mutationRemove.mutate(data.id); 
				} else {
					mutationAdd.mutate(data.id); 
				}
			}
		}
	};

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

	const handleTrailerClick = () => {
		if(data?.trailerUrl) {
			setTrailerUrl(data.trailerUrl)
			setIsModalOpen(true);
		}
	}

	const handleClick = () => {
		refetch()
		setIsFavorited(false)
	}

	const handleCloseModal = () => {
        setIsModalOpen(false);
    };

	const handleImageLoader = () => {
		setImageLoading(false)
	}

	if (isLoading) {
        return <div>Загрузка...</div>; 
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>; 
    }

	if (!data) {
		return <div>Нет данных</div>
	 }

	const hours = Math.floor(data.runtime / 60);
    const minutes = data.runtime % 60;

	const ratingColor = getRatingColor(data.tmdbRating)

	return (
		<section className='about-film'>
			<div className='container'>
				<div className='about-film__wrapper'>
					<div className='about-film__left'>
						<div className='about-film__info'>
							<div className="about-film__rating" style={{background:ratingColor}}>
								<svg className='about-film__icon-star' width='16' height='16'>
									<use xlinkHref='/public/sprite.svg#icon-star'></use>
								</svg>
								<span className="about-film__count">{data.tmdbRating.toFixed(1)}</span>
							</div>
							<span className='about-film__year'>{data.releaseYear}</span>
							<span className='about-film__genre'>{data.genres.join(",")}</span>
							<span className='about-film__time'>{hours} ч {minutes} мин</span>
						</div>
						<span className='about-film__title'>
							{data.title}
						</span>
						<span className='about-film__description'>
							{data.plot}
						</span>
						<div className='about-film__buttons'>
								<button className='about-film__button-trailer btn' onClick={handleTrailerClick}>Трейлер</button>
							<div className="about-film__button-wrapper">
								<Link to={`/movie/${data.id}`}>
									<button className='about-film__button-description btn'>
										О Фильме
									</button>
								</Link>
								<button className='about-film__button-favourites btn' onClick={toggleFavorite}>
									<svg className='about-film__icon'width='20' height='20'>
										{isFavorited ?
											(<use xlinkHref='/sprite.svg#icon-heart-purple'></use>)
											:
											(<use xlinkHref='/sprite.svg#icon-heart'></use>)
										}
									</svg>
								</button>
								<button className='about-film__button-update btn' onClick={handleClick}>
									<svg className='about-film__icon' width='20' height='20'>
										<use xlinkHref='/public/sprite.svg#icon-arrows'></use>
									</svg>
								</button>
							</div>
						</div>
					</div>
                    <div className='about-film__right'>
						{imageLoading && <span className="about-film__loader">Загрузка изображения...</span>}
                        <img className="about-film__img" src={data.posterUrl} alt={data.title} onLoad={handleImageLoader}></img>
                    </div>
				</div>
				{isModalOpen && (
                <TrailerModal title={data.title} trailerUrl={trailerUrl} onClose={handleCloseModal} />
            )}
			</div>
		</section>
	);
};

export default Film;
