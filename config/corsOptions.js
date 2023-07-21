const corsOptions = {
  origin: [
    'https://cyclic.app',
    'https://app.cyclic.sh/#',
    'https://flavourdash.netlify.app',
    'https://app-flavourdash.netlify.app',
    'https://determined-blue-cloak.cyclic.app',
    'https://determined-blue-cloak.cyclic.app/api/auth',
    'https://determined-blue-cloak.cyclic.app/api/user',
    'https://determined-blue-cloak.cyclic.app/api/refresh',
    'https://determined-blue-cloak.cyclic.app/api/recipe',
  ],
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'x-api-key', 'x-api-host'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};

module.exports = corsOptions;
