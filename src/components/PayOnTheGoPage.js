import React, {useEffect, useState} from 'react';
import axios from 'axios';
// MUI Components
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileTimePicker from '@mui/lab/MobileTimePicker';
import DatePicker from '@mui/lab/DatePicker';
import UploadFileIcon from "@mui/icons-material/UploadFile";

// stripe
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
// Util imports
import {makeStyles} from '@material-ui/core/styles';
// Custom Components
import CardInput from './CardInput';
import { Axios } from '../core/axios';
import './HomePage.css';
import { Autocomplete, createFilterOptions } from '@mui/material';
import { MenuItem } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    margin: '35vh auto',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'flex-start',
  },
  div: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'flex-start',
    justifyContent: 'space-between',
  },
  button: {
    margin: '2em auto 1em',
  },
});

function PayOnTheGoPage({setIsPayOnTheGo}) {
  const classes = useStyles();
  // State
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({});

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [stripeResult, setStripeResult] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const stripe = useStripe();
  const elements = useElements();

  const [value, setValue] = React.useState(new Date());
  const [startTime, setStartTime] = React.useState(new Date());
  const [country, setCountry] = React.useState('');
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [zip, setZip] = React.useState('');
  // const [bandName, setBandName] = React.useState('');
  const [venueName, setVenueName] = React.useState('');
  const [entertainerName, setEntertainerName] = React.useState('');
  const [date, setDate] = React.useState(new Date());
  const [sampleMp3, setSampleMp3] = React.useState('');

  const [venueNameInput, setVenueNameInput] = React.useState('');

  const [venueList, setVenueList] = React.useState([]);

  const [audioFile, setAudioFile] = React.useState(null);
  const [textUploader, setTextUploader] = React.useState('Upload Sample MP3');

  useEffect(() => {
     const user = JSON.parse(localStorage.getItem("user"));
     console.log(user)
     setEmail(user.email);
     setUser(user);

     if(user.address){
        // setCountry(user.address.country);
        setState(user.address.state);
        setCity(user.address.city);
        setStreet(user.address.street);
        setZip(user.address.zip);
      
     }

     if(user.userType==='Entertainer'){
      setEntertainerName(user.bandOrBarName);
     }

      // if(user.userType==='Bars'){
      //   setVenueName(user.bandOrBarName);
      // }

      if(user.userType==='Venue'){
        setVenueName(user.venueName);
      }

      // alert(JSON.stringify(user));
  }, []);




  const handleSubmitPay = async (event) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const res = await Axios.post('/stripe/pay', {email: email, listing: {
      "bandName": entertainerName,
      "venueName": venueNameInput,
      "date": date,
      "startingTime": startTime,
      "sampleMp3": sampleMp3,
      "address": {
          "street": street,
          "city": city,
          "state": state,
          "zip": zip,
      }
  }});

    const clientSecret = res.data['client_secret'];

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: email,
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        console.log('Money is in the bank!');
        // alert('Money is in the bank!');
        window.location.href = '/listings';
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  useEffect(async() => {
    console.log(stripeResult)
    var {data} = await Axios.get(`/users/profile`);
    console.log(data);
    if(data){
      console.log(data.data.subscriptionActive)
      setIsSubscribed(data.data.subscriptionActive);
      setIsLoading(false);
    }
  }, []);

  useEffect(async() => {
    console.log(stripeResult)
    var {data} = await Axios.get(`/listing/search/${venueNameInput}`);
    console.log(data);
    if(data){
      setVenueList(data.data);
    }
  }, [venueNameInput]);


  useEffect(() => {
    if(!audioFile){
      return;
    }
    const formData = new FormData();
    formData.append('audiofile', audioFile, audioFile.name);
      // formData.append('text', text);
      // formData.append('user_token', tok);
      // formData.append('question_id', qid);

      console.log(audioFile.name);
      Axios.post('/alexa/uploadAudio', formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
      }})
        .then((resp) => {
          console.log(resp);
          console.log(resp.data.data.Location);
          setTextUploader(audioFile.name+' Uploaded');
          setSampleMp3(resp.data.data.Location);
        })
        .catch((e) => {
          // setHue('error');
          // setAlertText(`Error from server! Check console`);
          console.log(e);
        });
  }, [audioFile]);



 return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      marginTop: '2rem',
    }}>
      <Card style={{
        alignSelf: 'center',
      }}
      className="card_style"
      >
        <CardContent className={classes.content} style={{
            gap: '1em',
          }}>
          <h2>On The Go Listing Form</h2>
          <div className={classes.div} style={{
            gap: '1em',
          }}>
            <TextField
              id="outlined-basic"
              label="Entertainer Name"
              value={entertainerName}
              onChange={(e) => setEntertainerName(e.target.value)}
              variant="outlined"
              contentEditable={user.name?"false":"true"}
              style={{width: '50%'}}
            />
            { user.userType==='Entertainer' ?(
              <Autocomplete
              id="combo-box-demo"
              freeSolo={true}
              filterOptions={createFilterOptions({ ignoreCase: true})}
              options={venueList}
              getOptionLabel={(option) => option.venueName}
              style={{ width: '50%' }}
              onInputChange={(event, newInputValue) => {
                // setVenueName(newInputValue);
                // console.log(newInputValue)
                setVenueNameInput(newInputValue);
              }}
              onChange={(event, newValue) => {
                // console.log(newValue)
                setVenueName(newValue.venueName);
              }}
              renderInput={(params) => <TextField {...params} value={venueName} label="Venue Name" variant="outlined" />}
            />
            ) : (
            <TextField
              id="outlined-basic"
              label="Venue Name"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              variant="outlined"
              style={{width: '50%'}}
            />
            )}
            </div>
            <div className={classes.div} style={{
            gap: '1em',
          }}>
             <div
              style={{width: '50%'}}
             >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
              renderInput={(params) => <TextField style={{width: '100%'}} variant='outlined' {...params} />}
            />
            </LocalizationProvider>
            </div>
            <div
              style={{width: '50%'}}
            >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <MobileTimePicker
                
                label="Starting Time"
                value={startTime}
                onChange={(newValue) => {
                  setStartTime(newValue);
                }}
                renderInput={(params) => <TextField style={{width: "100%"}} variant="outlined" {...params} />}
              />
          </LocalizationProvider>
          </div>
            </div>
            <div className={classes.div} style={{
            gap: '1em',
          }}>
            {/* <TextField
              id="outlined-basic"
              label="Sample MP3 Url"
              value={sampleMp3}
              onChange={(e) => {
                setSampleMp3(e.target.value);
              }
              }
              variant="outlined"
              style={{width: '100%'}}
            /> */}
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{ marginRight: "1rem" }}
              style={{width: '100%', height: '50px'}}
            >
              {/* Upload Sample MP3 */}
              {textUploader}
              <input 
              accept="audio/*"
              onChange={(e) => {
                setTextUploader(e.target.files[0].name+" Uploading...");
                setAudioFile(e.target.files[0]);
              }
              }
              type="file"
              hidden />
            </Button>
           {/* <TextField
              id="outlined-basic"
              label="Address"
              variant="outlined"
              style={{width: '50%'}}
            /> */}
            </div>
            {/* Collect address */}
            <div className={classes.div} style={{
            gap: '1em',
          }}>
            <TextField
              id="outlined-basic"
              label="Street"
              value={street}
              onChange={(e) => {
                setStreet(e.target.value);
              }
              }
              variant="outlined"
              style={{width: '50%'}}
            />
            <TextField
              id="outlined-basic"
              label="City"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
              }}
              variant="outlined"
              style={{width: '50%'}}
            />
            </div>
            <div className={classes.div} style={{
            gap: '1em',
          }}>
            <TextField

              id="outlined-basic"
              label="State"
              value={state}
              onChange={(e) => {
                setState(e.target.value);
              }}
              variant="outlined"
              style={{width: '50%'}}
              select
            >
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
            <TextField
              id="outlined-basic"
              label="Zip"
              value={zip}
              onChange={(e) => {
                setZip(e.target.value);
              }}
              variant="outlined"
              style={{width: '50%'}}
            />
            </div>
            {/* <div className={classes.div} style={{
            gap: '1em',
          }}>
            <Autocomplete
              id="combo-box-demo"
              options={[
                { label: 'US', value: 'United State' },
                { label: 'Canada', value: 'Canada' },
                { label: 'Mexico', value: 'Mexico' },
                { label: 'United Kingdom', value: 'United Kingdom' },
                { label: 'France', value: 'France' },
                { label: 'Germany', value: 'Germany' },
                { label: 'Italy', value: 'Italy' },
                { label: 'Spain', value: 'Spain' },
                { label: 'Switzerland', value: 'Switzerland' },
              ]}
              style={{width: '100%'}}
              onChange={(event, newValue) => {
                setCountry(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Country" variant="outlined" />}
            />
            </div> */}
            <TextField
          label='Email'
          id='outlined-email-input'
          helperText={`Email you'll recive updates and receipts on`}
          margin='normal'
          variant='outlined'
          type='email'
          disabled={true}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <CardInput />
            {/* Pay with Stripe Button */}
            <div className={classes.div} style={{
            gap: '1em',
          }}>
            <Button

              variant="contained"
              color="primary"
              onClick={() => {
                handleSubmitPay();
              }
              }
              style={{width: '100%', marginTop: '1em',height: '50px'}}
            >
              Pay And List ($0.99)
            </Button>
            </div>
            {/* Go Back Button */}
            <div className={classes.div} style={{
            gap: '1em',
          }}>
            <Button

              variant="text"
              color="primary"
              onClick={() => {
                // handleGoBack();
                setIsPayOnTheGo(false);
              }
              }
              style={{width: '100%', marginTop: '0.5em',height: '50px'}}
            >
              Go Back
            </Button>
            </div>
        </CardContent>
      </Card>
    </div>
    );
}

export default PayOnTheGoPage;