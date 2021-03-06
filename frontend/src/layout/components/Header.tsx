import type { FC } from 'react';
import { MenuAlt2Icon, SearchIcon } from '@heroicons/react/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { classNames } from '../../tools/classNames';
import type { AuthService } from '../../services/authService';

type Props = {
	setSidebarOpen: (open: boolean) => void;
	authService: AuthService;
};

const Header: FC<Props> = (props) => {
	const { setSidebarOpen, authService } = props;

	const userNavigation = [{ name: 'Sair', action: () => authService.logout() }];

	return (
		<div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow">
			<button
				type="button"
				className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
				onClick={() => setSidebarOpen(true)}
			>
				<span className="sr-only">Abrir menu lateral</span>
				<MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
			</button>
			<div className="flex-1 px-4 flex justify-between">
				<div className="flex-1 flex" />
				<div className="ml-4 flex items-center md:ml-6">
					<Menu as="div" className="ml-3 relative">
						<div>
							<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
								<span className="sr-only">Abrir menu de usuários</span>
								<img
									className="h-8 w-8 rounded-full"
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
									alt=""
								/>
							</Menu.Button>
						</div>
						<Transition
							as={Fragment}
							enter="transition ease-out duration-100"
							enterFrom="transform opacity-0 scale-95"
							enterTo="transform opacity-100 scale-100"
							leave="transition ease-in duration-75"
							leaveFrom="transform opacity-100 scale-100"
							leaveTo="transform opacity-0 scale-95"
						>
							<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
								{userNavigation.map((item) => (
									<Menu.Item key={item.name}>
										{({ active }) => (
											<span
												role="button"
												onClick={item.action}
												className={classNames(
													active ? 'bg-gray-100' : '',
													'block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100'
												)}
											>
												{item.name}
											</span>
										)}
									</Menu.Item>
								))}
							</Menu.Items>
						</Transition>
					</Menu>
				</div>
			</div>
		</div>
	);
};

export default Header;
