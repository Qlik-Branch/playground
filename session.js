module.exports = expressSession({
  secret: 'mySecretKey',
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  // cookie: {path:"/", domain:process.env.cookieDomain, httpOnly: true}
});
