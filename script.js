// ============================================
// SCALP MAX - Main JavaScript
// ============================================

// Load configuration
const SUPABASE_URL = 'https://zswsccjobdycswgphhrl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzd3NjY2pvYmR5Y3N3Z3BoaHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NDg1MDksImV4cCI6MjA4MzQyNDUwOX0.9kOt8bU67d23KCnsGskTu6Hg2guqUvlMTo4dP8_nJ9s';
const PRODUCT_PRICE = 499;
const PRODUCT_NAME = "SCALP MAX Anti Dandruff Scalp Therapy Shampoo";
const PRODUCT_SIZE = "300ml Bottle";

let cart = {
    quantity: 1,
    total: 499
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    updateCartCount();
    addScrollAnimations();
    initSmoothScroll();
    loadOrderFromStorage();
}

// ============================================
// CART FUNCTIONS
// ============================================
function addToCart() {
    cart.quantity = parseInt(document.getElementById('quantity').textContent);
    cart.total = cart.quantity * PRODUCT_PRICE;
    updateCartCount();
    saveCartToStorage();
    showToast('Added to cart successfully!');
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.quantity;
    }
    updateCartModal();
}

function viewCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.add('active');
        updateCartModal();
    }
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function updateCartModal() {
    const cartQuantity = document.getElementById('cartQuantity');
    const cartItemTotal = document.getElementById('cartItemTotal');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartQuantity) cartQuantity.textContent = cart.quantity;
    if (cartItemTotal) cartItemTotal.textContent = '₹' + (cart.quantity * PRODUCT_PRICE);
    if (cartTotal) cartTotal.textContent = '₹' + (cart.quantity * PRODUCT_PRICE);
}

function changeQuantity(change) {
    const quantityElement = document.getElementById('quantity');
    const totalPriceElement = document.getElementById('total-price');
    
    if (quantityElement && totalPriceElement) {
        let currentQuantity = parseInt(quantityElement.textContent);
        let newQuantity = currentQuantity + change;
        
        if (newQuantity >= 1 && newQuantity <= 10) {
            quantityElement.textContent = newQuantity;
            totalPriceElement.textContent = '₹' + (newQuantity * PRODUCT_PRICE);
        }
    }
}

function prepareOrder(event) {
    event.preventDefault();
    const quantity = parseInt(document.getElementById('quantity').textContent);
    const total = quantity * PRODUCT_PRICE;
    localStorage.setItem('orderQuantity', quantity);
    localStorage.setItem('orderTotal', total);
    window.location.href = 'checkout.html';
}

// ============================================
// LOCAL STORAGE - ORDER SAVING
// ============================================
function saveCartToStorage() {
    try {
        localStorage.setItem('cartData', JSON.stringify(cart));
    } catch (e) {
        console.error('Cart save error:', e);
    }
}

function loadOrderFromStorage() {
    try {
        const savedCart = localStorage.getItem('cartData');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartCount();
        }
    } catch (e) {
        console.error('Cart load error:', e);
    }
}

function saveOrderToLocal(orderData) {
    try {
        let orders = JSON.parse(localStorage.getItem('allOrders') || '[]');
        orders.unshift(orderData);
        localStorage.setItem('allOrders', JSON.stringify(orders));
        console.log('✅ Order saved locally:', orderData.orderId);
        return true;
    } catch (e) {
        console.error('❌ Local storage error:', e);
        return false;
    }
}

function getAllOrders() {
    try {
        return JSON.parse(localStorage.getItem('allOrders') || '[]');
    } catch (e) {
        console.error('Orders load error:', e);
        return [];
    }
}

// ============================================
// SUPABASE - ORDER SAVING
// ============================================
async function saveOrderToSupabase(orderData) {
    try {
        const orderRecord = {
            order_id: orderData.orderId || 'ORD' + Date.now(),
            name: orderData.name || '',
            email: orderData.email || '',
            phone: orderData.phone || '',
            address: orderData.address || '',
            city: orderData.city || '',
            state: orderData.state || '',
            pincode: orderData.pincode || '',
            quantity: orderData.quantity || '1',
            total: orderData.total || '0',
            payment: orderData.paymentMethod || 'COD',
            transaction_id: orderData.transactionId || '',
            status: orderData.status || 'New Order',
            created_at: new Date().toISOString(),
            date: orderData.date || new Date().toLocaleDateString('en-IN'),
            time: orderData.time || new Date().toLocaleTimeString('en-IN')
        };

        const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(orderRecord)
        });

        if (response.ok || response.status === 201) {
            return { success: true };
        } else {
            const errorText = await response.text();
            console.log('⚠️ Supabase save failed:', errorText);
            return { success: false, error: errorText };
        }
    } catch (error) {
        console.log('⚠️ Supabase save failed:', error.message);
        return { success: false, error: error.message };
    }
}

