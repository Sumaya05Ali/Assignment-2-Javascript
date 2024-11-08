document.addEventListener('DOMContentLoaded', function () {
    // =====================
    // Gallery Images Data
    // =====================
    const galleryImages = [
        { src: "lake_view.jpg", title: "Lake view with deck" },
        { src: "cottage_exterior.jpg", title: "Cottage exterior" },
        { src: "living_room_1.jpg", title: "Living room" },
        { src: "living_room_2.jpg", title: "Living room" },
        { src: "living_room_3.jpg", title: "Living room" },
        { src: "lake_view_1.jpg", title: "Lake View" },
        { src: "lake_view_2.jpg", title: "Lake View" },
        { src: "lake_view_3.jpg", title: "Lake View" },
        { src: "lake_view_4.jpg", title: "Lake View" },
        { src: "lake.jpg", title: "Lake" },
        { src: "deck.jpg", title: "Deck" },
        { src: "cottage.jpg", title: "Cottage" },
        
    ];

    // =====================
    // Region Mappings
    // =====================
    const regionCurrencyMap = {
        'US': 'USD',
        'EU': 'EUR',
        'UK': 'GBP',
        'PT': 'EUR',
        'RU': 'RUB',
        'CA': 'CAD',
        'AU': 'AUD'
    };

    const regionDisplayMap = {
        'US': 'United States',
        'EU': 'European Union',
        'UK': 'United Kingdom',
        'PT': 'Portugal',
        'RU': 'Russia',
        'CA': 'Canada',
        'AU': 'Australia'
    };

    // =====================
    // Gallery Popup Functionality
    // =====================
    class GalleryPopup {
        constructor() {
            this.currentIndex = 0;
            this.initializeElements();
            this.setupEventListeners();
        }

        initializeElements() {
            this.popup = document.getElementById('galleryPopup');
            this.popupImage = document.getElementById('popupImage');
            this.imageTitle = document.getElementById('imageTitle');
            this.imageCount = document.getElementById('imageCount');
        }

        setupEventListeners() {
            document.querySelector('.photo-count').addEventListener('click', () => this.openPopup());
            document.querySelector('.close-btn').addEventListener('click', () => this.closePopup());
            document.querySelector('.prev-btn').addEventListener('click', () => this.navigate(-1));
            document.querySelector('.next-btn').addEventListener('click', () => this.navigate(1));
            document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e));
            this.popup.addEventListener('click', (e) => {
                if (e.target === this.popup) {
                    this.closePopup();
                }
            });
        }

        handleKeyboardNavigation(e) {
            if (!this.popup.style.display || this.popup.style.display === 'none') return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.navigate(-1);
                    break;
                case 'ArrowRight':
                    this.navigate(1);
                    break;
                case 'Escape':
                    this.closePopup();
                    break;
            }
        }

        openPopup() {
            this.currentIndex = 0;
            this.updateImage();
            this.popup.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        closePopup() {
            this.popup.style.display = 'none';
            document.body.style.overflow = '';
        }

        navigate(direction) {
            this.currentIndex = (this.currentIndex + direction + galleryImages.length) % galleryImages.length;
            this.updateImage();
        }

        updateImage() {
            const image = galleryImages[this.currentIndex];
            this.popupImage.src = image.src;
            this.popupImage.alt = image.title;
            this.imageTitle.textContent = image.title;
            this.imageCount.textContent = `Image ${this.currentIndex + 1} of ${galleryImages.length}`;
        }
    }

    // =====================
    // Region Popup Functionality
    // =====================
    class RegionManager {
        constructor() {
            this.initializeElements();
            this.setupEventListeners();
        }

        initializeElements() {
            this.regionButton = document.getElementById('regionButton');
            this.mobileRegionButton = document.getElementById('mobileRegionButton');
            this.popupOverlay = document.getElementById('popupOverlay');
            this.closeButton = document.querySelector('.close-icon');
            this.saveButton = document.querySelector('.save-btn');
            this.regionSelect = document.getElementById('region');
            this.currencySelect = document.getElementById('currency');
            this.regionTextElements = document.querySelectorAll('.region-text, .mobile-region-text');
        }

        setupEventListeners() {
            this.regionButton.addEventListener('click', () => this.openPopup());
            this.mobileRegionButton.addEventListener('click', () => this.openPopup());
            this.closeButton.addEventListener('click', () => this.closePopup());
            this.popupOverlay.addEventListener('click', (e) => {
                if (e.target === this.popupOverlay) {
                    this.closePopup();
                }
            });

            this.regionSelect.addEventListener('change', (e) => {
                const selectedRegion = e.target.value;
                const correspondingCurrency = regionCurrencyMap[selectedRegion];
                this.currencySelect.value = correspondingCurrency;
                this.currencySelect.disabled = true;
            });

            this.saveButton.addEventListener('click', () => {
                const selectedRegion = this.regionSelect.value;
                const displayName = regionDisplayMap[selectedRegion];
                this.regionTextElements.forEach(element => {
                    element.textContent = displayName;
                });
                this.closePopup();
            });
        }

        openPopup() {
            this.popupOverlay.style.display = 'flex';
            setTimeout(() => {
                this.popupOverlay.style.opacity = '1';
            }, 10);
            
            this.currencySelect.disabled = true;
            const currentRegion = this.regionSelect.value;
            this.currencySelect.value = regionCurrencyMap[currentRegion];
        }

        closePopup() {
            this.popupOverlay.style.opacity = '0';
            setTimeout(() => {
                this.popupOverlay.style.display = 'none';
            }, 300);
        }
    }

    // =====================
    // Travelers Popup Functionality
    // =====================
    class TravelersManager {
        constructor() {
            this.initializeElements();
            this.setupEventListeners();
            this.updateChildrenButtons();
            this.updateTravelersDisplay();
        }

        initializeElements() {
            this.travelersDialog = document.querySelector('.travelers-input');
            this.travelersPopup = document.getElementById('travelers-popup');
            this.adultsCountElem = document.getElementById('adults-count');
            this.childrenCountElem = document.getElementById('children-count');
            this.childrenDecrementBtn = document.getElementById('children-decrement');
            this.childrenIncrementBtn = document.getElementById('children-increment');
            this.adultsIncrementBtn = document.getElementById('adults-increment');
            this.adultsDecrementBtn = document.getElementById('adults-decrement');

            this.adultsCount = parseInt(this.adultsCountElem.textContent);
            this.childrenCount = parseInt(this.childrenCountElem.textContent);
            this.isPopupOpen = false;
        }

        setupEventListeners() {
            this.travelersDialog.addEventListener('click', (e) => {
                e.stopPropagation();
                this.isPopupOpen ? this.closePopup() : this.openPopup();
            });

            document.addEventListener('click', (e) => {
                if (this.isPopupOpen && !this.travelersPopup.contains(e.target)) {
                    this.closePopup();
                }
            });

            // Adults counter listeners
            this.adultsIncrementBtn.addEventListener('click', () => {
                this.adultsCount++;
                this.adultsCountElem.textContent = this.adultsCount;
                this.updateTravelersDisplay();
            });

            this.adultsDecrementBtn.addEventListener('click', () => {
                if (this.adultsCount > 1) {
                    this.adultsCount--;
                    this.adultsCountElem.textContent = this.adultsCount;
                    this.updateTravelersDisplay();
                }
            });

            // Children counter listeners
            this.childrenIncrementBtn.addEventListener('click', () => {
                this.childrenCount++;
                this.childrenCountElem.textContent = this.childrenCount;
                this.updateChildrenButtons();
                this.updateTravelersDisplay();
            });

            this.childrenDecrementBtn.addEventListener('click', () => {
                if (this.childrenCount > 0) {
                    this.childrenCount--;
                    this.childrenCountElem.textContent = this.childrenCount;
                    this.updateChildrenButtons();
                }
                this.updateTravelersDisplay();
            });
        }

        openPopup() {
            this.travelersPopup.style.display = 'block';
            this.isPopupOpen = true;
            setTimeout(() => {
                this.travelersPopup.style.opacity = '1';
            }, 10);
        }

        closePopup() {
            this.travelersPopup.style.opacity = '0';
            setTimeout(() => {
                this.travelersPopup.style.display = 'none';
                this.isPopupOpen = false;
            }, 300);
        }

        updateChildrenButtons() {
            this.childrenDecrementBtn.disabled = this.childrenCount === 0;
        }

        updateTravelersDisplay() {
            const travelersDisplay = document.querySelector('.travelers-input div:nth-child(2)');
            const totalTravelers = this.adultsCount + this.childrenCount;
            travelersDisplay.textContent = `${totalTravelers} traveler${totalTravelers === 1 ? '' : 's'}`;
        }
    }

    // =====================
    // Initialize All Components
    // =====================
    new RegionManager();
    new TravelersManager();
    new GalleryPopup();
});
