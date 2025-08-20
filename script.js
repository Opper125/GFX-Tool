// Initialize Supabase
const SUPABASE_URL = 'https://rliwdosxsbauwxkayjoa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaXdkb3N4c2JhdXd4a2F5am9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMDA2NjIsImV4cCI6MjA2OTY3NjY2Mn0.uDvU9eX3Cy--D9l6daGaO2QMpn1YnxMJYVlbaeIgHu4';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;
let currentPage = 'home';
let uploadedFiles = {};

// DOM Elements
const app = document.getElementById('app');
const loadingScreen = document.getElementById('loadingScreen');
const loadingText = document.getElementById('loadingText');
const authContainer = document.getElementById('authContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Show loading animation
        showLoadingAnimation();
        
        // Wait for animation to complete
        setTimeout(async () => {
            // Check if user is already logged in
            await checkUserSession();
            
            // Hide loading screen
            hideLoadingScreen();
            
            // Initialize event listeners
            initializeEventListeners();
        }, 3000);
        
    } catch (error) {
        console.error('App initialization failed:', error);
        hideLoadingScreen();
        showNotification('စနစ်တွင် အမှားအယွင်းရှိသည်', 'error');
    }
}

function showLoadingAnimation() {
    const text = 'MMR GAMING SHOP';
    const letters = text.split('');
    loadingText.innerHTML = '';
    
    letters.forEach((letter, index) => {
        const span = document.createElement('span');
        span.textContent = letter === ' ' ? '\u00A0' : letter;
        span.className = 'loading-letter';
        span.style.animationDelay = `${index * 0.1}s`;
        loadingText.appendChild(span);
    });
}

function hideLoadingScreen() {
    loadingScreen.classList.add('fade-out');
    app.classList.remove('hidden');
    
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 1000);
}

async function checkUserSession() {
    try {
        const sessionData = localStorage.getItem('mmr_user_session');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            
            // Verify session with database
            const { data: user, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.id)
                .single();
                
            if (user && !error) {
                currentUser = user;
                showDashboard();
                await loadUserData();
                return;
            }
        }
        
        showAuth();
    } catch (error) {
        console.error('Session check failed:', error);
        showAuth();
    }
}

function showAuth() {
    authContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
}

function showDashboard() {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
}

function initializeEventListeners() {
    // Auth form listeners
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('showRegister')?.addEventListener('click', showRegisterPage);
    document.getElementById('showLogin')?.addEventListener('click', showLoginPage);
    
    // Navigation listeners
    document.getElementById('menuBtn')?.addEventListener('click', toggleNavMenu);
    document.getElementById('overlay')?.addEventListener('click', closeNavMenu);
    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    
    // Page navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });
    
    // Modal listeners
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    
    // Profile form
    document.getElementById('profileForm')?.addEventListener('submit', handleProfileUpdate);
    document.getElementById('profileImageUpload')?.addEventListener('change', handleProfileImageUpload);
    
    // KYC form
    document.getElementById('kycForm')?.addEventListener('submit', handleKYCSubmission);
    document.getElementById('kycBtn')?.addEventListener('click', showKYCModal);
    document.getElementById('kycDocType')?.addEventListener('change', handleDocTypeChange);
    
    // Seller system
    document.getElementById('addSellerProductForm')?.addEventListener('submit', handleAddSellerProduct);
    
    // File upload areas
    setupFileUploadAreas();
    
    // Load initial data
    if (currentUser) {
        loadInitialData();
    }
}

// Auth Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const loginBtn = document.getElementById('loginBtnText');
    const loginLoader = document.getElementById('loginLoader');
    
    if (!email || !password) {
        showNotification('အီးမေးလ်နှင့် စကားဝှက်ထည့်ပါ', 'error');
        return;
    }
    
    try {
        loginBtn.textContent = 'ဝင်နေသည်...';
        loginLoader.classList.remove('hidden');
        
        // Check if user is blocked
        const { data: blockedUser } = await supabase
            .from('blocked_users')
            .select('*')
            .eq('email', email)
            .single();
            
        if (blockedUser) {
            throw new Error('သင့်အကောင့်ကို ပိတ်ပင်ထားပါသည်');
        }
        
        // Verify user credentials
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .single();
            
        if (error || !user) {
            throw new Error('အီးမေးလ် သို့မဟုတ် စကားဝှက် မမှန်ကန်ပါ');
        }
        
        // Update last login
        await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);
        
        // Store session
        localStorage.setItem('mmr_user_session', JSON.stringify(user));
        currentUser = user;
        
        showNotification('အကောင့်ဝင်ခြင်း အောင်မြင်ပါသည်', 'success');
        showDashboard();
        await loadUserData();
        
    } catch (error) {
        console.error('Login failed:', error);
        showNotification(error.message || 'အကောင့်ဝင်ခြင်း မအောင်မြင်ပါ', 'error');
    } finally {
        loginBtn.textContent = 'လော့အင်ဝင်ရန်';
        loginLoader.classList.add('hidden');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    const registerBtn = document.getElementById('registerBtnText');
    const registerLoader = document.getElementById('registerLoader');
    
    if (!name || !username || !email || !password) {
        showNotification('အချက်အလက်များ ပြည့်စုံအောင် ထည့်ပါ', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('စည်းကမ်းချက်များကို သဘောတူရပါမည်', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('စကားဝှက်သည် အနည်းဆုံး ၆လုံးရှိရပါမည်', 'error');
        return;
    }
    
    try {
        registerBtn.textContent = 'စာရင်းသွင်းနေသည်...';
        registerLoader.classList.remove('hidden');
        
        // Check if email or username already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('email, username')
            .or(`email.eq.$${email},username.eq.$${username}`);
            
        if (existingUser && existingUser.length > 0) {
            const existing = existingUser[0];
            if (existing.email === email) {
                throw new Error('အီးမေးလ်ကို အသုံးပြုပြီးပါပြီ');
            }
            if (existing.username === username) {
                throw new Error('Username ကို အသုံးပြုပြီးပါပြီ');
            }
        }
        
        // Create new user
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{
                name: name,
                username: username,
                email: email,
                password: password,
                kyc_status: 'pending',
                is_seller: false
            }])
            .select()
            .single();
            
        if (error) {
            throw error;
        }
        
        showNotification('အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်', 'success');
        showLoginPage();
        
    } catch (error) {
        console.error('Registration failed:', error);
        showNotification(error.message || 'အကောင့်ဖွင့်ခြင်း မအောင်မြင်ပါ', 'error');
    } finally {
        registerBtn.textContent = 'စာရင်းသွင်းရန်';
        registerLoader.classList.add('hidden');
    }
}

function showLoginPage() {
    loginPage.classList.remove('hidden');
    registerPage.classList.add('hidden');
}

function showRegisterPage() {
    loginPage.classList.add('hidden');
    registerPage.classList.remove('hidden');
}

