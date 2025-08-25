    // Initialize Supabase
        const SUPABASE_URL = 'https://rliwdosxsbauwxkayjoa.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsaXdkb3N4c2JhdXd4a2F5am9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMDA2NjIsImV4cCI6MjA2OTY3NjY2Mn0.uDvU9eX3Cy--D9l6daGaO2QMpn1YnxMJYVlbaeIgHu4';
        
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // Global variables
        let currentUser = null;
        let currentProducts = [];
        let currentNews = [];
        let currentOrders = [];

        // DOM Elements
        const loadingScreen = document.getElementById('loadingScreen');
        const app = document.getElementById('app');
        const authContainer = document.getElementById('authContainer');
        const dashboardContainer = document.getElementById('dashboardContainer');
        const loginPage = document.getElementById('loginPage');
        const registerPage = document.getElementById('registerPage');

        // Loading Animation
        function initLoadingAnimation() {
            const loadingText = document.getElementById('loadingText');
            const text = 'OPPERGAMING';
            loadingText.innerHTML = '';
            
            // Create letter elements
            for (let i = 0; i < text.length; i++) {
                const letter = document.createElement('span');
                letter.className = 'loading-letter';
                letter.textContent = text[i];
                letter.style.animationDelay = `${i * 0.2}s`;
                loadingText.appendChild(letter);
            }
            
            // Hide loading screen after animation
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    app.classList.remove('hidden');
                    checkAuth();
                }, 1000);
            }, 4000);
        }

        // Utility functions
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'} mr-2"></i>
                ${message}
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        function formatPrice(price) {
            return new Intl.NumberFormat('my-MM').format(price) + ' Ks';
        }

        function formatDate(date) {
            return new Date(date).toLocaleDateString('my-MM');
        }

        // Authentication functions
        async function checkAuth() {
            try {
                const sessionData = localStorage.getItem('mmr_gaming_session');
                if (sessionData) {
                    const session = JSON.parse(sessionData);
                    const { data: user } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.userId)
                        .single();
                    
                    if (user) {
                        currentUser = user;
                        showDashboard();
                        return;
                    }
                }
                showAuth();
            } catch (error) {
                console.error('Auth check error:', error);
                showAuth();
            }
        }

        async function login(email, password) {
            try {
                const { data: user } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', email)
                    .eq('password', password)
                    .single();

                if (user) {
                    currentUser = user;
                    localStorage.setItem('mmr_gaming_session', JSON.stringify({
                        userId: user.id,
                        timestamp: Date.now()
                    }));
                    showDashboard();
                    showNotification('အကောင့်ဝင်ရောက်မှု အောင်မြင်ပါသည်');
                } else {
                    throw new Error('Invalid credentials');
                }
            } catch (error) {
                throw new Error('Email သို့မဟုတ် Password မှားယွင်းနေပါသည်');
            }
        }

        async function register(name, username, email, password) {
            try {
                // Check if email already exists
                const { data: existingEmail } = await supabase
                    .from('users')
                    .select('email')
                    .eq('email', email)
                    .single();

                if (existingEmail) {
                    throw new Error('ဤ Gmail ကို အကောင့်ဖွင့်ထားပြီးဖြစ်ပါသည်');
                }

                // Check if username already exists
                const { data: existingUsername } = await supabase
                    .from('users')
                    .select('username')
                    .eq('username', username)
                    .single();

                if (existingUsername) {
                    throw new Error('ဤ Username ကို အသုံးပြုထားပြီးဖြစ်ပါသည်');
                }

                // Check if email is blocked
                const { data: blockedUser } = await supabase
                    .from('blocked_users')
                    .select('email')
                    .eq('email', email)
                    .single();

                if (blockedUser) {
                    throw new Error('ဤ Gmail သည် ပိတ်ပင်ခံထားရပါသည်');
                }

                // Create new user
                const { data: user, error } = await supabase
                    .from('users')
                    .insert([{
                        name,
                        username,
                        email,
                        password,
                        created_at: new Date().toISOString()
                    }])
                    .select()
                    .single();

                if (error) throw error;

                currentUser = user;
                localStorage.setItem('mmr_gaming_session', JSON.stringify({
                    userId: user.id,
                    timestamp: Date.now()
                }));
                showDashboard();
                showNotification('အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်');
            } catch (error) {
                throw error;
            }
        }

        function logout() {
            localStorage.removeItem('mmr_gaming_session');
            currentUser = null;
            showAuth();
            showNotification('အကောင့်မှ ထွက်ခြင်း အောင်မြင်ပါသည်', 'warning');
        }

        // UI functions
        function showAuth() {
            authContainer.classList.remove('hidden');
            dashboardContainer.classList.add('hidden');
        }

        function showDashboard() {
            authContainer.classList.add('hidden');
            dashboardContainer.classList.remove('hidden');
            
            // Update user info
            document.getElementById('navUsername').textContent = currentUser.username;
            document.getElementById('profileName').value = currentUser.name || '';
            document.getElementById('profileUsername').value = currentUser.username || '';
            document.getElementById('profileEmail').value = currentUser.email || '';
            
            // Update avatars if profile image exists
            if (currentUser.profile_image) {
                const avatars = ['userAvatar', 'navAvatar', 'profileImage'];
                avatars.forEach(id => {
                    document.getElementById(id).src = currentUser.profile_image;
                });
            }
            
            // Load initial data
            loadProducts();
            loadNews();
            loadOrders();
            loadKYCStatus();
            loadAboutInfo();
            
            // Show home page by default
            showPage('home');
        }

        function showPage(pageName) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show selected page
            const page = document.getElementById(pageName + 'Page');
            if (page) {
                page.classList.add('active');
            }
            
            // Update nav active state
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            const activeNav = document.querySelector(`[data-page="${pageName}"]`);
            if (activeNav) {
                activeNav.classList.add('active');
            }
            
            // Close menu
            closeMenu();
        }

        function openMenu() {
            document.getElementById('navMenu').classList.add('active');
            document.getElementById('overlay').classList.add('active');
        }

        function closeMenu() {
            document.getElementById('navMenu').classList.remove('active');
            document.getElementById('overlay').classList.remove('active');
        }

        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        // Data loading functions
        async function loadProducts() {
            try {
                const { data: products } = await supabase
                    .from('products')
                    .select(`
                        *,
                        users(username, name)
                    `)
                    .eq('is_active', true)
                    .eq('status', 'approved');

                currentProducts = products || [];
                displayProducts();
            } catch (error) {
                console.error('Error loading products:', error);
                showNotification('ပစ္စည်းများ လွယ်ယူခြင်းမှာ အမှားရှိနေပါသည်', 'error');
            }
        }

        function displayProducts() {
            const grid = document.getElementById('productGrid');
            if (!currentProducts.length) {
                grid.innerHTML = `
                    <div class="col-span-full text-center neo-glass p-12 rounded-xl">
                        <i class="fas fa-box-open text-6xl text-cyan-400 mb-6"></i>
                        <p class="text-gray-300 text-xl">ပစ္စည်းများ မရှိသေးပါ</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = currentProducts.map(product => `
                <div class="product-card" onclick="showProductDetails('${product.id}')">
                    <div class="product-image">
                        ${product.icon_image ? 
                            `<img src="${product.icon_image}" alt="${product.name}" class="w-full h-full object-cover">` :
                            `<i class="fas fa-${product.product_type === 'apk' ? 'mobile-alt' : 'gamepad'}"></i>`
                        }
                    </div>
                    <div class="product-info">
                        <h3 class="font-bold text-lg mb-2 truncate">${product.name}</h3>
                        <p class="text-cyan-400 font-bold text-lg">${formatPrice(product.price)}</p>
                        <p class="text-gray-400 text-sm mt-2">ရောင်းချသူ: ${product.users?.username || 'Admin'}</p>
                    </div>
                </div>
            `).join('');
        }

        async function showProductDetails(productId) {
            const product = currentProducts.find(p => p.id === productId);
            if (!product) return;

            const modalContent = document.getElementById('productModalContent');
            modalContent.innerHTML = `
                <div class="space-y-6">
                    <div class="text-center">
                        ${product.icon_image ? 
                            `<img src="${product.icon_image}" alt="${product.name}" class="w-48 h-48 mx-auto rounded-xl shadow-lg object-cover">` :
                            `<div class="w-48 h-48 mx-auto bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                                <i class="fas fa-${product.product_type === 'apk' ? 'mobile-alt' : 'gamepad'} text-6xl text-white"></i>
                            </div>`
                        }
                        <h2 class="text-3xl font-bold mt-6 text-white">${product.name}</h2>
                        <p class="text-cyan-400 text-2xl font-bold">${formatPrice(product.price)}</p>
                        <p class="text-gray-400">ရောင်းချသူ: ${product.users?.username || 'Admin'}</p>
                    </div>
                    
                    ${product.description ? `<p class="text-gray-300 text-lg leading-relaxed">${product.description}</p>` : ''}
                    
                    ${product.gallery_images && product.gallery_images.length > 0 ? `
                        <div class="grid grid-cols-2 gap-4">
                            ${product.gallery_images.map(img => `<img src="${img}" class="rounded-lg w-full h-32 object-cover">`).join('')}
                        </div>
                    ` : ''}
                    
                    ${product.social_links ? `
                        <div class="flex justify-center space-x-4">
                            ${Object.entries(product.social_links).map(([platform, link]) => link ? `
                                <a href="${link}" target="_blank" class="social-icon ${platform}">
                                    <i class="fab fa-${platform}"></i>
                                </a>
                            ` : '').join('')}
                        </div>
                    ` : ''}
                    
                    <button class="neon-btn w-full text-lg py-4" onclick="initiatePurchase('${product.id}')">
                        <i class="fas fa-shopping-cart mr-2"></i>
                        ဝယ်ယူမည်
                    </button>
                </div>
            `;
            
            openModal('productModal');
        }

        async function initiatePurchase(productId) {
            const product = currentProducts.find(p => p.id === productId);
            if (!product) return;

            // Close product modal
            closeModal('productModal');

            // Load payment methods
            const { data: paymentMethods } = await supabase
                .from('payment_methods')
                .select('*')
                .eq('is_active', true);

            const modalContent = document.getElementById('purchaseModalContent');
            modalContent.innerHTML = `
                <div class="space-y-6">
                    <div class="text-center">
                        <h3 class="text-2xl font-bold text-white mb-2">${product.name}</h3>
                        <p class="text-cyan-400 text-xl font-bold">${formatPrice(product.price)}</p>
                    </div>
                    
                    <form id="purchaseForm" class="space-y-6">
                        <input type="hidden" id="purchaseProductId" value="${productId}">
                        
                        <div class="form-group">
                            <label class="form-label">ငွেပေးချေမှုနည်းလမ်း ရွေးချယ်မည်</label>
                            <select id="purchasePaymentMethod" class="cyber-input" required>
                                <option value="">ငွေပေးချေမှုနည်းလမ်း ရွေးချယ်ပါ</option>
                                ${paymentMethods.map(pm => `
                                    <option value="${pm.id}">${pm.name} - ${pm.details}</option>
                                `).join('')}
                            </select>
                        </div>
                        
                        <div id="paymentDetails" class="hidden">
                            <!-- Payment details will be shown here -->
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">ငွေလွှဲပြေစာ တင်ရန်</label>
                            <input type="file" id="purchaseReceipt" class="cyber-input" accept="image/*" required>
                            <p class="text-gray-400 text-sm mt-2">ငွေလွှဲပြေစာ ဓာတ်ပုံကို တင်ပေးပါ</p>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">မှတ်ချက် (မဖြစ်မနေ မလိုအပ်ပါ)</label>
                            <textarea id="purchaseNotes" class="cyber-input" rows="3" placeholder="ထပ်ဆောင်း မှတ်ချက်များ..."></textarea>
                        </div>
                        
                        <button type="submit" class="neon-btn w-full text-lg py-4">
                            မှာယူမည်
                        </button>
                    </form>
                </div>
            `;

            // Handle payment method change
            document.getElementById('purchasePaymentMethod').addEventListener('change', async function() {
                const paymentMethodId = this.value;
                if (paymentMethodId) {
                    const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
                    if (paymentMethod) {
                        document.getElementById('paymentDetails').innerHTML = `
                            <div class="neo-glass p-6 rounded-xl">
                                <h4 class="text-white font-bold mb-4">${paymentMethod.name}</h4>
                                <p class="text-gray-300 mb-4">${paymentMethod.details}</p>
                                ${paymentMethod.description ? `<p class="text-gray-400 text-sm mb-4">${paymentMethod.description}</p>` : ''}
                                ${paymentMethod.qr_code ? `
                                    <div class="text-center">
                                        <img src="${paymentMethod.qr_code}" alt="QR Code" class="w-48 h-48 mx-auto rounded-lg">
                                        <p class="text-gray-400 text-sm mt-2">QR Code ကို scan လုပ်ပြીး ငွေလွှဲပေးပါ</p>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                        document.getElementById('paymentDetails').classList.remove('hidden');
                    }
                } else {
                    document.getElementById('paymentDetails').classList.add('hidden');
                }
            });

            // Handle purchase form submission
            document.getElementById('purchaseForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData();
                const receiptFile = document.getElementById('purchaseReceipt').files[0];
                
                if (!receiptFile) {
                    showNotification('ငွေလွှဲပြေစာ တင်ပေးပါ', 'error');
                    return;
                }

                try {
                    showNotification('မှာယူမှု ပေးပို့နေပါသည်...', 'warning');

                    // Upload receipt
                    const fileName = `receipt_${Date.now()}.${receiptFile.name.split('.').pop()}`;
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('payment-receipts')
                        .upload(fileName, receiptFile);

                    if (uploadError) throw uploadError;

                    // Get file URL
                    const { data: urlData } = supabase.storage
                        .from('payment-receipts')
                        .getPublicUrl(fileName);

                    // Create order
                    const { data: order, error: orderError } = await supabase
                        .from('orders')
                        .insert([{
                            buyer_id: currentUser.id,
                            product_id: productId,
                            seller_id: product.seller_id,
                            payment_method_id: document.getElementById('purchasePaymentMethod').value,
                            amount: product.price,
                            payment_receipt: urlData.publicUrl,
                            notes: document.getElementById('purchaseNotes').value,
                            ordered_at: new Date().toISOString()
                        }])
                        .select()
                        .single();

                    if (orderError) throw orderError;

                    closeModal('purchaseModal');
                    showNotification('မှာယူမှု အောင်မြင်ပါသည်! အတည်ပြုချက်ကို စောင့်ဆိုင်းပါ');
                    loadOrders(); // Refresh orders
                } catch (error) {
                    console.error('Purchase error:', error);
                    showNotification('မှာယူမှုမှာ အမှားရှိနေပါသည်', 'error');
                }
            });

            openModal('purchaseModal');
        }

        async function loadNews() {
            try {
                const { data: news } = await supabase
                    .from('news')
                    .select('*')
                    .eq('is_published', true)
                    .order('created_at', { ascending: false });

                currentNews = news || [];
                displayNews();
            } catch (error) {
                console.error('Error loading news:', error);
            }
        }

        function displayNews() {
            const grid = document.getElementById('newsGrid');
            if (!currentNews.length) {
                grid.innerHTML = `
                    <div class="text-center neo-glass p-12 rounded-xl">
                        <i class="fas fa-newspaper text-6xl text-cyan-400 mb-6"></i>
                        <p class="text-gray-300 text-xl">သတင်းများ မရှိသေးပါ</p>
                    </div>
                `;
                return;
            }

            grid.innerHTML = currentNews.map(news => `
                <div class="cyber-card p-6 cursor-pointer" onclick="showNewsDetails('${news.id}')">
                    <div class="flex space-x-4">
                        <div class="flex-shrink-0">
                            ${news.images && news.images[0] ? 
                                `<img src="${news.images[0]}" alt="${news.title}" class="w-20 h-20 rounded-lg object-cover">` :
                                `<div class="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                                    <i class="fas fa-newspaper text-2xl text-white"></i>
                                </div>`
                            }
                        </div>
                        <div class="flex-1">
                            <h3 class="text-white font-bold text-lg mb-2">${news.title}</h3>
                            <p class="text-gray-300 line-clamp-2">${news.content.substring(0, 100)}...</p>
                            <p class="text-gray-400 text-sm mt-2">${formatDate(news.created_at)}</p>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        async function showNewsDetails(newsId) {
            const news = currentNews.find(n => n.id === newsId);
            if (!news) return;

            const modalContent = document.getElementById('newsModalContent');
            modalContent.innerHTML = `
                <div class="space-y-6">
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-4">${news.title}</h2>
                        <p class="text-gray-400 text-sm mb-6">${formatDate(news.created_at)}</p>
                    </div>
                    
                    ${news.video_url ? `
                        <div class="text-center">
                            <video controls class="w-full rounded-lg max-h-64">
                                <source src="${news.video_url}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    ` : ''}
                    
                    ${news.images && news.images.length > 0 ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${news.images.map(img => `<img src="${img}" class="rounded-lg w-full h-48 object-cover">`).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="text-gray-300 leading-relaxed">
                        ${news.content.replace(/\n/g, '<br>')}
                    </div>
                    
                    ${news.social_links ? `
                        <div class="flex justify-center space-x-4 pt-6 border-t border-gray-600">
                            ${Object.entries(news.social_links).map(([platform, link]) => link ? `
                                <a href="${link}" target="_blank" class="social-icon ${platform}">
                                    <i class="fab fa-${platform}"></i>
                                </a>
                            ` : '').join('')}
                        </div>
                    ` : ''}
                </div>
            `;
            
            openModal('newsModal');
        }

        async function loadOrders() {
            try {
                const { data: orders } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        product:products(name, price, product_type),
                        seller:users!orders_seller_id_fkey(username, name)
                    `)
                    .eq('buyer_id', currentUser.id)
                    .order('ordered_at', { ascending: false });

                currentOrders = orders || [];
                displayOrders();
            } catch (error) {
                console.error('Error loading orders:', error);
            }
        }

        function displayOrders() {
            const container = document.getElementById('orderHistory');
            if (!currentOrders.length) {
                container.innerHTML = `
                    <div class="text-center neo-glass p-12 rounded-xl">
                        <i class="fas fa-history text-6xl text-cyan-400 mb-6"></i>
                        <p class="text-gray-300 text-xl">မှာယူမှတ်တမ်း မရှိသေးပါ</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = currentOrders.map(order => `
                <div class="cyber-card p-6">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <h3 class="text-white font-bold text-lg mb-2">${order.product?.name || 'N/A'}</h3>
                            <p class="text-gray-300 mb-1">ရောင်းချသူ: ${order.seller?.username || 'N/A'}</p>
                            <p class="text-cyan-400 font-bold">${formatPrice(order.amount)}</p>
                            <p class="text-gray-400 text-sm mt-2">${formatDate(order.ordered_at)}</p>
                            ${order.notes ? `<p class="text-gray-300 text-sm mt-2">မှတ်ချက်: ${order.notes}</p>` : ''}
                        </div>
                        <div class="text-right">
                            <span class="status-${order.status} px-3 py-1 rounded-full text-sm font-bold">
                                ${order.status === 'pending' ? 'စောင့်ဆိုင်းနေ' : 
                                  order.status === 'approved' ? 'အတည်ပြုပြီး' : 'ငြင်းပယ်ပြီး'}
                            </span>
                            ${order.status === 'approved' && order.download_approved ? `
                                <button class="neon-btn mt-2 text-sm py-2 px-4" onclick="downloadProduct('${order.id}')">
                                    <i class="fas fa-download mr-1"></i> Download
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }

        async function downloadProduct(orderId) {
            try {
                const order = currentOrders.find(o => o.id === orderId);
                if (!order || !order.product) {
                    showNotification('ဖိုင်မတွေ့ပါ', 'error');
                    return;
                }

                // Get product details
                const { data: product } = await supabase
                    .from('products')
                    .select('apk_file')
                    .eq('id', order.product_id)
                    .single();

                if (product && product.apk_file) {
                    // Create download link
                    const link = document.createElement('a');
                    link.href = product.apk_file;
                    link.download = `${order.product.name}.apk`;
                    link.click();
                    
                    showNotification('ဖိုင် Download ပြုလုပ်နေပါသည်');
                } else {
                    showNotification('Download ဖိုင်မရှိပါ', 'error');
                }
            } catch (error) {
                console.error('Download error:', error);
                showNotification('Download တွင် အမှားရှိနေပါသည်', 'error');
            }
        }

        async function loadKYCStatus() {
            try {
                const { data: kyc } = await supabase
                    .from('kyc_verifications')
                    .select('*')
                    .eq('user_id', currentUser.id)
                    .order('submitted_at', { ascending: false })
                    .limit(1)
                    .single();

                displayKYCStatus(kyc);
                
                // Update seller content based on KYC status
                updateSellerContent(kyc);
            } catch (error) {
                console.error('Error loading KYC status:', error);
                displayKYCStatus(null);
                updateSellerContent(null);
            }
        }

        function displayKYCStatus(kyc) {
            const statusContainer = document.getElementById('kycStatus');
            
            if (!kyc) {
                statusContainer.innerHTML = `
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle text-4xl text-yellow-400 mb-4"></i>
                        <h4 class="text-white font-bold mb-2">KYC မတင်ရသေးပါ</h4>
                        <p class="text-gray-300 mb-4">ပစ္စည်းများ ရောင်းချနိုင်ရန် KYC အတည်ပြုချက် လိုအပ်ပါသည်</p>
                        <button onclick="openModal('kycModal')" class="neon-btn">KYC တင်မည်</button>
                    </div>
                `;
                return;
            }

            let statusIcon, statusText, statusColor;
            switch (kyc.status) {
                case 'pending':
                    statusIcon = 'clock';
                    statusText = 'စစ်ဆေးနေပါသည်';
                    statusColor = 'text-yellow-400';
                    break;
                case 'approved':
                    statusIcon = 'check-circle';
                    statusText = 'အတည်ပြုပြီး';
                    statusColor = 'text-green-400';
                    break;
                case 'rejected':
                    statusIcon = 'times-circle';
                    statusText = 'ငြင်းပယ်ပြီး';
                    statusColor = 'text-red-400';
                    break;
            }

            statusContainer.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-${statusIcon} text-4xl ${statusColor} mb-4"></i>
                    <h4 class="text-white font-bold mb-2">KYC ${statusText}</h4>
                    <p class="text-gray-300 mb-2">တင်ပြီးသည့်ရက်: ${formatDate(kyc.submitted_at)}</p>
                    ${kyc.reviewed_at ? `<p class="text-gray-300 mb-2">စစ်ဆေးပြီးသည့်ရက်: ${formatDate(kyc.reviewed_at)}</p>` : ''}
                    ${kyc.admin_notes ? `<p class="text-gray-300 text-sm mt-4 p-3 bg-gray-800 rounded-lg">မှတ်ချက်: ${kyc.admin_notes}</p>` : ''}
                    ${kyc.status === 'rejected' ? `
                        <button onclick="openModal('kycModal')" class="neon-btn mt-4">ပြန်လည်တင်မည်</button>
                    ` : ''}
                </div>
            `;
        }

        function updateSellerContent(kyc) {
            const sellerContent = document.getElementById('sellerContent');
            
            if (kyc && kyc.status === 'approved') {
                // User is approved seller, show seller dashboard
                sellerContent.innerHTML = `
                    <div class="space-y-6">
                        <div class="text-center mb-8">
                            <i class="fas fa-store text-6xl text-green-400 mb-4"></i>
                            <h3 class="text-2xl font-bold text-white mb-2">ရောင်းချသူ Dashboard</h3>
                            <p class="text-gray-300">သင်သည် အတည်ပြုခံရသော ရောင်းချသူဖြစ်ပါသည်</p>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button onclick="openAddProductModal()" class="cyber-card p-6 text-center hover:scale-105 transition-transform">
                                <i class="fas fa-plus-circle text-4xl text-cyan-400 mb-4"></i>
                                <h4 class="text-white font-bold text-lg mb-2">ပစ္စည်းအသစ်တင်မည်</h4>
                                <p class="text-gray-300">APK သို့မဟုတ် Game Account တင်ရန်</p>
                            </button>
                            
                            <button onclick="loadMyProducts()" class="cyber-card p-6 text-center hover:scale-105 transition-transform">
                                <i class="fas fa-box text-4xl text-cyan-400 mb-4"></i>
                                <h4 class="text-white font-bold text-lg mb-2">ကျွန်ုပ်၏ ပစ္စည်းများ</h4>
                                <p class="text-gray-300">တင်ထားသော ပစ္စည်းများကို ကြည့်ရန်</p>
                            </button>
                            
                            <button onclick="loadMyOrders()" class="cyber-card p-6 text-center hover:scale-105 transition-transform">
                                <i class="fas fa-shopping-cart text-4xl text-cyan-400 mb-4"></i>
                                <h4 class="text-white font-bold text-lg mb-2">ရောင်းချမှုများ</h4>
                                <p class="text-gray-300">မှာယူမှုများကို စီမံခန့်ခွဲရန်</p>
                            </button>
                            
                            <button onclick="openAddPaymentModal()" class="cyber-card p-6 text-center hover:scale-105 transition-transform">
                                <i class="fas fa-credit-card text-4xl text-cyan-400 mb-4"></i>
                                <h4 class="text-white font-bold text-lg mb-2">ငွေလက်ခံမှုနည်းလမ်း</h4>
                                <p class="text-gray-300">ငွေလက်ခံမှုနည်းလမ်း ထည့်ရန်</p>
                            </button>
                        </div>
                    </div>
                `;
            }
        }

        async function loadAboutInfo() {
            try {
                const { data: about } = await supabase
                    .from('about')
                    .select('*')
                    .eq('is_active', true)
                    .single();

                if (about && about.social_links) {
                    const socialLinks = document.getElementById('socialLinks');
                    const links = about.social_links;
                    
                    if (links.telegram) {
                        socialLinks.querySelector('.telegram').href = links.telegram;
                    }
                    if (links.youtube) {
                        socialLinks.querySelector('.youtube').href = links.youtube;
                    }
                    if (links.viber) {
                        socialLinks.querySelector('.viber').href = links.viber;
                    }
                    if (links.wechat) {
                        socialLinks.querySelector('.wechat').href = links.wechat;
                    }
                }
            } catch (error) {
                console.error('Error loading about info:', error);
            }
        }

        // Event Listeners
        document.addEventListener('DOMContentLoaded', function() {
            initLoadingAnimation();
            
            // Auth form handlers
            document.getElementById('loginForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                const submitBtn = document.getElementById('loginBtnText');
                const loader = document.getElementById('loginLoader');
                
                submitBtn.textContent = 'စောင့်ပေးပါ...';
                loader.classList.remove('hidden');
                
                try {
                    await login(email, password);
                } catch (error) {
                    showNotification(error.message, 'error');
                } finally {
                    submitBtn.textContent = 'အကောင့်ဝင်ရောက်မည်';
                    loader.classList.add('hidden');
                }
            });

            document.getElementById('registerForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const name = document.getElementById('registerName').value;
                const username = document.getElementById('registerUsername').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const submitBtn = document.getElementById('registerBtnText');
                const loader = document.getElementById('registerLoader');
                
                submitBtn.textContent = 'စောင့်ပေးပါ...';
                loader.classList.remove('hidden');
                
                try {
                    await register(name, username, email, password);
                } catch (error) {
                    showNotification(error.message, 'error');
                } finally {
                    submitBtn.textContent = 'အကောင့်ဖွင့်မည်';
                    loader.classList.add('hidden');
                }
            });

            // Toggle between login and register
            document.getElementById('showRegister').addEventListener('click', function(e) {
                e.preventDefault();
                loginPage.classList.add('hidden');
                registerPage.classList.remove('hidden');
            });

            document.getElementById('showLogin').addEventListener('click', function(e) {
                e.preventDefault();
                registerPage.classList.add('hidden');
                loginPage.classList.remove('hidden');
            });

            // Menu handlers
            document.getElementById('menuBtn').addEventListener('click', openMenu);
            document.getElementById('overlay').addEventListener('click', closeMenu);
            document.getElementById('logoutBtn').addEventListener('click', logout);

            // Navigation items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const page = this.getAttribute('data-page');
                    showPage(page);
                });
            });

            // Modal close buttons
            document.querySelectorAll('.modal-close').forEach(btn => {
                btn.addEventListener('click', function() {
                    const modal = this.closest('.cyber-modal');
                    modal.classList.remove('active');
                });
            });

            // KYC modal handlers
            document.getElementById('kycBtn').addEventListener('click', function() {
                openModal('kycModal');
            });

            document.getElementById('kycDocType').addEventListener('change', function() {
                const docType = this.value;
                const docFields = document.getElementById('kycDocFields');
                
                if (docType === 'nrc') {
                    docFields.innerHTML = `
                        <div class="grid grid-cols-2 gap-4">
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
                            <div class="form-group">
                                <label class="form-label">အမှတ်</label>
                                <input type="text" id="kycNrcNumber" class="cyber-input" required>
                            </div>
                        </div>
                    `;
                } else if (docType === 'passport') {
                    docFields.innerHTML = `
                        <div class="form-group">
                            <label class="form-label">Passport အမှတ်</label>
                            <input type="text" id="kycPassportNumber" class="cyber-input" required>
                        </div>
                    `;
                } else if (docType === 'driver') {
                    docFields.innerHTML = `
                        <div class="form-group">
                            <label class="form-label">ယာဉ်မောင်းလိုင်စင် အမှတ်</label>
                            <input type="text" id="kycLicenseNumber" class="cyber-input" required>
                        </div>
                    `;
                } else {
                    docFields.innerHTML = '';
                }
            });

            document.getElementById('kycForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                try {
                    showNotification('KYC အချက်အလက်များ ပေးပို့နေပါသည်...', 'warning');

                    const formData = {
                        user_id: currentUser.id,
                        full_name: document.getElementById('kycName').value,
                        date_of_birth: document.getElementById('kycBirthdate').value,
                        document_type: document.getElementById('kycDocType').value,
                        address: document.getElementById('kycAddress').value
                    };

                    // Add document specific fields
                    if (formData.document_type === 'nrc') {
                        formData.nrc_state = document.getElementById('kycNrcState').value;
                        formData.nrc_township = document.getElementById('kycNrcTownship').value;
                        formData.nrc_district = document.getElementById('kycNrcDistrict').value;
                        formData.nrc_number = document.getElementById('kycNrcNumber').value;
                    } else if (formData.document_type === 'passport') {
                        formData.passport_number = document.getElementById('kycPassportNumber').value;
                    } else if (formData.document_type === 'driver') {
                        formData.license_number = document.getElementById('kycLicenseNumber').value;
                    }

                    // Upload documents
                    const frontFile = document.getElementById('kycDocFront').files[0];
                    const backFile = document.getElementById('kycDocBack').files[0];
                    const selfieFile = document.getElementById('kycSelfie').files[0];

                    // Upload front document
                    const frontFileName = `kyc_front_${currentUser.id}_${Date.now()}.${frontFile.name.split('.').pop()}`;
                    const { data: frontUpload, error: frontError } = await supabase.storage
                        .from('kyc-documents')
                        .upload(frontFileName, frontFile);

                    if (frontError) throw frontError;

                    // Upload back document
                    const backFileName = `kyc_back_${currentUser.id}_${Date.now()}.${backFile.name.split('.').pop()}`;
                    const { data: backUpload, error: backError } = await supabase.storage
                        .from('kyc-documents')
                        .upload(backFileName, backFile);

                    if (backError) throw backError;

                    // Upload selfie
                    const selfieFileName = `kyc_selfie_${currentUser.id}_${Date.now()}.${selfieFile.name.split('.').pop()}`;
                    const { data: selfieUpload, error: selfieError } = await supabase.storage
                        .from('kyc-documents')
                        .upload(selfieFileName, selfieFile);

                    if (selfieError) throw selfieError;

                    // Get URLs
                    const { data: frontUrl } = supabase.storage.from('kyc-documents').getPublicUrl(frontFileName);
                    const { data: backUrl } = supabase.storage.from('kyc-documents').getPublicUrl(backFileName);
                    const { data: selfieUrl } = supabase.storage.from('kyc-documents').getPublicUrl(selfieFileName);

                    formData.document_front = frontUrl.publicUrl;
                    formData.document_back = backUrl.publicUrl;
                    formData.selfie_with_document = selfieUrl.publicUrl;
                    formData.submitted_at = new Date().toISOString();

                    // Submit KYC
                    const { data: kyc, error: kycError } = await supabase
                        .from('kyc_verifications')
                        .insert([formData])
                        .select()
                        .single();

                    if (kycError) throw kycError;

                    closeModal('kycModal');
                    showNotification('KYC အချက်အလက်များ အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ!');
                    loadKYCStatus(); // Refresh KYC status
                } catch (error) {
                    console.error('KYC submission error:', error);
                    showNotification('KYC တင်ခြင်းတွင် အမှားရှိနေပါသည်', 'error');
                }
            });

            // Profile form handler
            document.getElementById('profileForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                try {
                    const updateData = {
                        name: document.getElementById('profileName').value,
                        username: document.getElementById('profileUsername').value,
                        email: document.getElementById('profileEmail').value
                    };

                    const newPassword = document.getElementById('profilePassword').value;
                    if (newPassword.trim()) {
                        updateData.password = newPassword;
                    }

                    const { data: updatedUser, error } = await supabase
                        .from('users')
                        .update(updateData)
                        .eq('id', currentUser.id)
                        .select()
                        .single();

                    if (error) throw error;

                    currentUser = updatedUser;
                    document.getElementById('navUsername').textContent = currentUser.username;
                    
                    showNotification('ကိုယ်ရေးအချက်အလက်များ ပြင်ဆင်ပြီးပါပြီ');
                } catch (error) {
                    console.error('Profile update error:', error);
                    showNotification('ပြင်ဆင်ခြင်းတွင် အမှားရှိနေပါသည်', 'error');
                }
            });

            // Profile image upload
            document.getElementById('profileImageUpload').addEventListener('change', async function(e) {
                const file = e.target.files[0];
                if (!file) return;

                try {
                    showNotification('ပုံတင်နေပါသည်...', 'warning');

                    const fileName = `profile_${currentUser.id}_${Date.now()}.${file.name.split('.').pop()}`;
                    const { data: uploadData, error: uploadError } = await supabase.storage
                        .from('profile-images')
                        .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('profile-images')
                        .getPublicUrl(fileName);

                    // Update user profile
                    const { data: updatedUser, error: updateError } = await supabase
                        .from('users')
                        .update({ profile_image: urlData.publicUrl })
                        .eq('id', currentUser.id)
                        .select()
                        .single();

                    if (updateError) throw updateError;

                    currentUser = updatedUser;
                    
                    // Update all avatar images
                    const avatars = ['userAvatar', 'navAvatar', 'profileImage'];
                    avatars.forEach(id => {
                        document.getElementById(id).src = urlData.publicUrl;
                    });

                    showNotification('ပုံတင်ခြင်း အောင်မြင်ပါသည်');
                } catch (error) {
                    console.error('Profile image upload error:', error);
                    showNotification('ပုံတင်ခြင်းတွင် အမှားရှိနေပါသည်', 'error');
                }
            });
        });

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
        // Additional utility functions for sellers (will be implemented when needed)
        function openAddProductModal() {
            showNotification('ဤ feature ကို မကြာမီ ထည့်သွင်းပေးပါမည်', 'warning');
        }

        function loadMyProducts() {
            showNotification('ဤ feature ကို မကြာမီ ထည့်သွင်းပေးပါမည်', 'warning');
        }

        function loadMyOrders() {
            showNotification('ဤ feature ကို မကြာမီ ထည့်သွင်းပေးပါမည်', 'warning');
        }

        function openAddPaymentModal() {
            showNotification('ဤ feature ကို မကြာမီ ထည့်သွင်းပေးပါမည်', 'warning');
        }

// Export for global access
window.showProductDetail = showProductDetail;
window.showNewsDetail = showNewsDetail;
window.showPurchaseModal = showPurchaseModal;
window.openKYCModal = openKYCModal;
