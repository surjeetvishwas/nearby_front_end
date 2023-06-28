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
import ReactLoading from 'react-loading';

// stripe
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
// Util imports
import {makeStyles} from '@material-ui/core/styles';
// Custom Components
import CardInput from './CardInput';
import { Axios } from '../core/axios';
import './HomePage.css';
import { Autocomplete } from '@mui/material';
import PayOnTheGoPage from './PayOnTheGoPage';
import SubscribedPage from './SubscribedPage';

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

function HomePage() {
  const classes = useStyles();
  // State
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({});

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [stripeResult, setStripeResult] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isPayOnTheGo, setIsPayOnTheGo] = useState(false);

  const [isTrialUsedBefore, setIsTrialUsedBefore] = useState(false);
  const [trialEndsOn, setTrialEndsOn] = useState(null);


  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
     const user = JSON.parse(localStorage.getItem("user"));
     console.log(user)
     setEmail(user.email);
     setUser(user);
  }, []);

  useEffect(async() => {
    console.log(stripeResult)
    var {data} = await Axios.get(`/stripe/getUserSubscription`);
    console.log(data.subscription);
    if(!data.subscription.isTrialActive){
      if(!data.subscription.isSubscriptionActive){
        setIsTrialUsedBefore(data.subscription.isTrialUsedBefore);
      }
    }
    else{
      setTrialEndsOn(data.subscription.howManyDaysLeft);
    }
    // if(data){
    //   console.log(data.data.subscriptionActive)
    //   setIsSubscribed(data.data.subscriptionActive);
    //   setIsLoading(false);
    // }
  }, []);

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
    var {data} = await Axios.get(`/users/profile`);
    console.log(data);
    if(data){
      console.log(data.data.subscriptionActive)
      setIsSubscribed(data.data.subscriptionActive);
      setIsLoading(false);
    }
  }, []);

  const handleSubmitPay = async (event) => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const res = await Axios.post('/stripe/pay', {email: email, listing: {
      "bandName": "Hello Band From Stripe",
      "venueName": "This Venue",
      "date": "2022/04/30",
      "startingTime": "20:00",
      "sampleMp3": "https://google.com",
      "address": {
          "street": "Lake street stripe",
          "city": "Rudrapur",
          "state": "UK",
          "zip": 123456
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
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  };

  const [value, setValue] = React.useState(new Date());
  const [startTime, setStartTime] = React.useState(new Date());
  const [country, setCountry] = React.useState('');
  const [state, setState] = React.useState('');
  const [city, setCity] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [zip, setZip] = React.useState('');
  const [bandName, setBandName] = React.useState('');
  const [venueName, setVenueName] = React.useState('');
  const [date, setDate] = React.useState(new Date());
  const [sampleMp3, setSampleMp3] = React.useState('');



  const handleSubmitSub = async (event) => {
    setIsPaymentLoading(true);
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    if(!isTrialUsedBefore){
      const res = await Axios.post('/stripe/subscription', {'email': email});
      // eslint-disable-next-line camelcase
      const {subscription} = res.data;
      if(subscription.status=="trialing"){
        setIsSubscribed(true);
        setIsPaymentLoading(false);
      }
    }
    else{
    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        email: email,
      },
    });

    if (result.error) {
      console.log(result.error.message);
      setIsPaymentLoading(false);
    } else {
      const res = await Axios.post('/stripe/subscription', {'payment_method': result.paymentMethod.id, 'email': email});
      // eslint-disable-next-line camelcase
      const {client_secret, status} = res.data;

      if (status === 'requires_action') {
        stripe.confirmCardPayment(client_secret).then(function(result) {
          if (result.error) {
            console.log('There was an issue!');
            console.log(result.error);
            // Display error message in your UI.
            // The card was declined (i.e. insufficient funds, card has expired, etc)
          } else {
            console.log('You got the money!');
            // setStripeResult(result);
            setIsSubscribed(true);
            // Show a success message to your customer
          }
          setIsPaymentLoading(false);
        });
      } else {
        console.log('You got the money!');
        // setStripeResult(res.data);
        setIsSubscribed(true);
        // No additional information was needed
        // Show a success message to your customer
        setIsPaymentLoading(false);
      }
    }
  }
  };

  if(isLoading){
    return <div>Loading...</div>
  }
  if(isSubscribed){
    // Show a listing form
    return (
      <SubscribedPage />
    );
  }
  else if(isPayOnTheGo){
    return(<PayOnTheGoPage setIsPayOnTheGo={setIsPayOnTheGo} />)
  }
  else{
  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        {/* Pay on the go listing button */}
        <Button
          variant="contained"
          color="primary"
          style={{
            margin: '1em auto 1em',
            width: '100%',
            height: '50px',
          }}
          className={classes.button}
          onClick={() => setIsPayOnTheGo(true)}
        >
          Pay on the go
        </Button>
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
        {isTrialUsedBefore?
        <CardInput />:null
  }
        <div className={classes.div} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {
            isPaymentLoading?<div style={{marginTop: "10px"}}><ReactLoading type={"spin"} color="#000" height={'50px'} width={'50px'} /></div>:
          <Button variant="contained" color="primary"
          style={{
            margin: '1em auto 1em',
            width: '100%',
            height: '50px',
          }}
          className={classes.button} onClick={handleSubmitSub}>
            {!isTrialUsedBefore?"Activate Free Trial for 90 Days":"Subscribe for $19.95"}
          </Button>
  }
        </div>
      </CardContent>
    </Card>
  );
}
}

export default HomePage;