<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src https://api.pokemontcg.io;">
    <title>Pokémon TCG Browser - Secure Dark Aesthetic</title>
    
    <!-- CSS Files -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/auth.css">
    <link rel="stylesheet" href="css/navigation.css">
    <link rel="stylesheet" href="css/cards.css">
    <link rel="stylesheet" href="css/profile.css">
</head>
<body>
    <!-- Login/Signup Screen (shown by default) -->
    <div id="authScreen" class="auth-screen">
        <div class="auth-container">
            <div class="auth-logo">
                <span>⚡</span>
                <span>POKÉMON TCG</span>
            </div>
            <h2 class="auth-title">Welcome to Pokémon TCG Browser</h2>
            <p style="color: #aaa; margin-bottom: 30px;">Please log in or sign up to access the complete Pokémon TCG collection</p>
            
            <!-- Security Notice -->
            <div class="security-notice">
                <strong>Security Notice:</strong> Your data is protected with industry-standard security practices.
            </div>
            
            <div class="auth-tabs">
                <div class="auth-tab active" data-tab="login">Login</div>
                <div class="auth-tab" data-tab="signup">Sign Up</div>
            </div>
            
            <div id="loginForm" class="auth-form active">
                <div class="form-group">
                    <label for="loginEmail">Email</label>
                    <input type="email" id="loginEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">Password</label>
                    <input type="password" id="loginPassword" placeholder="Enter your password" required minlength="8">
                </div>
                <button class="auth-submit-btn" id="loginSubmit">Login</button>
                <div id="loginMessage" class="auth-message"></div>
            </div>
            
            <div id="signupForm" class="auth-form">
                <div class="form-group">
                    <label for="signupName">Full Name</label>
                    <input type="text" id="signupName" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label for="signupEmail">Email</label>
                    <input type="email" id="signupEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="signupPassword">Password</label>
                    <input type="password" id="signupPassword" placeholder="Create a password (min. 8 characters)" required minlength="8">
                </div>
                <div class="form-group">
                    <label for="signupConfirmPassword">Confirm Password</label>
                    <input type="password" id="signupConfirmPassword" placeholder="Confirm your password" required minlength="8">
                </div>
                <button class="auth-submit-btn" id="signupSubmit">Sign Up</button>
                <div id="signupMessage" class="auth-message"></div>
            </div>
        </div>
    </div>

    <!-- Main App (hidden until login) -->
    <div id="mainApp" class="main-app">
        <div class="container">
            <!-- Navigation Bar -->
            <nav class="navbar">
                <div class="nav-logo">
                    <span>⚡</span>
                    <span>POKÉMON TCG</span>
                </div>
                <div class="nav-links">
                    <a href="home" class="nav-link active" data-page="home">Home</a>
                    <a href="about" class="nav-link" data-page="about">About</a>
                    <a href="contact" class="nav-link" data-page="contact">Contact</a>
                    <a href="profile" class="nav-link" data-page="profile">Profile</a>
                    
                    <div class="user-info">
                        <div class="user-avatar" id="userAvatar">U</div>
                        <span id="userName">User</span>
                        <button class="logout-btn" id="logoutBtn">Logout</button>
                    </div>
                </div>
                <button class="mobile-menu-btn">☰</button>
            </nav>

            <!-- Home Section -->
            <section id="home" class="page-section active">
                <header>
                    <h1>⚡ POKÉMON TCG ⚡</h1>
                    <p style="color: #aaa; font-size: 18px;">Complete Pokémon Trading Card Game System</p>
                    <div class="search-container">
                        <input type="text" id="searchInput" placeholder="Search for a Pokémon card...">
                        <button id="searchBtn">Search</button>
                    </div>
                </header>

                <div class="filter-container">
                    <div>
                        <label for="typeFilter">Type:</label>
                        <select id="typeFilter">
                            <option value="">All Types</option>
                            <option value="Grass">Grass</option>
                            <option value="Fire">Fire</option>
                            <option value="Water">Water</option>
                            <option value="Lightning">Lightning</option>
                            <option value="Psychic">Psychic</option>
                            <option value="Fighting">Fighting</option>
                            <option value="Darkness">Darkness</option>
                            <option value="Metal">Metal</option>
                            <option value="Fairy">Fairy</option>
                            <option value="Dragon">Dragon</option>
                            <option value="Colorless">Colorless</option>
                        </select>
                    </div>
                    <div>
                        <label for="rarityFilter">Rarity:</label>
                        <select id="rarityFilter">
                            <option value="">All Rarities</option>
                            <option value="Common">Common</option>
                            <option value="Uncommon">Uncommon</option>
                            <option value="Rare">Rare</option>
                            <option value="Rare Holo">Rare Holo</option>
                            <option value="Rare Holo EX">Rare Holo EX</option>
                            <option value="Rare Ultra">Rare Ultra</option>
                        </select>
                    </div>
                    <div>
                        <label for="sortBy">Sort By:</label>
                        <select id="sortBy">
                            <option value="name">Name</option>
                            <option value="power">Power Score</option>
                            <option value="value">Estimated Value</option>
                            <option value="hp">HP</option>
                        </select>
                    </div>
                    <div>
                        <label for="collectionToggle">Show My Collection</label>
                        <input type="checkbox" id="collectionToggle">
                    </div>
                </div>

                <div class="stats-container">
                    <div class="stat-box">
                        <div class="stat-label">Total Cards</div>
                        <div class="stat-value" id="totalCards">0</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Average Power</div>
                        <div class="stat-value" id="avgPower">0</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Strongest Card</div>
                        <div class="stat-value" id="strongestCard">-</div>
                    </div>
                </div>

                <div id="loading" class="loading" style="display: none;">Loading cards...</div>
                <div id="cardsContainer" class="cards-grid"></div>
                
                <div class="pagination" id="pagination" style="display: none;">
                    <button class="pagination-btn" id="firstPage">First</button>
                    <button class="pagination-btn" id="prevPage">Previous</button>
                    <span class="pagination-info" id="pageInfo">Page 1 of 1</span>
                    <button class="pagination-btn" id="nextPage">Next</button>
                    <button class="pagination-btn" id="lastPage">Last</button>
                </div>
            </section>

            <!-- About Section -->
            <section id="about" class="page-section">
                <h2 class="page-title">About Pokémon TCG Browser</h2>
                <div class="page-content">
                    <p>Welcome to the ultimate Pokémon Trading Card Game browser and collection management system!</p>
                    
                    <div class="about-grid">
                        <div class="feature-box">
                            <div class="feature-icon">⚡</div>
                            <h3>Power Analysis</h3>
                            <p>Each card is assigned a power score based on HP, attack damage, and rarity.</p>
                        </div>
                        <div class="feature-box">
                            <div class="feature-icon">🔍</div>
                            <h3>Advanced Search</h3>
                            <p>Find exactly what you're looking for with filters by type, rarity, and sorting options.</p>
                        </div>
                        <div class="feature-box">
                            <div class="feature-icon">📊</div>
                            <h3>Collection Stats</h3>
                            <p>Track your collection with detailed statistics.</p>
                        </div>
                        <div class="feature-box">
                            <div class="feature-icon">📄</div>
                            <h3>Pagination</h3>
                            <p>Browse efficiently with 10 cards per page.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Contact Section -->
            <section id="contact" class="page-section">
                <h2 class="page-title">Contact Us</h2>
                <div class="page-content">
                    <div class="contact-form">
                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" placeholder="Enter your name">
                        </div>
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" placeholder="Enter your email">
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" placeholder="What is this regarding?">
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" rows="5" placeholder="Tell us what's on your mind..."></textarea>
                        </div>
                        <button class="submit-btn">Send Message</button>
                    </div>
                </div>
            </section>

            <!-- Profile Section -->
            <section id="profile" class="page-section">
                <h2 class="page-title">User Profile</h2>
                <div class="page-content">
                    <div class="profile-header">
                        <div class="profile-avatar" id="profileAvatar">U</div>
                        <h3 id="profileName">User Name</h3>
                        <p id="profileEmail">user@example.com</p>
                    </div>
                    
                    <div class="profile-info">
                        <div class="profile-card">
                            <h3>Account Information</h3>
                            <div class="info-row">
                                <span class="info-label">Member Since</span>
                                <span class="info-value" id="memberSince">-</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Total Logins</span>
                                <span class="info-value" id="totalLogins">0</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Last Login</span>
                                <span class="info-value" id="lastLogin">-</span>
                            </div>
                        </div>
                        
                        <div class="profile-card">
                            <h3>Collection Stats</h3>
                            <div class="collection-stats">
                                <div class="collection-stat">
                                    <div class="collection-stat-value" id="collectionCount">0</div>
                                    <div class="collection-stat-label">Cards Collected</div>
                                </div>
                                <div class="collection-stat">
                                    <div class="collection-stat-value" id="collectionValue">$0</div>
                                    <div class="collection-stat-label">Total Value</div>
                                </div>
                                <div class="collection-stat">
                                    <div class="collection-stat-value" id="collectionPower">0</div>
                                    <div class="collection-stat-label">Avg Power</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="profile-card">
                        <h3>Login History</h3>
                        <div class="history-list" id="loginHistory"></div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Card Details Modal -->
        <div id="modal" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <div class="modal-body" id="modalBody"></div>
            </div>
        </div>
    </div>

    <!-- JavaScript Files - Load in dependency order -->
    <script src="js/config.js"></script>
    <script src="js/security.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/api.js"></script>
    <script src="js/cards.js"></script>
    <script src="js/navigation.js"></script>
    <script src="js/profile.js"></script>
    <script src="js/main.js"></script>
</body>
</html>