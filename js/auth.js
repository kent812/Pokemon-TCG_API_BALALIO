// Authentication Module
const AuthModule = {
    currentUser: null,
    loginAttempts: {},
    
    // Initialize authentication
    init: function() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.loginAttempts = JSON.parse(localStorage.getItem('loginAttempts')) || {};
        
        // Setup event listeners
        this.setupEventListeners();
        this.checkAuthStatus();
    },
    
    // Setup authentication event listeners
    setupEventListeners: function() {
        const authTabs = document.querySelectorAll('.auth-tab');
        const loginSubmit = document.getElementById('loginSubmit');
        const signupSubmit = document.getElementById('signupSubmit');
        const logoutBtn = document.getElementById('logoutBtn');
        
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                this.switchAuthTab(tabName);
            });
        });
        
        loginSubmit.addEventListener('click', () => this.handleLogin());
        signupSubmit.addEventListener('click', () => this.handleSignup());
        logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Add enter key support
        document.getElementById('loginPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        document.getElementById('signupConfirmPassword').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSignup();
        });
    },
    
    // Check authentication status
    checkAuthStatus: function() {
        const sessionExpiry = localStorage.getItem('sessionExpiry');
        if (sessionExpiry && Date.now() > parseInt(sessionExpiry)) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionExpiry');
            this.currentUser = null;
        }
        
        if (this.currentUser) {
            this.showMainApp();
        } else {
            this.showAuthScreen();
        }
    },
    
    // Show main application
    showMainApp: function() {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        
        userName.textContent = SecurityUtils.sanitizeInput(this.currentUser.name);
        userAvatar.textContent = SecurityUtils.sanitizeInput(this.currentUser.name.charAt(0).toUpperCase());
        
        this.updateLoginHistory();
        localStorage.setItem('sessionExpiry', (Date.now() + SECURITY_CONFIG.sessionTimeout).toString());
    },
    
    // Show authentication screen
    showAuthScreen: function() {
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    },
    
    // Handle login
    handleLogin: function() {
        const email = SecurityUtils.sanitizeInput(document.getElementById('loginEmail').value);
        const password = document.getElementById('loginPassword').value;
        const loginMessage = document.getElementById('loginMessage');
        
        if (!email || !password) {
            this.showMessage(loginMessage, 'Please fill in all fields', 'error');
            return;
        }
        
        // Check for lockout
        const userAttempts = this.loginAttempts[email] || { count: 0, lastAttempt: 0 };
        const lockoutTime = 15 * 60 * 1000;
        
        if (userAttempts.count >= SECURITY_CONFIG.maxLoginAttempts && 
            (Date.now() - userAttempts.lastAttempt) < lockoutTime) {
            const remainingTime = Math.ceil((lockoutTime - (Date.now() - userAttempts.lastAttempt)) / 60000);
            this.showMessage(loginMessage, `Account temporarily locked. Try again in ${remainingTime} minutes.`, 'error');
            return;
        }
        
        if (!SecurityUtils.validateEmail(email)) {
            this.showMessage(loginMessage, 'Please enter a valid email address', 'error');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && 
            u.password === SecurityUtils.hashPassword(password));
        
        if (user) {
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            delete this.loginAttempts[email];
            localStorage.setItem('loginAttempts', JSON.stringify(this.loginAttempts));
            
            this.showMessage(loginMessage, 'Login successful!', 'success');
            
            setTimeout(() => {
                this.checkAuthStatus();
                // Trigger app initialization
                if (window.AppController) {
                    window.AppController.init();
                }
            }, 1000);
        } else {
            userAttempts.count = (userAttempts.count || 0) + 1;
            userAttempts.lastAttempt = Date.now();
            this.loginAttempts[email] = userAttempts;
            localStorage.setItem('loginAttempts', JSON.stringify(this.loginAttempts));
            
            const remainingAttempts = SECURITY_CONFIG.maxLoginAttempts - userAttempts.count;
            
            if (remainingAttempts > 0) {
                this.showMessage(loginMessage, `Invalid email or password. ${remainingAttempts} attempts remaining.`, 'error');
            } else {
                this.showMessage(loginMessage, `Account locked due to too many failed attempts. Try again in 15 minutes.`, 'error');
            }
        }
    },
    
    // Handle signup
    handleSignup: function() {
        const name = SecurityUtils.sanitizeInput(document.getElementById('signupName').value);
        const email = SecurityUtils.sanitizeInput(document.getElementById('signupEmail').value);
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const signupMessage = document.getElementById('signupMessage');
        
        if (!name || !email || !password || !confirmPassword) {
            this.showMessage(signupMessage, 'Please fill in all fields', 'error');
            return;
        }
        
        if (!SecurityUtils.validateEmail(email)) {
            this.showMessage(signupMessage, 'Please enter a valid email address', 'error');
            return;
        }
        
        const passwordValidation = SecurityUtils.validatePassword(password);
        if (!passwordValidation.valid) {
            this.showMessage(signupMessage, passwordValidation.message, 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showMessage(signupMessage, 'Passwords do not match', 'error');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        if (users.find(u => u.email === email)) {
            this.showMessage(signupMessage, 'User with this email already exists', 'error');
            return;
        }
        
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: SecurityUtils.hashPassword(password),
            createdAt: new Date().toISOString(),
            loginHistory: [new Date().toISOString()]
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        this.currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.showMessage(signupMessage, 'Account created successfully!', 'success');
        
        setTimeout(() => {
            this.checkAuthStatus();
            if (window.AppController) {
                window.AppController.init();
            }
        }, 1000);
    },
    
    // Handle logout
    handleLogout: function() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('sessionExpiry');
        this.checkAuthStatus();
    },
    
    // Update login history
    updateLoginHistory: function() {
        if (!this.currentUser) return;
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        
        if (userIndex !== -1) {
            const currentLogin = new Date().toISOString();
            
            if (!users[userIndex].loginHistory) {
                users[userIndex].loginHistory = [];
            }
            
            users[userIndex].loginHistory.unshift(currentLogin);
            
            if (users[userIndex].loginHistory.length > 10) {
                users[userIndex].loginHistory = users[userIndex].loginHistory.slice(0, 10);
            }
            
            users[userIndex].lastLogin = currentLogin;
            localStorage.setItem('users', JSON.stringify(users));
        }
    },
    
    // Switch authentication tab
    switchAuthTab: function(tab) {
        const authTabs = document.querySelectorAll('.auth-tab');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const loginMessage = document.getElementById('loginMessage');
        const signupMessage = document.getElementById('signupMessage');
        
        authTabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
        
        loginForm.classList.remove('active');
        signupForm.classList.remove('active');
        
        if (tab === 'login') {
            loginForm.classList.add('active');
        } else {
            signupForm.classList.add('active');
        }
        
        loginMessage.style.display = 'none';
        signupMessage.style.display = 'none';
    },
    
    // Show message
    showMessage: function(element, message, type) {
        element.textContent = SecurityUtils.sanitizeInput(message);
        element.className = 'auth-message ' + type;
        element.style.display = 'block';
    },
    
    // Get current user
    getCurrentUser: function() {
        return this.currentUser;
    }
};