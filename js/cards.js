// Cards Module for displaying and managing cards
const CardsModule = {
    allCards: [],
    filteredCards: [],
    userCollection: {},
    currentView: 'all',
    currentPage: 1,
    totalPages: 1,
    
    // Initialize cards module
    init: function() {
        this.userCollection = JSON.parse(localStorage.getItem('pokemonCollection')) || {};
        this.setupEventListeners();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const typeFilter = document.getElementById('typeFilter');
        const rarityFilter = document.getElementById('rarityFilter');
        const sortBy = document.getElementById('sortBy');
        const collectionToggle = document.getElementById('collectionToggle');
        const closeBtn = document.querySelector('.close');
        const modal = document.getElementById('modal');
        
        // Pagination
        const firstPageBtn = document.getElementById('firstPage');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const lastPageBtn = document.getElementById('lastPage');
        
        searchBtn.addEventListener('click', () => this.handleSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        typeFilter.addEventListener('change', () => this.applyFilters());
        rarityFilter.addEventListener('change', () => this.applyFilters());
        sortBy.addEventListener('change', () => this.applyFilters());
        collectionToggle.addEventListener('change', () => this.toggleCollectionView());
        
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
        
        firstPageBtn.addEventListener('click', () => this.goToPage(1));
        prevPageBtn.addEventListener('click', () => this.goToPage(this.currentPage - 1));
        nextPageBtn.addEventListener('click', () => this.goToPage(this.currentPage + 1));
        lastPageBtn.addEventListener('click', () => this.goToPage(this.totalPages));
    },
    
    // Load cards
    async loadCards(query = '') {
        const loading = document.getElementById('loading');
        const cardsContainer = document.getElementById('cardsContainer');
        const pagination = document.getElementById('pagination');
        
        loading.style.display = 'block';
        cardsContainer.innerHTML = '';
        pagination.style.display = 'none';
        
        try {
            this.allCards = await APIModule.fetchCards(query);
            loading.style.display = 'none';
            
            if (this.allCards.length > 0) {
                this.applyFilters();
            } else {
                cardsContainer.innerHTML = '<p style="color: #ffcb05; text-align: center; font-size: 20px;">No cards found. Try another search!</p>';
            }
        } catch (error) {
            loading.style.display = 'none';
            cardsContainer.innerHTML = `
                <div style="color: #ffcb05; text-align: center; background: rgba(255,0,0,0.2); padding: 30px; border-radius: 15px; max-width: 600px; margin: 0 auto;">
                    <h3 style="margin-bottom: 15px;">⚠️ Connection Error</h3>
                    <p style="margin-bottom: 15px;">Unable to fetch cards from the Pokémon TCG API.</p>
                    <p style="font-size: 14px;">Error: ${error.message}</p>
                </div>
            `;
        }
    },
    
    // Handle search
    handleSearch: function() {
        const query = document.getElementById('searchInput').value.trim();
        this.loadCards(query);
    },
    
    // Apply filters
    applyFilters: function() {
        const typeFilter = document.getElementById('typeFilter');
        const rarityFilter = document.getElementById('rarityFilter');
        const sortBy = document.getElementById('sortBy');
        
        let filtered = [...this.allCards];
        
        // Type filter
        if (typeFilter.value) {
            filtered = filtered.filter(card => 
                card.types && card.types.includes(typeFilter.value)
            );
        }
        
        // Rarity filter
        if (rarityFilter.value) {
            filtered = filtered.filter(card => 
                card.rarity === rarityFilter.value
            );
        }
        
        // Collection filter
        if (this.currentView === 'collection') {
            filtered = filtered.filter(card => this.userCollection[card.id]);
        }
        
        // Sort
        const sortValue = sortBy.value;
        filtered.sort((a, b) => {
            if (sortValue === 'name') {
                return a.name.localeCompare(b.name);
            } else if (sortValue === 'power') {
                return b.powerScore - a.powerScore;
            } else if (sortValue === 'value') {
                return b.estimatedValue - a.estimatedValue;
            } else if (sortValue === 'hp') {
                return (parseInt(b.hp) || 0) - (parseInt(a.hp) || 0);
            }
            return 0;
        });
        
        this.filteredCards = filtered;
        this.currentPage = 1;
        this.updatePagination();
        this.displayCurrentPage();
        this.updateStats();
    },
    
    // Toggle collection view
    toggleCollectionView: function() {
        const collectionToggle = document.getElementById('collectionToggle');
        this.currentView = collectionToggle.checked ? 'collection' : 'all';
        this.applyFilters();
    },
    
    // Display current page
    displayCurrentPage: function() {
        const cardsContainer = document.getElementById('cardsContainer');
        cardsContainer.innerHTML = '';
        
        if (this.filteredCards.length === 0) {
            cardsContainer.innerHTML = '<p style="color: #ffcb05; text-align: center; font-size: 20px; width: 100%;">No cards match your filters.</p>';
            return;
        }
        
        const startIndex = (this.currentPage - 1) * APP_CONFIG.cardsPerPage;
        const endIndex = Math.min(startIndex + APP_CONFIG.cardsPerPage, this.filteredCards.length);
        const cardsToShow = this.filteredCards.slice(startIndex, endIndex);
        
        cardsToShow.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            
            if (this.userCollection[card.id]) {
                cardDiv.style.border = '3px solid #4CAF50';
            }
            
            cardDiv.innerHTML = `
                ${card.rarity ? `<div class="card-rarity">${SecurityUtils.sanitizeInput(card.rarity)}</div>` : ''}
                <img src="${card.images.small}" alt="${SecurityUtils.sanitizeInput(card.name)}" loading="lazy">
                <div class="card-name">${SecurityUtils.sanitizeInput(card.name)}</div>
                <div class="card-stats">
                    <div class="card-power">Power: ${card.powerScore}</div>
                    <div class="card-value">$${card.estimatedValue}</div>
                </div>
            `;
            
            cardDiv.addEventListener('click', () => this.showCardDetails(card));
            cardsContainer.appendChild(cardDiv);
        });
    },
    
    // Update pagination
    updatePagination: function() {
        const pagination = document.getElementById('pagination');
        const pageInfo = document.getElementById('pageInfo');
        const firstPageBtn = document.getElementById('firstPage');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const lastPageBtn = document.getElementById('lastPage');
        
        this.totalPages = Math.ceil(this.filteredCards.length / APP_CONFIG.cardsPerPage);
        
        if (this.totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }
        
        pagination.style.display = 'flex';
        pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        
        firstPageBtn.disabled = this.currentPage === 1;
        prevPageBtn.disabled = this.currentPage === 1;
        nextPageBtn.disabled = this.currentPage === this.totalPages;
        lastPageBtn.disabled = this.currentPage === this.totalPages;
        
        firstPageBtn.classList.toggle('disabled', this.currentPage === 1);
        prevPageBtn.classList.toggle('disabled', this.currentPage === 1);
        nextPageBtn.classList.toggle('disabled', this.currentPage === this.totalPages);
        lastPageBtn.classList.toggle('disabled', this.currentPage === this.totalPages);
    },
    
    // Go to page
    goToPage: function(page) {
        if (page < 1 || page > this.totalPages) return;
        
        this.currentPage = page;
        this.displayCurrentPage();
        this.updatePagination();
        
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
    },
    
    // Show card details
    showCardDetails: function(card) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');
        const inCollection = this.userCollection[card.id];
        
        let attacksHTML = '';
        if (card.attacks && card.attacks.length > 0) {
            attacksHTML = '<div class="attacks"><div class="info-label">Attacks:</div>';
            card.attacks.forEach(attack => {
                attacksHTML += `
                    <div class="attack-item">
                        <div class="attack-name">${SecurityUtils.sanitizeInput(attack.name)}</div>
                        <div>${SecurityUtils.sanitizeInput(attack.text || '')}</div>
                        <div class="attack-damage">${SecurityUtils.sanitizeInput(attack.damage || 'N/A')}</div>
                    </div>
                `;
            });
            attacksHTML += '</div>';
        }
        
        const powerPercentage = Math.min(100, (card.powerScore / 200) * 100);
        
        modalBody.innerHTML = `
            <div class="modal-image">
                <img src="${card.images.large}" alt="${SecurityUtils.sanitizeInput(card.name)}">
            </div>
            <div class="modal-info">
                <h2>${SecurityUtils.sanitizeInput(card.name)}</h2>
                
                <div class="power-score">
                    <span class="info-label">Power Score:</span>
                    <span class="info-value">${card.powerScore}</span>
                    <div class="power-bar">
                        <div class="power-fill" style="width: ${powerPercentage}%"></div>
                    </div>
                </div>
                
                <div class="info-row">
                    <span class="info-label">Type:</span>
                    <span class="info-value">${card.types ? SecurityUtils.sanitizeInput(card.types.join(', ')) : 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">HP:</span>
                    <span class="info-value">${SecurityUtils.sanitizeInput(card.hp || 'N/A')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Rarity:</span>
                    <span class="info-value">${SecurityUtils.sanitizeInput(card.rarity || 'N/A')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Set:</span>
                    <span class="info-value">${SecurityUtils.sanitizeInput(card.set.name)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Artist:</span>
                    <span class="info-value">${SecurityUtils.sanitizeInput(card.artist || 'N/A')}</span>
                </div>
                ${attacksHTML}
                
                <div class="collection-actions">
                    <button class="collection-btn add-btn" onclick="CardsModule.addToCollection('${card.id}')" ${inCollection ? 'disabled' : ''}>
                        ${inCollection ? 'In Collection' : 'Add to Collection'}
                    </button>
                    <button class="collection-btn remove-btn" onclick="CardsModule.removeFromCollection('${card.id}')" ${!inCollection ? 'disabled' : ''}>
                        Remove from Collection
                    </button>
                </div>
            </div>
        `;
        modal.style.display = 'block';
    },
    
    // Add to collection
    addToCollection: function(cardId) {
        this.userCollection[cardId] = true;
        localStorage.setItem('pokemonCollection', JSON.stringify(this.userCollection));
        document.getElementById('modal').style.display = 'none';
        this.applyFilters();
        
        if (document.getElementById('profile').classList.contains('active')) {
            ProfileModule.updateProfile();
        }
    },
    
    // Remove from collection
    removeFromCollection: function(cardId) {
        delete this.userCollection[cardId];
        localStorage.setItem('pokemonCollection', JSON.stringify(this.userCollection));
        document.getElementById('modal').style.display = 'none';
        this.applyFilters();
        
        if (document.getElementById('profile').classList.contains('active')) {
            ProfileModule.updateProfile();
        }
    },
    
    // Update stats
    updateStats: function() {
        const totalCards = document.getElementById('totalCards');
        const avgPower = document.getElementById('avgPower');
        const strongestCard = document.getElementById('strongestCard');
        
        const cardsInView = this.currentView === 'collection' 
            ? this.filteredCards.filter(card => this.userCollection[card.id])
            : this.filteredCards;
        
        totalCards.textContent = cardsInView.length;
        
        const avgPowerValue = cardsInView.length > 0 
            ? Math.round(cardsInView.reduce((sum, card) => sum + card.powerScore, 0) / cardsInView.length)
            : 0;
        avgPower.textContent = avgPowerValue;
        
        if (cardsInView.length > 0) {
            const strongest = cardsInView.reduce((max, card) => 
                card.powerScore > max.powerScore ? card : max
            );
            strongestCard.textContent = SecurityUtils.sanitizeInput(strongest.name);
        } else {
            strongestCard.textContent = '-';
        }
    }
};