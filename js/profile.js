// Profile Module
const ProfileModule = {
    // Update profile information
    updateProfile: function() {
        const currentUser = AuthModule.getCurrentUser();
        if (!currentUser) return;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.id === currentUser.id);
        
        if (!user) return;
        
        // Update profile header
        this.updateProfileHeader(user);
        
        // Update account information
        this.updateAccountInfo(user);
        
        // Update collection stats
        this.updateCollectionStats();
        
        // Update login history
        this.updateLoginHistory(user);
    },
    
    // Update profile header
    updateProfileHeader: function(user) {
        const profileAvatar = document.getElementById('profileAvatar');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        profileAvatar.textContent = SecurityUtils.sanitizeInput(user.name.charAt(0).toUpperCase());
        profileName.textContent = SecurityUtils.sanitizeInput(user.name);
        profileEmail.textContent = SecurityUtils.sanitizeInput(user.email);
    },
    
    // Update account information
    updateAccountInfo: function(user) {
        const memberSince = document.getElementById('memberSince');
        const totalLogins = document.getElementById('totalLogins');
        const lastLogin = document.getElementById('lastLogin');
        
        // Format member since date
        const memberSinceDate = new Date(user.createdAt);
        memberSince.textContent = memberSinceDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Update login stats
        if (user.loginHistory && user.loginHistory.length > 0) {
            totalLogins.textContent = user.loginHistory.length;
            
            const lastLoginDate = new Date(user.loginHistory[0]);
            lastLogin.textContent = lastLoginDate.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            totalLogins.textContent = '1';
            lastLogin.textContent = 'Just now';
        }
    },
    
    // Update collection stats
    updateCollectionStats: function() {
        const collectionCount = document.getElementById('collectionCount');
        const collectionValue = document.getElementById('collectionValue');
        const collectionPower = document.getElementById('collectionPower');
        
        const userCollection = CardsModule.userCollection;
        const allCards = CardsModule.allCards;
        
        const collectedCards = allCards.filter(card => userCollection[card.id]);
        collectionCount.textContent = collectedCards.length;
        
        const totalValue = collectedCards.reduce((sum, card) => sum + card.estimatedValue, 0);
        collectionValue.textContent = `$${totalValue.toFixed(2)}`;
        
        const avgPowerValue = collectedCards.length > 0 
            ? Math.round(collectedCards.reduce((sum, card) => sum + card.powerScore, 0) / collectedCards.length)
            : 0;
        collectionPower.textContent = avgPowerValue;
    },
    
    // Update login history
    updateLoginHistory: function(user) {
        const loginHistory = document.getElementById('loginHistory');
        
        if (!user.loginHistory || user.loginHistory.length === 0) {
            loginHistory.innerHTML = '<p style="color: #aaa; text-align: center;">No login history available</p>';
            return;
        }
        
        loginHistory.innerHTML = '';
        user.loginHistory.forEach(loginTime => {
            const loginDate = new Date(loginTime);
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-time">${loginDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}</div>
                <div class="history-date">${loginDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</div>
            `;
            loginHistory.appendChild(historyItem);
        });
    }
};