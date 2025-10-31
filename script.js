// =======================
// 🎮 RAGA NUSANTARA v3.3
// Enhanced Guild System & Analytics
// =======================

// Global Variables
let currentUser = null;
let level = 1, xp = 0, xpNeeded = 50, gold = 100, gems = 5, energy = 100;
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
    totalGoldEarned: 100,
    timerQuestsCompleted: 0,
    totalTimeSpent: 0,
    productivityScore: 0,
    currentStreak: 0,
    lastActiveDate: null,
    weeklyGoals: 0,
    guildContributions: 0
};

// Enhanced systems
let activeTimers = new Map();
let timerIntervals = new Map();
let dailyChallenges = [];
let guildData = null;
let leaderboardData = [];
let analyticsData = {
    daily: [],
    weekly: [],
    monthly: []
};

// Enhanced Shop Items
const shopItems = [
    { id: "topi_kerajaan", name: "👑 Topi Kerajaan", price: 50, type: "head", rarity: "common" },
    { id: "pedang_emas", name: "⚔️ Pedang Emas", price: 100, type: "weapon", rarity: "rare" },
    { id: "perisai_naga", name: "🛡️ Perisai Naga", price: 150, type: "shield", rarity: "epic" },
    { id: "jubah_sakti", name: "🧥 Jubah Sakti", price: 200, type: "armor", rarity: "legendary" },
    { id: "sepatu_angin", name: "👟 Sepatu Angin", price: 80, type: "shoes", rarity: "common" },
    { id: "kalung_mustika", name: "📿 Kalung Mustika", price: 120, type: "accessory", rarity: "rare" },
    { id: "cincin_ajaib", name: "💍 Cincin Ajaib", price: 75, type: "ring", rarity: "common" },
    { id: "peti_harta", name: "🗃️ Peti Harta", price: 300, type: "special", rarity: "legendary" },
    { id: "peta_rahasia", name: "🗺️ Peta Rahasia", price: 180, type: "special", rarity: "epic" }
];

// Enhanced Achievements with progression
const allAchievements = [
    { 
        id: "first_quest", 
        name: "Pendatang Baru", 
        description: "Selesaikan quest pertama", 
        icon: "🎯", 
        unlocked: false,
        tier: 1,
        progress: 0,
        target: 1,
        rewards: { xp: 50, gold: 25 }
    },
    { 
        id: "level_5", 
        name: "Kesatria Pemula", 
        description: "Capai level 5", 
        icon: "⚔️", 
        unlocked: false,
        tier: 1,
        progress: 0,
        target: 5,
        rewards: { xp: 100, gold: 50, gems: 1 }
    },
    { 
        id: "level_10", 
        name: "Kesatria Tangguh", 
        description: "Capai level 10", 
        icon: "🛡️", 
        unlocked: false,
        tier: 2,
        progress: 0,
        target: 10,
        rewards: { xp: 200, gold: 100, gems: 3 }
    },
    { 
        id: "productive_week", 
        name: "Minggu Produktif", 
        description: "Selesaikan 7 quest dalam seminggu", 
        icon: "📈", 
        unlocked: false,
        tier: 2,
        progress: 0,
        target: 7,
        rewards: { xp: 150, gold: 75, gems: 2 }
    },
    { 
        id: "time_master", 
        name: "Master Waktu", 
        description: "Habiskan 10 jam di timer quest", 
        icon: "⏱️", 
        unlocked: false,
        tier: 3,
        progress: 0,
        target: 36000,
        rewards: { xp: 300, gold: 150, gems: 5 }
    },
    { 
        id: "guild_champion", 
        name: "Juara Guild", 
        description: "Berkontribusi 1000 XP ke guild", 
        icon: "🏆", 
        unlocked: false,
        tier: 3,
        progress: 0,
        target: 1000,
        rewards: { xp: 500, gold: 250, gems: 10 }
    }
];