async function handleLogout() {
    try {
        localStorage.removeItem('mmr_user_session');
        currentUser = null;
        showAuth();
        showNotification('အကောင့်ထွက်ခြင်း အောင်မြင်ပါသည်', 'success');
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

// Navigation Functions
function toggleNavMenu() {
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('overlay');
    
    navMenu.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeNavMenu() {
    const navMenu = document.getElementById('navMenu');
    const overlay = document.getElementById('overlay');
    
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
}

function handleNavigation(e) {
    e.preventDefault();
    
    const page = e.currentTarget.getAttribute('data-page');
    if (page) {
        showPage(page);
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        closeNavMenu();
    }
}

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageName + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Load page specific data
        loadPageData(pageName);
    }
}

async function loadPageData(pageName) {
    try {
        switch (pageName) {
            case 'home':
                await loadProducts();
                break;
            case 'news':
                await loadNews();
                break;
            case 'shop':
                await loadSellerContent();
                break;
            case 'history':
                await loadOrderHistory();
                break;
            case 'profile':
                await loadProfileData();
                break;
            case 'about':
                await loadAboutData();
                break;
        }
    } catch (error) {
        console.error(`Error loading ${pageName} data:`, error);
    }
}

// Data Loading Functions
async function loadUserData() {
    try {
        // Update user avatar and info
        updateUserInterface();
        
        // Load initial page data
        await loadProducts();
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

function updateUserInterface() {
    if (!currentUser) return;
    
    // Update avatars
    const avatars = document.querySelectorAll('#userAvatar, #navAvatar');
    avatars.forEach(avatar => {
        if (currentUser.profile_image) {
            avatar.src = currentUser.profile_image;
        }
    });
    
    // Update username
    const usernameEl = document.getElementById('navUsername');
    if (usernameEl) {
        usernameEl.textContent = currentUser.name || currentUser.username;
    }
}

async function loadProducts() {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        displayProducts(products || []);
        
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('ကုန်ပစ္စည်းများ ရယူခြင်း မအောင်မြင်ပါ', 'error');
    }
}

function displayProducts(products) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div class="col-span-full text-center py-20">
                <div class="text-6xl mb-6 text-gray-400">
                    <i class="fas fa-box-open"></i>
                </div>
                <p class="text-gray-400 text-xl">ကုန်ပစ္စည်းများ မရှိသေးပါ</p>
            </div>
        `;
        return;
    }
    
    productGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProductDetails('${product.id}')">
            <div class="product-image">
                ${product.icon_image ? 
                    `<img src="$${product.icon_image}" alt="$${product.name}" loading="lazy">` :
                    '<i class="fas fa-gamepad"></i>'
                }
            </div>
            <div class="product-info">
                <h3 class="text-lg font-bold mb-2">${product.name}</h3>
                <p class="text-gray-300 text-sm mb-3 line-clamp-2">${product.description || 'ဖော်ပြချက်မရှိပါ'}</p>
                <div class="flex justify-between items-center mb-3">
                    <span class="text-cyan-400 font-bold text-lg">${formatPrice(product.price)} MMK</span>
                    <span class="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-full text-sm">
                        ${product.product_type === 'apk' ? 'APK' : 'Game Account'}
                    </span>
                </div>
                ${product.apk_file || product.gallery_images?.length > 0 ? `
                    <div class="product-files">
                        ${product.apk_file ? `
                            <div class="file-download-btn">
                                <i class="fas fa-mobile-alt"></i>
                                APK
                            </div>
                        ` : ''}
                        ${product.gallery_images?.length > 0 ? `
                            <div class="file-download-btn">
                                <i class="fas fa-images"></i>
                                ${product.gallery_images.length} ပုံ
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                <button class="neon-btn w-full mt-4" onclick="event.stopPropagation(); showPurchaseModal('${product.id}')">
                    ဝယ်ယူရန်
                </button>
            </div>
        </div>
    `).join('');
}

async function loadNews() {
    try {
        const { data: news, error } = await supabase
            .from('news')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        displayNews(news || []);
        
    } catch (error) {
        console.error('Error loading news:', error);
        showNotification('သတင်းများ ရယူခြင်း မအောင်မြင်ပါ', 'error');
    }
}

function displayNews(news) {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    
    if (news.length === 0) {
        newsGrid.innerHTML = `
            <div class="text-center py-20">
                <div class="text-6xl mb-6 text-gray-400">
                    <i class="fas fa-newspaper"></i>
                </div>
                <p class="text-gray-400 text-xl">သတင်းများ မရှိသေးပါ</p>
            </div>
        `;
        return;
    }
    
    newsGrid.innerHTML = news.map(item => `
        <div class="news-card" onclick="showNewsDetails('${item.id}')">
            <div class="news-media">
                ${item.video_url ? `
                    <video src="${item.video_url}" muted loop>
                        <source src="${item.video_url}" type="video/mp4">
                    </video>
                ` : item.images && item.images.length > 0 ? `
                    <img src="$${item.images[0]}" alt="$${item.title}" loading="lazy">
                ` : `
                    <i class="fas fa-newspaper text-4xl"></i>
                `}
            </div>
            <div class="news-content">
                <h3 class="text-xl font-bold mb-3">${item.title}</h3>
                <p class="text-gray-300 line-clamp-3">${item.content}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-gray-400 text-sm">
                        <i class="fas fa-calendar-alt mr-1"></i>
                        ${formatDate(item.created_at)}
                    </span>
                    <span class="text-cyan-400 hover:text-cyan-300 cursor-pointer">
                        ပိုမိုကြည့်ရှုရန် <i class="fas fa-arrow-right"></i>
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

async function loadSellerContent() {
    const sellerContent = document.getElementById('sellerContent');
    if (!sellerContent || !currentUser) return;
    
    try {
        // Check if user is a seller (KYC approved)
        if (currentUser.is_seller && currentUser.kyc_status === 'approved') {
            sellerContent.innerHTML = `
                <div class="text-center mb-8">
                    <button id="openSellerDashboard" class="neon-btn">
                        <i class="fas fa-store mr-2"></i>
                        အရောင်းသမား Dashboard ဖွင့်ရန်
                    </button>
                </div>
            `;
            
            document.getElementById('openSellerDashboard')?.addEventListener('click', showSellerDashboard);
        } else {
            // Show KYC requirement
            sellerContent.innerHTML = `
                <div class="neo-glass p-8 text-center max-w-md mx-auto">
                    <div class="text-6xl mb-6 text-cyan-400">
                        <i class="fas fa-store"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-white mb-4">အရောင်းသမားဖြစ်ချင်သလား?</h3>
                    <p class="text-gray-300 mb-8">
                        ကုန်ပစ္စည်းများ ရောင်းချရန် KYC အတည်ပြုမှု လိုအပ်ပါသည်
                    </p>
                    ${currentUser.kyc_status === 'pending' ? `
                        <div class="status-pending mb-4">
                            KYC အတည်ပြုမှုကို စောင့်နေသည်
                        </div>
                    ` : currentUser.kyc_status === 'approved' ? `
                        <div class="status-approved mb-4">
                            KYC အတည်ပြုပြီးပါပြီ
                        </div>
                    ` : currentUser.kyc_status === 'rejected' ? `
                        <div class="status-rejected mb-4">
                            KYC ငြင်းပယ်ခံရပါသည်
                        </div>
                        <button id="kycBtn" class="neon-btn">KYC ပြန်တင်ရန်</button>
                    ` : `
                        <button id="kycBtn" class="neon-btn">KYC အတည်ပြုရန်</button>
                    `}
                </div>
            `;
            
            document.getElementById('kycBtn')?.addEventListener('click', showKYCModal);
        }
        
    } catch (error) {
        console.error('Error loading seller content:', error);
    }
}

async function loadOrderHistory() {
    try {
        const { data: orders, error } = await supabase
            .from('orders')
            .select(`
                *,
                products(name, icon_image, product_type),
                users!orders_seller_id_fkey(name, username)
            `)
            .eq('buyer_id', currentUser.id)
            .order('ordered_at', { ascending: false });
            
        if (error) throw error;
        
        displayOrderHistory(orders || []);
        
    } catch (error) {
        console.error('Error loading order history:', error);
        showNotification('မှာယူမှုများ ရယူခြင်း မအောင်မြင်ပါ', 'error');
    }
}

function displayOrderHistory(orders) {
    const orderHistory = document.getElementById('orderHistory');
    if (!orderHistory) return;
    
    if (orders.length === 0) {
        orderHistory.innerHTML = `
            <div class="text-center py-20">
                <div class="text-6xl mb-6 text-gray-400">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p class="text-gray-400 text-xl">မှာယူမှုများ မရှိသေးပါ</p>
            </div>
        `;
        return;
    }
    
    orderHistory.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 rounded-lg overflow-hidden">
                        ${order.products?.icon_image ? 
                            `<img src="$${order.products.icon_image}" alt="$${order.products.name}" class="w-full h-full object-cover">` :
                            '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl"><i class="fas fa-gamepad"></i></div>'
                        }
                    </div>
                    <div>
                        <h3 class="text-white font-bold">${order.products?.name || 'ကုန်ပစ္စည်း'}</h3>
                        <p class="text-gray-400 text-sm">ရောင်းချသူ: ${order.users?.name || order.users?.username || 'မသိ'}</p>
                        <p class="text-gray-400 text-sm">မှာယူသည့်ရက်: ${formatDate(order.ordered_at)}</p>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-cyan-400 font-bold text-lg">${formatPrice(order.amount)} MMK</div>
                    <div class="status-${order.status} mt-1">
                        ${getOrderStatusText(order.status)}
                    </div>
                </div>
            </div>
            
            ${order.status === 'approved' && order.download_approved ? `
                <div class="border-t border-gray-600 pt-4">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-300">ဖိုင်များ ဒေါင်းလုဒ်ရန်:</span>
                        <button onclick="downloadOrderFiles('${order.id}')" class="neon-btn">
                            <i class="fas fa-download mr-2"></i>
                            ဒေါင်းလုဒ်
                        </button>
                    </div>
                </div>
            ` : ''}
            
            ${order.order_slip ? `
                <div class="border-t border-gray-600 pt-4">
                    <button onclick="showOrderSlip('${order.id}')" class="neon-btn">
                        <i class="fas fa-receipt mr-2"></i>
                        မှာယူမှု စာရွက်ကြည့်ရန်
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function loadProfileData() {
    if (!currentUser) return;
    
    // Fill profile form with current user data
    document.getElementById('profileName').value = currentUser.name || '';
    document.getElementById('profileUsername').value = currentUser.username || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    
    // Set profile image
    const profileImage = document.getElementById('profileImage');
    if (currentUser.profile_image) {
        profileImage.src = currentUser.profile_image;
    }
    
    // Load KYC status
    await loadKYCStatus();
}

async function loadKYCStatus() {
    try {
        const { data: kycData, error } = await supabase
            .from('kyc_verifications')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('submitted_at', { ascending: false })
            .limit(1)
            .single();
            
        const kycStatus = document.getElementById('kycStatus');
        if (!kycStatus) return;
        
        if (error && error.code !== 'PGRST116') {
            console.error('Error loading KYC status:', error);
            return;
        }
        
        if (!kycData) {
            kycStatus.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-id-card text-3xl text-gray-400 mb-4"></i>
                    <p class="text-gray-300 mb-4">KYC အတည်ပြုမှု မတင်သွင်းရသေးပါ</p>
                    <button onclick="showKYCModal()" class="neon-btn">
                        KYC အတည်ပြုရန်
                    </button>
                </div>
            `;
        } else {
            let statusClass, statusText, statusIcon;
            
            switch (kycData.status) {
                case 'pending':
                    statusClass = 'status-pending';
                    statusText = 'အတည်ပြုမှုကို စောင့်နေသည်';
                    statusIcon = 'fas fa-clock';
                    break;
                case 'approved':
                    statusClass = 'status-approved';
                    statusText = 'အတည်ပြုပြီးပါပြီ';
                    statusIcon = 'fas fa-check-circle';
                    break;
                case 'rejected':
                    statusClass = 'status-rejected';
                    statusText = 'ငြင်းပယ်ခံရပါသည်';
                    statusIcon = 'fas fa-times-circle';
                    break;
                default:
                    statusClass = 'status-pending';
                    statusText = 'မသိသော အခြေအနေ';
                    statusIcon = 'fas fa-question-circle';
            }
            
            kycStatus.innerHTML = `
                <div class="text-center">
                    <i class="${statusIcon} text-3xl mb-4"></i>
                    <div class="$${statusClass} text-lg mb-4">$${statusText}</div>
                    <p class="text-gray-300 text-sm">တင်သွင်းသည့်ရက်: ${formatDate(kycData.submitted_at)}</p>
                    ${kycData.admin_notes ? `
                        <div class="mt-4 p-4 bg-gray-800 rounded-lg">
                            <p class="text-gray-300 text-sm"><strong>မှတ်ချက်:</strong> ${kycData.admin_notes}</p>
                        </div>
                    ` : ''}
                    ${kycData.status === 'rejected' ? `
                        <button onclick="showKYCModal()" class="neon-btn mt-4">
                            KYC ပြန်တင်ရန်
                        </button>
                    ` : ''}
                </div>
            `;
        }
        
    } catch (error) {
        console.error('Error loading KYC status:', error);
    }
}

async function loadAboutData() {
    try {
        const { data: aboutData, error } = await supabase
            .from('about')
            .select('*')
            .eq('is_active', true)
            .single();
            
        if (aboutData && aboutData.social_links) {
            const socialLinks = document.getElementById('socialLinks');
            if (socialLinks && aboutData.social_links) {
                const links = aboutData.social_links;
                
                socialLinks.innerHTML = `
                    $${links.telegram ? `<a href="$${links.telegram}" class="social-icon telegram" title="Telegram"><i class="fab fa-telegram"></i></a>` : ''}
                    $${links.youtube ? `<a href="$${links.youtube}" class="social-icon youtube" title="YouTube"><i class="fab fa-youtube"></i></a>` : ''}
                    $${links.viber ? `<a href="$${links.viber}" class="social-icon viber" title="Viber"><i class="fab fa-viber"></i></a>` : ''}
                    $${links.wechat ? `<a href="$${links.wechat}" class="social-icon wechat" title="WeChat"><i class="fab fa-weixin"></i></a>` : ''}
                `;
            }
        }
        
    } catch (error) {
        console.error('Error loading about data:', error);
    }
}

// Profile Functions
async function handleProfileUpdate(e) {
    e.preventDefault();
    
    const name = document.getElementById('profileName').value.trim();
    const username = document.getElementById('profileUsername').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const password = document.getElementById('profilePassword').value;
    
    if (!name || !username || !email) {
        showNotification('အချက်အလက်များ ပြည့်စုံအောင် ထည့်ပါ', 'error');
        return;
    }
    
    try {
        const updateData = {
            name: name,
            username: username,
            email: email,
            updated_at: new Date().toISOString()
        };
        
        if (password) {
            if (password.length < 6) {
                showNotification('စကားဝှက်သည် အနည်းဆုံး ၆လုံးရှိရပါမည်', 'error');
                return;
            }
            updateData.password = password;
        }
        
        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', currentUser.id)
            .select()
            .single();
            
        if (error) throw error;
        
        // Update current user data
        currentUser = { ...currentUser, ...data };
        localStorage.setItem('mmr_user_session', JSON.stringify(currentUser));
        
        // Update UI
        updateUserInterface();
        
        showNotification('ကိုယ်ရေးအချက်အလက် အပ်ဒိတ်လုပ်ပြီးပါပြီ', 'success');
        
        // Clear password field
        document.getElementById('profilePassword').value = '';
        
    } catch (error) {
        console.error('Profile update failed:', error);
        showNotification(error.message || 'အပ်ဒိတ်လုပ်ခြင်း မအောင်မြင်ပါ', 'error');
    }
}

async function handleProfileImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('ပုံဖိုင်သာ ရွေးချယ်ပါ', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('ပုံဖိုင်အရွယ်သည် 5MB ထက်မပိုရပါ', 'error');
        return;
    }
    
    try {
        showNotification('ပုံအပ်လုဒ်လုပ်နေသည်...', 'warning');
        
        const fileName = `profile_$${currentUser.id}_$${Date.now()}.${file.name.split('.').pop()}`;
        
        const { data, error } = await supabase.storage
            .from('profile-images')
            .upload(fileName, file);
            
        if (error) throw error;
        
        const { data: urlData } = supabase.storage
            .from('profile-images')
            .getPublicUrl(fileName);
            
        const imageUrl = urlData.publicUrl;
        
        // Update user profile with new image URL
        const { error: updateError } = await supabase
            .from('users')
            .update({ profile_image: imageUrl })
            .eq('id', currentUser.id);
            
        if (updateError) throw updateError;
        
        // Update UI
        currentUser.profile_image = imageUrl;
        localStorage.setItem('mmr_user_session', JSON.stringify(currentUser));
        
        document.getElementById('profileImage').src = imageUrl;
        updateUserInterface();
        
        showNotification('ပုံအပ်လုဒ်လုပ်ပြီးပါပြီ', 'success');
        
    } catch (error) {
        console.error('Profile image upload failed:', error);
        showNotification('ပုံအပ်လုဒ်လုပ်ခြင်း မအောင်မြင်ပါ', 'error');
    }
}

// KYC Functions
function showKYCModal() {
    const kycModal = document.getElementById('kycModal');
    if (kycModal) {
        kycModal.classList.add('active');
    }
}

function handleDocTypeChange(e) {
    const docType = e.target.value;
    const docFields = document.getElementById('kycDocFields');
    
    if (!docFields) return;
    
    let fieldsHTML = '';
    
    switch (docType) {
        case 'nrc':
            fieldsHTML = `
                <div class="grid grid-cols-3 gap-4">
                    <div class="form-group">
                        <label class="form-label">ပြည်နယ်/တိုင်း</label>
                        <input type="text" id="kycNrcState" class="cyber-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">မြို့နယ်</label>
                        <input type="text" id="kycNrcTownship" class="cyber-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">ခရိုင်</label>
                        <input type="text" id="kycNrcDistrict" class="cyber-input" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">NRC နံပါတ်</label>
                    <input type="text" id="kycNrcNumber" class="cyber-input" required>
                </div>
            `;
            break;
        case 'passport':
            fieldsHTML = `
                <div class="form-group">
                    <label class="form-label">Passport နံပါတ်</label>
                    <input type="text" id="kycPassportNumber" class="cyber-input" required>
                </div>
            `;
            break;
        case 'driver':
            fieldsHTML = `
                <div class="form-group">
                    <label class="form-label">ယာဥ်မောင်းလိုင်စင် နံပါတ်</label>
                    <input type="text" id="kycLicenseNumber" class="cyber-input" required>
                </div>
            `;
            break;
    }
    
    docFields.innerHTML = fieldsHTML;
}

async function handleKYCSubmission(e) {
    e.preventDefault();
    
    const name = document.getElementById('kycName').value.trim();
    const birthdate = document.getElementById('kycBirthdate').value;
    const docType = document.getElementById('kycDocType').value;
    const address = document.getElementById('kycAddress').value.trim();
    const docFront = document.getElementById('kycDocFront').files[0];
    const docBack = document.getElementById('kycDocBack').files[0];
    const selfie = document.getElementById('kycSelfie').files[0];
    
    if (!name || !birthdate || !docType || !address || !docFront || !selfie) {
        showNotification('အချက်အလက်များ ပြည့်စုံအောင် ထည့်ပါ', 'error');
        return;
    }
    
    try {
        showNotification('KYC တင်သွင်းနေသည်...', 'warning');
        
        // Upload documents
        const frontFileName = `kyc_$${currentUser.id}_front_$${Date.now()}.${docFront.name.split('.').pop()}`;
        const backFileName = docBack ? `kyc_$${currentUser.id}_back_$${Date.now()}.${docBack.name.split('.').pop()}` : null;
        const selfieFileName = `kyc_$${currentUser.id}_selfie_$${Date.now()}.${selfie.name.split('.').pop()}`;
        
        const uploads = [
            supabase.storage.from('kyc-documents').upload(frontFileName, docFront),
            supabase.storage.from('kyc-documents').upload(selfieFileName, selfie)
        ];
        
        if (docBack) {
            uploads.push(supabase.storage.from('kyc-documents').upload(backFileName, docBack));
        }
        
        const uploadResults = await Promise.all(uploads);
        
        for (const result of uploadResults) {
            if (result.error) throw result.error;
        }
        
        // Get document URLs
        const frontUrl = supabase.storage.from('kyc-documents').getPublicUrl(frontFileName).data.publicUrl;
        const backUrl = backFileName ? supabase.storage.from('kyc-documents').getPublicUrl(backFileName).data.publicUrl : null;
        const selfieUrl = supabase.storage.from('kyc-documents').getPublicUrl(selfieFileName).data.publicUrl;
        
        // Prepare KYC data
        const kycData = {
            user_id: currentUser.id,
            full_name: name,
            date_of_birth: birthdate,
            document_type: docType,
            address: address,
            document_front: frontUrl,
            document_back: backUrl,
            selfie_with_document: selfieUrl,
            status: 'pending'
        };
        
        // Add document specific fields
        if (docType === 'nrc') {
            kycData.nrc_state = document.getElementById('kycNrcState').value;
            kycData.nrc_township = document.getElementById('kycNrcTownship').value;
            kycData.nrc_district = document.getElementById('kycNrcDistrict').value;
            kycData.nrc_number = document.getElementById('kycNrcNumber').value;
        } else if (docType === 'passport') {
            kycData.passport_number = document.getElementById('kycPassportNumber').value;
        } else if (docType === 'driver') {
            kycData.license_number = document.getElementById('kycLicenseNumber').value;
        }
        
        // Submit KYC data
        const { error: kycError } = await supabase
            .from('kyc_verifications')
            .insert([kycData]);
            
        if (kycError) throw kycError;
        
        // Update user KYC status
        const { error: userError } = await supabase
            .from('users')
            .update({ kyc_status: 'pending' })
            .eq('id', currentUser.id);
            
        if (userError) throw userError;
        
        currentUser.kyc_status = 'pending';
        localStorage.setItem('mmr_user_session', JSON.stringify(currentUser));
        
        showNotification('KYC တင်သွင်းခြင်း အောင်မြင်ပါသည်', 'success');
        closeModals();
        
        // Reload KYC status
        await loadKYCStatus();
        
    } catch (error) {
        console.error('KYC submission failed:', error);
        showNotification(error.message || 'KYC တင်သွင်းခြင်း မအောင်မြင်ပါ', 'error');
    }
}

// Seller Functions
async function showSellerDashboard() {
    try {
        // Load seller dashboard content
        const sellerModal = document.getElementById('sellerModal');
        const sellerDashboard = document.getElementById('sellerDashboard');
        
        if (!sellerModal || !sellerDashboard) return;
        
        // Show loading
        sellerDashboard.innerHTML = `
            <div class="text-center py-20">
                <div class="loading-spinner mx-auto mb-4"></div>
                <p class="text-white">Dashboard ရယူနေသည်...</p>
            </div>
        `;
        
        sellerModal.classList.add('active');
        
        // Load seller data
        const [productsResult, ordersResult, paymentsResult] = await Promise.all([
            supabase.from('users_products').select('*').eq('user_id', currentUser.id),
            supabase.from('orders').select('*, products(name)').eq('seller_id', currentUser.id),
            supabase.from('users_payment_methods').select('*').eq('user_id', currentUser.id)
        ]);
        
        const products = productsResult.data || [];
        const orders = ordersResult.data || [];
        const payments = paymentsResult.data || [];
        
        // Render dashboard
        sellerDashboard.innerHTML = `
            <div class="seller-stats">
                <div class="seller-stat-card">
                    <div class="text-3xl font-bold">${products.length}</div>
                    <div class="text-gray-300 mt-2">ကုန်ပစ္စည်းများ</div>
                </div>
                <div class="seller-stat-card">
                    <div class="text-3xl font-bold">${orders.length}</div>
                    <div class="text-gray-300 mt-2">မှာယူမှုများ</div>
                </div>
                <div class="seller-stat-card">
                    <div class="text-3xl font-bold">${payments.length}</div>
                    <div class="text-gray-300 mt-2">ငွေပေးချေမှု</div>
                </div>
                <div class="seller-stat-card">
                    <div class="text-3xl font-bold">${orders.filter(o => o.status === 'approved').length}</div>
                    <div class="text-gray-300 mt-2">အတည်ပြုမှုများ</div>
                </div>
            </div>
            
            <div class="seller-tabs">
                <button class="seller-tab active" data-tab="products">ကုန်ပစ္စည်းများ</button>
                <button class="seller-tab" data-tab="orders">မှာယူမှုများ</button>
                <button class="seller-tab" data-tab="payments">ငွေပေးချေမှု</button>
                <button class="seller-tab" data-tab="add-product">ကုန်ပစ္စည်းတင်ရန်</button>
            </div>
            
            <div class="seller-tab-content active" id="seller-products">
                ${renderSellerProducts(products)}
            </div>
            
            <div class="seller-tab-content" id="seller-orders">
                ${renderSellerOrders(orders)}
            </div>
            
            <div class="seller-tab-content" id="seller-payments">
                ${renderSellerPayments(payments)}
            </div>
            
            <div class="seller-tab-content" id="seller-add-product">
                ${renderAddProductForm()}
            </div>
        `;
        
        // Add tab functionality
        document.querySelectorAll('.seller-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                switchSellerTab(tabName);
            });
        });
        
    } catch (error) {
        console.error('Error loading seller dashboard:', error);
        showNotification('Dashboard ရယူခြင်း မအောင်မြင်ပါ', 'error');
    }
}

function switchSellerTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.seller-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.seller-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`seller-${tabName}`).classList.add('active');
}

function renderSellerProducts(products) {
    if (products.length === 0) {
        return `
            <div class="text-center py-20">
                <div class="text-6xl mb-6 text-gray-400">
                    <i class="fas fa-box-open"></i>
                </div>
                <p class="text-gray-400 text-xl">ကုန်ပစ္စည်းများ မရှိသေးပါ</p>
            </div>
        `;
    }
    
    return `
        <div class="product-grid">
            ${products.map(product => `
                <div class="product-card">
                    <div class="product-image">
                        ${product.icon_image ? 
                            `<img src="$${product.icon_image}" alt="$${product.name}">` :
                            '<i class="fas fa-gamepad"></i>'
                        }
                    </div>
                    <div class="product-info">
                        <h3 class="text-lg font-bold mb-2">${product.name}</h3>
                        <p class="text-gray-300 text-sm mb-3">${product.description || 'ဖော်ပြချက်မရှိပါ'}</p>
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-cyan-400 font-bold">${formatPrice(product.price)} MMK</span>
                            <span class="status-$${product.status}">$${getProductStatusText(product.status)}</span>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="editSellerProduct('${product.id}')" class="neon-btn flex-1">
                                ပြင်ရန်
                            </button>
                            <button onclick="deleteSellerProduct('${product.id}')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1">
                                ဖျက်ရန်
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderSellerOrders(orders) {
    if (orders.length === 0) {
        return `
            <div class="text-center py-20">
                <div class="text-6xl mb-6 text-gray-400">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <p class="text-gray-400 text-xl">မှာယူမှုများ မရှိသေးပါ</p>
            </div>
        `;
    }
    
    return `
        <div class="space-y-4">
            ${orders.map(order => `
                <div class="order-item">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="text-white font-bold">${order.products?.name || 'ကုန်ပစ္စည်း'}</h3>
                            <p class="text-gray-400 text-sm">မှာယူသည့်ရက်: ${formatDate(order.ordered_at)}</p>
                            <div class="text-cyan-400 font-bold">${formatPrice(order.amount)} MMK</div>
                        </div>
                        <div class="text-right">
                            <div class="status-$${order.status} mb-2">$${getOrderStatusText(order.status)}</div>
                            ${order.status === 'pending' ? `
                                <div class="flex gap-2">
                                    <button onclick="approveOrder('${order.id}')" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                                        အတည်ပြု
                                    </button>
                                    <button onclick="rejectOrder('${order.id}')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                                        ငြင်းပယ်
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderSellerPayments(payments) {
    return `
        <div class="space-y-4">
            <button onclick="addSellerPaymentMethod()" class="neon-btn">
                <i class="fas fa-plus mr-2"></i>
                ငွေပေးချေမှု အသစ်ထည့်ရန်
            </button>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${payments.map(payment => `
                    <div class="payment-method">
                        <h3 class="text-white font-bold mb-2">${payment.name}</h3>
                        <p class="text-gray-300 text-sm mb-3">${payment.details}</p>
                        ${payment.qr_code ? `
                            <div class="payment-qr mb-3">
                                <img src="${payment.qr_code}" alt="QR Code">
                            </div>
                        ` : ''}
                        <div class="flex gap-2">
                            <button onclick="editPaymentMethod('${payment.id}')" class="neon-btn flex-1">
                                ပြင်ရန်
                            </button>
                            <button onclick="deletePaymentMethod('${payment.id}')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
                                ဖျက်ရန်
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderAddProductForm() {
    return `
        <form id="sellerProductForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="form-group">
                    <label class="form-label">ကုန်ပစ္စည်းအမည်</label>
                    <input type="text" name="name" class="cyber-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">အမျိုးအစား</label>
                    <select name="product_type" class="cyber-input" required onchange="handleSellerProductTypeChange(this.value)">
                        <option value="">ရွေးချယ်ပါ</option>
                        <option value="apk">APK ဖိုင်</option>
                        <option value="game_account">Game Account</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">စျေးနှုန်း (MMK)</label>
                <input type="number" name="price" class="cyber-input" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">ဖော်ပြချက်</label>
                <textarea name="description" class="cyber-input" rows="4"></textarea>
            </div>
            
            <div class="multi-file-upload">
                <div class="file-type-section">
                    <div class="file-type-title">
                        <i class="fas fa-image"></i>
                        Icon ပုံ (လိုအပ်သည်)
                    </div>
                    <div class="upload-area" data-upload-type="icon">
                        <input type="file" name="icon_image" accept="image/*" class="hidden" required>
                        <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                        <p class="text-gray-400">Icon ပုံရွေးရန် နှိပ်ပါ</p>
                    </div>
                    <div class="file-preview" id="icon-preview"></div>
                </div>
                
                <div class="file-type-section">
                    <div class="file-type-title">
                        <i class="fas fa-images"></i>
                        Gallery ပုံများ (ရွေးချယ်ရန်)
                    </div>
                    <div class="upload-area" data-upload-type="gallery">
                        <input type="file" name="gallery_images" accept="image/*" class="hidden" multiple>
                        <i class="fas fa-images text-3xl text-gray-400 mb-2"></i>
                        <p class="text-gray-400">Gallery ပုံများရွေးရန် နှိပ်ပါ</p>
                    </div>
                    <div class="file-preview" id="gallery-preview"></div>
                </div>
                
                <div id="apk-files-section" class="file-type-section" style="display: none;">
                    <div class="file-type-title">
                        <i class="fas fa-file-archive"></i>
                        APK/ZIP/Files
                    </div>
                    <div class="upload-area" data-upload-type="files">
                        <input type="file" name="product_files" class="hidden" multiple accept=".apk,.zip,.rar,.7z">
                        <i class="fas fa-file-archive text-3xl text-gray-400 mb-2"></i>
                        <p class="text-gray-400">APK/ZIP ဖိုင်များရွေးရန် နှိပ်ပါ</p>
                    </div>
                    <div class="file-preview" id="files-preview"></div>
                </div>
                
                <div class="file-type-section">
                    <div class="file-type-title">
                        <i class="fas fa-video"></i>
                        Video ဖိုင် (ရွေးချယ်ရန်)
                    </div>
                    <div class="upload-area" data-upload-type="video">
                        <input type="file" name="product_video" accept="video/*" class="hidden">
                        <i class="fas fa-video text-3xl text-gray-400 mb-2"></i>
                        <p class="text-gray-400">Video ဖိုင်ရွေးရန် နှိပ်ပါ</p>
                        <p class="text-xs text-gray-500">အများဆုံး 50MB</p>
                    </div>
                    <div class="file-preview" id="video-preview"></div>
                </div>
            </div>
            
            <button type="submit" class="neon-btn w-full">
                ကုန်ပစ္စည်းတင်ရန်
            </button>
        </form>
    `;
}

function handleSellerProductTypeChange(type) {
    const apkSection = document.getElementById('apk-files-section');
    if (apkSection) {
        if (type === 'apk') {
            apkSection.style.display = 'block';
        } else {
            apkSection.style.display = 'none';
        }
    }
}

// File Upload Functions
function setupFileUploadAreas() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.upload-area')) {
            const uploadArea = e.target.closest('.upload-area');
            const fileInput = uploadArea.querySelector('input[type="file"]');
            if (fileInput) {
                fileInput.click();
            }
        }
    });
    
    document.addEventListener('change', function(e) {
        if (e.target.type === 'file' && e.target.closest('.upload-area')) {
            handleFileSelection(e.target);
        }
    });
    
    // Drag and drop functionality
    document.addEventListener('dragover', function(e) {
        if (e.target.closest('.upload-area')) {
            e.preventDefault();
            e.target.closest('.upload-area').classList.add('dragover');
        }
    });
    
    document.addEventListener('dragleave', function(e) {
        if (e.target.closest('.upload-area')) {
            e.target.closest('.upload-area').classList.remove('dragover');
        }
    });
    
    document.addEventListener('drop', function(e) {
        if (e.target.closest('.upload-area')) {
            e.preventDefault();
            const uploadArea = e.target.closest('.upload-area');
            uploadArea.classList.remove('dragover');
            
            const fileInput = uploadArea.querySelector('input[type="file"]');
            if (fileInput && e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelection(fileInput);
            }
        }
    });
}

function handleFileSelection(input) {
    const files = Array.from(input.files);
    const uploadType = input.closest('.upload-area').getAttribute('data-upload-type');
    const previewContainer = document.getElementById(`${uploadType}-preview`);
    
    if (!previewContainer) return;
    
    // Store files for later upload
    if (!uploadedFiles[uploadType]) {
        uploadedFiles[uploadType] = [];
    }
    
    if (input.multiple) {
        uploadedFiles[uploadType] = uploadedFiles[uploadType].concat(files);
    } else {
        uploadedFiles[uploadType] = files;
    }
    
    // Show preview
    showFilePreview(uploadType, uploadedFiles[uploadType], previewContainer);
}

function showFilePreview(type, files, container) {
    container.innerHTML = files.map((file, index) => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        
        return `
            <div class="file-preview-item">
                ${isImage ? `
                    <img src="${URL.createObjectURL(file)}" alt="Preview" class="w-16 h-16 object-cover rounded">
                ` : isVideo ? `
                    <video src="${URL.createObjectURL(file)}" class="w-16 h-16 object-cover rounded" muted></video>
                ` : `
                    <div class="w-16 h-16 bg-gray-600 rounded flex items-center justify-center">
                        <i class="fas fa-file text-2xl"></i>
                    </div>
                `}
                <div class="flex-1">
                    <p class="text-sm font-medium truncate">${file.name}</p>
                    <p class="text-xs text-gray-400">${formatFileSize(file.size)}</p>
                </div>
                <button type="button" class="remove-file" onclick="removeFile('$${type}', $${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }).join('');
}

function removeFile(type, index) {
    if (uploadedFiles[type]) {
        uploadedFiles[type].splice(index, 1);
        const previewContainer = document.getElementById(`${type}-preview`);
        if (previewContainer) {
            showFilePreview(type, uploadedFiles[type], previewContainer);
        }
    }
}

// Product Functions
async function showProductDetails(productId) {
    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
            
        if (error) throw error;
        
        const productModal = document.getElementById('productModal');
        const productModalContent = document.getElementById('productModalContent');
        
        if (!productModal || !productModalContent) return;
        
        productModalContent.innerHTML = `
            <div class="space-y-6">
                <div class="text-center">
                    <div class="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden">
                        ${product.icon_image ? 
                            `<img src="$${product.icon_image}" alt="$${product.name}" class="w-full h-full object-cover">` :
                            '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl"><i class="fas fa-gamepad"></i></div>'
                        }
                    </div>
                    <h2 class="text-2xl font-bold text-white mb-2">${product.name}</h2>
                    <div class="text-cyan-400 text-3xl font-bold">${formatPrice(product.price)} MMK</div>
                </div>
                
                <div class="text-gray-300">
                    <h3 class="text-white font-bold mb-2">ဖော်ပြချက်:</h3>
                    <p>${product.description || 'ဖော်ပြချက်မရှိပါ'}</p>
                </div>
                
                <div class="text-gray-300">
                    <h3 class="text-white font-bold mb-2">အမျိုးအစား:</h3>
                    <span class="px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-full">
                        ${product.product_type === 'apk' ? 'APK ဖိုင်' : 'Game Account'}
                    </span>
                </div>
                
                ${product.gallery_images && product.gallery_images.length > 0 ? `
                    <div>
                        <h3 class="text-white font-bold mb-2">ပုံများ:</h3>
                        <div class="image-gallery">
                            ${product.gallery_images.map(img => `
                                <div class="gallery-item">
                                    <img src="$${img}" alt="Product Image" onclick="showImageModal('$${img}')">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <button onclick="showPurchaseModal('${product.id}')" class="neon-btn w-full">
                    <i class="fas fa-shopping-cart mr-2"></i>
                    ဝယ်ယူရန်
                </button>
            </div>
        `;
        
        productModal.classList.add('active');
        
    } catch (error) {
        console.error('Error loading product details:', error);
        showNotification('ကုန်ပစ္စည်းအချက်အလက် ရယူခြင်း မအောင်မြင်ပါ', 'error');
    }
}

async function showPurchaseModal(productId) {
    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
            
        if (error) throw error;
        
        // Load payment methods
        const { data: paymentMethods, error: paymentError } = await supabase
            .from('payment_methods')
            .select('*')
            .eq('is_active', true);
            
        if (paymentError) throw paymentError;
        
        const purchaseModal = document.getElementById('purchaseModal');
        const purchaseModalContent = document.getElementById('purchaseModalContent');
        
        if (!purchaseModal || !purchaseModalContent) return;
        
        purchaseModalContent.innerHTML = `
            <form id="purchaseForm" class="space-y-6">
                <input type="hidden" name="product_id" value="${product.id}">
                <input type="hidden" name="seller_id" value="${product.seller_id}">
                <input type="hidden" name="amount" value="${product.price}">
                
                <div class="text-center border-b border-gray-600 pb-6">
                    <div class="w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden">
                        ${product.icon_image ? 
                            `<img src="$${product.icon_image}" alt="$${product.name}" class="w-full h-full object-cover">` :
                            '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl"><i class="fas fa-gamepad"></i></div>'
                        }
                    </div>
                    <h3 class="text-white font-bold">${product.name}</h3>
                    <div class="text-cyan-400 text-2xl font-bold">${formatPrice(product.price)} MMK</div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">ငွေပေးချေမှုနည်းလမ်း ရွေးချယ်ပါ:</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${paymentMethods.map(method => `
                            <div class="payment-method" onclick="selectPaymentMethod('${method.id}', this)">
                                <div class="payment-qr">
                                    <img src="$${method.qr_code}" alt="$${method.name}">
                                </div>
                                <h4 class="font-bold">${method.name}</h4>
                                <p class="text-sm">${method.details}</p>
                                <input type="radio" name="payment_method_id" value="${method.id}" class="hidden">
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">ငွေလွှဲပြေစာ အပ်လုဒ်လုပ်ပါ:</label>
                    <div class="upload-area" data-upload-type="receipt">
                        <input type="file" name="payment_receipt" accept="image/*" class="hidden" required>
                        <i class="fas fa-receipt text-3xl text-gray-400 mb-2"></i>
                        <p class="text-gray-400">ပြေစာပုံရွေးရန် နှိပ်ပါ</p>
                    </div>
                    <div class="file-preview" id="receipt-preview"></div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">မှတ်ချက် (ရွေးချယ်ရန်):</label>
                    <textarea name="notes" class="cyber-input" rows="3" placeholder="အပိုမှတ်ချက်များ..."></textarea>
                </div>
                
                <button type="submit" class="neon-btn w-full">
                    <i class="fas fa-credit-card mr-2"></i>
                    မှာယူမှုတင်ရန်
                </button>
            </form>
        `;
        
        purchaseModal.classList.add('active');
        
        // Add form submission handler
        document.getElementById('purchaseForm')?.addEventListener('submit', handlePurchaseSubmission);
        
    } catch (error) {
        console.error('Error loading purchase modal:', error);
        showNotification('မှာယူမှုဖောင် ရယူခြင်း မအောင်မြင်ပါ', 'error');
    }
}

function selectPaymentMethod(methodId, element) {
    // Remove selection from all payment methods
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected');
    });
    
    // Select current method
    element.classList.add('selected');
    element.querySelector('input[type="radio"]').checked = true;
}

async function handlePurchaseSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    if (!formData.get('payment_method_id')) {
        showNotification('ငွေပေးချေမှုနည်းလမ်း ရွေးချယ်ပါ', 'error');
        return;
    }
    
    if (!formData.get('payment_receipt')) {
        showNotification('ငွေလွှဲပြေစာ အပ်လုဒ်လုပ်ပါ', 'error');
        return;
    }
    
    try {
        showNotification('မှာယူမှု တင်သွင်းနေသည်...', 'warning');
        
        // Upload payment receipt
        const receiptFile = formData.get('payment_receipt');
        const receiptFileName = `receipt_$${currentUser.id}_$${Date.now()}.${receiptFile.name.split('.').pop()}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('payment-receipts')
            .upload(receiptFileName, receiptFile);
            
        if (uploadError) throw uploadError;
        
        const receiptUrl = supabase.storage
            .from('payment-receipts')
            .getPublicUrl(receiptFileName).data.publicUrl;
        
        // Create order
        const { error: orderError } = await supabase
            .from('orders')
            .insert([{
                buyer_id: currentUser.id,
                product_id: formData.get('product_id'),
                seller_id: formData.get('seller_id'),
                payment_method_id: formData.get('payment_method_id'),
                amount: parseFloat(formData.get('amount')),
                payment_receipt: receiptUrl,
                notes: formData.get('notes'),
                status: 'pending'
            }]);
            
        if (orderError) throw orderError;
        
        showNotification('မှာယူမှု အောင်မြင်စွာတင်ပြီးပါပြီ', 'success');
        closeModals();
        
        // Reload order history if on history page
        if (currentPage === 'history') {
            await loadOrderHistory();
        }
        
    } catch (error) {
        console.error('Purchase submission failed:', error);
        showNotification(error.message || 'မှာယူမှု မအောင်မြင်ပါ', 'error');
    }
}

// News Functions
async function showNewsDetails(newsId) {
    try {
        const { data: news, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', newsId)
            .single();
            
        if (error) throw error;
        
        const newsModal = document.getElementById('newsModal');
        const newsModalContent = document.getElementById('newsModalContent');
        
        if (!newsModal || !newsModalContent) return;
        
        newsModalContent.innerHTML = `
            <div class="space-y-6">
                <h2 class="text-2xl font-bold text-white">${news.title}</h2>
                
                ${news.video_url ? `
                    <div class="rounded-lg overflow-hidden">
                        <video controls class="w-full">
                            <source src="${news.video_url}" type="video/mp4">
                        </video>
                    </div>
                ` : ''}
                
                ${news.images && news.images.length > 0 ? `
                    <div class="image-gallery">
                        ${news.images.map(img => `
                            <div class="gallery-item">
                                <img src="$${img}" alt="News Image" onclick="showImageModal('$${img}')">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="text-gray-300 leading-relaxed">
                    ${news.content.replace(/\n/g, '<br>')}
                </div>
                
                <div class="text-gray-400 text-sm border-t border-gray-600 pt-4">
                    <i class="fas fa-calendar-alt mr-1"></i>
                    ${formatDate(news.created_at)}
                </div>
            </div>
        `;
        
        newsModal.classList.add('active');
        
    } catch (error) {
        console.error('Error loading news details:', error);
        showNotification('သတင်းအချက်အလက် ရယူခြင်း မအောင်မြင်ပါ', 'error');
    }
}

// Order Functions
async function downloadOrderFiles(orderId) {
    try {
        showNotification('ဖိုင်များ ပြင်ဆင်နေသည်...', 'warning');
        
        const { data: order, error } = await supabase
            .from('orders')
            .select(`
                *,
                products(apk_file, gallery_images)
            `)
            .eq('id', orderId)
            .single();
            
        if (error) throw error;
        
        if (!order.download_approved) {
            showNotification('ဖိုင်ဒေါင်းလုဒ် ခွင့်ပြုချက်မရှိပါ', 'error');
            return;
        }
        
        const files = [];
        
        // Add APK file if exists
        if (order.products.apk_file) {
            files.push({
                url: order.products.apk_file,
                name: 'product_file.apk'
            });
        }
        
        // Add gallery images if exist
        if (order.products.gallery_images && order.products.gallery_images.length > 0) {
            order.products.gallery_images.forEach((img, index) => {
                files.push({
                    url: img,
                    name: `image_${index + 1}.jpg`
                });
            });
        }
        
        if (files.length === 0) {
            showNotification('ဒေါင်းလုဒ်ရန် ဖိုင်များမရှိပါ', 'warning');
            return;
        }
        
        // Download files
        for (const file of files) {
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        showNotification('ဖိုင်ဒေါင်းလုဒ် စတင်ပြီးပါပြီ', 'success');
        
    } catch (error) {
        console.error('Error downloading files:', error);
        showNotification('ဖိုင်ဒေါင်းလုဒ် မအောင်မြင်ပါ', 'error');
    }
}

async function showOrderSlip(orderId) {
    try {
        const { data: order, error } = await supabase
            .from('orders')
            .select(`
                *,
                products(name, icon_image),
                users!orders_buyer_id_fkey(name, username, profile_image)
            `)
            .eq('id', orderId)
            .single();
            
        if (error) throw error;
        
        if (!order.order_slip) {
            showNotification('မှာယူမှုစာရွက် မရှိပါ', 'error');
            return;
        }
        
        const orderSlipModal = document.getElementById('orderSlipModal');
        const orderSlipContent = document.getElementById('orderSlipContent');
        
        if (!orderSlipModal || !orderSlipContent) return;
        
        orderSlipContent.innerHTML = `
            <div class="order-slip">
                <div class="slip-header">
                    <div class="slip-logo">MMR GAMING SHOP</div>
                    <p class="text-sm">မှာယူမှု အောင်မြင်မှု စာရွက်</p>
                </div>
                
                <div class="slip-details">
                    <div class="flex items-center justify-center mb-4">
                        <div class="w-16 h-16 rounded-full overflow-hidden mr-4">
                            ${order.users.profile_image ? 
                                `<img src="${order.users.profile_image}" alt="Profile" class="w-full h-full object-cover">` :
                                '<div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white"><i class="fas fa-user"></i></div>'
                            }
                        </div>
                        <div>
                            <h3 class="font-bold">${order.users.name}</h3>
                            <p class="text-sm text-gray-600">@${order.users.username}</p>
                        </div>
                    </div>
                    
                    <div class="slip-row">
                        <span>မှာယူမှုနံပါတ်:</span>
                        <span>#${order.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div class="slip-row">
                        <span>ကုန်ပစ္စည်း:</span>
                        <span>${order.products.name}</span>
                    </div>
                    <div class="slip-row">
                        <span>မှာယူသည့်ရက်:</span>
                        <span>${formatDate(order.ordered_at)}</span>
                    </div>
                    <div class="slip-row">
                        <span>အတည်ပြုသည့်ရက်:</span>
                        <span>${formatDate(order.processed_at)}</span>
                    </div>
                    <div class="slip-row total">
                        <span>စုစုပေါင်း:</span>
                        <span>${formatPrice(order.amount)} MMK</span>
                    </div>
                </div>
                
                <div class="slip-footer">
                    <p>ကျေးဇူးတင်ပါသည်!</p>
                    <p>MMR GAMING SHOP မှ ဝယ်ယူအား ပေးမှုအတွက်</p>
                </div>
            </div>
            
            <div class="text-center mt-6">
                <button onclick="downloadOrderSlip('${orderId}')" class="neon-btn">
                    <i class="fas fa-download mr-2"></i>
                    စလစ်ဒေါင်းလုဒ်ရန်
                </button>
            </div>
        `;
        
        orderSlipModal.classList.add('active');
        
    } catch (error) {
        console.error('Error loading order slip:', error);
        showNotification('မှာယူမှုစာရွက် ရယူခြင်း မအောင်မြင်ပါ', 'error');
    }
}

async function downloadOrderSlip(orderId) {
    try {
        // This would generate and download the order slip as PDF/image
        // For now, we'll use html2canvas or similar library to convert the slip to image
        showNotification('စလစ်ဒေါင်းလုဒ် စတင်ပြီးပါပြီ', 'success');
        
    } catch (error) {
        console.error('Error downloading order slip:', error);
        showNotification('စလစ်ဒေါင်းလုဒ် မအောင်မြင်ပါ', 'error');
    }
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(price);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('my-MM', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getOrderStatusText(status) {
    switch (status) {
        case 'pending': return 'စောင့်ဆိုင်းနေသည်';
        case 'approved': return 'အတည်ပြုပြီး';
        case 'rejected': return 'ငြင်းပယ်ခံရ';
        default: return status;
    }
}

function getProductStatusText(status) {
    switch (status) {
        case 'pending': return 'စောင့်ဆိုင်းနေသည်';
        case 'approved': return 'အတည်ပြုပြီး';
        case 'rejected': return 'ငြင်းပယ်ခံရ';
        default: return status;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="ml-4">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function closeModals() {
    document.querySelectorAll('.cyber-modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

function showImageModal(imageUrl) {
    const modal = document.createElement('div');
    modal.className = 'cyber-modal active';
    modal.innerHTML = `
        <div class="modal-content max-w-4xl">
            <div class="text-center">
                <img src="${imageUrl}" alt="Image" class="max-w-full max-h-96 rounded-lg">
                <button onclick="this.closest('.cyber-modal').remove()" class="neon-btn mt-4">
                    ပိတ်ရန်
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialize file upload handling for seller products
document.addEventListener('submit', async function(e) {
    if (e.target.id === 'sellerProductForm') {
        e.preventDefault();
        await handleAddSellerProduct(e);
    }
});

async function handleAddSellerProduct(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    if (!formData.get('name') || !formData.get('product_type') || !formData.get('price')) {
        showNotification('အချက်အလက်များ ပြည့်စုံအောင် ထည့်ပါ', 'error');
        return;
    }
    
    if (!uploadedFiles['icon'] || uploadedFiles['icon'].length === 0) {
        showNotification('Icon ပုံ ရွေးချယ်ပါ', 'error');
        return;
    }
    
    try {
        showNotification('ကုန်ပစ္စည်း တင်သွင်းနေသည်...', 'warning');
        
        // Upload icon image
        const iconFile = uploadedFiles['icon'][0];
        const iconFileName = `product_icon_$${currentUser.id}_$${Date.now()}.${iconFile.name.split('.').pop()}`;
        
        const { data: iconUpload, error: iconError } = await supabase.storage
            .from('product-images')
            .upload(iconFileName, iconFile);
            
        if (iconError) throw iconError;
        
        const iconUrl = supabase.storage
            .from('product-images')
            .getPublicUrl(iconFileName).data.publicUrl;
        
        // Upload gallery images if any
        let galleryUrls = [];
        if (uploadedFiles['gallery'] && uploadedFiles['gallery'].length > 0) {
            const galleryUploads = uploadedFiles['gallery'].map(async (file, index) => {
                const fileName = `product_gallery_$${currentUser.id}_$${Date.now()}_$${index}.$${file.name.split('.').pop()}`;
                const { data, error } = await supabase.storage
                    .from('product-images')
                    .upload(fileName, file);
                    
                if (error) throw error;
                
                return supabase.storage
                    .from('product-images')
                    .getPublicUrl(fileName).data.publicUrl;
            });
            
            galleryUrls = await Promise.all(galleryUploads);
        }
        
        // Upload product files if any (for APK type)
        let fileUrls = [];
        if (formData.get('product_type') === 'apk' && uploadedFiles['files'] && uploadedFiles['files'].length > 0) {
            const fileUploads = uploadedFiles['files'].map(async (file, index) => {
                const fileName = `product_file_$${currentUser.id}_$${Date.now()}_$${index}.$${file.name.split('.').pop()}`;
                const { data, error } = await supabase.storage
                    .from('product-files')
                    .upload(fileName, file);
                    
                if (error) throw error;
                
                return {
                    url: supabase.storage.from('product-files').getPublicUrl(fileName).data.publicUrl,
                    name: file.name,
                    type: file.type
                };
            });
            
            fileUrls = await Promise.all(fileUploads);
        }
        
        // Upload video if any
        let videoUrl = null;
        if (uploadedFiles['video'] && uploadedFiles['video'].length > 0) {
            const videoFile = uploadedFiles['video'][0];
            const videoFileName = `product_video_$${currentUser.id}_$${Date.now()}.${videoFile.name.split('.').pop()}`;
            
            const { data: videoUpload, error: videoError } = await supabase.storage
                .from('product-images')
                .upload(videoFileName, videoFile);
                
            if (videoError) throw videoError;
            
            videoUrl = supabase.storage
                .from('product-images')
                .getPublicUrl(videoFileName).data.publicUrl;
        }
        
        // Create product record
        const productData = {
            user_id: currentUser.id,
            name: formData.get('name'),
            product_type: formData.get('product_type'),
            price: parseFloat(formData.get('price')),
            description: formData.get('description'),
            icon_image: iconUrl,
            gallery_images: galleryUrls,
            product_files: fileUrls,
            video_url: videoUrl,
            status: 'pending'
        };
        
        const { error: productError } = await supabase
            .from('users_products')
            .insert([productData]);
            
        if (productError) throw productError;
        
        showNotification('ကုန်ပစ္စည်း တင်သွင်းပြီးပါပြီ', 'success');
        
        // Clear form and uploaded files
        e.target.reset();
        uploadedFiles = {};
        document.querySelectorAll('.file-preview').forEach(preview => {
            preview.innerHTML = '';
        });
        
        // Refresh seller dashboard
        await showSellerDashboard();
        
    } catch (error) {
        console.error('Error adding seller product:', error);
        showNotification(error.message || 'ကုန်ပစ္စည်း တင်သွင်းခြင်း မအောင်မြင်ပါ', 'error');
    }
}

async function loadInitialData() {
    await Promise.all([
        loadProducts(),
        loadNews()
    ]);
}
