// ============================================
// SCALP MAX - Email Configuration (EmailJS)
// ============================================

// EmailJS Configuration
// Get these from: https://dashboard.emailjs.com/admin
const EMAILJS_SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';

// Supabase Configuration (for order storage)
const SUPABASE_URL = 'https://zswsccjobdycswgphhrl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzd3NjY2pvYmR5Y3N3Z3BoaHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4NDg1MDksImV4cCI6MjA4MzQyNDUwOX0.9kOt8bU67d23KCnsGskTu6Hg2guqUvlMTo4dP8_nJ9s';

// Export to global scope
if (typeof window !== 'undefined') {
    window.EMAILJS_SERVICE_ID = EMAILJS_SERVICE_ID;
    window.EMAILJS_TEMPLATE_ID = EMAILJS_TEMPLATE_ID;
    window.EMAILJS_PUBLIC_KEY = EMAILJS_PUBLIC_KEY;
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation helper (Indian phone numbers)
function isValidIndianPhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
}

// Load EmailJS SDK
function loadEmailJS() {
    return new Promise((resolve, reject) => {
        if (typeof emailjs !== 'undefined') {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialize EmailJS
async function initEmailJS() {
    try {
        await loadEmailJS();
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('✅ EmailJS initialized');
        return true;
    } catch (error) {
        console.error('❌ EmailJS load error:', error);
        return false;
    }
}

// Send order confirmation email
async function sendOrderConfirmationEmail(orderDetails) {
    try {
        const templateParams = {
            to_name: orderDetails.name,
            to_email: orderDetails.email,
            order_id: orderDetails.orderId,
            order_date: orderDetails.date,
            order_time: orderDetails.time,
            product_name: 'SCALP MAX Anti Dandruff Scalp Therapy Shampoo',
            quantity: orderDetails.quantity,
            total_amount: '₹' + orderDetails.total,
            shipping_address: `${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}`,
            payment_method: orderDetails.paymentMethod
        };
        
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
        
        console.log('✅ Email sent:', response.status);
        return { success: true, messageId: response.text };
    } catch (error) {
        console.error('❌ Email send error:', error);
        return { success: false, error: error.message };
    }
}

// Send admin notification email
async function sendAdminNotificationEmail(orderDetails) {
    try {
        const templateParams = {
            order_id: orderDetails.orderId,
            customer_name: orderDetails.name,
            customer_email: orderDetails.email,
            customer_phone: orderDetails.phone,
            shipping_address: `${orderDetails.address}, ${orderDetails.city}, ${orderDetails.state} - ${orderDetails.pincode}`,
            quantity: orderDetails.quantity,
            total_amount: '₹' + orderDetails.total,
            payment_method: orderDetails.paymentMethod,
            transaction_id: orderDetails.transactionId || 'N/A'
        };
        
        // Use a different template for admin notifications
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            'admin_notification_template', // Create this template in EmailJS
            templateParams
        );
        
        console.log('✅ Admin notification sent:', response.status);
        return { success: true };
    } catch (error) {
        console.error('❌ Admin notification error:', error);
        return { success: false, error: error.message };
    }
}

