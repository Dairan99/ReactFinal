import { QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import { queryClient } from './utils/queryClient';
import Footer from './components/Footer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Genres from './pages/Genres';
import GenrePage from './pages/GenresPage';
import AboutFilmPage from './pages/AboutFilmPage';
import { Provider } from 'react-redux';
import store from './store';
import AboutAccount from './pages/AboutAccount';

function App() {
	return (
		<>
			<BrowserRouter future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}>
				<Provider store={store}>
					<QueryClientProvider client={queryClient}>
					<Header />
					<main>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/genres' element={<Genres />} />
							<Route path='/about-account' element={<AboutAccount />} />
							<Route path='/genres/:genre' element={<GenrePage />} />
							<Route path='/movie/:movieId' element={<AboutFilmPage />} />
						</Routes>
					</main>
					<Footer />
					</QueryClientProvider>
				</Provider>
			</BrowserRouter>
		</>
	);
}

export default App;
