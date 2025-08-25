// Initialize Supabase
const SUPABASE_URL = 'https://rliwdosxsbauwxkayjoa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaXdkb3N4c2JhdXd4a2F5am9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMDA2NjIsImV4cCI6MjA2OTY3NjY2Mn0.uDvU9eX3Cy--D9l6daGaO2QMpn1YnxMJYVlbaeIgHu4';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global Variables
let currentUser = null;
let currentPage = 'home';

// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    app: document.getElementById('app'),
    authContainer: document.getElementById('authContainer'),
    dashboardContainer: document.getElementById('dashboardContainer'),
    loginPage: document.getElementById('loginPage'),
    registerPage: document.getElementById('registerPage'),
    navMenu: document.getElementById('navMenu'),
    overlay: document.getElementById('overlay'),
    menuBtn: document.getElementById('menuBtn'),
    logoutBtn: document.getElementById('logoutBtn')
};

// Loading Animation
function initializeLoadingAnimation() {
    const loadingText = document.getElementById('loadingText');
    const text = 'MMR GAMING SHOP';
    
    loadingText.innerHTML = '';
    
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.classList.add('loading-letter');
        span.style.animationDelay = `${index * 0.1}s`;
        span.textContent = char === ' ' ? '\u00A0' : char;
        loadingText.appendChild(span);
    });
    
    setTimeout(() => {
        elements.loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            elements.loadingScreen.style.display = 'none';
            elements.app.classList.remove('hidden');
            checkAuthState();
        }, 1000);
    }, 3000);
}

// Authentication Functions
async function checkAuthState() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            // Get user data from database
            const { data: userData } = await supabase
                .from('users')
                .select('*')
                .eq('email', user.email)
                .single();
            
            if (userData) {
                currentUser = userData;
                showDashboard();
                loadUserProfile();
            } else {
                showAuth();
            }
        } else {
            showAuth();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        showAuth();
    }
}

function showAuth() {
    elements.authContainer.classList.remove('hidden');
    elements.dashboardContainer.classList.add('hidden');
}

function showDashboard() {
    elements.authContainer.classList.add('hidden');
    elements.dashboardContainer.classList.remove('hidden');
    
    // Initialize ads when dashboard is shown
    setTimeout(() => {
        initializeAds();
    }, 1000);
    
    loadDashboardData();
}

// Login Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.querySelector('#loginForm button');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginLoader = document.getElementById('loginLoader');
    
    // Show loading state
    loginBtnText.textContent = 'လော့ဂ်အင်နေသည်...';
    loginLoader.classList.remove('hidden');
    loginBtn.disabled = true;
    loginBtn.classList.add('loading');
    
    try {
        // Check if user exists in our database
        const { data: users } = await supabase
            .from('users')
            .select('*')
            .eq('email', email);
        
        if (users && users.length > 0) {
            const user = users[0];
            
            // Simple password check (in production, use proper hashing)
            if (user.password === password) {
                currentUser = user;
                
                // Update last login
                await supabase
                    .from('users')
                    .update({ last_login: new Date().toISOString() })
                    .eq('id', user.id);
                
                showNotification('လော့ဂ်အင် အောင်မြင်ပါသည်!', 'success');
                showDashboard();
            } else {
                showNotification('Password မှားယွင်းနေပါသည်!', 'error');
            }
        } else {
            showNotification('အကောင့် မတွေ့ရှိပါ!', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('လော့ဂ်အင် မအောင်မြင်ပါ!', 'error');
    } finally {
        // Reset button state
        loginBtnText.textContent = 'လော့ဂ်အင်';
        loginLoader.classList.add('hidden');
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
    }
});

