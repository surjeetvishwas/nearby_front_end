import React, { useState, useContext, useEffect } from 'react';

const AuthContext = React.createContext();

export const useAuth = () => {
	return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		(async () => {
			setUser(JSON.parse(await localStorage.getItem('user')));
		})();
	}, []);

	const login = async (user) => {
		try {
			await localStorage.setItem('user', JSON.stringify(user));
			setUser(user);
		} catch (error) {
			setUser(null);
		}
	};

	const logout = async () => {
		try {
			await localStorage.removeItem('user');
			setUser(null);
		} catch (error) {}
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
