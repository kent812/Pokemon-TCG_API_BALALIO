// Main Application Controller
const AppController = {
    // Initialize the application
    init: function() {
        // Initialize API module
        APIModule.init();
        
        // Initialize cards module
        CardsModule.init();
        
        // Initialize navigation module
        NavigationModule.init();
        
        // Load initial cards
        CardsModule.loadCards();
        
        // Setup session timeout
        this.setupSessionTimeout();
    },
    
    // Setup session timeout
    setupSessionTimeout: function() {
        let timeout;
        
        const resetTimer = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const currentUser = AuthModule.getCurrentUser();
                if (currentUser) {
                    alert('Your session has expired due to inactivity. Please log in again.');
                    AuthModule.handleLogout();
                }
            }, SECURITY_CONFIG.sessionTimeout);
        };
        
        // Events that reset the timer
        ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, false);
        });
        
        resetTimer();
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize authentication first
    AuthModule.init();
    
    // If user is logged in, initialize the rest of the app
    if (AuthModule.getCurrentUser()) {
        AppController.init();
    }
});