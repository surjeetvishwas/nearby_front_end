import React, { useEffect } from 'react';
import './home.css';
import hero from './1.jpg';
import feature1 from './3.jpg';
import feature2 from './4.jpg';
import feature3 from './2.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter } from '@fortawesome/free-brands-svg-icons';


const Home = () => {
  useEffect(() => {
    const items = document.querySelectorAll('.accordion button');

    function toggleAccordion() {
      const itemToggle = this.getAttribute('aria-expanded');

      for (let i = 0; i < items.length; i++) {
        items[i].setAttribute('aria-expanded', 'false');
      }

      if (itemToggle === 'false') {
        this.setAttribute('aria-expanded', 'true');
      }
    }

    items.forEach((item) => item.addEventListener('click', toggleAccordion));

    return () => {
      items.forEach((item) => item.removeEventListener('click', toggleAccordion));
    };
  }, []);

  return (
    <div>
      <header>
        <div className="container header-section flex">
          <div className="header-left">
            <h2>Nearby Entertainment</h2>
            <h1>Connecting Entertainment Seekers with Entertainers and Venues.</h1>
            <p>Join the Artificial Intelligence Revolution using Amazon Alexa's voice controlled digital assistant.</p>
            <a href="#" className="primary-button lets-go-btn">Let's Go</a>
          </div>
          <div className="header-right">
            <img src={hero} alt="" />
          </div>
        </div>
      </header>
      <div className="feature1">
        <div className="feature-container">
          <div className="feature-img">
            <img src={feature1} alt="" />
            <div className="feature-text">
              <h1>Finding Local Entertainment Just Got Easier</h1>
              <p>Over 70 million Amazon Alexa users can now discover live local entertainment in a brand new way! It's a free service for users looking for live entertainment...</p>
              <a href="#" className="primary-button alexa-btn">Alexa Nearby Entertainment</a>
            </div>
          </div>
        </div>
      </div>

      <div className="feature2">
        <div className="feature-container2">
          <div className="feature-img2">
            <img src={feature2} alt="" className="image-right" />
            <div className="feature-text2">
              <h1>How it works for Bars, Venues, and Entertainers</h1>
              <p>1) Sign up. We offer a 90-day free trial and no credit card is required. 2) Post your upcoming events on our simple-to-use listing page. 3) That's it! Now Alexa users everywhere can ask about your event. It's that easy! 4) After your 90-day trial has expired, you can list an event for just $1.99 - We also offer discounted monthly and yearly subscriptions</p>
              <a href="#" className="primary-button sign-up-btn">Sign Up For Free!</a>
            </div>
          </div>
        </div>
      </div>

      <div className="feature-img3">
        <img src={feature3} alt="" />
      </div>
      <div className="feature-text3">
        <h1>Voice AI technology.</h1>
        <p>- 90% of people believe that voice search is easier than searching online. - Approximately 68.2 million Americans use voice technology at least monthly. - 71% of mobile users between the ages of 18 and 29 use voice assistants.</p>
        <p>“Alexa, tell me a joke.” It’s a phrase millions of people across the globe say every day to Amazon’s intelligent personal assistant, which has become a household name since the tech giant launched the Echo device in 2014. The AI-powered voice assistant has since extended its reach beyond the home and is now integrated into smartphones, cars, and even wearable devices.</p>
      </div>

      <div className="faq-accordion">
        <div className="container-acc">
          <h1>FAQ</h1>
          <div className="accordion">
            <button className="accordion-btn">What is Nearby Entertainment?</button>
            <div className="accordion-content">
              <p>Nearby Entertainment is a platform that connects entertainment seekers with entertainers and venues. It leverages voice AI technology through Amazon Alexa to make it easier for users to discover local live entertainment.</p>
            </div>

            <button className="accordion-btn">How does it work for users?</button>
            <div className="accordion-content">
              <p>Users with Amazon Alexa can access Nearby Entertainment by enabling the skill and simply asking Alexa for information about local live entertainment events. Alexa will provide relevant event details based on the user's location.</p>
            </div>

            <button className="accordion-btn">How does it work for entertainers and venues?</button>
            <div className="accordion-content">
              <p>Entertainers and venues can sign up for Nearby Entertainment and list their upcoming events. Once listed, Alexa users can inquire about those events and receive information and updates.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="container">
          <div class="row">
            <div class="footer-col">
              <h4>company</h4>
              <ul>
                <li><a href="#">about us</a></li>
                <li><a href="#">our services</a></li>
                <li><a href="#">privacy policy</a></li>
                <li><a href="#">affiliate program</a></li>
              </ul>
            </div>

            <div class="footer-col">
              <h4>follow us</h4>
              <div class="social-links">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
