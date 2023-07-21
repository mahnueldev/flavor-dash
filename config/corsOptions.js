const corsOptions = {
  origin: [
    // 'http://127.0.0.1:5173',
    // 'http://127.0.0.1:8080',
    // 'http://localhost:3000',
    // 'http://localhost:3000',
    // 'http://localhost:4000',
    // 'http://localhost:8080',
    // 'http://localhost:8080/api/auth',
    // 'http://localhost:8080/api/refresh',
    // 'http://localhost:8080/api/recipes',
    
    'https://flavourdash.netlify.app',
    'https://app-flavourdash.netlify.app',
    'https://determined-blue-cloak.cyclic.app',
    'https://determined-blue-cloak.cyclic.app/api/auth',
    'https://determined-blue-cloak.cyclic.app/api/user',
    'https://determined-blue-cloak.cyclic.app/api/refresh',
    'https://determined-blue-cloak.cyclic.app/api/recipe',
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'x-api-key', 'x-api-host'],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};

module.exports = corsOptions;