// Enhanced Quest Pool with more variety
const questPool = [
    // Work Category
    { 
        title: "💼 Kerjakan Laporan", 
        description: "Selesaikan laporan pekerjaan dengan fokus selama 45 menit",
        category: "work",
        duration: 2700,
        xp: 30, 
        gold: 18,
        energy: 5
    },
    { 
        title: "📊 Analisis Data", 
        description: "Analisis data dan buat insight selama 50 menit",
        category: "work",
        duration: 3000,
        xp: 35, 
        gold: 20,
        energy: 6
    },
    
    // Study Category
    { 
        title: "📚 Belajar Topik Baru", 
        description: "Pelajari materi baru atau skill selama 45 menit",
        category: "study",
        duration: 2700,
        xp: 30, 
        gold: 18,
        energy: 5
    },
    { 
        title: "🌐 Bahasa Asing", 
        description: "Latihan bahasa asing selama 30 menit",
        category: "study",
        duration: 1800,
        xp: 22, 
        gold: 12,
        energy: 4
    },
    
    // Exercise Category
    { 
        title: "💪 Workout Ringan", 
        description: "Latihan fisik ringan selama 25 menit",
        category: "exercise",
        duration: 1500,
        xp: 20, 
        gold: 12,
        energy: 8
    },
    { 
        title: "🚶 Jalan Santai", 
        description: "Jalan kaki atau jogging selama 30 menit",
        category: "exercise",
        duration: 1800,
        xp: 22, 
        gold: 12,
        energy: 7
    },
    
    // Creative Category
    { 
        title: "🎨 Project Kreatif", 
        description: "Kerjakan proyek seni atau kreatif 50 menit",
        category: "creative",
        duration: 3000,
        xp: 35, 
        gold: 20,
        energy: 6
    },
    { 
        title: "✏️ Menulis Kreatif", 
        description: "Tulis cerita atau puisi selama 40 menit",
        category: "creative",
        duration: 2400,
        xp: 28, 
        gold: 16,
        energy: 5
    },
    
    // Personal Category
    { 
        title: "🧹 Bersih-bersih", 
        description: "Bersihkan dan rapikan ruangan 30 menit",
        category: "personal",
        duration: 1800,
        xp: 20, 
        gold: 10,
        energy: 4
    },
    { 
        title: "🍳 Masak Sehat", 
        description: "Siapkan makanan sehat dan bergizi 40 menit",
        category: "personal",
        duration: 2400,
        xp: 25, 
        gold: 14,
        energy: 5
    }
];

// Daily Challenges
const dailyChallengePool = [
    { 
        title: "Selesaikan 3 Quest", 
        description: "Selesaikan 3 quest apapun hari ini",
        target: 3,
        type: "quests",
        reward: { gold: 25, xp: 15 }
    },
    { 
        title: "Aktifkan 2 Timer", 
        description: "Mulai 2 timer quest yang berbeda",
        target: 2,
        type: "timers",
        reward: { gold: 20, xp: 10 }
    },
    { 
        title: "Capai 30 Menit Produktif", 
        description: "Habiskan 30 menit di timer quest",
        target: 1800,
        type: "time",
        reward: { gold: 30, xp: 20 }
    }
];

// Initialize the enhanced game
function initGame() {
    initializeSampleUsers();
    setupEventListeners();
    checkExistingSession();
    initParticles();
    initAnalytics();
    
    // Hide loading screen after 1.5 seconds
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        if (!currentUser) {
            showPage('splashPage');
        }
    }, 1500);
}

// Enhanced User Management
function getUsers() {
    try {
        const users = localStorage.getItem('ragaNusantaraUsers');
        return users ? JSON.parse(users) : {};
    } catch (e) {
        console.error('Error reading user data:', e);
        return {};
    }
}

function saveUsers(users) {
    try {
        localStorage.setItem('ragaNusantaraUsers', JSON.stringify(users));
    } catch (e) {
        console.error('Error saving user data:', e);
        showNotification('Error: Gagal menyimpan data permainan');
    }
}