// Register Handler
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const registerBtn = document.querySelector('#registerForm button');
    const registerBtnText = document.getElementById('registerBtnText');
    const registerLoader = document.getElementById('registerLoader');
    
    // Show loading state
    registerBtnText.textContent = 'အကောင့်ဖွင့်နေသည်...';
    registerLoader.classList.remove('hidden');
    registerBtn.disabled = true;
    registerBtn.classList.add('loading');
    
    try {
        // Check if email already exists
        const { data: existingUsers } = await supabase
            .from('users')
            .select('email')
            .eq('email', email);
        
        if (existingUsers && existingUsers.length > 0) {
            showNotification('ဤ Gmail ကို အသုံးပြုပြီးသားဖြစ်ပါသည်!', 'error');
            return;
        }
        
        // Check if username already exists
        const { data: existingUsernames } = await supabase
            .from('users')
            .select('username')
            .eq('username', username);
        
        if (existingUsernames && existingUsernames.length > 0) {
            showNotification('ဤ Username ကို အသုံးပြုပြီးသားဖြစ်ပါသည်!', 'error');
            return;
        }
        
        // Create new user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{
                name: name,
                username: username,
                email: email,
                password: password, // In production, hash this password
                created_at: new Date().toISOString()
            }])
            .select()
            .single();
        
        if (error) throw error;
        
        showNotification('အකောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်!', 'success');
        
        // Auto login after successful registration
        currentUser = newUser;
        showDashboard();
        
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('အကောင့်ဖွင့်ခြင်း မအောင်မြင်ပါ!', 'error');
    } finally {
        // Reset button state
        registerBtnText.textContent = 'အကောင့်ဖွင့်ရန်';
        registerLoader.classList.remove('hidden');
        registerBtn.disabled = false;
        registerBtn.classList.remove('loading');
    }
});

// Auth Page Switchers
document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    elements.loginPage.classList.add('hidden');
    elements.registerPage.classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    elements.registerPage.classList.add('hidden');
    elements.loginPage.classList.remove('hidden');
});

// Navigation Functions
elements.menuBtn.addEventListener('click', () => {
    elements.navMenu.classList.toggle('active');
    elements.overlay.classList.toggle('active');
});

elements.overlay.addEventListener('click', () => {
    elements.navMenu.classList.remove('active');
    elements.overlay.classList.remove('active');
    closeAllModals();
});

elements.logoutBtn.addEventListener('click', logout);

// Logout Function
async function logout() {
    try {
        currentUser = null;
        showAuth();
        showNotification('လော့ဂ်အောက် အောင်မြင်ပါသည်!', 'success');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Navigation Menu Items
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        const page = item.getAttribute('data-page');
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show page
        showPage(page);
        
        // Close menu
        elements.navMenu.classList.remove('active');
        elements.overlay.classList.remove('active');
    });
});

// Page Navigation
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
        
        // Load page specific data
        switch(page) {
            case 'home':
                loadProducts();
                break;
            case 'news':
                loadNews();
                break;
            case 'shop':
                loadSellerContent();
                break;
            case 'history':
                loadOrderHistory();
                break;
            case 'profile':
                loadUserProfile();
                break;
        }
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    loadProducts();
    loadNews();
    loadUserProfile();
}

// Load Products
async function loadProducts() {
    try {
        const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });
        
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = '';
        
        if (products && products.length > 0) {
            products.forEach(product => {
                const productCard = createProductCard(product);
                productGrid.appendChild(productCard);
            });
        } else {
            productGrid.innerHTML = `
                <div class="col-span-full text-center py-20">
                    <div class="text-6xl mb-6 text-gray-500">
                        <i class="fas fa-box-open"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">ကုန်ပစ္စည်း မရှိသေးပါ</h3>
                    <p class="text-gray-400">မကြာမီ ထုတ်ကုန်အသစ်များ ရောက်ရှိပါမည်</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card cyber-card';
    card.innerHTML = `
        <div class="product-image">
            ${product.image_url ? 
                `<img src="${product.image_url}" alt="${product.name}" class="w-full h-full object-cover">` :
                `<i class="fas fa-gamepad"></i>`
            }
        </div>
        <div class="product-info">
            <h3 class="text-xl font-bold mb-2">${product.name}</h3>
            <p class="text-gray-300 mb-4 text-sm">${product.description || ''}</p>
            <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-cyan-400">${product.price} MMK</span>
                <button class="neon-btn text-sm px-4 py-2" onclick="showProductDetail(${product.id})">
                    ကြည့်ရှုရန်
                </button>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showProductDetail(product.id));
    
    return card;
}

