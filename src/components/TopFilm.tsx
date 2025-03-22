import { useQuery } from "@tanstack/react-query"
import { validateResponse } from "../utils/validateResponse";
import { ITopMovie } from "../data/ITopMovie";
import { Link } from "react-router-dom";

const TopFilm = () => {
    const {data, isLoading, error} = useQuery<ITopMovie[]>({
        queryKey:["topFilm"],
        queryFn:async () => {
            const response = await fetch('https://cinemaguide.skillbox.cc/movie/top10');
            validateResponse(response);
            const data = await response.json()
            const sortedFilm = [...data].sort((a,b) => b.tmdbRating - a.tmdbRating)
            return sortedFilm.slice(0,10)
        }
    })

    if (isLoading) {
        return <div>Загрузка...</div>; 
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>; 
    }
    return (
        <section className="top-films">
            <div className="container">
                <h2 className="top-films__title">Топ 10 фильмов</h2>
                <div className="top-films__list-wrapper">
                    <ul className="top-films__list">
                        {data?.map((film, index) => (
                            <li key={film.id} className="top-films__item">
                            <span className="top-films__rank">{index + 1}</span>
                            <Link to={`/movie/${film.id}`}>
                                <img className="top-films__image" src={film.posterUrl} />
                            </Link>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default TopFilm