// Enhanced Login System with Streak Tracking
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
    energy = userData.energy || 100;
    avatar = userData.avatar || "ksatria";
    quests = userData.quests || [];
    inventory = userData.inventory || [];
    achievements = userData.achievements || [];
    userStats = userData.userStats || { ...userStats };
    guildData = userData.guildData || null;
    dailyChallenges = userData.dailyChallenges || [];

    // Update streak and daily challenges
    updateLoginStreak();
    initializeDailyChallenges();
    
    // Save session
    localStorage.setItem('currentUser', username);

    // Check and update daily quests
    checkDailyQuests();
    
    // Resume any active timers
    resumeActiveTimers();
    
    // Load game page
    showPage('gamePage');
    showNotification(`Selamat datang kembali, ${username}! 🔥 Streak ${userStats.currentStreak} hari`);
}

// Streak Management
function updateLoginStreak() {
    const today = new Date().toDateString();
    const lastActive = userStats.lastActiveDate;
    
    if (lastActive) {
        const lastDate = new Date(lastActive);
        const todayDate = new Date();
        const diffTime = todayDate - lastDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            // Consecutive login
            userStats.currentStreak++;
            showNotification(`🔥 Streak bertambah! Sekarang ${userStats.currentStreak} hari berturut-turut!`);
        } else if (diffDays > 1) {
            // Broken streak
            userStats.currentStreak = 1;
            showNotification('🔥 Memulai streak baru! Login berturut-turut untuk bonus harian.');
        }
        // Same day - no change
    } else {
        // First login
        userStats.currentStreak = 1;
    }
    
    userStats.lastActiveDate = today;
    saveCurrentUserData();
}

// Daily Challenges System
function initializeDailyChallenges() {
    const today = new Date().toDateString();
    
    if (dailyChallenges.length === 0 || dailyChallenges[0].date !== today) {
        // Generate new daily challenges
        dailyChallenges = dailyChallengePool.map(challenge => ({
            ...challenge,
            date: today,
            progress: 0,
            completed: false
        }));
        
        saveCurrentUserData();
        showNotification('🎯 Tantangan harian baru telah tersedia!');
    }
    
    renderDailyChallenges();
}

function updateDailyChallengeProgress(type, amount = 1) {
    dailyChallenges.forEach(challenge => {
        if (!challenge.completed && challenge.type === type) {
            challenge.progress += amount;
            
            if (challenge.progress >= challenge.target) {
                challenge.completed = true;
                completeDailyChallenge(challenge);
            }
        }
    });
    
    renderDailyChallenges();
    saveCurrentUserData();
}

function completeDailyChallenge(challenge) {
    gold += challenge.reward.gold;
    xp += challenge.reward.xp;
    
    userStats.totalGoldEarned += challenge.reward.gold;
    userStats.totalXP += challenge.reward.xp;
    
    showNotification(`🎯 Tantangan "${challenge.title}" selesai! +${challenge.reward.xp}XP +${challenge.reward.gold}🪙`);
    
    if (xp >= xpNeeded) {
        levelUp();
    }
    
    saveCurrentUserData();
    loadGame();
}

function renderDailyChallenges() {
    const challengesContainer = document.getElementById('dailyChallenges');
    const progressElement = document.getElementById('completedChallenges');
    
    if (!challengesContainer) return;
    
    const completedCount = dailyChallenges.filter(c => c.completed).length;
    progressElement.textContent = `${completedCount}/3 Selesai`;
    
    challengesContainer.innerHTML = '';
    
    dailyChallenges.forEach(challenge => {
        const challengeElement = document.createElement('div');
        challengeElement.className = `challenge-item ${challenge.completed ? 'completed' : ''}`;
        
        challengeElement.innerHTML = `
            <div class="challenge-checkbox">
                ${challenge.completed ? '✓' : ''}
            </div>
            <div class="challenge-info">
                <div class="challenge-title">${challenge.title}</div>
                <div class="challenge-description">${challenge.description}</div>
                <div class="challenge-progress">${challenge.progress}/${challenge.target}</div>
            </div>
            <div class="challenge-reward">
                +${challenge.reward.xp}XP ${challenge.reward.gold}🪙
            </div>
        `;
        
        challengesContainer.appendChild(challengeElement);
    });
}

