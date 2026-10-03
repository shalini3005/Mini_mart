/**
 * Mini Mart - Complete Frontend E-Commerce Engine
 * Centralized State Management, Reactive Rendering, Cart, Favorites,
 * Dynamic Filters & Sorting, Checkout, and Demo Authentication.
 */

(function () {
    "use strict";

    // --------------------------------------------------------------------------
    // 1. DATA HELPERS & LOCALSTORAGE WRAPPERS
    // --------------------------------------------------------------------------

    const STORAGE_KEYS = {
        CART: "mini_mart_cart",
        FAVORITES: "mini_mart_favorites",
        USERS: "mini_mart_users",
        CURRENT_USER: "mini_mart_current_user",
        LAST_ORDER: "mini_mart_last_order"
    };

    // Safe reference to product catalog
    const catalog = (typeof products !== "undefined" && Array.isArray(products)) ? products : [];

    function getProductById(id) {
        return catalog.find(p => p.id === Number(id)) || null;
    }

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
        } catch (e) {
            console.error("Failed to read cart from localStorage", e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
        updateNavbarBadges();
    }

    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
        } catch (e) {
            console.error("Failed to read favorites from localStorage", e);
            return [];
        }
    }

    function saveFavorites(favs) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
        updateNavbarBadges();
    }

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
        } catch (e) {
            return null;
        }
    }

    function saveCurrentUser(user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        updateNavbarAuth();
    }

    function logoutUser() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        updateNavbarAuth();
        window.location.reload();
    }

    // --------------------------------------------------------------------------
    // 2. UI UTILITIES & TEMPLATES
    // --------------------------------------------------------------------------

    // Shows a floating auth-required modal with login / register links
    function showAuthModal(action) {
        // Remove any existing modal
        const existing = document.getElementById("auth-required-modal");
        if (existing) existing.remove();

        const modal = document.createElement("div");
        modal.id = "auth-required-modal";
        modal.innerHTML = `
            <div class="auth-modal-overlay" id="authModalOverlay">
                <div class="auth-modal-box">
                    <button class="auth-modal-close" id="authModalClose" aria-label="Close">&times;</button>
                    <div class="auth-modal-icon"><i class="fa-solid fa-lock"></i></div>
                    <h3>Login Required</h3>
                    <p>You need to be logged in to ${action}.</p>
                    <div class="auth-modal-actions">
                        <a href="login.html" class="auth-btn-login">Login</a>
                        <a href="register.html" class="auth-btn-register">Register</a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const close = () => modal.remove();
        document.getElementById("authModalClose").addEventListener("click", close);
        document.getElementById("authModalOverlay").addEventListener("click", function(e) {
            if (e.target === this) close();
        });
        document.addEventListener("keydown", function handler(e) {
            if (e.key === "Escape") { close(); document.removeEventListener("keydown", handler); }
        });
    }

    function renderStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
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

    function renderProductCard(p) {
        const favorites = getFavorites();
        const isFav = favorites.includes(p.id);
        const heartClass = isFav ? "fa-solid fa-heart text-danger" : "fa-regular fa-heart";

        return `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                <div class="card product-card h-100" data-id="${p.id}" style="cursor: pointer;">
                    <div class="product-img-box position-relative">
                        <img src="${p.image}" class="card-img-top" alt="${p.name}" loading="lazy">
                        <button class="favorite-btn" type="button" data-id="${p.id}" title="${isFav ? 'Remove from favorites' : 'Add to favorites'}">
                            <i class="${heartClass}"></i>
                        </button>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <p class="product-category">${p.category}</p>
                        <h5 class="card-title text-truncate-2" title="${p.name}">${p.name}</h5>
                        <div class="rating">
                            ${renderStarRating(p.rating)}
                            <span>${p.rating.toFixed(1)}</span>
                        </div>
                        <h4 class="product-price">₹${p.price}</h4>
                        <button class="btn add-cart-btn mt-auto" type="button" data-id="${p.id}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // --------------------------------------------------------------------------
    // 3. CART & FAVORITES LOGIC
    // --------------------------------------------------------------------------

    function addToCart(productId, quantity = 1, buttonElement = null) {
        // Auth guard
        if (!getCurrentUser()) {
            showAuthModal("add items to cart");
            return;
        }

        const id = Number(productId);
        const product = getProductById(id);
        if (!product) return;

        const cart = getCart();
        const existingIndex = cart.findIndex(item => item.id === id);

        if (existingIndex > -1) {
            cart[existingIndex].quantity += quantity;
        } else {
            cart.push({ id, quantity });
        }

        saveCart(cart);

        // Visual feedback on button
        if (buttonElement) {
            const originalText = buttonElement.innerHTML;
            buttonElement.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
            buttonElement.classList.add("btn-success");
            buttonElement.disabled = true;

            setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.classList.remove("btn-success");
                buttonElement.disabled = false;
            }, 1000);
        }
    }

    function toggleFavorite(productId, buttonElement) {
        // Auth guard
        if (!getCurrentUser()) {
            showAuthModal("add items to favorites");
            return;
        }

        const id = Number(productId);
        if (!id) return;

        let favorites = getFavorites().map(Number);
        const index = favorites.indexOf(id);
        const isAdding = (index === -1);

        if (isAdding) {
            favorites.push(id);
        } else {
            favorites.splice(index, 1);
        }

        saveFavorites(favorites);

        const newIconHtml = isAdding
            ? '<i class="fa-solid fa-heart text-danger"></i>'
            : '<i class="fa-regular fa-heart"></i>';
        const newTitle = isAdding ? "Remove from favorites" : "Add to favorites";

        // Update all matching favorite buttons for this product on the page
        const matchingButtons = document.querySelectorAll(
            `.favorite-btn[data-id="${id}"], .favorite-detail-btn[data-id="${id}"]`
        );

        matchingButtons.forEach(btn => {
            btn.innerHTML = newIconHtml;
            btn.setAttribute("title", newTitle);
        });

        // Also update buttonElement if passed and not already in matchingButtons
        if (buttonElement && !Array.from(matchingButtons).includes(buttonElement)) {
            buttonElement.innerHTML = newIconHtml;
            buttonElement.setAttribute("title", newTitle);
        }
    }





    // --------------------------------------------------------------------------
    // 4. NAVBAR STATE: BADGES, AUTH, SEARCH
    // --------------------------------------------------------------------------

    function updateNavbarBadges() {
        const cart = getCart();
        const favorites = getFavorites();

        const totalCartQty = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        const totalFavs = favorites.length;

        // Update cart badge
        document.querySelectorAll('a[href="cart.html"] .icon-badge, .cart-count').forEach(badge => {
            badge.textContent = totalCartQty;
        });

        // Update favorites badge
        document.querySelectorAll('a[href="favo.html"] .icon-badge, .favorite-count').forEach(badge => {
            badge.textContent = totalFavs;
        });
    }

    function updateNavbarAuth() {
        const currentUser = getCurrentUser();
        const loginContainers = document.querySelectorAll('.navbar-nav.mb-2.mb-lg-0, .navbar-nav:has(a[href="login.html"])');

        loginContainers.forEach(container => {
            const loginLink = container.querySelector('a[href="login.html"]');
            if (!loginLink && !container.querySelector('#logoutBtn')) return;

            if (currentUser) {
                container.innerHTML = `
                    <li class="nav-item d-flex align-items-center me-2">
                        <span class="nav-link fw-semibold text-dark">
                            <i class="fa-regular fa-circle-user me-1"></i> Hi, ${currentUser.firstName || 'User'}
                        </span>
                    </li>
                    <li class="nav-item">
                        <button type="button" class="btn btn-outline-danger btn-sm my-1" id="logoutBtn">
                            Logout
                        </button>
                    </li>
                `;
                const logoutBtn = container.querySelector('#logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener("click", logoutUser);
                }
            } else {
                container.innerHTML = `
                    <li class="nav-item">
                        <a class="nav-link" href="login.html">Login</a>
                    </li>
                `;
            }
        });
    }

    function initGlobalSearch() {
        document.querySelectorAll(".search-box").forEach(form => {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                const input = form.querySelector('input[type="search"]');
                const query = input ? input.value.trim() : "";
                if (query) {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                } else {
                    window.location.href = "products.html";
                }
            });
        });
    }

    function initCardClickNavigation() {
        document.addEventListener("click", function (e) {
            const card = e.target.closest(".product-card");
            if (!card) return;

            // Prevent redirect if clicking favorite or add-to-cart buttons
            if (e.target.closest(".favorite-btn") || e.target.closest(".add-cart-btn")) {
                return;
            }

            const productId = card.getAttribute("data-id");
            if (productId) {
                window.location.href = `product.html?id=${productId}`;
            }
        });
    }

    // --------------------------------------------------------------------------
    // 5. PAGE CONTROLLER: HOMEPAGE (index.html)
    // --------------------------------------------------------------------------

    function initHomePage() {
        const bestSellerContainer = document.getElementById("bestSellerContainer");
        if (!bestSellerContainer) return;

        const bestSellers = catalog.filter(p => p.bestSeller === true);

        if (bestSellers.length > 0) {
            bestSellerContainer.innerHTML = bestSellers.map(renderProductCard).join("");
        } else {
            bestSellerContainer.innerHTML = '<p class="text-center text-muted">No best sellers available.</p>';
        }

        // Attach event delegation for buttons inside best-seller container
        bestSellerContainer.addEventListener("click", function (e) {
            const cartBtn = e.target.closest(".add-cart-btn");
            if (cartBtn) {
                e.preventDefault();
                e.stopPropagation();
                const id = cartBtn.getAttribute("data-id");
                addToCart(id, 1, cartBtn);
                return;
            }

            const favBtn = e.target.closest(".favorite-btn");
            if (favBtn) {
                e.preventDefault();
                e.stopPropagation();
                const id = favBtn.getAttribute("data-id");
                toggleFavorite(id, favBtn);
                return;
            }
        });

        // View more button navigation
        const viewMoreBtn = document.getElementById("btn-more");
        if (viewMoreBtn && viewMoreBtn.tagName === "BUTTON") {
            viewMoreBtn.addEventListener("click", () => {
                window.location.href = "products.html";
            });
        }
    }

    // --------------------------------------------------------------------------
    // 6. PAGE CONTROLLER: PRODUCTS CATALOG (products.html)
    // --------------------------------------------------------------------------

    function initProductsPage() {
        const container = document.getElementById("productsContainer");
        if (!container) return;

        const sortSelect = document.getElementById("sort");
        const clearBtn = document.getElementById("clearFilters");
        const applyBtn = document.getElementById("applyFilters");
        const countText = document.getElementById("productCountText");
        const paginationList = document.getElementById("paginationList");

        const PRODUCTS_PER_PAGE = 8;
        let currentPage = 1;
        let currentFiltered = [];

        // Parse URL params
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get("category");
        const searchParam = urlParams.get("search");

        // Set search input value if param exists
        if (searchParam) {
            document.querySelectorAll('.search-box input[type="search"]').forEach(input => {
                input.value = searchParam;
            });
        }

        // Check category checkbox if param exists
        if (categoryParam) {
            const categoryCheckbox = document.querySelector(`.filter-group input[type="checkbox"][value="${categoryParam.toLowerCase()}"]`);
            if (categoryCheckbox) {
                categoryCheckbox.checked = true;
            }
        }

        function renderPage() {
            const totalPages = Math.ceil(currentFiltered.length / PRODUCTS_PER_PAGE);
            const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
            const end = start + PRODUCTS_PER_PAGE;
            const pageProducts = currentFiltered.slice(start, end);

            // Update product count text
            if (countText) {
                const showStart = currentFiltered.length === 0 ? 0 : start + 1;
                const showEnd = Math.min(end, currentFiltered.length);
                countText.innerHTML = `Showing <strong>${showStart}-${showEnd}</strong> of <strong>${currentFiltered.length}</strong> products`;
            }

            // Render product cards
            if (pageProducts.length > 0) {
                container.innerHTML = pageProducts.map(renderProductCard).join("");
            } else {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
                        <h4>No Products Found</h4>
                        <p class="text-muted">Try clearing some filters or search with different keywords.</p>
                        <button class="btn btn-outline-dark mt-2" id="resetFiltersInner">Reset Filters</button>
                    </div>
                `;
                const resetBtn = document.getElementById("resetFiltersInner");
                if (resetBtn) {
                    resetBtn.addEventListener("click", clearAllFilters);
                }
            }

            // Render pagination
            if (paginationList) {
                paginationList.innerHTML = "";

                // Previous button
                const prevLi = document.createElement("li");
                prevLi.className = `page-item${currentPage === 1 ? " disabled" : ""}`;
                prevLi.innerHTML = `<button class="page-link">Previous</button>`;
                prevLi.querySelector("button").addEventListener("click", () => {
                    if (currentPage > 1) { currentPage--; renderPage(); }
                });
                paginationList.appendChild(prevLi);

                // Page number buttons
                for (let i = 1; i <= totalPages; i++) {
                    const li = document.createElement("li");
                    li.className = `page-item${i === currentPage ? " active" : ""}`;
                    li.innerHTML = `<button class="page-link">${i}</button>`;
                    li.querySelector("button").addEventListener("click", () => {
                        currentPage = i;
                        renderPage();
                    });
                    paginationList.appendChild(li);
                }

                // Next button
                const nextLi = document.createElement("li");
                nextLi.className = `page-item${currentPage === totalPages || totalPages === 0 ? " disabled" : ""}`;
                nextLi.innerHTML = `<button class="page-link">Next</button>`;
                nextLi.querySelector("button").addEventListener("click", () => {
                    if (currentPage < totalPages) { currentPage++; renderPage(); }
                });
                paginationList.appendChild(nextLi);

                // Hide pagination if only 1 page
                paginationList.parentElement.parentElement.style.display = totalPages <= 1 ? "none" : "";
            }

            // Scroll to top of products
            container.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        function filterAndRenderProducts() {
            let filtered = [...catalog];

            // 1. Category Filter
            const checkedCategories = Array.from(
                document.querySelectorAll('.filter-group input[type="checkbox"]:checked')
            ).map(cb => cb.value.toLowerCase());

            if (checkedCategories.length > 0) {
                filtered = filtered.filter(p => {
                    const catLower = p.category.toLowerCase();
                    return checkedCategories.some(cat => catLower.includes(cat) || cat.includes(catLower));
                });
            }

            // 2. Price Range Filter
            const checkedPrice = document.querySelector('input[name="price"]:checked');
            if (checkedPrice) {
                const val = checkedPrice.value;
                if (val === "0-500") {
                    filtered = filtered.filter(p => p.price <= 500);
                } else if (val === "500-1000") {
                    filtered = filtered.filter(p => p.price >= 500 && p.price <= 1000);
                } else if (val === "1000-5000") {
                    filtered = filtered.filter(p => p.price >= 1000 && p.price <= 5000);
                } else if (val === "5000-10000") {
                    filtered = filtered.filter(p => p.price >= 5000 && p.price <= 10000);
                } else if (val === "10000+") {
                    filtered = filtered.filter(p => p.price >= 10000);
                }
            }

            // 3. Rating Filter
            const checkedRating = document.querySelector('input[name="rating"]:checked');
            if (checkedRating) {
                const minRating = parseFloat(checkedRating.value);
                if (minRating > 0) {
                    filtered = filtered.filter(p => p.rating >= minRating);
                }
            }

            // 4. Search Filter
            const currentSearch = (urlParams.get("search") || "").toLowerCase().trim();
            if (currentSearch) {
                filtered = filtered.filter(p => {
                    const nameMatch = p.name.toLowerCase().includes(currentSearch);
                    const catMatch = p.category.toLowerCase().includes(currentSearch);
                    const brandMatch = (p.brand || "").toLowerCase().includes(currentSearch);
                    return nameMatch || catMatch || brandMatch;
                });
            }

            // 5. Sorting
            const sortMode = sortSelect ? sortSelect.value : "default";
            if (sortMode === "low-high") {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortMode === "high-low") {
                filtered.sort((a, b) => b.price - a.price);
            } else if (sortMode === "a-z") {
                filtered.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortMode === "z-a") {
                filtered.sort((a, b) => b.name.localeCompare(a.name));
            } else if (sortMode === "rating") {
                filtered.sort((a, b) => b.rating - a.rating);
            }

            // Reset to page 1 on filter/sort change
            currentFiltered = filtered;
            currentPage = 1;
            renderPage();
        }

        function clearAllFilters() {
            document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => cb.checked = false);
            document.querySelectorAll('input[name="price"]').forEach(r => r.checked = false);
            document.querySelectorAll('input[name="rating"]').forEach(r => r.checked = false);
            if (sortSelect) sortSelect.value = "default";

            // Clear search param in URL without reload
            if (window.location.search) {
                window.history.replaceState({}, document.title, window.location.pathname);
                urlParams.delete("search");
                urlParams.delete("category");
                document.querySelectorAll('.search-box input[type="search"]').forEach(input => input.value = "");
            }

            filterAndRenderProducts();
        }

        // Event listeners
        if (applyBtn) {
            applyBtn.addEventListener("click", filterAndRenderProducts);
        }
        if (clearBtn) {
            clearBtn.addEventListener("click", clearAllFilters);
        }
        if (sortSelect) {
            sortSelect.addEventListener("change", filterAndRenderProducts);
        }

        // Live filter on category/price/rating change
        document.querySelectorAll('.filter-group input').forEach(input => {
            input.addEventListener("change", filterAndRenderProducts);
        });

        // Delegate add-to-cart & favorites
        container.addEventListener("click", function (e) {
            const cartBtn = e.target.closest(".add-cart-btn");
            if (cartBtn) {
                e.preventDefault();
                e.stopPropagation();
                const id = cartBtn.getAttribute("data-id");
                addToCart(id, 1, cartBtn);
                return;
            }

            const favBtn = e.target.closest(".favorite-btn");
            if (favBtn) {
                e.preventDefault();
                e.stopPropagation();
                const id = favBtn.getAttribute("data-id");
                toggleFavorite(id, favBtn);
                return;
            }
        });

        // Initial render
        filterAndRenderProducts();
    }

    // --------------------------------------------------------------------------
    // 7. PAGE CONTROLLER: PRODUCT DETAILS (product.html)
    // --------------------------------------------------------------------------

    function initProductDetailsPage() {
        const detailsSection = document.querySelector(".product-details-section");
        if (!detailsSection) return;

        const urlParams = new URLSearchParams(window.location.search);
        let productId = Number(urlParams.get("id")) || 1;
        let product = getProductById(productId);

        if (!product) {
            product = catalog[0];
            productId = product ? product.id : 1;
        }

        if (!product) return;

        // 1. Populate Main Details
        const mainImg = detailsSection.querySelector(".product-main-image img");
        if (mainImg) {
            mainImg.src = product.image;
            mainImg.alt = product.name;
        }

        const categoryEl = detailsSection.querySelector(".product-category");
        if (categoryEl) categoryEl.textContent = product.category;

        const nameEl = detailsSection.querySelector(".product-name");
        if (nameEl) nameEl.textContent = product.name;

        const ratingStars = detailsSection.querySelector(".product-rating");
        if (ratingStars) {
            const reviewsCount = product.reviews ? product.reviews.length : 0;
            ratingStars.innerHTML = `
                ${renderStarRating(product.rating)}
                <span>${product.rating.toFixed(1)}</span>
                <a href="#reviews">${reviewsCount} Reviews</a>
            `;
        }

        const priceEl = detailsSection.querySelector(".product-price");
        if (priceEl) priceEl.textContent = `₹${product.price}`;

        const stockEl = detailsSection.querySelector(".stock-text");
        if (stockEl) {
            const inStock = (product.stock || 0) > 0;
            stockEl.innerHTML = inStock
                ? '<i class="fa-solid fa-circle-check text-success"></i> In Stock'
                : '<i class="fa-solid fa-circle-xmark text-danger"></i> Out of Stock';
        }

        const descEl = detailsSection.querySelector(".product-description");
        if (descEl) descEl.textContent = product.description;

        // Quick details section
        const quickDetails = detailsSection.querySelector(".quick-details");
        if (quickDetails) {
            quickDetails.innerHTML = `
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Brand:</strong> ${product.brand || "Mini Mart"}</p>
                <p><strong>Availability:</strong> ${(product.stock || 0) > 0 ? "In Stock (" + product.stock + " available)" : "Out of Stock"}</p>
                <p><strong>Product ID:</strong> MM00${product.id}</p>
            `;
        }

        // 2. Quantity Counter
        const qtyBox = detailsSection.querySelector(".quantity-box");
        let quantity = 1;
        if (qtyBox) {
            const qtySpan = qtyBox.querySelector(".quantity");
            const btns = qtyBox.querySelectorAll(".qty-btn");
            const decreaseBtn = btns[0];
            const increaseBtn = btns[1];

            if (qtySpan) qtySpan.textContent = quantity;

            if (decreaseBtn) {
                decreaseBtn.addEventListener("click", () => {
                    if (quantity > 1) {
                        quantity--;
                        if (qtySpan) qtySpan.textContent = quantity;
                    }
                });
            }

            if (increaseBtn) {
                increaseBtn.addEventListener("click", () => {
                    const maxStock = product.stock || 99;
                    if (quantity < maxStock) {
                        quantity++;
                        if (qtySpan) qtySpan.textContent = quantity;
                    }
                });
            }
        }

        // 3. Add to Cart Button
        const addCartBtn = detailsSection.querySelector(".add-cart-detail-btn");
        if (addCartBtn) {
            addCartBtn.setAttribute("data-id", product.id);
            addCartBtn.addEventListener("click", () => {
                addToCart(product.id, quantity, addCartBtn);
            });
        }

        // 4. Favorite Button
        const favoriteBtn = detailsSection.querySelector(".favorite-detail-btn");
        if (favoriteBtn) {
            favoriteBtn.setAttribute("data-id", product.id);
            const favs = getFavorites().map(Number);
            const isFav = favs.includes(Number(product.id));
            favoriteBtn.innerHTML = isFav
                ? '<i class="fa-solid fa-heart text-danger"></i>'
                : '<i class="fa-regular fa-heart"></i>';
            favoriteBtn.setAttribute("title", isFav ? "Remove from favorites" : "Add to favorites");

            favoriteBtn.addEventListener("click", () => {
                toggleFavorite(product.id, favoriteBtn);
            });
        }

        // 5. Tabs: Description, Additional Details, Reviews
        const tabBtns = document.querySelectorAll(".product-tabs .tab-btn");
        const tabContents = document.querySelectorAll(".extra-details-section .tab-content");

        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                tabBtns.forEach(b => b.classList.remove("active"));
                tabContents.forEach(c => c.classList.remove("active"));

                btn.classList.add("active");
                const targetId = btn.getAttribute("data-tab");
                const targetContent = document.getElementById(targetId);
                if (targetContent) targetContent.classList.add("active");
            });
        });

        // Tab Content: Description
        const descTab = document.getElementById("description");
        if (descTab) {
            descTab.innerHTML = `
                <h3>Product Description</h3>
                <p>${product.description}</p>
                <p>All items sold on Mini Mart undergo stringent quality inspections to guarantee authenticity and customer satisfaction.</p>
            `;
        }

        // Tab Content: Details Table
        const detailsTab = document.getElementById("details");
        if (detailsTab) {
            let detailsRows = `<div><span>Brand</span><strong>${product.brand || "Mini Mart"}</strong></div>`;
            detailsRows += `<div><span>Category</span><strong>${product.category}</strong></div>`;

            if (product.details) {
                for (const [key, value] of Object.entries(product.details)) {
                    const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    detailsRows += `<div><span>${formattedKey}</span><strong>${value}</strong></div>`;
                }
            }

            detailsTab.innerHTML = `
                <h3>Additional Details</h3>
                <div class="details-table">${detailsRows}</div>
            `;
        }

        // Tab Content: Reviews
        const reviewsTab = document.getElementById("reviews");
        if (reviewsTab) {
            let reviewsHtml = "<h3>Customer Reviews</h3>";
            if (product.reviews && product.reviews.length > 0) {
                reviewsHtml += product.reviews.map(rev => `
                    <div class="review-card">
                        <div class="review-top">
                            <strong>${rev.name}</strong>
                            <div class="review-stars">
                                ${renderStarRating(rev.rating)}
                            </div>
                        </div>
                        <p>${rev.comment}</p>
                    </div>
                `).join("");
            } else {
                reviewsHtml += '<p class="text-muted">No reviews yet for this product.</p>';
            }
            reviewsTab.innerHTML = reviewsHtml;
        }

        // 6. Related Products
        const relatedContainer = document.getElementById("relatedProducts");
        if (relatedContainer) {
            let related = catalog.filter(p => p.category === product.category && p.id !== product.id);
            if (related.length === 0) {
                related = catalog.filter(p => p.id !== product.id).slice(0, 4);
            } else {
                related = related.slice(0, 4);
            }

            relatedContainer.innerHTML = related.map(renderProductCard).join("");

            relatedContainer.addEventListener("click", function (e) {
                const cartBtn = e.target.closest(".add-cart-btn");
                if (cartBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(cartBtn.getAttribute("data-id"), 1, cartBtn);
                    return;
                }
                const favBtn = e.target.closest(".favorite-btn");
                if (favBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(favBtn.getAttribute("data-id"), favBtn);
                    return;
                }
            });
        }
    }

    // --------------------------------------------------------------------------
    // 8. PAGE CONTROLLER: FAVORITES (favo.html)
    // --------------------------------------------------------------------------

    function initFavoritesPage() {
        const container = document.getElementById("favoritesContainer");
        const emptyBox = document.getElementById("emptyFavorites");
        if (!container) return;

        function renderFavorites() {
            const favIds = getFavorites();
            const favProducts = favIds.map(id => getProductById(id)).filter(Boolean);

            if (favProducts.length === 0) {
                container.innerHTML = "";
                container.classList.add("d-none");
                if (emptyBox) emptyBox.classList.remove("d-none");
                return;
            }

            container.classList.remove("d-none");
            if (emptyBox) emptyBox.classList.add("d-none");

            container.innerHTML = favProducts.map(p => `
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div class="card favorite-card h-100" data-id="${p.id}" style="cursor: pointer;">
                        <div class="favorite-img-box position-relative">
                            <img src="${p.image}" alt="${p.name}" loading="lazy">
                            <button class="remove-favorite-btn" type="button" data-id="${p.id}" title="Remove">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div class="card-body d-flex flex-column">
                            <p class="favorite-category">${p.category}</p>
                            <h5 class="favorite-title text-truncate-2" title="${p.name}">${p.name}</h5>
                            <div class="rating">
                                ${renderStarRating(p.rating)}
                                <span>${p.rating.toFixed(1)}</span>
                            </div>
                            <h4 class="favorite-price">₹${p.price}</h4>
                            <button class="btn move-cart-btn mt-auto" type="button" data-id="${p.id}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join("");
        }

        container.addEventListener("click", function (e) {
            // Remove Favorite
            const removeBtn = e.target.closest(".remove-favorite-btn");
            if (removeBtn) {
                e.preventDefault();
                e.stopPropagation();
                const id = Number(removeBtn.getAttribute("data-id"));
                toggleFavorite(id);
                renderFavorites();
                return;
            }

            // Move to Cart
            const moveCartBtn = e.target.closest(".move-cart-btn");
            if (moveCartBtn) {
                e.preventDefault();
                e.stopPropagation();
                const id = Number(moveCartBtn.getAttribute("data-id"));
                addToCart(id, 1, moveCartBtn);
                return;
            }

            // Click on card opens product details
            const card = e.target.closest(".favorite-card");
            if (card) {
                const id = card.getAttribute("data-id");
                window.location.href = `product.html?id=${id}`;
            }
        });

        renderFavorites();
    }

    // --------------------------------------------------------------------------
    // 9. PAGE CONTROLLER: CART (cart.html)
    // --------------------------------------------------------------------------

    function initCartPage() {
        const cartItemsContainer = document.getElementById("cartItemsContainer");
        if (!cartItemsContainer) return;

        const emptyCart = document.getElementById("emptyCart");
        const subtotalEl = document.getElementById("subtotal");
        const grandTotalEl = document.getElementById("grandTotal");
        const checkoutBtn = document.getElementById("checkoutBtn");
        const deliveryEl = document.getElementById("deliveryCharge");

        function renderCart() {
            const cart = getCart();

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = "";
                cartItemsContainer.classList.add("d-none");
                if (emptyCart) emptyCart.classList.remove("d-none");

                if (subtotalEl) subtotalEl.textContent = "₹0";
                if (deliveryEl) deliveryEl.textContent = "₹0";
                if (grandTotalEl) grandTotalEl.textContent = "₹0";
                if (checkoutBtn) {
                    checkoutBtn.classList.add("disabled");
                    checkoutBtn.setAttribute("aria-disabled", "true");
                    checkoutBtn.style.pointerEvents = "none";
                    checkoutBtn.style.opacity = "0.5";
                }
                return;
            }

            cartItemsContainer.classList.remove("d-none");
            if (emptyCart) emptyCart.classList.add("d-none");
            if (checkoutBtn) {
                checkoutBtn.classList.remove("disabled");
                checkoutBtn.removeAttribute("aria-disabled");
                checkoutBtn.style.pointerEvents = "auto";
                checkoutBtn.style.opacity = "1";
            }

            let subtotal = 0;

            cartItemsContainer.innerHTML = cart.map(item => {
                const product = getProductById(item.id);
                if (!product) return "";

                const itemTotal = product.price * item.quantity;
                subtotal += itemTotal;

                return `
                    <div class="cart-item" data-id="${product.id}">
                        <div class="cart-img" style="cursor: pointer;">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="cart-details">
                            <h5 style="cursor: pointer;">${product.name}</h5>
                            <p class="cart-category">${product.category}</p>
                            <h4 class="cart-price">₹${product.price}</h4>
                            <div class="quantity-box">
                                <button class="qty-btn decrease-btn" type="button" data-id="${product.id}">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="qty-btn increase-btn" type="button" data-id="${product.id}">+</button>
                            </div>
                        </div>
                        <div class="cart-actions">
                            <button class="remove-btn" type="button" data-id="${product.id}" title="Remove item">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                            <p class="item-total">₹${itemTotal}</p>
                        </div>
                    </div>
                `;
            }).join("");

            const delivery = subtotal > 0 ? 50 : 0;
            const grandTotal = subtotal + delivery;

            if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
            if (deliveryEl) deliveryEl.textContent = `₹${delivery}`;
            if (grandTotalEl) grandTotalEl.textContent = `₹${grandTotal}`;
        }

        cartItemsContainer.addEventListener("click", function (e) {
            const cart = getCart();

            // Increase Quantity
            const incBtn = e.target.closest(".increase-btn");
            if (incBtn) {
                const id = Number(incBtn.getAttribute("data-id"));
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity++;
                    saveCart(cart);
                    renderCart();
                }
                return;
            }

            // Decrease Quantity
            const decBtn = e.target.closest(".decrease-btn");
            if (decBtn) {
                const id = Number(decBtn.getAttribute("data-id"));
                const itemIndex = cart.findIndex(i => i.id === id);
                if (itemIndex > -1) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity--;
                    } else {
                        cart.splice(itemIndex, 1);
                    }
                    saveCart(cart);
                    renderCart();
                }
                return;
            }

            // Remove Item
            const removeBtn = e.target.closest(".remove-btn");
            if (removeBtn) {
                const id = Number(removeBtn.getAttribute("data-id"));
                const updatedCart = cart.filter(i => i.id !== id);
                saveCart(updatedCart);
                renderCart();
                return;
            }

            // Click title or image to open details
            const imgOrTitle = e.target.closest(".cart-img, h5");
            if (imgOrTitle) {
                const cartItem = e.target.closest(".cart-item");
                if (cartItem) {
                    const id = cartItem.getAttribute("data-id");
                    window.location.href = `product.html?id=${id}`;
                }
            }
        });

        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", function (e) {
                if (!getCurrentUser()) {
                    e.preventDefault();
                    showAuthModal("proceed to checkout");
                }
            });
        }

        renderCart();
    }

    // --------------------------------------------------------------------------
    // 10. PAGE CONTROLLER: CHECKOUT (checkout.html)
    // --------------------------------------------------------------------------

    function initCheckoutPage() {
        const checkoutForm = document.getElementById("checkoutForm");
        const checkoutItems = document.getElementById("checkoutItems");
        if (!checkoutItems) return;

        if (!getCurrentUser()) {
            window.location.href = "login.html";
            return;
        }

        const cart = getCart();
        const subtotalEl = document.getElementById("checkoutSubtotal");
        const deliveryEl = document.getElementById("checkoutDelivery");
        const discountEl = document.getElementById("checkoutDiscount");
        const totalEl = document.getElementById("checkoutTotal");
        const placeOrderBtn = document.getElementById("placeOrderBtn");

        // 1. Populate items and totals
        if (cart.length === 0) {
            checkoutItems.innerHTML = '<p class="text-danger p-3 bg-light rounded">Your cart is empty. Please add items before checking out.</p>';
            if (placeOrderBtn) placeOrderBtn.disabled = true;
            if (subtotalEl) subtotalEl.textContent = "₹0";
            if (deliveryEl) deliveryEl.textContent = "₹0";
            if (discountEl) discountEl.textContent = "₹0";
            if (totalEl) totalEl.textContent = "₹0";
            return;
        }

        let subtotal = 0;
        checkoutItems.innerHTML = cart.map(item => {
            const product = getProductById(item.id);
            if (!product) return "";
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            return `
                <div class="checkout-product">
                    <div class="checkout-product-img">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="checkout-product-info">
                        <h6>${product.name}</h6>
                        <p>Qty: ${item.quantity} × ₹${product.price}</p>
                    </div>
                    <strong>₹${itemTotal}</strong>
                </div>
            `;
        }).join("");

        const delivery = 50;
        const discount = 0;
        const grandTotal = subtotal + delivery - discount;

        if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
        if (deliveryEl) deliveryEl.textContent = `₹${delivery}`;
        if (discountEl) discountEl.textContent = `₹${discount}`;
        if (totalEl) totalEl.textContent = `₹${grandTotal}`;

        // Pre-fill user details if logged in
        const currentUser = getCurrentUser();
        if (currentUser) {
            const nameInput = document.getElementById("checkoutName");
            const emailInput = document.getElementById("checkoutEmail");
            const phoneInput = document.getElementById("checkoutPhone");

            if (nameInput && !nameInput.value) {
                nameInput.value = `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim();
            }
            if (emailInput && !emailInput.value) {
                emailInput.value = currentUser.email || "";
            }
            if (phoneInput && !phoneInput.value && currentUser.phone) {
                phoneInput.value = currentUser.phone;
            }
        }

        // 2. Form Validation & Submission
        if (checkoutForm) {
            checkoutForm.addEventListener("submit", function (e) {
                e.preventDefault();

                if (cart.length === 0) {
                    alert("Your cart is empty!");
                    return;
                }

                let isValid = true;

                function validateField(inputId, errorId, validator, errorMsg) {
                    const input = document.getElementById(inputId);
                    const error = document.getElementById(errorId);
                    if (!input || !error) return true;

                    const val = input.value.trim();
                    if (!validator(val)) {
                        error.textContent = errorMsg;
                        input.classList.add("is-invalid");
                        isValid = false;
                        return false;
                    } else {
                        error.textContent = "";
                        input.classList.remove("is-invalid");
                        return true;
                    }
                }

                validateField("checkoutName", "checkoutNameError", v => v.length >= 2, "Please enter your full name.");
                validateField("checkoutPhone", "checkoutPhoneError", v => /^\d{10}$/.test(v), "Please enter a valid 10-digit phone number.");
                validateField("checkoutEmail", "checkoutEmailError", v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Please enter a valid email address.");
                validateField("checkoutAddress", "checkoutAddressError", v => v.length >= 5, "Please enter your full delivery address.");
                validateField("checkoutCity", "checkoutCityError", v => v.length >= 2, "Please enter your city.");
                validateField("checkoutState", "checkoutStateError", v => v.length >= 2, "Please select or enter your state.");
                validateField("checkoutPincode", "checkoutPincodeError", v => /^\d{6}$/.test(v), "Please enter a valid 6-digit pincode.");

                const selectedPayment = document.querySelector('input[name="payment"]:checked');
                if (!selectedPayment) {
                    alert("Please select a payment method.");
                    isValid = false;
                }

                if (!isValid) return;

                // Create Order
                const paymentLabels = {
                    cod: "Cash on Delivery",
                    upi: "UPI Payment",
                    card: "Debit / Credit Card"
                };

                const order = {
                    orderId: "#MM" + Math.floor(100000 + Math.random() * 900000),
                    total: grandTotal,
                    paymentMethod: selectedPayment ? (paymentLabels[selectedPayment.value] || selectedPayment.value) : "Cash on Delivery",
                    customer: {
                        name: document.getElementById("checkoutName").value.trim(),
                        email: document.getElementById("checkoutEmail").value.trim(),
                        phone: document.getElementById("checkoutPhone").value.trim()
                    },
                    items: cart,
                    date: new Date().toLocaleDateString()
                };

                localStorage.setItem(STORAGE_KEYS.LAST_ORDER, JSON.stringify(order));
                saveCart([]); // Clear cart
                window.location.href = "success.html";
            });
        }
    }

    // --------------------------------------------------------------------------
    // 11. PAGE CONTROLLER: ORDER SUCCESS (success.html)
    // --------------------------------------------------------------------------

    function initSuccessPage() {
        const orderBox = document.querySelector(".success-order-box");
        if (!orderBox) return;

        let lastOrder = null;
        try {
            lastOrder = JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_ORDER));
        } catch (e) {
            lastOrder = null;
        }

        if (lastOrder) {
            const orderIdEl = document.getElementById("successOrderId");
            const totalEl = document.getElementById("successTotal");
            const paymentEl = document.getElementById("successPayment");

            if (orderIdEl) orderIdEl.textContent = lastOrder.orderId;
            if (totalEl) totalEl.textContent = `₹${lastOrder.total}`;
            if (paymentEl) paymentEl.textContent = lastOrder.paymentMethod;
        }
    }

    // --------------------------------------------------------------------------
    // 12. PAGE CONTROLLER: AUTH (login.html & register.html)
    // --------------------------------------------------------------------------

    function initPasswordToggles() {
        document.querySelectorAll(".password-toggle").forEach(btn => {
            btn.addEventListener("click", function () {
                const input = btn.closest(".input-box").querySelector("input");
                const icon = btn.querySelector("i");
                if (!input) return;

                if (input.type === "password") {
                    input.type = "text";
                    if (icon) {
                        icon.classList.remove("fa-eye");
                        icon.classList.add("fa-eye-slash");
                    }
                } else {
                    input.type = "password";
                    if (icon) {
                        icon.classList.remove("fa-eye-slash");
                        icon.classList.add("fa-eye");
                    }
                }
            });
        });
    }

    function initRegisterPage() {
        const registerForm = document.getElementById("registerForm");
        if (!registerForm) return;

        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let isValid = true;

            function validate(id, errId, check, msg) {
                const el = document.getElementById(id);
                const err = document.getElementById(errId);
                if (!el || !err) return true;

                const val = el.type === "checkbox" ? el.checked : el.value.trim();
                if (!check(val)) {
                    err.textContent = msg;
                    el.classList.add("is-invalid");
                    isValid = false;
                } else {
                    err.textContent = "";
                    el.classList.remove("is-invalid");
                }
            }

            validate("firstName", "firstNameError", v => v.length >= 2, "First name is required.");
            validate("lastName", "lastNameError", v => v.length >= 1, "Last name is required.");
            validate("registerEmail", "registerEmailError", v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Valid email address is required.");
            validate("phone", "phoneError", v => /^\d{10}$/.test(v), "10-digit phone number is required.");
            validate("registerPassword", "registerPasswordError", v => v.length >= 8, "Password must be at least 8 characters.");

            const password = document.getElementById("registerPassword") ? document.getElementById("registerPassword").value : "";
            validate("confirmPassword", "confirmPasswordError", v => v && v === password, "Passwords do not match.");


            if (!isValid) return;

            const users = getUsers();
            const email = document.getElementById("registerEmail").value.trim().toLowerCase();

            if (users.some(u => u.email === email)) {
                const emailErr = document.getElementById("registerEmailError");
                if (emailErr) emailErr.textContent = "An account with this email already exists.";
                return;
            }

            const newUser = {
                firstName: document.getElementById("firstName").value.trim(),
                lastName: document.getElementById("lastName").value.trim(),
                email: email,
                phone: document.getElementById("phone").value.trim(),
                password: password
            };

            users.push(newUser);
            saveUsers(users);

            alert("Account created successfully! Redirecting to login...");
            window.location.href = "login.html";
        });
    }

    function initLoginPage() {
        const loginForm = document.getElementById("loginForm");
        if (!loginForm) return;

        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const emailInput = document.getElementById("loginEmail");
            const passInput = document.getElementById("loginPassword");
            const emailErr = document.getElementById("loginEmailError");
            const passErr = document.getElementById("loginPasswordError");

            if (emailErr) emailErr.textContent = "";
            if (passErr) passErr.textContent = "";

            const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
            const password = passInput ? passInput.value : "";

            let hasError = false;
            if (!email) {
                if (emailErr) emailErr.textContent = "Email is required.";
                hasError = true;
            }
            if (!password) {
                if (passErr) passErr.textContent = "Password is required.";
                hasError = true;
            }
            if (hasError) return;

            const users = getUsers();
            let matchedUser = users.find(u => u.email === email && u.password === password);

            // Default demo user fallback for test convenience
            if (!matchedUser && email === "user@minimart.com" && password === "password123") {
                matchedUser = {
                    firstName: "Demo",
                    lastName: "User",
                    email: "user@minimart.com",
                    phone: "9876543210"
                };
            }

            if (matchedUser) {
                saveCurrentUser({
                    firstName: matchedUser.firstName,
                    lastName: matchedUser.lastName,
                    email: matchedUser.email,
                    phone: matchedUser.phone
                });
                window.location.href = "index.html";
            } else {
                if (passErr) passErr.textContent = "Invalid email or password. Please try again.";
            }
        });
    }

    // --------------------------------------------------------------------------
    // 13. MASTER INITIALIZATION
    // --------------------------------------------------------------------------

    function init() {
        updateNavbarBadges();
        updateNavbarAuth();
        initGlobalSearch();
        initCardClickNavigation();
        initPasswordToggles();

        initHomePage();
        initProductsPage();
        initProductDetailsPage();
        initFavoritesPage();
        initCartPage();
        initCheckoutPage();
        initSuccessPage();
        initRegisterPage();
        initLoginPage();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

})();
