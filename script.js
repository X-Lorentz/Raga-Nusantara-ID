// =======================
// 🎮 RAGA NUSANTARA v3.0
// RPG Produktivitas Nusantara
// =======================

// Global Variables
let currentUser = null;
let level = 1, xp = 0, xpNeeded = 50, gold = 100, gems = 5;
let quests = [];
let avatar = "";
let musicPlaying = false;
let inventory = [];
let achievements = [];
let userStats = {
    totalXP: 0,
    tasksCompleted: 0,
    questsCompleted: 0,
    daysActive: 1,
    totalGoldEarned: 100
};

// Shop Items
const shopItems = [
    { id: "topi_kerajaan", name: "👑 Topi Kerajaan", price: 50, type: "head" },
    { id: "pedang_emas", name: "⚔️ Pedang Emas", price: 100, type: "weapon" },
    { id: "perisai_naga", name: "🛡️ Perisai Naga", price: 150, type: "shield" },
    { id: "jubah_sakti", name: "🧥 Jubah Sakti", price: 200, type: "armor" },
    { id: "sepatu_angin", name: "👟 Sepatu Angin", price: 80, type: "shoes" },
    { id: "kalung_mustika", name: "📿 Kalung Mustika", price: 120, type: "accessory" },
    { id: "cincin_ajaib", name: "💍 Cincin Ajaib", price: 75, type: "ring" }
];

// Achievements
const allAchievements = [
    { id: "first_quest", name: "Pendatang Baru", description: "Selesaikan quest pertama", icon: "🎯", unlocked: false },
    { id: "level_5", name: "Kesatria Pemula", description: "Capai level 5", icon: "⚔️", unlocked: false },
    { id: "level_10", name: "Kesatria Tangguh", description: "Capai level 10", icon: "🛡️", unlocked: false },
    { id: "rich", name: "Pedagang Kaya", description: "Kumpulkan 500 gold", icon: "💰", unlocked: false },
    { id: "shopper", name: "Kolektor", description: "Beli 3 item dari toko", icon: "🛒", unlocked: false },
    { id: "productive", name: "Produktif", description: "Selesaikan 10 tugas", icon: "✨", unlocked: false },
    { id: "dedicated", name: "Berkomitmen", description: "Aktif selama 7 hari", icon: "📅", unlocked: false }
];

// Initialize the game
function initGame() {
    initializeSampleUsers();
    setupEventListeners();
    checkExistingSession();
    initParticles();
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        if (!currentUser) {
            showPage('splashPage');
        }
    }, 2000);
}

// Check if user was already logged in
function checkExistingSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const users = getUsers();
        if (users[savedUser]) {
            loginUser(savedUser);
        }
    }
}

// User Management
function getUsers() {
    const users = localStorage.getItem('ragaNusantaraUsers');
    return users ? JSON.parse(users) : {};
}

function saveUsers(users) {
    localStorage.setItem('ragaNusantaraUsers', JSON.stringify(users));
}

function getCurrentUserData() {
    const users = getUsers();
    return users[currentUser];
}

function saveCurrentUserData() {
    const users = getUsers();
    if (users[currentUser]) {
        users[currentUser] = {
            ...users[currentUser],
            level, xp, xpNeeded, gold, gems, quests, inventory, achievements, userStats
        };
        saveUsers(users);
    }
}

// Initialize Sample Users
function initializeSampleUsers() {
    const users = getUsers();
    
    if (!users.test) {
        users.test = {
            username: "test",
            password: "123456",
            avatar: "ksatria",
            level: 10,
            xp: 0,
            xpNeeded: 50,
            gold: 500,
            gems: 10,
            quests: [],
            inventory: ["topi_kerajaan", "pedang_emas"],
            achievements: [],
            userStats: { totalXP: 1000, tasksCompleted: 50, questsCompleted: 20, daysActive: 5, totalGoldEarned: 800 },
            lastQuestDate: "",
            createdAt: new Date().toISOString()
        };
    }
    
    if (!users.asep) {
        users.asep = {
            username: "asep",
            password: "4321",
            avatar: "pendeta",
            level: 20,
            xp: 0,
            xpNeeded: 50,
            gold: 1000,
            gems: 20,
            quests: [],
            inventory: ["topi_kerajaan", "pedang_emas", "jubah_sakti"],
            achievements: [],
            userStats: { totalXP: 2000, tasksCompleted: 100, questsCompleted: 40, daysActive: 10, totalGoldEarned: 1500 },
            lastQuestDate: "",
            createdAt: new Date().toISOString()
        };
    }
    
    saveUsers(users);
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // Special handling for game page
    if (pageId === 'gamePage') {
        loadGame();
    }
}

