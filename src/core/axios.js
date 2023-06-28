import axios from "axios";

const instance = axios.create({
	baseURL: "https://api.nearbyentertainment.com/api",
	// baseURL: "http://localhost:3001/api",
});

const user = localStorage.getItem("user");

if (user) {
	let token = JSON.parse(user).jwt;

	instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response) {
			const message = error.response.data ? error.response.data.error.issue : error.message;

			if (error.response.status === 401) {
				localStorage.removeItem("user");
				window.location.href = "/?action=login";

				return Promise.reject(new Error("You are not authorize."));
			}

			return Promise.reject(new Error(message));
		}

		return Promise.reject(error);
	}
);

export const Axios = instance;
