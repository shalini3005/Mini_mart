/**
 * ==============================================================================
 * MINI MART - 10-DAY ROADMAP: DAY 1
 * ==============================================================================
 * 
 * 🎯 DAY 1 OBJECTIVES:
 * 1. Set up the script architecture using an IIFE (Immediately Invoked Function Expression).
 * 2. Define localStorage keys for all persistent data.
 * 3. Safely link to the catalog data defined in product.js.
 * 4. Create resilient LocalStorage helper functions (get/save for Cart, Wishlist, Users, Auth).
 * 5. Create a dynamic Star Rating rendering function.
 * 6. Build the badge counter updater to sync cart & favorite counts with the navbar.
 * 
 * ------------------------------------------------------------------------------
 * 10-DAY CURRICULUM PREVIEW:
 * - Day 1:  Foundation, LocalStorage Data Layer & Navbar Badges (THIS FILE)
 * - Day 2:  Product Card Component & Homepage Best Sellers
 * - Day 3:  Card Click Navigation & Global Search Interceptor
 * - Day 4:  Auth Modal Component & User Session Handling
 * - Day 5:  Add-to-Cart & Wishlist Toggle Interactions
 * - Day 6:  Products Catalog Page: Dynamic Category, Price & Rating Filters
 * - Day 7:  Catalog Sorting & Client-Side Pagination
 * - Day 8:  Product Details Page (Quantity Selector, Tabs & Related Products)
 * - Day 9:  Interactive Cart Page (Quantity +/- and Subtotal/Delivery Math)
 * - Day 10: Checkout Validation, Mock Order Creation & Success Screen
 * ==============================================================================
 */

(function () {
    "use strict";

    /* ==========================================================================
     * 1. STORAGE KEYS DEFINITION
     * ==========================================================================
     * Storing key strings in a central object prevents typos and makes future
     * key name updates easy to manage across the entire project.
     */
    const STORAGE_KEYS = {
        CART: "mini_mart_cart",               // Stores array of { id, quantity }
        FAVORITES: "mini_mart_favorites",     // Stores array of product IDs [1, 2, 5]
        USERS: "mini_mart_users",             // Stores array of registered user objects
        CURRENT_USER: "mini_mart_current_user", // Stores current logged-in user object
        LAST_ORDER: "mini_mart_last_order"    // Stores the most recent completed order
    };

    /* ==========================================================================
     * 2. PRODUCT CATALOG REFERENCE
     * ==========================================================================
     * mini mart loads product.js before script.js in HTML.
     * We safely verify that 'products' exists and is an array to prevent runtime crashes.
     */
    const catalog = (typeof products !== "undefined" && Array.isArray(products)) ? products : [];

    /**
     * Finds a single product object from the catalog by its numerical ID.
     * @param {number|string} id - The ID of the product.
     * @returns {Object|null} - Product object if found, otherwise null.
     */
    function getProductById(id) {
        return catalog.find(p => p.id === Number(id)) || null;
    }


    /* ==========================================================================
     * 3. LOCALSTORAGE HELPERS (SAFE GETTERS & SETTERS)
     * ==========================================================================
     * LocalStorage only stores strings. We must serialize objects to strings using
     * JSON.stringify() when saving, and parse them with JSON.parse() when reading.
     * Wrapping JSON.parse in try/catch protects our app from corrupted data in the browser.
     */

    // --- CART ---
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
        } catch (error) {
            console.error("Error reading cart from localStorage:", error);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        // Whenever cart changes, keep navbar badge numbers in sync
        updateNavbarBadges();
    }

    // --- FAVORITES (WISHLIST) ---
    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
        } catch (error) {
            console.error("Error reading favorites from localStorage:", error);
            return [];
        }
    }

    function saveFavorites(favs) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
        // Whenever favorites change, keep navbar badge numbers in sync
        updateNavbarBadges();
    }

    // --- REGISTERED USERS ---
    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        } catch (error) {
            console.error("Error reading users from localStorage:", error);
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // --- CURRENT USER SESSION ---
    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
        } catch (error) {
            console.error("Error reading current user session:", error);
            return null;
        }
    }

    function saveCurrentUser(user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    function logoutUser() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        // Refresh the page so navbar and auth state update immediately
        window.location.reload();
    }


    /* ==========================================================================
     * 4. UI UTILITIES
     * ==========================================================================
     */

    /**
     * Converts a numeric rating (e.g., 4.5) into FontAwesome star icons.
     * Rules:
     * - Math.floor(rating) determines how many full stars (fa-star) to render.
     * - (rating % 1 >= 0.5) checks if there is a half star (fa-star-half-stroke).
     * - The remainder up to 5 stars are empty stars (fa-regular fa-star).
     *
     * @param {number} rating - Decimal rating between 0 and 5
     * @returns {string} - HTML string containing FontAwesome icon tags
     */
    function renderStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalf = (rating % 1) >= 0.5;
        let html = "";

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                html += '<i class="fa-solid fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalf) {
                html += '<i class="fa-solid fa-star-half-stroke"></i>';
            } else {
                html += '<i class="fa-regular fa-star"></i>';
            }
        }
        return html;
    }


    /* ==========================================================================
     * 5. NAVBAR BADGES SYNC
     * ==========================================================================
     * Reads current cart and favorites from localStorage, calculates quantities,
     * and updates all badge elements on the page.
     */
    function updateNavbarBadges() {
        const cart = getCart();
        const favorites = getFavorites();

        // Total quantity is the sum of all item quantities in the cart
        const totalCartQty = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        // Total favorites is simply the length of the favorites ID list
        const totalFavs = favorites.length;

        // Update Cart badge counter in navbar
        document.querySelectorAll('a[href="cart.html"] .icon-badge, .cart-count').forEach(badge => {
            badge.textContent = totalCartQty;
        });

        // Update Favorites badge counter in navbar
        document.querySelectorAll('a[href="favo.html"] .icon-badge, .favorite-count').forEach(badge => {
            badge.textContent = totalFavs;
        });
    }


    /* ==========================================================================
     * 6. DAY 1 INITIALIZATION & VERIFICATION
     * ==========================================================================
     */
    function initDay1() {
        console.log("🚀 [Mini Mart] Day 1 Script Initialized successfully!");
        console.log("📦 Products in catalog:", catalog.length);
        console.log("🛒 Items currently in cart:", getCart().length);
        console.log("❤️ Items in favorites:", getFavorites().length);

        // Update badges immediately upon page load
        updateNavbarBadges();
    }

    // Run when the DOM content is fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initDay1);
    } else {
        initDay1();
    }

})();
