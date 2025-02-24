
// script.js
const CONFIG = {
    originalPrice: 5000,
    razorpayKey: 'rzp_test_WhSEV2SfARdFbR', // Your Razorpay key here
    formURL: 'https://cap70.com/mynuv/', // Your form URL
    promoCodes: {
        'NUV100': 100,  // 100% off
        'TEST50': 50,   // 50% off
        'SAVE25': 25    // 25% off
    }
};

let currentPrice = CONFIG.originalPrice;
let appliedDiscount = 0;

function updatePriceDisplay() {
    document.getElementById('originalPrice').textContent = CONFIG.originalPrice;
    document.getElementById('finalPrice').textContent = currentPrice;
    
    const discountBadge = document.getElementById('discountBadge');
    const proceedButton = document.getElementById('proceedButton');
    
    if (appliedDiscount > 0) {
        discountBadge.textContent = `${appliedDiscount}% OFF Applied!`;
        discountBadge.style.display = 'inline-block';
        
        if (currentPrice === 0) {
            proceedButton.textContent = 'Continue to Test (Free)';
            proceedButton.onclick = function() {
                window.location.href = CONFIG.formURL;
            };
        } else {
            proceedButton.textContent = `Pay ₹${currentPrice} and Continue to Test`;
            proceedButton.onclick = startPayment;
        }
    }
}

function showMessage(message, isError = false) {
    const messageDiv = document.getElementById('promoMessage');
    messageDiv.className = isError ? 'error-msg' : 'success-msg';
    messageDiv.textContent = message;
}

function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.trim().toUpperCase();
    
    if (!code) {
        showMessage('Please enter a promotional code', true);
        return;
    }

    const discount = CONFIG.promoCodes[code];
    
    if (discount === undefined) {
        showMessage('Invalid promotional code', true);
        return;
    }

    appliedDiscount = discount;
    currentPrice = Math.max(0, Math.round(CONFIG.originalPrice * (100 - discount) / 100));
    
    showMessage(`${discount}% discount applied successfully!`);
    updatePriceDisplay();
}

function startPayment() {
    if (currentPrice === 0) {
        window.location.href = CONFIG.formURL;
        return;
    }

    const options = {
        key: CONFIG.razorpayKey,
        amount: currentPrice * 100,
        currency: 'INR',
        name: 'Test Registration',
        description: 'Test Access Fee',
        handler: function(response) {
            // After successful payment, redirect to form
            window.location.href = CONFIG.formURL;
        }
    };
    
    const rzp = new Razorpay(options);
    rzp.open();
}

// Initialize price display
updatePriceDisplay();