function showLogin() {
    showPage('loginPage');
}

function showSignup() {
    showPage('signupPage');
}

// Password Toggle
function togglePassword(inputId, element) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        element.textContent = '🙈';
    } else {
        input.type = 'password';
        element.textContent = '👁️';
    }
}

// Music Control
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const btn = document.getElementById('musicBtn');
    
    try {
        if (musicPlaying) {
            music.pause();
            btn.textContent = '🔇';
        } else {
            const playPromise = music.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicPlaying = true;
                    btn.textContent = '🔊';
                }).catch(error => {
                    console.log('Audio play failed:', error);
                    showNotification('Klik layar dulu untuk memutar musik');
                });
            }
        }
    } catch (error) {
        console.log('Music error:', error);
    }
}

// Auto-play music on user interaction
document.addEventListener('click', function initMusic() {
    const music = document.getElementById('bgMusic');
    if (music.paused && !musicPlaying) {
        music.play().then(() => {
            musicPlaying = true;
            document.getElementById('musicBtn').textContent = '🔊';
        }).catch(e => {
            console.log('Auto-play blocked');
        });
    }
    document.removeEventListener('click', initMusic);
}, { once: true });

// Sign Up Function
function signup() {
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const avatarChoice = document.querySelector('input[name="avatar"]:checked').value;

    if (!username || !password) {
        showNotification('Isi semua kolom, wahai calon kesatria!');
        return;
    }

    if (password.length < 6) {
        showNotification('Kata sandi harus minimal 6 karakter!');
        return;
    }

    if (username.length < 3) {
        showNotification('Nama kesatria harus minimal 3 karakter!');
        return;
    }

    const users = getUsers();

    if (users[username]) {
        showNotification('Nama kesatria sudah terdaftar di kerajaan!');
        return;
    }

    // Create new user
    users[username] = {
        username: username,
        password: password,
        avatar: avatarChoice,
        level: 1,
        xp: 0,
        xpNeeded: 50,
        gold: 100,
        gems: 5,
        quests: [],
        inventory: [],
        achievements: [],
        userStats: { ...userStats },
        lastQuestDate: "",
        createdAt: new Date().toISOString()
    };

    saveUsers(users);
    showNotification('Selamat datang di Kerajaan Raga Nusantara!');
    
    // Auto login after signup
    loginUser(username);
}

// Login Function
function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        showNotification('Isi nama kesatria dan kata sandi rahasia!');
        return;
    }

    const users = getUsers();
    const userData = users[username];

    if (!userData) {
        showNotification('Kesatria tidak ditemukan dalam catatan kerajaan!');
        return;
    }

    if (userData.password !== password) {
        showNotification('Kata sandi rahasia salah!');
        return;
    }

    loginUser(username);
}

function loginUser(username) {
    const users = getUsers();
    const userData = users[username];

    // Load user data
    currentUser = username;
    level = userData.level || 1;
    xp = userData.xp || 0;
    xpNeeded = userData.xpNeeded || 50;
    gold = userData.gold || 100;
    gems = userData.gems || 5;
    avatar = userData.avatar || "ksatria";
    quests = userData.quests || [];
    inventory = userData.inventory || [];
    achievements = userData.achievements || [];
    userStats = userData.userStats || { ...userStats };

    // Save session
    localStorage.setItem('currentUser', username);

    // Check and update daily quests
    checkDailyQuests();
    
    // Load game page
    showPage('gamePage');
    showNotification(`Selamat datang kembali, ${username}!`);
}