// Enhanced Quest System with Custom Quests
function createCustomQuest() {
    const title = document.getElementById('customQuestTitle').value.trim();
    const description = document.getElementById('customQuestDescription').value.trim();
    const category = document.getElementById('customQuestCategory').value;
    const duration = parseInt(document.getElementById('customQuestDuration').value) * 60;
    const questXP = parseInt(document.getElementById('customQuestXP').value);
    const questGold = parseInt(document.getElementById('customQuestGold').value);
    
    if (!title || !description) {
        showNotification('Harap isi judul dan deskripsi quest!');
        return;
    }
    
    if (gold < 20) {
        showNotification('Gold tidak cukup untuk membuat quest custom! Perlu 20 🪙');
        return;
    }
    
    gold -= 20;
    
    const customQuest = {
        id: generateId(),
        title: `🎨 ${title}`,
        description: description,
        category: category,
        duration: duration,
        timeLeft: duration,
        xp: questXP,
        gold: questGold,
        energy: Math.floor(duration / 300),
        timerState: 'idle',
        originalDuration: duration,
        done: false,
        pausedTime: 0,
        isCustom: true
    };
    
    quests.push(customQuest);
    saveCurrentUserData();
    closeCreateQuestModal();
    renderQuests();
    showNotification('Quest custom berhasil dibuat!');
    
    // Update daily challenge
    updateDailyChallengeProgress('quests');
}

// Guild System
function showCreateGuildModal() {
    document.getElementById('createGuildModal').classList.add('active');
}

function closeCreateGuildModal() {
    document.getElementById('createGuildModal').classList.remove('active');
}

function createGuild() {
    const guildName = document.getElementById('guildNameInput').value.trim();
    const guildDescription = document.getElementById('guildDescription').value.trim();
    const guildType = document.getElementById('guildType').value;
    
    if (!guildName) {
        showNotification('Harap beri nama untuk guild Anda!');
        return;
    }
    
    if (gold < 100) {
        showNotification('Gold tidak cukup untuk membuat guild! Perlu 100 🪙');
        return;
    }
    
    gold -= 100;
    
    guildData = {
        id: generateId(),
        name: guildName,
        description: guildDescription,
        type: guildType,
        level: 1,
        xp: 0,
        members: [{
            username: currentUser,
            role: 'leader',
            joinDate: new Date().toISOString(),
            contribution: 0
        }],
        created: new Date().toISOString(),
        quests: []
    };
    
    saveCurrentUserData();
    closeCreateGuildModal();
    showGuildModal();
    showNotification(`Guild "${guildName}" berhasil dibuat!`);
}

function showGuildModal() {
    const guildInfo = document.getElementById('guildInfo');
    const guildDetails = document.getElementById('guildDetails');
    
    if (guildData) {
        guildInfo.style.display = 'none';
        guildDetails.style.display = 'block';
        
        document.getElementById('guildName').textContent = guildData.name;
        document.getElementById('guildLevel').textContent = guildData.level;
        
        // Render members
        const membersList = document.getElementById('guildMembersList');
        membersList.innerHTML = '';
        
        guildData.members.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.className = 'guild-member';
            memberElement.innerHTML = `
                <img src="${getAvatarImage('ksatria')}" class="guild-member-avatar" alt="Avatar">
                <div class="member-info">
                    <div class="member-name">${member.username}</div>
                    <div class="member-role">${member.role}</div>
                </div>
                <div class="member-contribution">${member.contribution} XP</div>
            `;
            membersList.appendChild(memberElement);
        });
    } else {
        guildInfo.style.display = 'block';
        guildDetails.style.display = 'none';
    }
    
    document.getElementById('guildModal').classList.add('active');
}

function closeGuildModal() {
    document.getElementById('guildModal').classList.remove('active');
}

// Analytics System
function initAnalytics() {
    // Initialize analytics data structure
    const savedAnalytics = localStorage.getItem('ragaNusantaraAnalytics');
    if (savedAnalytics) {
        analyticsData = JSON.parse(savedAnalytics);
    }
}

