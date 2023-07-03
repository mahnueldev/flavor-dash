const corsOptions = {
  origin: [
    'http://127.0.0.1:8080',
    'http://localhost:3000',
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:8080',
    'http://localhost:8080/api/auth',
    'http://localhost:8080/api/refresh',
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};

module.exports = corsOptions;
