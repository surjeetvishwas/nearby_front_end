import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
import { IconButton, InputAdornment, MenuItem, TextField, useMediaQuery } from "@mui/material";
import { Axios } from "../../../core/axios";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useTheme } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";


// const style = {};


const Registration = ({ handleCloser, openr }) => {
	const theme = useTheme();
  	const matchesMd = useMediaQuery(theme.breakpoints.up('md'));

	const [fullName, setFullName] = useState("");
	const [venueName, setVenueName] = useState("");

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [bandOrBarName, setBandOrBarName] = useState("");

	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zip, setZip] = useState("");

	const [phoneNo, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setLoading] = useState(false);

	const [venuePhone, setVenuePhone] = useState("");

	const [websiteOrSocialMedia, setWebsiteOrSocialMedia] = useState("");

	const [selectedValue, setSelectedValue] = React.useState('venue');

	const handleChange = (event) => {
		setSelectedValue(event.target.value);
	};

	const handleRegister = async (e) => {
		e.preventDefault();

		if (fullName === "" || phoneNo === "" || email === "" || password === "" || confirmPassword === "") return;

		// Check if the password is at least 8 characters long
		if (password.length >= 8) {
			// Check if the password and confirm password are the same
			if (password === confirmPassword) {
			} else {
				alert("Password and confirm password do not match");
				return;
			}
		}
		else{
			alert("Password must be at least 8 characters long");
			return;
		}

		try {
			setLoading(true);
			var json_body = {}
			

			if(selectedValue === "Venue") {
				json_body = {
					"name": fullName,
					"phone": phoneNo,
					"userType": selectedValue,
					"venueName": venueName,
					websiteOrSocialMedia,
					"address": {
						"street": street,
						"city": city,
						"state": state,
						"zip": zip,
					},
					email,
					password
				}	
			}
			else{
				json_body = {
						"name": fullName,
						"phone": phoneNo,
						"userType": selectedValue,
						websiteOrSocialMedia,
						email,
						password,
						"bandOrBarName": bandOrBarName
				}
			}

			const { data } = await Axios.post("/users/register", json_body);
			localStorage.setItem("user", JSON.stringify(data));
			window.location.href = "/home";
		} catch (error) {
			alert(error.message);
			setLoading(false);
		}
	};

	return (
		<div>
			<Box style={{
				backgroundColor: "#fff",
				display: 'flex',
				flexDirection: 'column',
				alignContent: 'center',
				justifyContent: 'center',
				height: '100vh'

			}}
				aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box sx={{ 
					width: { xs: 300, md: 400 }, bgcolor: "background.paper", borderRadius: 3, boxShadow: 24, p: 4, outline: "none", overflow: 'auto',
					alignSelf: 'center',
					 }}>
					<Typography id="modal-modal-title" sx={{ mb: 3 }} variant="h5" component="h2">
						Registration
					</Typography>
					<Box>
						<form onSubmit={handleRegister}>
							<Box>
								<TextField
								id="outlined-password-input"
								label="Full Name"
								type="text"
								autoComplete="current-email"
								sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								required
								/>
							</Box>
							<Box>
								<TextField id="outlined-password-input" label="Phone Number" type="text" sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small" value={phoneNo} onChange={(e) => setPhone(e.target.value)} />
							</Box>
							<Box>
								<TextField id="outlined-password-input" label="Website Or Social Media Link" type="text" sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small" value={websiteOrSocialMedia} onChange={(e) => setWebsiteOrSocialMedia(e.target.value)} required />
							</Box>
							<Box>
								<TextField id="outlined-password-input" label="Email" type="text" autoComplete="current-email" sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small" value={email} onChange={(e) => setEmail(e.target.value)} required />
							</Box>
							<Box>
								<TextField
								id="outlined-password-input"
								label="Password"
								type={!showPassword?"password":"text"}
								autoComplete="current-email"
								sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small"
								value={password}
								helperText="Password must be 8 characters or more"
								onChange={(e) => setPassword(e.target.value)} required
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={()=>{
													setShowPassword(!showPassword)
												}}
												// onMouseDown={handleMouseDownPassword}
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									),
								}}
								/>
							</Box>
					 		{/* Password enter twice to confirm and add show password icon on right */}
							<Box>
								<TextField id="outlined-password-input" label="Confirm Password" type={!showConfirmPassword?"password":"text"} autoComplete="current-email" sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={()=>{
													setShowConfirmPassword(!showConfirmPassword)
												}}
												// onMouseDown={handleMouseDownPassword}
											>
												{showConfirmPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									),
								}}
								/>
							</Box>

							<Box>
								<RadioGroup
									row
									aria-labelledby="demo-radio-buttons-group-label"
									defaultValue="Venue"
									name="radio-buttons-group"
									value={selectedValue}
    								onChange={handleChange}
								>
									<FormControlLabel value="Venue" control={<Radio />} label="Venue" />
									<FormControlLabel value="Entertainer" control={<Radio />} label="Entertainer" />
									{/* <FormControlLabel value="Bands" control={<Radio />} label="Bands" /> */}
								</RadioGroup>
							</Box>

							{selectedValue === "Venue" ? (<Box mt={2}>
								
								<TextField id="outlined-password-input" label="Venue Name" type="text" sx={{ width: { xs: 250, md: 185 }, p: 0, mb: 3 }} size="small" value={venueName} onChange={(e) => setVenueName(e.target.value)} required />
								<TextField id="outlined-password-input" label="Street" type="text" sx={{ width: { xs: 250, md: 185 }, p: 0, mb: 3, ml: matchesMd?1:0 }} size="small" value={street} onChange={(e) => setStreet(e.target.value)} required />
								<TextField id="outlined-password-input" label="City" type="text" sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small" value={city} onChange={(e) => setCity(e.target.value)} required />
								<TextField id="outlined-password-input" label="State" type="text" sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small" value={state} onChange={(e) => setState(e.target.value)} required select >
								<MenuItem value={"AL"}>Alabama</MenuItem>
									<MenuItem value={"AK"}>Alaska</MenuItem>
									<MenuItem value={"AZ"}>Arizona</MenuItem>
									<MenuItem value={"AR"}>Arkansas</MenuItem>
									<MenuItem value={"CA"}>California</MenuItem>
									<MenuItem value={"CO"}>Colorado</MenuItem>
									<MenuItem value={"CT"}>Connecticut</MenuItem>
									<MenuItem value={"DE"}>Delaware</MenuItem>
									<MenuItem value={"DC"}>District Of Columbia</MenuItem>
									<MenuItem value={"FL"}>Florida</MenuItem>
									<MenuItem value={"GA"}>Georgia</MenuItem>
									<MenuItem value={"HI"}>Hawaii</MenuItem>
									<MenuItem value={"ID"}>Idaho</MenuItem>
									<MenuItem value={"IL"}>Illinois</MenuItem>
									<MenuItem value={"IN"}>Indiana</MenuItem>
									<MenuItem value={"IA"}>Iowa</MenuItem>
									<MenuItem value={"KS"}>Kansas</MenuItem>
									<MenuItem value={"KY"}>Kentucky</MenuItem>
									<MenuItem value={"LA"}>Louisiana</MenuItem>
									<MenuItem value={"ME"}>Maine</MenuItem>
									<MenuItem value={"MD"}>Maryland</MenuItem>
									<MenuItem value={"MA"}>Massachusetts</MenuItem>
									<MenuItem value={"MI"}>Michigan</MenuItem>
									<MenuItem value={"MN"}>Minnesota</MenuItem>
									<MenuItem value={"MS"}>Mississippi</MenuItem>
									<MenuItem value={"MO"}>Missouri</MenuItem>
									<MenuItem value={"MT"}>Montana</MenuItem>
									<MenuItem value={"NE"}>Nebraska</MenuItem>
									<MenuItem value={"NV"}>Nevada</MenuItem>
									<MenuItem value={"NH"}>New Hampshire</MenuItem>
									<MenuItem value={"NJ"}>New Jersey</MenuItem>
									<MenuItem value={"NM"}>New Mexico</MenuItem>
									<MenuItem value={"NY"}>New York</MenuItem>
									<MenuItem value={"NC"}>North Carolina</MenuItem>
									<MenuItem value={"ND"}>North Dakota</MenuItem>
									<MenuItem value={"OH"}>Ohio</MenuItem>
									<MenuItem value={"OK"}>Oklahoma</MenuItem>
									<MenuItem value={"OR"}>Oregon</MenuItem>
									<MenuItem value={"PA"}>Pennsylvania</MenuItem>
									<MenuItem value={"RI"}>Rhode Island</MenuItem>
									<MenuItem value={"SC"}>South Carolina</MenuItem>
									<MenuItem value={"SD"}>South Dakota</MenuItem>
									<MenuItem value={"TN"}>Tennessee</MenuItem>
									<MenuItem value={"TX"}>Texas</MenuItem>
									<MenuItem value={"UT"}>Utah</MenuItem>
									<MenuItem value={"VT"}>Vermont</MenuItem>
									<MenuItem value={"VA"}>Virginia</MenuItem>
									<MenuItem value={"WA"}>Washington</MenuItem>
									<MenuItem value={"WV"}>West Virginia</MenuItem>
									<MenuItem value={"WI"}>Wisconsin</MenuItem>
									<MenuItem value={"WY"}>Wyoming</MenuItem>
								</TextField>
								<TextField id="outlined-password-input" label="Zip Code" type="text" sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small" value={zip} onChange={(e) => setZip(e.target.value)} required />
								<TextField id="outlined-password-input" label="Venue Phone Number" type="text" sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3 }} size="small" value={venuePhone} onChange={(e) => setVenuePhone(e.target.value)} required />

							</Box>) :
							null
							}
							{
								(selectedValue === "Entertainer") && (<Box mt={1}>
									<TextField id="outlined-password-input" label= {"Entertainer Name"} type="text" sx={{ width: { xs: 250, md: 375 }, p: 0, mb: 3, mt: 1 }} size="small" value={bandOrBarName} onChange={(e) => setBandOrBarName(e.target.value)} required />
									</Box>
								)
							}

							<Button variant="contained" type="submit">
								{isLoading ? "wait..." : "Signup"}
							</Button>
						</form>
					</Box>
				</Box>
			</Box>
		</div>
	);
};

export default Registration;