// Load Game Data
function loadGame() {
    // Update player info
    document.getElementById('playerName').textContent = currentUser;
    document.getElementById('playerAvatar').src = getAvatarImage(avatar);
    document.getElementById('level').textContent = level;
    document.getElementById('xp').textContent = xp;
    document.getElementById('xpNeeded').textContent = xpNeeded;
    document.getElementById('gold').textContent = gold;
    document.getElementById('gems').textContent = gems;
    
    const xpPercentage = (xp / xpNeeded) * 100;
    document.getElementById('xpFill').style.width = `${xpPercentage}%`;

    // Render game elements
    renderQuests();
    renderShop();
    renderInventory();
    updateStatsModal();
    renderAchievements();
    
    // Check for new achievements
    checkAchievements();
}

// Get Avatar Image
function getAvatarImage(avatarType) {
    const avatars = {
        ksatria: "https://i.imgur.com/b0tZAvk.png",
        pendeta: "https://i.imgur.com/wgMJfZQ.png",
        petani: "https://i.imgur.com/ToTzx7G.png",
        pedagang: "https://i.imgur.com/31fFEsK.png",
        pelukis: "https://i.imgur.com/3lMJkWe.png"
    };
    return avatars[avatarType] || avatars.ksatria;
}

// Complete Task
function completeTask() {
    const earnedXP = 10 + Math.floor(level * 1.2);
    const earnedGold = 5 + Math.floor(level * 0.8);
    
    xp += earnedXP;
    gold += earnedGold;
    userStats.totalXP += earnedXP;
    userStats.tasksCompleted++;
    userStats.totalGoldEarned += earnedGold;
    
    createParticleEffect();
    
    if (xp >= xpNeeded) {
        levelUp();
    }
    
    saveCurrentUserData();
    loadGame();
    
    showNotification(`+${earnedXP} XP | +${earnedGold} 🪙 Gold`);
    
    // Check achievements
    checkAchievements();
}

// Level Up
function levelUp() {
    const oldLevel = level;
    
    while (xp >= xpNeeded) {
        xp -= xpNeeded;
        level++;
        xpNeeded = Math.floor(xpNeeded * 1.5);
        
        // Bonus gold and gems every level up
        gold += level * 10;
        gems += Math.floor(level / 5);
        
        userStats.totalGoldEarned += level * 10;
    }
    
    createParticleEffect('levelup');
    showNotification(`🎉 LEVEL UP! ${oldLevel} → ${level} | +${level * 10} 🪙 Gold`);
    
    // Check for level-based achievements
    checkAchievements();
}

// Daily Quests System
function checkDailyQuests() {
    const today = new Date().toDateString();
    const userData = getCurrentUserData();

    if (userData.lastQuestDate !== today) {
        // Reset quests for new day
        const dailyQuests = [
            { title: "📖 Menulis 500 kata", done: false, xp: 25, gold: 15 },
            { title: "🧠 Belajar 30 menit", done: false, xp: 20, gold: 12 },
            { title: "💪 Olahraga ringan", done: false, xp: 15, gold: 10 },
            { title: "🎨 Kreatif project", done: false, xp: 30, gold: 18 },
            { title: "📚 Baca 1 chapter", done: false, xp: 18, gold: 8 }
        ];
        
        quests = dailyQuests;
        
        // Update user data
        const users = getUsers();
        users[currentUser].quests = quests;
        users[currentUser].lastQuestDate = today;
        
        // Update days active
        if (users[currentUser].userStats) {
            users[currentUser].userStats.daysActive++;
        }
        
        saveUsers(users);
        showNotification('Quest harian telah diperbarui!');
    }
}

function renderQuests() {
    const questList = document.getElementById('questList');
    questList.innerHTML = '';
    
    if (quests.length === 0) {
        questList.innerHTML = '<div class="empty-inventory">Tidak ada quest hari ini</div>';
        return;
    }
    
    quests.forEach((quest, index) => {
        const questElement = document.createElement('div');
        questElement.className = `quest ${quest.done ? 'done' : ''}`;
        questElement.innerHTML = `
            <label>
                <input type="checkbox" ${quest.done ? 'checked' : ''} onchange="toggleQuest(${index})">
                <span class="quest-title">${quest.title}</span>
                <span class="quest-reward">+${quest.xp}XP +${quest.gold}🪙</span>
            </label>
        `;
        questList.appendChild(questElement);
    });
}

