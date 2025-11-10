// Security Utility Functions
const SecurityUtils = {
    // Simple hash function for demo purposes
    // In production, use a proper hashing library like bcrypt
    hashPassword: function(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
    },
    
    // Input sanitization to prevent XSS
    sanitizeInput: function(input) {
        if (typeof input !== 'string') return input;
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    },
    
    // Validate email format
    validateEmail: function(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    
    // Password strength validation
    validatePassword: function(password) {
        if (password.length < SECURITY_CONFIG.minPasswordLength) {
            return { 
                valid: false, 
                message: `Password must be at least ${SECURITY_CONFIG.minPasswordLength} characters` 
            };
        }
        
        // Check for at least one number and one letter
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        
        if (!hasNumber || !hasLetter) {
            return { 
                valid: false, 
                message: 'Password must contain at least one letter and one number' 
            };
        }
        
        return { valid: true, message: 'Password is strong' };
    },
    
    // Generate CSRF token
    generateCSRFToken: function() {
        return 'csrf_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }
};