function trackProductivity(timeSpent, questsCompleted) {
    const today = new Date().toDateString();
    
    // Update daily analytics
    if (!analyticsData.daily.find(entry => entry.date === today)) {
        analyticsData.daily.push({
            date: today,
            timeSpent: 0,
            questsCompleted: 0,
            productivityScore: 0
        });
    }
    
    const dailyEntry = analyticsData.daily.find(entry => entry.date === today);
    dailyEntry.timeSpent += timeSpent;
    dailyEntry.questsCompleted += questsCompleted;
    dailyEntry.productivityScore = calculateProductivityScore(dailyEntry.timeSpent, dailyEntry.questsCompleted);
    
    // Save analytics
    localStorage.setItem('ragaNusantaraAnalytics', JSON.stringify(analyticsData));
}

function calculateProductivityScore(timeSpent, questsCompleted) {
    const timeScore = Math.min(timeSpent / 3600, 8) * 12.5; // Max 8 hours = 100 points
    const questScore = Math.min(questsCompleted, 10) * 10; // Max 10 quests = 100 points
    return Math.round((timeScore + questScore) / 2);
}

function showAnalytics() {
    updateAnalyticsDisplay();
    document.getElementById('analyticsModal').classList.add('active');
}

function closeAnalyticsModal() {
    document.getElementById('analyticsModal').classList.remove('active');
}

function updateAnalyticsDisplay() {
    const productiveTimeElement = document.getElementById('productiveTime');
    const completedQuestsElement = document.getElementById('completedQuests');
    const efficiencyScoreElement = document.getElementById('efficiencyScore');
    
    const today = new Date().toDateString();
    const todayData = analyticsData.daily.find(entry => entry.date === today) || {
        timeSpent: 0,
        questsCompleted: 0,
        productivityScore: 0
    };
    
    const hours = Math.floor(todayData.timeSpent / 3600);
    const minutes = Math.floor((todayData.timeSpent % 3600) / 60);
    
    productiveTimeElement.textContent = `${hours}j ${minutes}m`;
    completedQuestsElement.textContent = todayData.questsCompleted;
    efficiencyScoreElement.textContent = `${todayData.productivityScore}%`;
    
    // Update chart
    renderProductivityChart();
}

