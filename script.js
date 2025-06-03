// ===== GLOBAL VARIABLES =====
let cart = [];
let cartCount = 0;
let totalPrice = 0;

// Tea menu data
const teaMenu = [
  {
    name: "Original Ice Tea",
    description: "Di buat dari daun teh dengan aroma khas yang menenangkan",
    price: 10000,
    priceText: "Rp 10.000",
    category: "tea",
  },
  {
    name: "Jasmine Tea",
    description:
      "teh harum dengan sentuhan bunga melati, menyegarkan dan menenangkan setiap tegukan.",
    price: 12000,
    priceText: "Rp 12.000",
    category: "jasmine-tea",
  },
  {
    name: "Lechyee Tea",
    description: "Nikmatnya teh di padukan dengan buah leci yang manis",
    price: 12000,
    priceText: "Rp 12.000",
    category: "lechyee-tea",
  },
  {
    name: "Lemon Tea",
    description: "Perpaduan teh yang menyegarkan dengan rasa lemon yang segar",
    price: 12000,
    priceText: "Rp 12.000",
    category: "lemon-tea",
  },
  {
    name: "Milk Tea",
    description: "Teh yang di padukan dengan susu yang nikmat",
    price: 11000,
    priceText: "Rp 11.000",
    category: "milk-tea",
  },
  {
    name: "Creamy Matcha Latte",
    description: "Teh yang di padukan dengan susu yang nikmat",
    price: 17000,
    priceText: "Rp 17.000",
    category: "matcha-latte",
  },
];