async function testSupabaseConnection() {
    const testOrder = {
        orderId: 'TEST-' + Date.now().toString().slice(-6),
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '9876543210',
        address: 'Test Address',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        quantity: '1',
        total: '499',
        paymentMethod: 'COD',
        transactionId: '',
        status: 'Test Order'
    };
    
    const result = await saveOrderToSupabase(testOrder);
    console.log('🧪 Supabase test result:', result);
    return result;
}

// ============================================
// ORDER PROCESSING
// ============================================
async function processOrder() {
    // Get form values
    const name = document.getElementById('customerName')?.value;
    const email = document.getElementById('customerEmail')?.value;
    const phone = document.getElementById('customerPhone')?.value;
    const address = document.getElementById('customerAddress')?.value;
    const city = document.getElementById('customerCity')?.value;
    const state = document.getElementById('customerState')?.value;
    const pincode = document.getElementById('customerPincode')?.value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked');
    const transactionId = document.getElementById('transactionId')?.value || '';
    
    // Validation
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
        showToast('Please fill in all required fields');
        return;
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        showToast('Please enter a valid Indian phone number');
        return;
    }
    
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
        showToast('Please enter a valid 6-digit PIN code');
        return;
    }
    
    // Get quantity and total
    const quantity = parseInt(document.getElementById('summaryQuantity')?.innerText || '1');
    const totalAmount = parseInt(document.getElementById('summaryTotal')?.innerText.replace('₹', '') || '499');
    
    // Generate order ID
    const orderId = 'SM' + Date.now().toString().slice(-8);
    const now = new Date();
    
    // Create order object
    const orderDetails = {
        orderId: orderId,
        name: name,
        email: email,
        phone: phone,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        quantity: quantity,
        total: totalAmount,
        paymentMethod: paymentMethod?.value || 'COD',
        transactionId: transactionId,
        date: now.toLocaleDateString('en-IN'),
        time: now.toLocaleTimeString('en-IN'),
        status: 'New Order',
        createdAt: now.toISOString()
    };
    
    console.log('💾 Saving order:', orderDetails.orderId);
    
// Handle UPI payment separately
    if (paymentMethod?.value === 'upi') {
        // Process UPI order with proper flow
        await processUPIOrder(orderDetails);
        return;
    }
    
    // For COD orders - use the already generated order ID
    orderDetails.status = 'New Order';
    
    // Save to local storage FIRST
    saveOrderToLocal(orderDetails);
    
    // Try Supabase as backup
    const supabaseResult = await saveOrderToSupabase(orderDetails);
    if (supabaseResult.success) {
        console.log('✅ Order also saved to Supabase');
    } else {
        console.log('⚠️ Supabase backup failed (order saved locally)');
    }
    
    // Save order details for thank you page
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    
    // Show success message
    showToast('Order placed successfully!');
    
    // Redirect to thank you page
    setTimeout(function() {
        window.location.href = 'thank-you.html';
    }, 2000);
}

// Generate UPI payment link
function generateUPILink(orderDetails) {
    const upiId = 'saibalajisinghrajput@oksbi';
    const amount = orderDetails.total;
    const note = `SCALP MAX Order ${orderDetails.orderId}`;
    
    return `upi://pay?pa=${upiId}&pn=SCALP%20MAX&am=${amount}&tn=${encodeURIComponent(note)}`;
}

// Process UPI order with proper flow
async function processUPIOrder(orderDetails) {
    // Generate order ID if not already set
    if (!orderDetails.orderId) {
        orderDetails.orderId = 'SM' + Date.now().toString().slice(-8);
    }
    orderDetails.status = 'Payment Pending';
    orderDetails.paymentMethod = 'UPI';
    
    const now = new Date();
    orderDetails.date = now.toLocaleDateString('en-IN');
    orderDetails.time = now.toLocaleTimeString('en-IN');
    orderDetails.createdAt = now.toISOString();
    
    // Save to localStorage immediately
    saveOrderToLocal(orderDetails);
    
    // Try to save to Supabase
    await saveOrderToSupabase(orderDetails);
    
    // Generate UPI link
    const upiLink = generateUPILink(orderDetails);
    
    // Open UPI payment in new tab
    window.open(upiLink, '_blank');
    
    // Save order details for thank you page
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    
    // Redirect to thank you page
    showToast('UPI payment opened! Complete payment and confirm on next page.');
    setTimeout(function() {
        window.location.href = 'thank-you.html';
    }, 2000);
}

