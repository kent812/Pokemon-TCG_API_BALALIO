// Configuration Constants
const SECURITY_CONFIG = {
    minPasswordLength: 8,
    maxLoginAttempts: 5,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    apiRateLimit: 100 // requests per minute
};

// API Configuration
// Note: In production, API calls should go through your own backend
const API_CONFIG = {
    key: 'b66c9324-40e6-4f99-a8bf-b2c65fd8e3a3',
    url: 'https://api.pokemontcg.io/v2/cards'
};

// Application Constants
const APP_CONFIG = {
    cardsPerPage: 10,
    cacheDuration: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
};

// Rarity Multipliers for Power Score Calculation
const RARITY_MULTIPLIER = {
    'Common': 1,
    'Uncommon': 1.2,
    'Rare': 1.5,
    'Rare Holo': 2,
    'Rare Holo EX': 3,
    'Rare Ultra': 4
};

// Rarity Base Values for Estimated Value Calculation
const RARITY_VALUE = {
    'Common': 0.10,
    'Uncommon': 0.25,
    'Rare': 1.00,
    'Rare Holo': 3.00,
    'Rare Holo EX': 10.00,
    'Rare Ultra': 25.00
};