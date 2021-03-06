import type { ComponentType, FC, ReactComponentElement } from 'react';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import NotFound from './layout/NotFound';
import MainLayout from './layout/MainLayout';
import { InterfaceService } from './services/interfaceService';
import { AuthService } from './services/authService';
import { HttpService } from './services/httpService';
import { StorageService } from './services/storageService';
import './theme/index.scss';

export type PageProperties = {
	interfaceService: InterfaceService;
	httpService: HttpService;
	authService: AuthService;
	storageService: StorageService;

	routeMeta: {
		path: string;
	};
};

export type RouteSet = { path: string; component: ComponentType<PageProperties> };

const dirs = import.meta.globEager('/src/routes/**/[a-z[]*.tsx');

/**
 * Set as a route every .tsx file with a default export, in the 'routes' dir.
 */
const routes: RouteSet[] = Object.entries(dirs).reduce<RouteSet[]>((acc, curr) => {
	const [dir, exported] = curr;

	if (typeof exported.default !== 'function') return acc;

	let path = dir;

	path = path.replaceAll(/\/src\/routes|index|\.tsx$/gm, '');
	path = path.replaceAll(/\[\.{3}.+]/gm, '*');
	path = path.replaceAll(/\[(.+)]/gm, ':$1');

	const component = exported.default;

	acc.push({ path, component });

	return acc;
}, []);

const App: FC = () => {
	const location = useLocation();

	const interfaceService = new InterfaceService();
	const httpService = new HttpService(interfaceService);
	const storageService = new StorageService(httpService);
	const authService = new AuthService(httpService);

	return (
		<Routes location={location}>
			<Route path="*" element={<NotFound />} />

			{routes.map(({ path, component: Component = Fragment }) => (
				<Route
					key={path}
					path={path}
					caseSensitive
					element={
						['/', '/register/'].includes(path) ? (
							<Component
								routeMeta={{ path }}
								interfaceService={interfaceService}
								httpService={httpService}
								authService={authService}
								storageService={storageService}
							/>
						) : (
							<MainLayout interfaceService={interfaceService} authService={authService}>
								<TransitionGroup component={null}>
									<CSSTransition key={location.key} classNames="fade" timeout={300}>
										<Component
											routeMeta={{ path }}
											interfaceService={interfaceService}
											httpService={httpService}
											authService={authService}
											storageService={storageService}
										/>
									</CSSTransition>
								</TransitionGroup>
							</MainLayout>
						)
					}
				/>
			))}
		</Routes>
	);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