// Load News
async function loadNews() {
    try {
        const { data: news } = await supabase
            .from('news')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });
        
        const newsGrid = document.getElementById('newsGrid');
        newsGrid.innerHTML = '';
        
        if (news && news.length > 0) {
            news.forEach(article => {
                const newsCard = createNewsCard(article);
                newsGrid.appendChild(newsCard);
            });
        } else {
            newsGrid.innerHTML = `
                <div class="text-center py-20">
                    <div class="text-6xl mb-6 text-gray-500">
                        <i class="fas fa-newspaper"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">သတင်း မရှိသေးပါ</h3>
                    <p class="text-gray-400">မကြာမီ သတင်းအသစ်များ ရောက်ရှိပါမည်</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading news:', error);
    }
}

// Create News Card
function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'cyber-card cursor-pointer';
    card.innerHTML = `
        <div class="flex items-start space-x-4">
            <div class="flex-shrink-0">
                ${article.image_url ? 
                    `<img src="${article.image_url}" alt="${article.title}" class="w-24 h-24 rounded-lg object-cover">` :
                    `<div class="w-24 h-24 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <i class="fas fa-newspaper text-white text-2xl"></i>
                    </div>`
                }
            </div>
            <div class="flex-1">
                <h3 class="text-xl font-bold text-white mb-2">${article.title}</h3>
                <p class="text-gray-300 text-sm mb-3 line-clamp-2">${article.content.substring(0, 100)}...</p>
                <div class="flex justify-between items-center text-sm text-gray-400">
                    <span>${new Date(article.created_at).toLocaleDateString('my-MM')}</span>
                    <span class="text-cyan-400 hover:text-cyan-300 cursor-pointer">ပိုမိုကြည့်ရှုရန် →</span>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showNewsDetail(article.id));
    
    return card;
}

// Load User Profile
function loadUserProfile() {
    if (currentUser) {
        // Update navigation avatar and name
        document.getElementById('navUsername').textContent = currentUser.name;
        
        // Update profile form
        if (document.getElementById('profileName')) {
            document.getElementById('profileName').value = currentUser.name || '';
            document.getElementById('profileUsername').value = currentUser.username || '';
            document.getElementById('profileEmail').value = currentUser.email || '';
        }
        
        // Update profile image if exists
        if (currentUser.profile_image) {
            const avatars = document.querySelectorAll('.avatar');
            avatars.forEach(avatar => {
                avatar.src = currentUser.profile_image;
            });
            
            if (document.getElementById('profileImage')) {
                document.getElementById('profileImage').src = currentUser.profile_image;
            }
        }
        
        // Load KYC status
        loadKYCStatus();
    }
}

