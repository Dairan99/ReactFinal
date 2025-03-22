import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { validateResponse } from "../utils/validateResponse";
import { useEffect, useState } from "react";
import TrailerModal from "../components/TrailerModal";
import { useSelector } from "react-redux";
import { RootState } from "../components/Header";
import { addFavorites } from "../api/addFavorites";
import { removeFavorites } from "../api/removeFavorites";
import { IFavoritesData, receivingFavorites } from "../api/receivingFavorites";
import { queryClient } from "../utils/queryClient";

interface IAboutFilm {
    id:number,
    language:string,
    budget:number,
    revenue:number,
    director:string,
    production:string,
    awardsSummary:string | number,
    title:string,
    releaseYear:number,
    genres:string[],
    plot:string,
    posterUrl:string,
    tmdbRating:number,
    runtime:number
    trailerUrl:string
}

const AboutFilmPage = () => {
    const {movieId} = useParams()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [trailerUrl, setTrailerUrl] = useState("")
    const [isFavorited, setIsFavorited] = useState(false)
    const {userName} = useSelector((state:RootState) => state.auth)

    const {data, isLoading, error} = useQuery<IAboutFilm>({
        queryKey:["aboutFilm", movieId],
        queryFn: async () => {
            const response = await fetch(`https://cinemaguide.skillbox.cc/movie/${movieId}`)
            validateResponse(response)
            const data = await response.json()
            return data
        },
        retry:false,
        enabled: !!movieId
    })

    const {data:favoritesData} = useQuery<IFavoritesData[]>({
        queryFn:receivingFavorites,
        queryKey:["favorites"],
        enabled:!!userName
    })

    useEffect(() => {
        if (favoritesData && data) {
            // Проверка, фильма в избранном
            const isInFavorites = favoritesData.some(film => film.id === data.id);
            setIsFavorited(isInFavorites);
        }
    }, [favoritesData, data]);

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
		if (userName && data) {
			if (isFavorited) {
				mutationRemove.mutate(data.id); 
			} else {
				mutationAdd.mutate(data.id); 
			}
		}
	};


    const handleTrailerClick = () => {
		if(data?.trailerUrl) {
			setTrailerUrl(data.trailerUrl)
			setIsModalOpen(true);
		}
	}

    const handleCloseModal = () => {
        setIsModalOpen(false);
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

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error?.message}</div>;
    }

    if (!data) {
        return <div>Нет данных</div>;
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
							<div className='about-film__rating' style={{background:ratingColor}}>
								<svg className='about-film__icon-star' width='16' height='16'>
									<use xlinkHref='/public/sprite.svg#icon-star'></use>
								</svg>
								<span className='about-film__count'>{data?.tmdbRating.toFixed(1)}</span>
							</div>
							<span className='about-film__year'>{data?.releaseYear}</span>
							<span className='about-film__genre'>{data?.genres?.join(',')}</span>
							<span className='about-film__time'>{hours} ч {minutes} мин</span>
						</div>
						<span className='about-film__title'>{data?.title}</span>
						<span className='about-film__description'>{data?.plot}</span>
						<div className='about-film__buttons'>
							<button className='about-film__button-trailer btn'onClick={handleTrailerClick}>Трейлер</button>
							<button className='about-film__button-favourites btn' onClick={toggleFavorite}>
								<svg className='about-film__icon' width='20' height='20'>
                                {isFavorited ?
										(<use xlinkHref='/public/sprite.svg#icon-heart-purple'></use>) 
										:
										(<use xlinkHref='/public/sprite.svg#icon-heart'></use>)
									}
								</svg>
							</button>
						</div>
					</div>
					<div className='about-film__right'>
						<img
							className='about-film__img'src={data?.posterUrl}alt={data?.title}></img>
					</div>
				</div>
                <div className="about-film__bottom">
                    <div className="about-film__bottom-wrapper">
                        <h2 className="about-film__bottom-title">О фильме</h2>
                        <ul className="about-film__bottom-list">
                            <li className="about-film__bottom-item">
                                <span className="about-film__bottom-name">Язык оригинала</span>
                                <span className="about-film__bottom-info">{data.language}</span>
                            </li>
                            <li className="about-film__bottom-item">
                                <span className="about-film__bottom-name">Бюджет</span>
                                <span className="about-film__bottom-info">{data.budget}</span>
                            </li>
                            <li className="about-film__bottom-item">
                                <span className="about-film__bottom-name">Выручка</span>
                                <span className="about-film__bottom-info">{data.revenue}</span>
                            </li>
                            <li className="about-film__bottom-item">
                                <span className="about-film__bottom-name">Режиссёр</span>
                                <span className="about-film__bottom-info">{data.director}</span>
                            </li>
                            <li className="about-film__bottom-item">
                                <span className="about-film__bottom-name">Продакшен</span>
                                <span className="about-film__bottom-info">{data.production}</span>
                            </li>
                            <li className="about-film__bottom-item">
                                <span className="about-film__bottom-name">Награды</span>
                                <span className="about-film__bottom-info">{data.awardsSummary}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                {isModalOpen && (
                <TrailerModal title={data.title} trailerUrl={trailerUrl} onClose={handleCloseModal} />
            )}
			</div>
		</section>
	);
};

export default AboutFilmPage;
