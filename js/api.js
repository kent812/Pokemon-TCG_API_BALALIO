// API Module for fetching Pokemon cards
const APIModule = {
    cardCache: {},
    lastFetchTime: 0,
    
    // Initialize API module
    init: function() {
        this.cardCache = JSON.parse(localStorage.getItem('cardCache')) || {};
        this.lastFetchTime = parseInt(localStorage.getItem('lastFetchTime')) || 0;
    },
    
    // Fetch cards from API
    async fetchCards(query = '') {
        const cacheKey = query || 'default';
        const currentTime = Date.now();
        
        // Check cache
        if (this.cardCache[cacheKey] && (currentTime - this.lastFetchTime) < APP_CONFIG.cacheDuration) {
            return this.cardCache[cacheKey];
        }
        
        try {
            const sanitizedQuery = SecurityUtils.sanitizeInput(query);
            const url = sanitizedQuery 
                ? `${API_CONFIG.url}?q=name:${encodeURIComponent(sanitizedQuery)}*&pageSize=100`
                : `${API_CONFIG.url}?pageSize=100`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Api-Key': API_CONFIG.key,
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                const cards = data.data.map(card => ({
                    ...card,
                    powerScore: this.calculatePowerScore(card),
                    estimatedValue: this.calculateEstimatedValue(card)
                }));
                
                // Update cache
                this.cardCache[cacheKey] = cards;
                this.lastFetchTime = currentTime;
                localStorage.setItem('cardCache', JSON.stringify(this.cardCache));
                localStorage.setItem('lastFetchTime', this.lastFetchTime.toString());
                
                return cards;
            }
            
            return [];
        } catch (error) {
            console.error('Fetch Error:', error);
            throw error;
        }
    },
    
    // Calculate power score for a card
    calculatePowerScore: function(card) {
        let score = 0;
        
        // Base HP contributes to power
        if (card.hp) {
            score += parseInt(card.hp) * 0.5;
        }
        
        // Attacks contribute to power
        if (card.attacks && card.attacks.length > 0) {
            card.attacks.forEach(attack => {
                if (attack.damage && attack.damage !== '') {
                    const damage = parseInt(attack.damage) || 0;
                    score += damage * 2;
                }
            });
        }
        
        // Rarity multiplier
        if (card.rarity && RARITY_MULTIPLIER[card.rarity]) {
            score *= RARITY_MULTIPLIER[card.rarity];
        }
        
        return Math.round(score);
    },
    
    // Calculate estimated value for a card
    calculateEstimatedValue: function(card) {
        let value = 0;
        
        // Base value from rarity
        if (card.rarity && RARITY_VALUE[card.rarity]) {
            value = RARITY_VALUE[card.rarity];
        }
        
        // Adjust based on power score
        value += card.powerScore * 0.05;
        
        // Special cards are more valuable
        if (card.name.includes('EX') || card.name.includes('GX') || card.name.includes('V')) {
            value *= 2;
        }
        
        return Math.round(value * 100) / 100;
    }
};