// Load KYC Status
async function loadKYCStatus() {
    try {
        const { data: kycData } = await supabase
            .from('kyc_documents')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
        
        const kycStatusElement = document.getElementById('kycStatus');
        
        if (kycData) {
            let statusClass = 'status-pending';
            let statusText = 'စောင့်ဆိုင်းနေသည်';
            let statusIcon = 'fa-clock';
            
            switch (kycData.status) {
                case 'approved':
                    statusClass = 'status-approved';
                    statusText = 'အတည်ပြုပြီး';
                    statusIcon = 'fa-check-circle';
                    break;
                case 'rejected':
                    statusClass = 'status-rejected';
                    statusText = 'ငြင်းပယ်ခံရသည်';
                    statusIcon = 'fa-times-circle';
                    break;
            }
            
            kycStatusElement.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <i class="fas ${statusIcon} ${statusClass} text-2xl"></i>
                        <div>
                            <h4 class="font-bold text-white">KYC အခြေအနေ</h4>
                            <p class="${statusClass}">${statusText}</p>
                        </div>
                    </div>
                    ${kycData.status === 'rejected' ? 
                        `<button class="neon-btn text-sm px-4 py-2" onclick="openKYCModal()">
                            ပြန်လည်ပေးပို့ရန်
                        </button>` : ''
                    }
                </div>
                ${kycData.rejection_reason ? 
                    `<div class="mt-4 p-3 bg-red-900 bg-opacity-30 rounded-lg">
                        <p class="text-red-300 text-sm">
                            <strong>ငြင်းပယ်ရခြင်း:</strong> ${kycData.rejection_reason}
                        </p>
                    </div>` : ''
                }
            `;
        } else {
            kycStatusElement.innerHTML = `
                <div class="text-center">
                    <div class="text-4xl mb-4 text-yellow-500">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h4 class="font-bold text-white mb-2">KYC မဖြည့်စွက်ရသေးပါ</h4>
                    <p class="text-gray-300 mb-4">ကုန်ပစ္စည်းများ ဝယ်ယူရန် KYC ဖြည့်စွက်ရန် လိုအပ်ပါသည်</p>
                    <button class="neon-btn" onclick="openKYCModal()">
                        KYC ဖြည့်စွက်ရန်
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading KYC status:', error);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                         type === 'error' ? 'fa-exclamation-circle' : 
                         type === 'warning' ? 'fa-exclamation-triangle' : 
                         'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Modal Functions
function closeAllModals() {
    document.querySelectorAll('.cyber-modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', closeAllModals);
});

// Product Detail Modal
async function showProductDetail(productId) {
    try {
        const { data: product } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
        
        if (product) {
            const modal = document.getElementById('productModal');
            const content = document.getElementById('productModalContent');
            
            content.innerHTML = `
                <div class="space-y-6">
                    <div class="text-center">
                        ${product.image_url ? 
                            `<img src="${product.image_url}" alt="${product.name}" class="w-full max-w-md mx-auto rounded-lg">` :
                            `<div class="w-full max-w-md mx-auto h-64 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <i class="fas fa-gamepad text-white text-6xl"></i>
                            </div>`
                        }
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-white mb-4">${product.name}</h3>
                        <p class="text-gray-300 mb-6">${product.description || ''}</p>
                        <div class="flex justify-between items-center mb-6">
                            <span class="text-3xl font-bold text-cyan-400">${product.price} MMK</span>
                            <span class="text-sm text-gray-400">လက်ကျန်: ${product.stock || 0}</span>
                        </div>
                        <div class="space-y-4">
                            <button class="neon-btn w-full" onclick="showPurchaseModal(${product.id})">
                                ဝယ်ယူရန်
                            </button>
                            <button class="cyber-input w-full text-center" onclick="closeAllModals()">
                                ပြန်သွားရန်
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            modal.classList.add('active');
        }
    } catch (error) {
        console.error('Error loading product detail:', error);
        showNotification('ထုတ်ကုန် အသေးစိတ် ရယူ၍မရပါ', 'error');
    }
}

// News Detail Modal
async function showNewsDetail(newsId) {
    try {
        const { data: article } = await supabase
            .from('news')
            .select('*')
            .eq('id', newsId)
            .single();
        
        if (article) {
            const modal = document.getElementById('newsModal');
            const content = document.getElementById('newsModalContent');
            
            content.innerHTML = `
                <div class="space-y-6">
                    ${article.image_url ? 
                        `<img src="${article.image_url}" alt="${article.title}" class="w-full rounded-lg">` :
                        ''
                    }
                    <div>
                        <h3 class="text-2xl font-bold text-white mb-4">${article.title}</h3>
                        <div class="text-gray-400 text-sm mb-6">
                            ${new Date(article.created_at).toLocaleDateString('my-MM')}
                        </div>
                        <div class="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            ${article.content}
                        </div>
                    </div>
                    <button class="cyber-input w-full text-center" onclick="closeAllModals()">
                        ပြန်သွားရန်
                    </button>
                </div>
            `;
            
            modal.classList.add('active');
        }
    } catch (error) {
        console.error('Error loading news detail:', error);
        showNotification('သတင်း အသေးစိတ် ရယူ၍မရပါ', 'error');
    }
}

// Initialize Advertisement
function initializeAds() {
    const dashboardContainer = document.getElementById('dashboardContainer');
    const adContainer = document.getElementById('adContainer');
    
    // Only initialize ads when in dashboard and not in login/register
    if (dashboardContainer && !dashboardContainer.classList.contains('hidden')) {
        // Check if ads are already loaded
        const existingAd = document.querySelector('#adPlacement script[src*="highperformanceformat.com"]');
        if (!existingAd) {
            // Configure ad options
            window.atOptions = {
                'key': '8972f565fb2ce3bcc30125e33791174c',
                'format': 'iframe',
                'height': 60,
                'width': 320,
                'params': {}
            };
            
            // Create and append ad script
            const adScript = document.createElement('script');
            adScript.type = 'text/javascript';
            adScript.src = '//www.highperformanceformat.com/8972f565fb2ce3bcc30125e33791174c/invoke.js';
            
            const adPlacement = document.getElementById('adPlacement');
            if (adPlacement) {
                // Clear existing content
                adPlacement.innerHTML = '';
                adPlacement.appendChild(adScript);
                
                // Show ad container
                adContainer.style.display = 'flex';
            }
        }
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingAnimation();
    
    // Initialize ads after dashboard is shown (handled in showDashboard function)
    
    // Profile image upload handler
    const profileImageUpload = document.getElementById('profileImageUpload');
    if (profileImageUpload) {
        profileImageUpload.addEventListener('change', handleProfileImageUpload);
    }
    
    // Profile form submit handler
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // KYC form handlers
    const kycForm = document.getElementById('kycForm');
    if (kycForm) {
        kycForm.addEventListener('submit', handleKYCSubmit);
    }
    
    const kycBtn = document.getElementById('kycBtn');
    if (kycBtn) {
        kycBtn.addEventListener('click', openKYCModal);
    }
});

// Handle Profile Image Upload
async function handleProfileImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        try {
            // In production, upload to Supabase Storage
            // For now, we'll use a data URL
            const reader = new FileReader();
            reader.onload = async function(e) {
                const imageUrl = e.target.result;
                
                // Update user profile image in database
                const { error } = await supabase
                    .from('users')
                    .update({ profile_image: imageUrl })
                    .eq('id', currentUser.id);
                
                if (!error) {
                    currentUser.profile_image = imageUrl;
                    
                    // Update all avatar images
                    document.querySelectorAll('.avatar, #profileImage').forEach(img => {
                        img.src = imageUrl;
                    });
                    
                    showNotification('ပရိုဖိုင် ဓာတ်ပုံ အပ်ဒိတ် အောင်မြင်ပါသည်!', 'success');
                } else {
                    showNotification('ဓာတ်ပုံ အပ်လုတ် မအောင်မြင်ပါ', 'error');
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading profile image:', error);
            showNotification('ဓာတ်ပုံ အပ်လုတ် မအောင်မြင်ပါ', 'error');
        }
    }
}

// Handle Profile Update
async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const name = document.getElementById('profileName').value;
    const username = document.getElementById('profileUsername').value;
    const email = document.getElementById('profileEmail').value;
    const password = document.getElementById('profilePassword').value;
    
    try {
        const updateData = {
            name: name,
            username: username,
            email: email
        };
        
        // Only update password if provided
        if (password.trim()) {
            updateData.password = password;
        }
        
        const { error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', currentUser.id);
        
        if (!error) {
            // Update current user object
            Object.assign(currentUser, updateData);
            
            // Update UI
            document.getElementById('navUsername').textContent = name;
            if (password.trim()) {
                document.getElementById('profilePassword').value = '';
            }
            
            showNotification('ပရိုဖိုင် အပ်ဒိတ် အောင်မြင်ပါသည်!', 'success');
        } else {
            showNotification('ပရိုဖိုင် အပ်ဒိတ် မအောင်မြင်ပါ', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('ပရိုဖိုင် အပ်ဒိတ် မအောင်မြင်ပါ', 'error');
    }
}

// Open KYC Modal
function openKYCModal() {
    const modal = document.getElementById('kycModal');
    modal.classList.add('active');
}

// Handle KYC Submit
async function handleKYCSubmit(event) {
    event.preventDefault();
    
    // KYC submission logic would go here
    showNotification('KYC ပေးပို့ခြင်း အောင်မြင်ပါသည်! စစ်ဆေးပြီး အကြောင်းကြားပါမည်။', 'success');
    closeAllModals();
    
    // Refresh KYC status
    setTimeout(() => {
        loadKYCStatus();
    }, 1000);
}

// Additional helper functions...
function loadSellerContent() {
    // Seller content loading logic
}

function loadOrderHistory() {
    // Order history loading logic
}

function showPurchaseModal(productId) {
    // Purchase modal logic
}

// Export for global access
window.showProductDetail = showProductDetail;
window.showNewsDetail = showNewsDetail;
window.showPurchaseModal = showPurchaseModal;
window.openKYCModal = openKYCModal;