// Confirm UPI payment (called from thank-you page)
function confirmPayment() {
    const orderDetails = localStorage.getItem('orderDetails');
    if (orderDetails) {
        const order = JSON.parse(orderDetails);
        
        // Update order status
        order.status = 'Payment Confirmed';
        
        // Save updated order
        localStorage.setItem('orderDetails', JSON.stringify(order));
        
        // Update in orders list
        const allOrders = getAllOrders();
        const orderIndex = allOrders.findIndex(o => o.orderId === order.orderId);
        if (orderIndex !== -1) {
            allOrders[orderIndex].status = 'Payment Confirmed';
            localStorage.setItem('allOrders', JSON.stringify(allOrders));
        }
        
        // Try to update in Supabase
        updateOrderStatusInSupabase(order.orderId, 'Payment Confirmed');
        
        showToast('Payment confirmed! Your order is being processed.');
        
        // Update UI
        const confirmationDiv = document.getElementById('paymentConfirmation');
        if (confirmationDiv) {
            confirmationDiv.innerHTML = '<p style="color: #2e7d32;"><i class="fas fa-check-circle"></i> <strong>Payment Confirmed!</strong> Your order is being processed.</p>';
        }
        
        // Update status badge
        const statusBadge = document.getElementById('orderStatus');
        if (statusBadge) {
            statusBadge.textContent = 'Payment Confirmed';
            statusBadge.style.background = '#e8f5e9';
            statusBadge.style.color = '#2e7d32';
        }
    }
}

// Update order status in Supabase
async function updateOrderStatusInSupabase(orderId, newStatus) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?order_id=eq.${orderId}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            console.log('✅ Order status updated in Supabase');
        }
    } catch (error) {
        console.log('⚠️ Failed to update status in Supabase:', error.message);
    }
}

// ============================================
// CHECKOUT PAGE FUNCTIONS
// ============================================
function initCheckoutPage() {
    const quantity = localStorage.getItem('orderQuantity') || 1;
    const total = localStorage.getItem('orderTotal') || 499;
    updateOrderSummary(quantity, total);
    initCheckoutForm();
}

function updateOrderSummary(quantity, total) {
    const summaryQuantity = document.getElementById('summaryQuantity');
    const summaryTotal = document.getElementById('summaryTotal');
    const subtotal = document.getElementById('subtotal');
    
    if (summaryQuantity) summaryQuantity.textContent = quantity;
    if (summaryTotal) summaryTotal.textContent = '₹' + total;
    if (subtotal) subtotal.textContent = '₹' + total;
}

function initCheckoutForm() {
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            processOrder();
        });
    }
}

// ============================================
// UI FUNCTIONS
// ============================================
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('active');
        setTimeout(function() {
            toast.classList.remove('active');
        }, 3000);
    } else {
        alert(message);
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    const allFaqItems = document.querySelectorAll('.faq-item');
    allFaqItems.forEach(function(item) {
        item.classList.remove('active');
    });
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    const mobileMenu = document.getElementById('mobileMenu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                    }
                }
            }
        });
    });
}

function addScrollAnimations() {
    const fadeElements = document.querySelectorAll('.feature-card, .benefit-item, .ingredient-card, .step, .review-card, .faq-item');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(function(element) {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.padding = '15px 0';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// ============================================
// MODAL CLOSE ON OUTSIDE CLICK
// ============================================
document.addEventListener('click', function(event) {
    const modal = document.getElementById('cartModal');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (modal && modal.classList.contains('active')) {
        if (!modal.contains(event.target) && !cartIcon.contains(event.target)) {
            modal.classList.remove('active');
        }
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('cartModal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    }
});

// ============================================
// EXPORT FUNCTIONS TO WINDOW
// ============================================
window.addToCart = addToCart;
window.viewCart = viewCart;
window.closeCart = closeCart;
window.changeQuantity = changeQuantity;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleFaq = toggleFaq;
window.prepareOrder = prepareOrder;
window.initCheckoutPage = initCheckoutPage;
window.processOrder = processOrder;
window.saveOrderToSupabase = saveOrderToSupabase;
window.saveOrderToLocal = saveOrderToLocal;
window.getAllOrders = getAllOrders;
window.showToast = showToast;
window.testSupabaseConnection = testSupabaseConnection;
window.processUPIOrder = processUPIOrder;
window.confirmPayment = confirmPayment;
window.generateUPILink = generateUPILink;
window.updateOrderStatusInSupabase = updateOrderStatusInSupabase;

// ============================================
// TEST FUNCTION (run testSupabase() in console)
// ============================================
// Uncomment below to enable auto-test mode when URL has ?test=true
// if (window.location.search.includes('test=true')) {
//     window.testSupabase = testSupabaseConnection;
//     console.log('🧪 To test Supabase, type: testSupabase() in console');
// }


// ============================================
// SCALP MAX - Order Storage Configuration
// ============================================
// 
// ORDERS ARE STORED IN TWO PLACES:
// 1. Local Storage (browser) - Primary storage
// 2. Supabase (cloud) - Backup storage
// 
// Supabase Table: orders
// ============================================

// Export Supabase config to global scope
if (typeof window !== 'undefined') {
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
}

