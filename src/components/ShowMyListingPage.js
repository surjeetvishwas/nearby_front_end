import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import MobileTimePicker from "@mui/lab/MobileTimePicker";
import DatePicker from "@mui/lab/DatePicker";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { makeStyles } from "@material-ui/core/styles";
import CardInput from "./CardInput";
import { Axios } from "../core/axios";
import "./HomePage.css";
import { Autocomplete } from "@mui/material";
import { Delete } from "@material-ui/icons";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginTop: "2rem",
    backgroundColor: "#9af5d5",
    gap: "1rem",
  },
  card: {
    flexBasis: "calc(33.33% - 4rem)",
    backgroundColor: "#fff",
    borderRadius: "10px",
    margin: "1rem",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  audioPlayer: {
    marginTop: "2rem",
  },
  Button:{
    marginTop: "2rem",
  },
  // text:{
  //   backgroundImage:"linear-gradient(to right, #00F260, #79d00, 0575E6, #64f38c)",
  //   WebkitBackgroundClip:"text",
  //   backgroundClip:"text",
  //   color:"transparent",
  // }
});

function ShowMyListingPage() {
  const classes = useStyles();
  const [stripeResult, setStripeResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState([]);

  useEffect(() => {
    Axios.get("/listing/getUserListings?skip=0").then((res) => {
      console.log(res.data);
      setListing(res.data.data);
      setIsLoading(false);
    });
  }, []);

  const handleDeleteListing = (listingId) => {
    // Logic to delete the listing with the given listingId
    // You can use Axios or any other method to send a delete request to the server
    Axios.delete(`/listing/deleteListing/${listingId}`)
      .then((res) => {
        // Handle successful deletion
        console.log("Listing deleted:", res.data);
        // Update the listing state to reflect the changes
        setListing((prevListing) =>
          prevListing.filter((listing) => listing._id !== listingId)
        );
      })
      .catch((error) => {
        // Handle deletion error
        console.error("Error deleting listing:", error);
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className={classes.container}>
        {listing.map((listing) => (
          <Card key={listing._id} className={classes.card}>
            <CardContent>
              <h3 className={classes.text}>{"Entertainer Name: " + listing.bandName}</h3>
              <h3>{"Venue Name: " + listing.venueName}</h3>
              <h3>
                {"Starting Time: " +
                  convertDate(listing.date) +
                  " " +
                  convertTime(listing.startingTime)}
              </h3>
              <h3>
                {"Address: " +
                  listing.address.street +
                  ", " +
                  listing.address.city +
                  ", " +
                  listing.address.state}
              </h3>
              <h3>{"Zip Code: " + listing.address.zip}</h3>
              <audio
                controls
                className={classes.audioPlayer}
                src={listing.sampleMp3}
              >
                Your browser does not support the audio element.
              </audio>
              <Button
                className={classes.Button}
                variant="contained"
                color="secondary"
                startIcon={<Delete />}
                onClick={() => handleDeleteListing(listing._id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}

function convertDate(date) {
  var date = new Date(date);
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  return month + "/" + day + "/" + year;
}

function convertTime(date) {
  var date = new Date(date);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export default ShowMyListingPage;