// ===== UTILITY FUNCTIONS =====
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#4CAF50" : "#f44336"};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 2000;
        font-weight: 500;
        animation: slideInRight 0.3s ease-out;
    `;

  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// ===== CART FUNCTIONS =====
function addToCart(name, price) {
  // Check if item already exists
  const existingItemIndex = cart.findIndex((item) => item.name === name);

  if (existingItemIndex !== -1) {
    // Update existing item
    cart[existingItemIndex].quantity += 1;
    cart[existingItemIndex].total =
      cart[existingItemIndex].price * cart[existingItemIndex].quantity;
  } else {
    // Add new item
    cart.push({
      name: name,
      price: price,
      priceText: formatCurrency(price),
      quantity: 1,
      total: price,
    });
  }

  saveCart(); // Save cart after modification
  updateCartDisplay();
  showNotification(`${name} berhasil ditambahkan ke keranjang!`);
}

function updateCartDisplay() {
  cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  totalPrice = cart.reduce((total, item) => total + item.total, 0);

  // Update cart count in navigation
  const cartLink = document.querySelector("nav ul li:last-child a");
  if (cartLink) {
    cartLink.textContent = `Keranjang (${cartCount})`;
  }
}

function showCart() {
  if (cart.length === 0) {
    showNotification("Keranjang masih kosong!", "error");
    return;
  }

  let cartHTML = `
        <div class="cart-modal">
            <div class="cart-content">
                <div class="cart-header">
                    <h3>Keranjang Belanja</h3>
                    <button onclick="closeCart()" class="close-btn">&times;</button>
                </div>
                <div class="cart-items">
    `;

  cart.forEach((item, index) => {
    cartHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.priceText} x ${item.quantity}</p>
                </div>
                <div class="item-controls">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQuantity(${index})">+</button>
                    <button onclick="removeFromCart(${index})" class="remove-btn">🗑️</button>
                </div>
                <div class="item-total">${formatCurrency(item.total)}</div>
            </div>
        `;
  });

  cartHTML += `
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <strong>Total: ${formatCurrency(totalPrice)}</strong>
                    </div>
                    <div class="cart-actions">
                        <button onclick="clearCart()" class="clear-btn">Kosongkan</button>
                        <button onclick="checkout()" class="checkout-btn">Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", cartHTML);

  // Add modal styles
  const style = document.createElement("style");
  style.textContent = `
        .cart-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3000;
            animation: fadeIn 0.3s ease-out;
        }
        .cart-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
        }
        .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
        }
        .cart-item {
            display: flex;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #f0f0f0;
            gap: 15px;
        }
        .item-info {
            flex: 1;
        }
        .item-info h4 {
            margin: 0 0 5px 0;
            color: #2d5016;
        }
        .item-info p {
            margin: 0;
            color: #666;
            font-size: 14px;
        }
        .item-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .item-controls button {
            width: 30px;
            height: 30px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
            border-radius: 4px;
        }
        .remove-btn {
            background: #ff4757 !important;
            color: white !important;
            border: none !important;
        }
        .item-total {
            font-weight: bold;
            color: #daa520;
            min-width: 80px;
            text-align: right;
        }
        .cart-footer {
            padding: 20px;
            border-top: 1px solid #eee;
        }
        .cart-total {
            text-align: center;
            margin-bottom: 15px;
            font-size: 18px;
            color: #2d5016;
        }
        .cart-actions {
            display: flex;
            gap: 10px;
        }
        .cart-actions button {
            flex: 1;
            padding: 12px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
        }
        .clear-btn {
            background: #ff4757;
            color: white;
        }
        .checkout-btn {
            background: #2d5016;
            color: white;
        }
    `;
  document.head.appendChild(style);
}

function closeCart() {
  const modal = document.querySelector(".cart-modal");
  if (modal) {
    modal.remove();
  }
}

function increaseQuantity(index) {
  cart[index].quantity += 1;
  cart[index].total = cart[index].price * cart[index].quantity;
  saveCart(); // Save after modification
  updateCartDisplay();
  showCart();
  closeCart();
}

function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
    cart[index].total = cart[index].price * cart[index].quantity;
  } else {
    cart.splice(index, 1);
  }
  saveCart(); // Save after modification
  updateCartDisplay();
  showCart();
  closeCart();
}

function removeFromCart(index) {
  const itemName = cart[index].name;
  cart.splice(index, 1);
  saveCart(); // Save after modification
  updateCartDisplay();
  showNotification(`${itemName} dihapus dari keranjang`);
  showCart();
  closeCart();
}

function clearCart() {
  if (confirm("Yakin ingin mengosongkan keranjang?")) {
    cart = [];
    saveCart(); // Save after modification
    updateCartDisplay();
    closeCart();
    showNotification("Keranjang berhasil dikosongkan");
  }
}

function checkout() {
  if (cart.length === 0) {
    showNotification("Keranjang kosong!", "error");
    return;
  }

  // Create payment modal
  const paymentModal = document.createElement("div");
  paymentModal.className = "payment-modal";
  paymentModal.innerHTML = `
    <div class="payment-content">
      <div class="payment-header">
        <h3>Pilih Metode Pembayaran</h3>
        <button onclick="closePaymentModal()" class="close-btn">&times;</button>
      </div>
      <div class="order-summary">
        <h4>Ringkasan Pesanan</h4>
        ${cart
          .map(
            (item) => `
          <div class="order-item">
            <span>${item.name} x${item.quantity}</span>
            <span>${formatCurrency(item.total)}</span>
          </div>
        `
          )
          .join("")}
        <div class="order-total">
          <strong>Total: ${formatCurrency(totalPrice)}</strong>
        </div>
      </div>
      <div class="payment-methods">
        <h4>Metode Pembayaran</h4>
        <div class="payment-options">
          <div class="payment-group">
            <h5>E-Wallet</h5>
            <button class="payment-btn" onclick="processPayment('GoPay')">
              <img src="https://i.pinimg.com/736x/fe/ce/b2/feceb2ca508603b06c2f7ba18a5d018d.jpg" alt="GoPay"> GoPay
            </button>
            <button class="payment-btn" onclick="processPayment('OVO')">
              <img src="https://i.pinimg.com/736x/76/1a/bf/761abfb9e4c628b0f4b9943c390e93b3.jpg" alt="OVO"> OVO
            </button>
            <button class="payment-btn" onclick="processPayment('ShopeePay')">
              <img src="https://i.pinimg.com/736x/d0/19/16/d019163d861908ed0046391ebfa42ce1.jpg" alt="ShopeePay"> ShopeePay
            </button>
            <button class="payment-btn" onclick="processPayment('DANA')">
              <img src="https://i.pinimg.com/736x/2f/09/d3/2f09d36f2d9613930ecb7351377bb756.jpg" alt="DANA"> Dana
            </button>
          </div>
          <div class="payment-group">
            <h5>Transfer Bank</h5>
            <button class="payment-btn" onclick="processPayment('BCA')">
              <img src="https://i.pinimg.com/736x/b5/b5/fb/b5b5fb49dfd972ec3b676f9ebe11706b.jpg" alt="BCA"> BCA
            </button>
            <button class="payment-btn" onclick="processPayment('Mandiri')">
              <img src="https://i.pinimg.com/736x/16/5d/36/165d3631292b958714f9829f20a02b17.jpg" alt="Mandiri"> Mandiri
            </button>
            <button class="payment-btn" onclick="processPayment('BNI')">
              <img src="https://i.pinimg.com/736x/2b/d3/1f/2bd31f32c7a4b0f58d2d7869a951ec8e.jpg" alt="BNI"> BNI
            </button>
          </div>
          <div class="payment-group">
            <h5>QRIS</h5>
            <button class="payment-btn qris" onclick="showQRIS()">
              <img src="https://i.pinimg.com/736x/43/41/38/434138932e81512fe14236d29f09c7c3.jpg" alt="QRIS"> Bayar dengan QRIS
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(paymentModal);

  // Add payment modal styles
  const style = document.createElement("style");
  style.textContent = `
    .payment-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3000;
    }
    .payment-content {
      background: white;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    .payment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    .order-summary {
      padding: 20px;
      background: #f8f9fa;
      border-bottom: 1px solid #eee;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      color: #666;
    }
    .order-total {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
      text-align: right;
      font-size: 1.1em;
    }
    .payment-methods {
      padding: 20px;
    }
    .payment-options {
      display: grid;
      gap: 20px;
    }
    .payment-group {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
    }
    .payment-group h5 {
      margin-bottom: 10px;
      color: #666;
    }
    .payment-btn {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 10px;
      margin: 5px 0;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .payment-btn:hover {
      background: #f0f0f0;
      transform: translateY(-2px);
    }
    .payment-btn img {
      height: 24px;
      width: 24px;
      margin-right: 10px;
      object-fit: contain;
    }
    .qris {
      background: #00a0e9;
      color: white;
      border: none;
    }
    .qris:hover {
      background: #0088cc;
    }
  `;
  document.head.appendChild(style);
}

