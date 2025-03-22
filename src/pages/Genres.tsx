import { useQuery } from "@tanstack/react-query"
import { GenresMovie, imagesGenre } from "../data/IGenresMovie"
import { validateResponse } from "../utils/validateResponse"
import { Link } from "react-router-dom";

const Genres = () => {
    const { data, isLoading, error } = useQuery<GenresMovie[]>({
        queryKey: ["genresMovie"],
        queryFn: async () => {
            const response = await fetch("https://cinemaguide.skillbox.cc/movie/genres");
            validateResponse(response);
            const data = await response.json();
            return data;
        },
    });

    const genreImages = imagesGenre //Список картинок для жанров

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Ошибка: {error.message}</div>;
    }

    return (
        <section className="genres">
            <div className="container">
                <div className="genres__content">
                    <h1 className="genres__title">Жанры фильмов</h1>
                    <ul className="genres__list">
                        {data?.map((genre) => (
                            <li key={genre} className="genres__item">
                                <Link className="genres__link" to={`/genres/${genre}`}>
                                    <img className="genres__image" src={genreImages[genre]} alt={genre} />
                                    <span className="genres__name">{genre}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default Genres

