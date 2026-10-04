# 🛒 Mini Mart

A responsive, multi-page frontend e-commerce web application built with HTML, CSS, JavaScript, and Bootstrap 5.

---

## ✨ Features

- **Product Catalog**: Dynamic product listings with search, pagination, and multi-filter (category, price, rating).
- **Product Details**: Image showcase, stock status, specs table, and customer reviews.
- **Cart & Wishlist**: Real-time quantity controls, cost calculation, and persistent storage via `localStorage`.
- **Authentication**: User registration, login with form validation, password visibility toggle, and auth guards.
- **Checkout Flow**: Multi-field address validation, payment selection (COD, UPI, Card), and order confirmation.
- **Responsive**: Fully optimized for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5.3.8
- **Icons**: FontAwesome 6
- **Storage**: Browser LocalStorage

---

## 🚀 How to Run

1. Clone or download the repository.
2. Open `index.html` in your browser (or use VS Code **Live Server**).

---



## 📁 Project Structure

```text
mini_mart/
├── index.html       # Homepage
├── products.html    # Product listing & filters
├── product.html     # Single product details
├── cart.html        # Shopping cart
├── favo.html        # Favorites / Wishlist
├── checkout.html    # Checkout & delivery details
├── success.html     # Order confirmation
├── login.html       # Login page
├── register.html    # Registration page
├── product.js       # Product data catalog
├── script.js        # Core logic & state management
├── *.css            # Modular stylesheets
└── img/             # Images & media assets