function closePaymentModal() {
  const modal = document.querySelector(".payment-modal");
  if (modal) {
    modal.remove();
  }
}

function showQRIS() {
  const qrisModal = document.createElement("div");
  qrisModal.className = "qris-modal";
  qrisModal.innerHTML = `
    <div class="qris-content">
      <div class="qris-header">
        <h3>Scan QRIS</h3>
        <button onclick="closeQRISModal()" class="close-btn">&times;</button>
      </div>
      <div class="qris-body">
        <img src="https://i.pinimg.com/736x/8d/ba/5e/8dba5ef69e0a5401d0b207f4ca968a32.jpg" alt="QRIS Code" class="qris-image">
        <p class="qris-amount">Total: ${formatCurrency(totalPrice)}</p>
        <p class="qris-instruction">Scan QR code menggunakan aplikasi e-wallet atau mobile banking Anda</p>
      </div>
    </div>
  `;

  document.body.appendChild(qrisModal);

  // Add QRIS modal styles
  const style = document.createElement("style");
  style.textContent = `
    .qris-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3100;
    }
    .qris-content {
      background: white;
      border-radius: 12px;
      max-width: 400px;
      width: 90%;
      text-align: center;
      padding: 20px;
    }
    .qris-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .qris-image {
      width: 200px;
      height: 200px;
      margin: 20px auto;
    }
    .qris-amount {
      font-size: 1.2em;
      font-weight: bold;
      margin: 15px 0;
    }
    .qris-instruction {
      color: #666;
      margin-top: 15px;
    }
  `;
  document.head.appendChild(style);
}

function closeQRISModal() {
  const modal = document.querySelector(".qris-modal");
  if (modal) {
    modal.remove();
  }
}

function processPayment(method) {
  closePaymentModal();
  showNotification(
    `Pembayaran dengan ${method} berhasil! Pesanan Anda akan segera diproses.`
  );
  cart = [];
  saveCart(); // Save after clearing cart
  updateCartDisplay();
  closeCart();
}

// ===== NAVIGATION FUNCTIONS =====
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

function setupNavbarEffects() {
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector("nav");
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(45, 80, 22, 0.98)";
      navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.3)";
    } else {
      navbar.style.background = "rgba(45, 80, 22, 0.95)";
      navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
    }
  });
}

// ===== ANIMATION FUNCTIONS =====
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Add animation styles to elements
  const animatedElements = document.querySelectorAll(
    "section > div, #menu > div > div > div, #services > div > div > div"
  );
  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });
}

// ===== INTERACTIVE FEATURES =====
function setupMenuButtons() {
  const menuItems = document.querySelectorAll("#menu button");
  menuItems.forEach((button, index) => {
    const tea = teaMenu[index];
    if (tea) {
      button.addEventListener("click", () => {
        addToCart(tea.name, tea.price);
      });
    }
  });
}

function setupFAQToggle() {
  const faqItems = document.querySelectorAll("#faq > div > div");

  faqItems.forEach((item) => {
    const question = item.querySelector("h3");
    const answer = item.querySelector("p");

    // Initially hide all answers
    answer.style.display = "none";

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close all other items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
          otherItem.querySelector("p").style.display = "none";
          otherItem.querySelector("p").style.maxHeight = "0";
        }
      });

      // Toggle current item
      if (!isOpen) {
        item.classList.add("active");
        answer.style.display = "block";
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        item.classList.remove("active");
        answer.style.display = "none";
        answer.style.maxHeight = "0";
      }
    });
  });
}

