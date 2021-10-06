const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
const Appointment = require('./models/appointment');
const Admin = require('./models/user');
const moment = require('moment');

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET,
};

app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({'extended': true}));
app.use(auth(config));

const uri = `mongodb+srv://mkv:${process.env.DB_PASSWORD}@cluster0.9kf4f.mongodb.net/umico?retryWrites=true&w=majority`;
mongoose.connect(uri)
.then(data => {
	console.log("connected to db");
	app.listen(process.env.PORT, () => console.log("listening on port", process.env.PORT));
})
.catch(err => console.log(err));
    
app.get('/', (req, res) => {
	res.render('index', {'isAuthenticated': req.oidc.isAuthenticated()});
});

app.get('/request', requiresAuth(), (req, res) => {
  res.render('request', {'isAuthenticated': req.oidc.isAuthenticated(), 'posted': false});
});

app.post('/request', requiresAuth(), (req, res) => {

	const appointment = new Appointment({"name": req.oidc.user.nickname, "email": req.oidc.user.email, "doctor": req.body.doctor});
	appointment.save()
		.then(data => res.render('request', {'isAuthenticated': req.oidc.isAuthenticated(), 'posted': true}))
		.catch(err => res.status(500).render('500', {'isAuthenticated': req.oidc.isAuthenticated()}));
});

app.get('/appointments', requiresAuth(), function (req, res) {

	Admin.find({"email": req.oidc.user.email})
		.then(data => {
			if(data.length == 0) {
				res.status(403).render('403', {'isAuthenticated': req.oidc.isAuthenticated()});
			}else {
				Appointment.find()
					.then(data => res.render('appointments', {data, 'isAuthenticated': req.oidc.isAuthenticated(), moment}))
					.catch(err => res.status(500).render('500', {'isAuthenticated': req.oidc.isAuthenticated()}));
			}
		})
		.catch(err => res.status(500).render('500', {'isAuthenticated': req.oidc.isAuthenticated()}));
    
});

app.use((req, res) => {
	res.status(404).render('404');
})