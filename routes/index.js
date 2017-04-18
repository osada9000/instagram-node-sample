const express = require('express');
const router = express.Router();
const api = require('instagram-node').instagram();
const axios = require('axios');

api.use({
  client_id: 'your client id',
  client_secret: 'your client secret',
});

const redirectUri = 'http://localhost:3000/handleauth';

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

// This is where you would initially send users to authorize
router.get('/authorize_user', (req, res) => {
  res.redirect(api.get_authorization_url(redirectUri, { scope: ['basic', 'public_content'], state: 'a state' }));
});


// This is your redirect URI
router.get('/handleauth', (req, res) => {
  api.authorize_user(req.query.code, redirectUri, (err, result) => {
    if (err) {
      console.log(err);
      res.send("Didn't work");
    } else {
      console.log(`Access token is ${result.access_token}`);

      const TAGNAME = 'snow';
      axios.get(`https://api.instagram.com/v1/tags/${TAGNAME}/media/recent`, {
        params: {
          access_token: result.access_token,
        },
      }).then((response) => {
        console.log(response.data);
        res.send('You made it!!');
      }).catch((error) => {
        console.log('ERROR', error);
        res.status(400).send(error);
      });
    }
  });
});


module.exports = router;