function setupCartLink() {
  const cartLink = document.querySelector("nav ul li:last-child a");
  if (cartLink) {
    cartLink.addEventListener("click", (e) => {
      e.preventDefault();
      showCart();
    });
  }
}

// ===== FORM FUNCTIONS =====
function setupContactForm() {
  // If there's a contact form in the future
  const contactForms = document.querySelectorAll("form");
  contactForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      showNotification("Terima kasih! Pesan Anda telah terkirim.");
    });
  });
}

// ===== TYPING EFFECT =====
function typeWriter(element, text, speed = 80) {
  let i = 0;
  element.textContent = "";

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

function setupTypingEffect() {
  const heroTitle = document.querySelector("#home h1");
  if (heroTitle) {
    const originalText = heroTitle.textContent;
    setTimeout(() => {
      typeWriter(heroTitle, originalText);
    }, 1000);
  }
}

// ===== UTILITY FEATURES =====
function setupBackToTop() {
  // Create back to top button
  const backToTopBtn = document.createElement("button");
  backToTopBtn.innerHTML = "↑";
  backToTopBtn.id = "backToTop";
  backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #2d5016;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

  document.body.appendChild(backToTopBtn);

  // Show/hide based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.style.opacity = "1";
    } else {
      backToTopBtn.style.opacity = "0";
    }
  });

  // Scroll to top functionality
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function setupImagePlaceholders() {
  const images = document.querySelectorAll("#gallery img");
  images.forEach((img, index) => {
    img.style.backgroundColor = "#8fbc8f";
    img.style.color = "white";
    img.style.display = "flex";
    img.style.alignItems = "center";
    img.style.justifyContent = "center";
    img.style.fontSize = "14px";
    img.style.fontWeight = "bold";
    img.textContent = `Foto ${index + 1}`;
  });
}

// ===== LOADING FUNCTIONS =====
function showLoading() {
  const loader = document.createElement("div");
  loader.id = "loader";
  loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(45, 80, 22, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            color: white;
            font-size: 18px;
        ">
            <div style="text-align: center;">
                <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p>Memuat TeaBliss...</p>
            </div>
        </div>
    `;

  // Add spin animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
  document.head.appendChild(style);
  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.remove();
    }, 1500);
  }
}

// ===== INITIALIZATION =====
function initializeWebsite() {
  // Show loading screen
  showLoading();

  // Setup all functionality
  setupSmoothScrolling();
  setupNavbarEffects();
  setupScrollAnimations();
  setupMenuButtons();
  setupFAQToggle();
  setupCartLink();
  setupContactForm();
  setupTypingEffect();
  setupBackToTop();
  setupImagePlaceholders();

  // Setup menu categories if we're on the menu page
  if (document.querySelector(".menu-categories")) {
    setupMenuCategories();
  }

  // Hide loading screen
  hideLoading();

  // Welcome message
  setTimeout(() => {
    showNotification("Selamat datang di TeaBliss! 🍵");
  }, 2000);
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
  // Load cart data when page loads
  loadCart();

  // Initialize website functionality
  initializeWebsite();
});

// Handle page visibility changes to ensure cart is always up to date
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    loadCart(); // Reload cart data when page becomes visible
    showNotification("Selamat datang kembali! ☕");
  }
});

// Add beforeunload event listener to save cart before page unload
window.addEventListener("beforeunload", () => {
  saveCart();
});

// Navigation hide/show on scroll
let lastScrollTop = 0;
const navbar = document.querySelector("nav");
const scrollThreshold = 50;

window.addEventListener("scroll", () => {
  const currentScroll =
    window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
    // Scrolling down & past threshold
    navbar.classList.add("nav-hidden");
  } else {
    // Scrolling up or at top
    navbar.classList.remove("nav-hidden");
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// ===== EXPORT FOR TESTING (Optional) =====
// If running in Node.js environment for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    addToCart,
    cart,
    formatCurrency,
    teaMenu,
  };
}

// Menu category filtering
function setupMenuCategories() {
  const categoryButtons = document.querySelectorAll(".btn-category");
  const menuItems = document.querySelectorAll("#menu [data-category]");

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      const category = button.getAttribute("data-category");

      // Show/hide menu items based on category
      menuItems.forEach((item) => {
        if (
          category === "all" ||
          item.getAttribute("data-category") === category
        ) {
          item.style.display = "";
          item.style.animation = "fadeIn 0.5s ease-out";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

// Load cart data from localStorage
function loadCart() {
  const savedCart = localStorage.getItem("teablissCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartDisplay();
  }
}

// Save cart data to localStorage
function saveCart() {
  localStorage.setItem("teablissCart", JSON.stringify(cart));
}