function renderProductivityChart() {
    const ctx = document.getElementById('productivityChart').getContext('2d');
    const last7Days = analyticsData.daily.slice(-7);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(day => {
                const date = new Date(day.date);
                return date.toLocaleDateString('id-ID', { weekday: 'short' });
            }),
            datasets: [{
                label: 'Skor Produktivitas',
                data: last7Days.map(day => day.productivityScore),
                borderColor: '#c0933e',
                backgroundColor: 'rgba(192, 147, 62, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Leaderboard System
function showLeaderboard() {
    loadLeaderboard('level');
    document.getElementById('leaderboardModal').classList.add('active');
}

function closeLeaderboardModal() {
    document.getElementById('leaderboardModal').classList.remove('active');
}

function loadLeaderboard(category) {
    const users = getUsers();
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Convert to array and sort
    const usersArray = Object.values(users).filter(user => user.userStats);
    
    usersArray.sort((a, b) => {
        switch(category) {
            case 'level':
                return b.level - a.level;
            case 'xp':
                return (b.userStats.totalXP || 0) - (a.userStats.totalXP || 0);
            case 'quests':
                return (b.userStats.questsCompleted || 0) - (a.userStats.questsCompleted || 0);
            case 'streak':
                return (b.userStats.currentStreak || 0) - (a.userStats.currentStreak || 0);
            default:
                return 0;
        }
    });
    
    leaderboardList.innerHTML = '';
    
    usersArray.slice(0, 10).forEach((user, index) => {
        const rank = index + 1;
        let value = '';
        
        switch(category) {
            case 'level':
                value = `Level ${user.level}`;
                break;
            case 'xp':
                value = `${user.userStats.totalXP || 0} XP`;
                break;
            case 'quests':
                value = `${user.userStats.questsCompleted || 0} Quest`;
                break;
            case 'streak':
                value = `${user.userStats.currentStreak || 0} Hari`;
                break;
        }
        
        const item = document.createElement('div');
        item.className = 'leaderboard-item';
        item.innerHTML = `
            <div class="leaderboard-rank">#${rank}</div>
            <img src="${getAvatarImage(user.avatar)}" class="leaderboard-avatar" alt="Avatar">
            <div class="leaderboard-info">
                <div class="leaderboard-name">${user.username}</div>
                <div class="leaderboard-stats">${value}</div>
            </div>
        `;
        
        // Highlight current user
        if (user.username === currentUser) {
            item.style.background = 'rgba(192, 147, 62, 0.2)';
            item.style.borderColor = 'var(--primary-gold)';
        }
        
        leaderboardList.appendChild(item);
    });
    
    // Update active tab
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });
}

// Enhanced Achievement System with Progression
function checkAchievements() {
    let newAchievements = false;
    
    allAchievements.forEach(achievement => {
        if (!achievements.includes(achievement.id)) {
            let progress = 0;
            
            switch(achievement.id) {
                case 'first_quest':
                    progress = userStats.questsCompleted;
                    break;
                case 'level_5':
                case 'level_10':
                    progress = level;
                    break;
                case 'productive_week':
                    progress = userStats.weeklyGoals || 0;
                    break;
                case 'time_master':
                    progress = userStats.totalTimeSpent;
                    break;
                case 'guild_champion':
                    progress = userStats.guildContributions || 0;
                    break;
            }
            
            if (progress >= achievement.target) {
                achievements.push(achievement.id);
                unlockAchievement(achievement);
                newAchievements = true;
            }
        }
    });
    
    if (newAchievements) {
        saveCurrentUserData();
        renderAchievements();
    }
}

function unlockAchievement(achievement) {
    // Give rewards
    xp += achievement.rewards.xp;
    gold += achievement.rewards.gold;
    gems += achievement.rewards.gems || 0;
    
    userStats.totalXP += achievement.rewards.xp;
    userStats.totalGoldEarned += achievement.rewards.gold;
    
    showNotification(`🏆 Pencapaian terbuka: ${achievement.name}! +${achievement.rewards.xp}XP +${achievement.rewards.gold}🪙`);
    
    if (xp >= xpNeeded) {
        levelUp();
    }
    
    createParticleEffect('achievement');
}

// Enhanced Energy System
function updateEnergy(cost) {
    energy = Math.max(0, energy - cost);
    
    if (energy <= 0) {
        showNotification('⚡ Energy habis! Istirahat sejenak atau tunggu hingga energy pulih.');
    }
    
    saveCurrentUserData();
    loadGame();
}

function regenerateEnergy() {
    const now = new Date().getTime();
    const lastUpdate = userStats.lastEnergyUpdate || now;
    const timeDiff = now - lastUpdate;
    
    // Regenerate 1 energy per minute
    const energyGain = Math.floor(timeDiff / 60000);
    
    if (energyGain > 0) {
        energy = Math.min(100, energy + energyGain);
        userStats.lastEnergyUpdate = now;
        saveCurrentUserData();
        loadGame();
    }
}

// Enhanced Timer System with Energy Cost
function startTimer(questId) {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.done || quest.timerState === 'running') return;
    
    if (energy < 5) {
        showNotification('⚡ Energy tidak cukup untuk memulai timer!');
        return;
    }
    
    updateEnergy(5);
    
    quest.timerState = 'running';
    quest.startTime = Date.now() - (quest.pausedTime || 0);
    quest.pausedTime = 0;
    
    activeTimers.set(questId, {
        quest: quest,
        startTime: quest.startTime
    });
    
    startTimerInterval(questId);
    
    saveCurrentUserData();
    renderQuests();
    updateActiveTimersDisplay();
    showNotification(`Timer quest "${quest.title}" dimulai! -5⚡`);
    
    // Update daily challenge
    updateDailyChallengeProgress('timers');
}

