import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField, CircularProgress } from "@mui/material";
import Registration from "./Registration/Registration";
import { Axios } from "../../core/axios";

const style = {};

const ResetPassword = ({ handleClose, open }) => {
	const [openr, setOpenr] = useState(false);
	const handleOpenr = () => setOpenr(true);
	const handleCloser = () => setOpenr(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setLoading] = useState(false);

	const [token, setToken] = useState(window.location.href.split("/")[window.location.href.split("/").length - 1]);


	const handleLogin = async (e) => {
		e.preventDefault();

		if (email === "") return;

		try {
			setLoading(true);
			const { data } = await Axios.post("/users/resetPassword", { email });

			localStorage.setItem("user", JSON.stringify(data));
			window.location.href = "/";
		} catch (error) {
			alert(error.message);
			setLoading(false);
		}
	};

	return (
		<div>
			<Box style={{backgroundColor: "#fff"}} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: { xs: 300, md: 400 }, bgcolor: "background.paper", borderRadius: 3, boxShadow: 24, p: 4, outline: "none" }}>
					<Typography id="modal-modal-title" sx={{ mb: 3 }} variant="h5" component="h2">
						Reset Password
					</Typography>
					<Box>
						<form onSubmit={handleLogin}>
						<Box>
								<TextField id="outlined-password-input" label="Email" type="text" autoComplete="current-email" sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small" value={email} onChange={(e) => setEmail(e.target.value)} required />
							</Box>

							<Button variant="contained" type="submit">
								{isLoading ? "Wait..." : "Reset"}
							</Button>
						</form>
					</Box>
					{/* <p style={{ fontSize: 14 }}>
						New User
						<span style={{ color: "#2196f3", cursor: "pointer" }} onClick={()=> {
							window.location.href = "/register"
						}}>
							{" "}
							Register{" "}
						</span>
						Please
					</p> */}
					{/* <Registration handleCloser={handleCloser} openr={openr}></Registration> */}
				</Box>
			</Box>
		</div>
	);
};

export default ResetPassword;
