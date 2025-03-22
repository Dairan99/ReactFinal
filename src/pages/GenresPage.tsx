import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IGenreMovie } from '../data/IGenreMovie';
import { validateResponse } from '../utils/validateResponse';
import InfiniteScroll from 'react-infinite-scroll-component';

const GenrePage = () => {
	const { genre } = useParams();
	const [page, setPage] = useState(1);
	const [allMovies, setAllMovies] = useState<IGenreMovie[]>([]);

	const { data, isLoading, error } = useQuery<IGenreMovie[]>({
		queryKey: ['genreMovies', page, genre],
		queryFn: async () => {
			const response = await fetch(
				`https://cinemaguide.skillbox.cc/movie?genre=${genre}&count=15&page=${page}`
			);
			validateResponse(response);
			const data = await response.json();
			return data;
		},
	});

	useEffect(() => {
		if (data) {
			setAllMovies((prevMovie) => [...prevMovie, ...data]);
		}
	}, [data]);

	const hasMore = data ? data.length === 15 : false;

	const loadMore = () => {
		if (hasMore) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	if (isLoading && page === 1) return <div>Загрузка...</div>;
	if (error) return <div>Ошибка {error.message}</div>;

	return (
		<section className='genre-page'>
			<div className='container'>
				<div className='genre-page__content'>
					<h1 className='genre-page__title'>{genre}</h1>
					<InfiniteScroll
						dataLength={allMovies.length}
						next={loadMore}
						hasMore={hasMore}
						loader={<div>Загрузка...</div>}
					>
						<ul className='genre-page__list'>
							{allMovies?.map((movie) => (
								<li className='genre-page__item' key={movie.id}>
									<Link to={`/movie/${movie.id}`}>
										<img
											className='genre-page__image'
											src={movie.posterUrl}
											alt={movie.title}
										></img>
									</Link>
								</li>
							))}
						</ul>
					</InfiniteScroll>
				</div>
			</div>
		</section>
	);
};

export default GenrePage;