// Enhanced Complete Timer with Analytics
function completeTimer(questId) {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    quest.timerState = 'completed';
    quest.done = true;
    quest.timeLeft = 0;
    quest.pausedTime = 0;
    
    // Remove from active timers
    activeTimers.delete(questId);
    
    // Clear interval
    if (timerIntervals.has(questId)) {
        clearInterval(timerIntervals.get(questId));
        timerIntervals.delete(questId);
    }
    
    // Give rewards
    xp += quest.xp;
    gold += quest.gold;
    userStats.totalXP += quest.xp;
    userStats.questsCompleted++;
    userStats.timerQuestsCompleted++;
    userStats.totalGoldEarned += quest.gold;
    userStats.totalTimeSpent += quest.originalDuration;
    
    // Track analytics
    trackProductivity(quest.originalDuration, 1);
    
    // Update daily challenges
    updateDailyChallengeProgress('quests');
    updateDailyChallengeProgress('time', quest.originalDuration);
    
    if (xp >= xpNeeded) {
        levelUp();
    }
    
    saveCurrentUserData();
    loadGame();
    createParticleEffect('completed');
    showNotification(`Quest "${quest.title}" selesai! +${quest.xp}XP +${quest.gold}🪙`);
    
    // Check achievements
    checkAchievements();
}

// Enhanced Load Game
function loadGame() {
    // Regenerate energy
    regenerateEnergy();
    
    // Update player info
    document.getElementById('playerName').textContent = currentUser;
    document.getElementById('playerAvatar').src = getAvatarImage(avatar);
    document.getElementById('level').textContent = level;
    document.getElementById('xp').textContent = xp;
    document.getElementById('xpNeeded').textContent = xpNeeded;
    document.getElementById('gold').textContent = gold;
    document.getElementById('gems').textContent = gems;
    document.getElementById('energy').textContent = energy;
    
    const xpPercentage = (xp / xpNeeded) * 100;
    document.getElementById('xpFill').style.width = `${xpPercentage}%`;
    
    // Update energy bar
    const energyFill = document.querySelector('.energy-fill');
    if (energyFill) {
        energyFill.style.width = `${energy}%`;
    }

    // Update refresh button state
    updateRefreshButtonState();

    // Render game elements
    renderQuests();
    renderShop();
    renderInventory();
    updateStatsModal();
    renderAchievements();
    updateActiveTimersDisplay();
    renderDailyChallenges();
    
    // Check for new achievements
    checkAchievements();
}

// Enhanced Save System
function saveCurrentUserData() {
    const users = getUsers();
    if (users[currentUser]) {
        users[currentUser] = {
            ...users[currentUser],
            level, xp, xpNeeded, gold, gems, energy, quests, inventory, achievements, 
            userStats, guildData, dailyChallenges
        };
        saveUsers(users);
    }
}

// Setup Enhanced Event Listeners
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
    
    // Category filter event listeners
    document.querySelectorAll('.category-filter').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.category-filter').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            renderQuests();
        });
    });
    
    // Analytics tab events
    document.querySelectorAll('.analytics-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.analytics-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            updateAnalyticsDisplay();
        });
    });
    
    // Leaderboard tab events
    document.querySelectorAll('.leaderboard-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            loadLeaderboard(category);
        });
    });
    
    // Modal close on background click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Auto energy regeneration
    setInterval(regenerateEnergy, 60000); // Check every minute
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);

// Export functions to global scope for HTML onclick
window.showCreateQuestModal = function() {
    document.getElementById('createQuestModal').classList.add('active');
};

window.closeCreateQuestModal = function() {
    document.getElementById('createQuestModal').classList.remove('active');
};

window.showGuildModal = showGuildModal;
window.closeGuildModal = closeGuildModal;
window.showCreateGuildModal = showCreateGuildModal;
window.closeCreateGuildModal = closeCreateGuildModal;
window.createGuild = createGuild;
window.createCustomQuest = createCustomQuest;
window.showAnalytics = showAnalytics;
window.closeAnalyticsModal = closeAnalyticsModal;
window.showLeaderboard = showLeaderboard;
window.closeLeaderboardModal = closeLeaderboardModal;

// Keep all existing functions from previous versions
// [All previous functions remain unchanged...]