function toggleQuest(index) {
    if (quests[index].done) return;
    
    quests[index].done = true;
    xp += quests[index].xp;
    gold += quests[index].gold;
    userStats.totalXP += quests[index].xp;
    userStats.questsCompleted++;
    userStats.totalGoldEarned += quests[index].gold;
    
    createParticleEffect();
    
    if (xp >= xpNeeded) {
        levelUp();
    }
    
    saveCurrentUserData();
    loadGame();
    showNotification(`Quest selesai! +${quests[index].xp}XP +${quests[index].gold}🪙`);
    
    // Check for quest-related achievements
    checkAchievements();
}

// Shop System
function renderShop() {
    const shopItemsElement = document.getElementById('shopItems');
    shopItemsElement.innerHTML = '';
    
    shopItems.forEach(item => {
        const isOwned = inventory.includes(item.id);
        const canAfford = gold >= item.price;
        
        const itemElement = document.createElement('div');
        itemElement.className = `shop-item ${isOwned ? 'owned' : ''}`;
        itemElement.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${item.price} 🪙</span>
            </div>
            <button onclick="buyItem('${item.id}')" class="btn-primary buy-btn" 
                    ${isOwned || !canAfford ? 'disabled' : ''}>
                ${isOwned ? '✅ Dimiliki' : 'Beli'}
            </button>
        `;
        shopItemsElement.appendChild(itemElement);
    });
}

function buyItem(itemId) {
    const item = shopItems.find(i => i.id === itemId);
    
    if (!item) return;
    
    if (gold < item.price) {
        showNotification('Gold tidak cukup, wahai kesatria!');
        return;
    }
    
    if (inventory.includes(itemId)) {
        showNotification('Item sudah dimiliki!');
        return;
    }
    
    gold -= item.price;
    inventory.push(itemId);
    userStats.totalGoldEarned -= item.price; // Not counting spent gold as earned
    
    saveCurrentUserData();
    loadGame();
    createParticleEffect('purchase');
    showNotification(`Berhasil membeli ${item.name}!`);
    
    // Check for shopping achievements
    checkAchievements();
}

// Inventory System
function renderInventory() {
    const inventoryItems = document.getElementById('inventoryItems');
    inventoryItems.innerHTML = '';
    
    if (inventory.length === 0) {
        inventoryItems.innerHTML = '<div class="empty-inventory">Inventory kosong. Beli item di toko!</div>';
        return;
    }
    
    inventory.forEach(itemId => {
        const item = shopItems.find(i => i.id === itemId);
        if (item) {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.textContent = item.name;
            inventoryItems.appendChild(itemElement);
        }
    });
}

// Achievements System
function checkAchievements() {
    let newAchievements = false;
    
    // First quest achievement
    if (userStats.questsCompleted >= 1 && !achievements.includes('first_quest')) {
        achievements.push('first_quest');
        newAchievements = true;
        showNotification('🏆 Pencapaian terbuka: Pendatang Baru!');
    }
    
    // Level 5 achievement
    if (level >= 5 && !achievements.includes('level_5')) {
        achievements.push('level_5');
        newAchievements = true;
        showNotification('🏆 Pencapaian terbuka: Kesatria Pemula!');
    }
    
    // Level 10 achievement
    if (level >= 10 && !achievements.includes('level_10')) {
        achievements.push('level_10');
        newAchievements = true;
        showNotification('🏆 Pencapaian terbuka: Kesatria Tangguh!');
    }
    
    // Rich achievement
    if (userStats.totalGoldEarned >= 500 && !achievements.includes('rich')) {
        achievements.push('rich');
        newAchievements = true;
        showNotification('🏆 Pencapaian terbuka: Pedagang Kaya!');
    }
    
    // Shopper achievement
    if (inventory.length >= 3 && !achievements.includes('shopper')) {
        achievements.push('shopper');
        newAchievements = true;
        showNotification('🏆 Pencapaian terbuka: Kolektor!');
    }
    
    // Productive achievement
    if (userStats.tasksCompleted >= 10 && !achievements.includes('productive')) {
        achievements.push('productive');
        newAchievements = true;
        showNotification('🏆 Pencapaian terbuka: Produktif!');
    }
    
    // Dedicated achievement
    if (userStats.daysActive >= 7 && !achievements.includes('dedicated')) {
        achievements.push('dedicated');
        newAchievements = true;
        showNotification('🏆 Pencapaian terbuka: Berkomitmen!');
    }
    
    if (newAchievements) {
        saveCurrentUserData();
        renderAchievements();
    }
}

function renderAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';
    
    allAchievements.forEach(achievement => {
        const isUnlocked = achievements.includes(achievement.id);
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement ${isUnlocked ? '' : 'locked'}`;
        
        let progressText = '';
        if (!isUnlocked) {
            switch(achievement.id) {
                case 'first_quest':
                    progressText = `(${userStats.questsCompleted}/1)`;
                    break;
                case 'level_5':
                    progressText = `(Level ${level}/5)`;
                    break;
                case 'level_10':
                    progressText = `(Level ${level}/10)`;
                    break;
                case 'rich':
                    progressText = `(${userStats.totalGoldEarned}/500)`;
                    break;
                case 'shopper':
                    progressText = `(${inventory.length}/3)`;
                    break;
                case 'productive':
                    progressText = `(${userStats.tasksCompleted}/10)`;
                    break;
                case 'dedicated':
                    progressText = `(${userStats.daysActive}/7)`;
                    break;
            }
        }
        
        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
            <div class="achievement-progress">${isUnlocked ? '✅' : progressText}</div>
        `;
        achievementsList.appendChild(achievementElement);
    });
}

// Stats Modal
function showStatsModal() {
    updateStatsModal();
    document.getElementById('statsModal').classList.add('active');
}

function closeStatsModal() {
    document.getElementById('statsModal').classList.remove('active');
}

function updateStatsModal() {
    document.getElementById('statTotalXP').textContent = userStats.totalXP;
    document.getElementById('statTasksCompleted').textContent = userStats.tasksCompleted;
    document.getElementById('statQuestsCompleted').textContent = userStats.questsCompleted;
    document.getElementById('statDaysActive').textContent = userStats.daysActive;
}

// Achievements Modal
function showAchievements() {
    document.getElementById('achievementsModal').classList.add('active');
}

function closeAchievementsModal() {
    document.getElementById('achievementsModal').classList.remove('active');
}

// Notification System
function showNotification(message) {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Particle Effects
function initParticles() {
    const canvas = document.getElementById('particlesCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    
    function createParticle(x, y, type = 'default') {
        const colors = {
            default: ['#ffcc33', '#ff8800', '#c0933e'],
            levelup: ['#ff00ff', '#ff66ff', '#cc00cc'],
            purchase: ['#00ff00', '#66ff66', '#00cc00']
        };
        
        const colorSet = colors[type] || colors.default;
        
        return {
            x: x || Math.random() * canvas.width,
            y: y || Math.random() * canvas.height,
            size: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 4,
            speedY: (Math.random() - 0.5) * 4,
            color: colorSet[Math.floor(Math.random() * colorSet.length)],
            alpha: 1,
            life: 1
        };
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Add new particles occasionally
        if (particles.length < 50 && Math.random() < 0.1) {
            particles.push(createParticle());
        }
        
        particles.forEach((particle, index) => {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.alpha;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.alpha -= 0.01;
            particle.life -= 0.01;
            
            if (particle.life <= 0) {
                particles.splice(index, 1);
            }
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Store createParticle function for external use
    window.createParticleEffect = function(type = 'default') {
        for (let i = 0; i < 20; i++) {
            particles.push(createParticle(
                canvas.width / 2,
                canvas.height / 2,
                type
            ));
        }
    };
}

// Logout
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar dari kerajaan?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        
        const music = document.getElementById('bgMusic');
        music.pause();
        musicPlaying = false;
        
        showPage('splashPage');
        showNotification('Sampai jumpa lagi, kesatria!');
    }
}

// Event Listeners Setup
function setupEventListeners() {
    document.getElementById('signupBtn').addEventListener('click', signup);
    document.getElementById('loginBtn').addEventListener('click', login);
    
    // Enter key support for forms
    document.getElementById('signupPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') signup();
    });
    
    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') login();
    });
    
    // Modal close on background click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Initialize the game when DOM is loaded

document.addEventListener('DOMContentLoaded', initGame);