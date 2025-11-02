// Game State
const gameState = {
    player: {
        name: "Petualang",
        level: 1,
        avatar: null,
        experience: 0,
        maxExperience: 100,
        health: 100,
        maxHealth: 100,
        skillPoints: 5,
        location: "desa"
    },
    inventory: [
        { id: 1, name: "Pedang Kayu", type: "weapon", rarity: "common", description: "Pedang dasar untuk pemula", value: 10 },
        { id: 2, name: "Potion Kesehatan", type: "consumable", rarity: "common", description: "Memulihkan 30 HP", value: 5 },
        { id: 3, name: "Peta Nusantara", type: "quest", rarity: "uncommon", description: "Peta petualangan", value: 15 },
        { id: 4, name: "Baju Besi Kulit", type: "armor", rarity: "uncommon", description: "Memberikan pertahanan +5", value: 20 }
    ],
    achievements: [
        { id: 1, name: "Petualang Baru", description: "Memulai permainan", unlocked: true, reward: "10 EXP" },
        { id: 2, name: "Kolektor", description: "Mengumpulkan 5 item", unlocked: false, reward: "Pedang Besi" },
        { id: 3, name: "Jago Berkelahi", description: "Mengalahkan 10 musuh", unlocked: false, reward: "25 EXP" },
        { id: 4, name: "Penjelajah", description: "Mengunjungi 3 lokasi", unlocked: false, reward: "Peta Khusus" }
    ],
    quests: [
        { id: 1, name: "Tutorial", description: "Pelajari dasar-dasar game", progress: 0, maxProgress: 5, completed: false, reward: "100 EXP, Potion Kesehatan" },
        { id: 2, name: "Koleksi Item", description: "Kumpulkan 3 item", progress: 0, maxProgress: 3, completed: false, reward: "50 EXP, 20 Koin" },
        { id: 3, name: "Kalahkan Goblin", description: "Kalahkan Goblin di Hutan", progress: 0, maxProgress: 3, completed: false, reward: "75 EXP, Pedang Besi" }
    ],
    skills: [
        { id: 1, name: "Serangan Cepat", description: "Serangan dengan kecepatan tinggi", level: 0, maxLevel: 5, cost: 1, type: "attack" },
        { id: 2, name: "Pertahanan Kuat", description: "Meningkatkan pertahanan", level: 0, maxLevel: 5, cost: 1, type: "defense" },
        { id: 3, name: "Penyembuhan", description: "Memulihkan kesehatan", level: 0, maxLevel: 3, cost: 2, type: "heal" },
        { id: 4, name: "Serangan Kritis", description: "Meningkatkan peluang serangan kritis", level: 0, maxLevel: 3, cost: 2, type: "attack" }
    ],
    locations: {
        desa: { name: "Desa", unlocked: true, levelReq: 1, enemies: [] },
        hutan: { name: "Hutan", unlocked: true, levelReq: 1, enemies: ["Goblin", "Serigala"] },
        sungai: { name: "Sungai", unlocked: false, levelReq: 3, enemies: ["Ikan Besar", "Buaya"] },
        gunung: { name: "Gunung", unlocked: false, levelReq: 5, enemies: ["Elang Raksasa", "Yeti"] },
        gua: { name: "Gua", unlocked: false, levelReq: 8, enemies: ["Kelelawar Vampir", "Golem Batu"] },
        kota: { name: "Kota", unlocked: false, levelReq: 10, enemies: [] }
    },
    unlockedAvatars: ["tsatria", "pendeta", "petani", "bedgeng", "peluki"],
    selectedAvatar: null,
    inCombat: false,
    currentEnemy: null
};

// Avatar Images (SVG Base64)
const avatarImages = {
    tsatria: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZTY5ODAwIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZmZiYzhiIi8+CjxyZWN0IHg9IjMwIiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzQ2OGExIi8+Cjx0ZXh0IHg9IjUwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VLnEjXRyaWE8L3RleHQ+Cjwvc3ZnPg==",
    pendeta: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjODBjN2Q2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZmZiYzhiIi8+CjxyZWN0IHg9IjMwIiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMmM1MDZkIi8+Cjx0ZXh0IHg9IjUwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGVuZGV0YTwvdGV4dD4KPC9zdmc+",
    petani: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjMjdhYTZkIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZmZiYzhiIi8+CjxyZWN0IHg9IjMwIiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMTk3NTJkIi8+Cjx0ZXh0IHg9IjUwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGV0YW5pPC90ZXh0Pgo8L3N2Zz4=",
    bedgeng: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNzQ3NDc0Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZmZiYzhiIi8+CjxyZWN0IHg9IjMwIiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMmIzYjNiIi8+Cjx0ZXh0IHg9IjUwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QmVkZ2VuZzwvdGV4dD4KPC9zdmc+",
    peluki: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjOWI1OWRmIi8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjZmZiYzhiIi8+CjxyZWN0IHg9IjMwIiB5PSI1MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNmMyOGM4Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGVsdWtpPC90ZXh0Pgo8L3N2Zz4="
};

// Enemy Data
const enemies = {
    goblin: { name: "Goblin", health: 30, maxHealth: 30, attack: 5, defense: 2, exp: 15 },
    serigala: { name: "Serigala", health: 25, maxHealth: 25, attack: 7, defense: 1, exp: 12 },
    ikanBesar: { name: "Ikan Besar", health: 40, maxHealth: 40, attack: 6, defense: 3, exp: 20 },
    buaya: { name: "Buaya", health: 50, maxHealth: 50, attack: 8, defense: 4, exp: 25 }
};

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    loadGame();
    setupEventListeners();
    updateGameDisplay();
});

// Load Game Function
function loadGame() {
    // Try to load from localStorage
    const savedGame = localStorage.getItem('ragaNusantaraSave');
    if (savedGame) {
        const parsed = JSON.parse(savedGame);
        Object.assign(gameState, parsed);
        showNotification('Game berhasil dimuat!', 'success');
    }
    
    renderInventory();
    updateStartModal();
    renderAchievements();
    renderQuests();
    renderSkills();
    checkAchievements();
    updatePlayerDisplay();
}

// Save Game Function
function saveGame() {
    localStorage.setItem('ragaNusantaraSave', JSON.stringify(gameState));
    showNotification('Game berhasil disimpan!', 'success');
}

// Setup Event Listeners
function setupEventListeners() {
    // Start Button
    document.getElementById('start-btn').addEventListener('click', function() {
        showStartModal();
    });
    
    // Map Button
    document.getElementById('map-btn').addEventListener('click', function() {
        showMapModal();
    });
    
    // Skills Button
    document.getElementById('skills-btn').addEventListener('click', function() {
        showSkillsModal();
    });
    
    // Inventory Button
    document.getElementById('inventory-btn').addEventListener('click', function() {
        togglePanel('inventory-panel');
    });
    
    // Quests Button
    document.getElementById('quests-btn').addEventListener('click', function() {
        togglePanel('quests-panel');
    });
    
    // Save Button
    document.getElementById('save-btn').addEventListener('click', saveGame);
    
    // Avatar Selection
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectAvatar(this.dataset.avatar);
        });
    });
    
    // Confirm Avatar
    document.getElementById('confirm-avatar').addEventListener('click', confirmAvatarSelection);
    
    // Location Selection
    const locations = document.querySelectorAll('.location:not(.locked)');
    locations.forEach(location => {
        location.addEventListener('click', function() {
            selectLocation(this.dataset.location);
        });
    });
    
    // Travel Button
    document.getElementById('travel-btn').addEventListener('click', travelToLocation);
    
    // Close Modals
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Toggle Panels
    const toggleButtons = document.querySelectorAll('.toggle-panel');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.closest('.panel');
            const content = panel.querySelector('.item-list');
            if (content.style.display === 'none') {
                content.style.display = 'block';
                this.textContent = '−';
            } else {
                content.style.display = 'none';
                this.textContent = '+';
            }
        });
    });
    
    // Combat Actions
    const combatActions = document.querySelectorAll('.combat-action');
    combatActions.forEach(action => {
        action.addEventListener('click', function() {
            performCombatAction(this.dataset.action);
        });
    });
}

// Toggle Panel Visibility
function togglePanel(panelClass) {
    const panel = document.querySelector(`.${panelClass}`);
    const content = panel.querySelector('.item-list');
    const toggle = panel.querySelector('.toggle-panel');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        toggle.textContent = '−';
    } else {
        content.style.display = 'none';
        toggle.textContent = '+';
    }
}

// Get Avatar Image
function getAvatarImage(avatarType) {
    return avatarImages[avatarType] || null;
}

// Update Start Modal
function updateStartModal() {
    // Set avatar images in modal
    Object.keys(avatarImages).forEach(avatarType => {
        const imgElement = document.getElementById(`${avatarType}-img`);
        if (imgElement) {
            imgElement.src = getAvatarImage(avatarType);
        }
    });
}

// Show Start Modal
function showStartModal() {
    const modal = document.getElementById('start-modal');
    modal.style.display = 'block';
}

// Show Map Modal
function showMapModal() {
    const modal = document.getElementById('map-modal');
    modal.style.display = 'block';
    updateMapDisplay();
}

// Show Skills Modal
function showSkillsModal() {
    const modal = document.getElementById('skills-modal');
    modal.style.display = 'block';
    document.getElementById('skill-points').textContent = gameState.player.skillPoints;
}

// Select Avatar
function selectAvatar(avatarType) {
    // Remove selected class from all options
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    const selectedOption = document.querySelector(`[data-avatar="${avatarType}"]`);
    selectedOption.classList.add('selected');
    
    // Store selected avatar
    gameState.selectedAvatar = avatarType;
}

// Confirm Avatar Selection
function confirmAvatarSelection() {
    if (gameState.selectedAvatar) {
        gameState.player.avatar = gameState.selectedAvatar;
        updatePlayerDisplay();
        hideStartModal();
        
        // Update scene display
        document.getElementById('scene-display').innerHTML = `
            <h2 class="scene-title">Avatar Dipilih!</h2>
            <div class="scene-content">
                <p>Anda sekarang adalah <strong>${getAvatarName(gameState.selectedAvatar)}</strong></p>
                <p>Mulai petualangan Anda di dunia Nusantara!</p>
                <p>Jelajahi lokasi baru, kumpulkan item, selesaikan quest, dan tingkatkan kemampuan Anda.</p>
            </div>
        `;
        
        // Update tutorial quest
        updateQuestProgress(1, 1);
        
        showNotification(`Selamat datang, ${getAvatarName(gameState.selectedAvatar)}!`, 'success');
    } else {
        showNotification('Pilih avatar terlebih dahulu!', 'error');
    }
}

// Get Avatar Name
function getAvatarName(avatarType) {
    const names = {
        tsatria: 'Ksatriya',
        pendeta: 'Pendeta',
        petani: 'Petani',
        bedgeng: 'Bedgeng',
        peluki: 'Peluki'
    };
    return names[avatarType] || 'Petualang';
}

// Hide Start Modal
function hideStartModal() {
    const modal = document.getElementById('start-modal');
    modal.style.display = 'none';
}

// Update Player Display
function updatePlayerDisplay() {
    const avatarDisplay = document.getElementById('avatar-display');
    const level = document.getElementById('level');
    const expFill = document.getElementById('exp-fill');
    const hpFill = document.getElementById('hp-fill');
    
    if (gameState.player.avatar) {
        avatarDisplay.innerHTML = `<img src="${getAvatarImage(gameState.player.avatar)}" alt="${gameState.player.avatar}" style="width: 100%; height: 100%; border-radius: 50%;">`;
    }
    
    level.textContent = gameState.player.level;
    
    // Update experience bar
    const expPercent = (gameState.player.experience / gameState.player.maxExperience) * 100;
    expFill.style.width = `${expPercent}%`;
    
    // Update health bar
    const hpPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
    hpFill.style.width = `${hpPercent}%`;
}

// Update Game Display
function updateGameDisplay() {
    updatePlayerDisplay();
    renderInventory();
    renderAchievements();
    renderQuests();
}

// Render Inventory
function renderInventory() {
    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    
    gameState.inventory.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <div class="item-header">
                <span class="item-name">${item.name}</span>
                <span class="item-rarity rarity-${item.rarity}">${item.rarity}</span>
            </div>
            <div class="item-description">${item.description}</div>
            <div class="item-value">Nilai: ${item.value} koin</div>
        `;
        inventoryList.appendChild(itemElement);
    });
    
    // Update collection quest
    updateQuestProgress(2, gameState.inventory.length);
}

// Render Achievements
function renderAchievements() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = '';
    
    gameState.achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'achievement-item';
        achievementElement.innerHTML = `
            <div class="item-header">
                <span class="item-name">${achievement.name}</span>
                <span style="color: ${achievement.unlocked ? '#27ae60' : '#e74c3c'}">
                    ${achievement.unlocked ? '✓' : '✗'}
                </span>
            </div>
            <div class="item-description">${achievement.description}</div>
            <div class="item-reward">Hadiah: ${achievement.reward}</div>
        `;
        achievementsList.appendChild(achievementElement);
    });
}

// Render Quests
function renderQuests() {
    const questsList = document.getElementById('quests-list');
    questsList.innerHTML = '';
    
    gameState.quests.forEach(quest => {
        if (!quest.completed) {
            const questElement = document.createElement('div');
            questElement.className = 'quest-item';
            const progressPercent = (quest.progress / quest.maxProgress) * 100;
            
            questElement.innerHTML = `
                <div class="item-header">
                    <span class="item-name">${quest.name}</span>
                    <span>${quest.progress}/${quest.maxProgress}</span>
                </div>
                <div class="item-description">${quest.description}</div>
                <div class="quest-progress">
                    <div class="quest-bar">
                        <div class="quest-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <span>${Math.round(progressPercent)}%</span>
                </div>
                <div class="item-reward">Hadiah: ${quest.reward}</div>
            `;
            questsList.appendChild(questElement);
        }
    });
}

// Render Skills
function renderSkills() {
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';
    
    gameState.skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill';
        skillElement.innerHTML = `
            <div class="skill-name">${skill.name} (Level ${skill.level}/${skill.maxLevel})</div>
            <div class="skill-description">${skill.description}</div>
            <div class="skill-cost">Biaya: ${skill.cost} skill point</div>
            <button class="btn btn-primary upgrade-skill" data-skill="${skill.id}" ${gameState.player.skillPoints < skill.cost || skill.level >= skill.maxLevel ? 'disabled' : ''}>
                Tingkatkan
            </button>
        `;
        skillsList.appendChild(skillElement);
    });
    
    // Add event listeners to upgrade buttons
    const upgradeButtons = document.querySelectorAll('.upgrade-skill');
    upgradeButtons.forEach(button => {
        button.addEventListener('click', function() {
            upgradeSkill(parseInt(this.dataset.skill));
        });
    });
}

// Upgrade Skill
function upgradeSkill(skillId) {
    const skill = gameState.skills.find(s => s.id === skillId);
    if (skill && gameState.player.skillPoints >= skill.cost && skill.level < skill.maxLevel) {
        skill.level++;
        gameState.player.skillPoints -= skill.cost;
        document.getElementById('skill-points').textContent = gameState.player.skillPoints;
        renderSkills();
        showNotification(`Skill ${skill.name} ditingkatkan ke level ${skill.level}!`, 'success');
    }
}

// Check Achievements
function checkAchievements() {
    // Check collector achievement
    if (gameState.inventory.length >= 5 && !gameState.achievements[1].unlocked) {
        gameState.achievements[1].unlocked = true;
        showAchievementNotification('Kolektor');
    }
    
    // Check explorer achievement
    let unlockedLocations = 0;
    Object.values(gameState.locations).forEach(location => {
        if (location.unlocked) unlockedLocations++;
    });
    
    if (unlockedLocations >= 3 && !gameState.achievements[3].unlocked) {
        gameState.achievements[3].unlocked = true;
        showAchievementNotification('Penjelajah');
    }
}

// Show Achievement Notification
function showAchievementNotification(achievementName) {
    showNotification(`🏆 Pencapaian Terbuka: ${achievementName}`, 'success');
}

// Update Quest Progress
function updateQuestProgress(questId, progress) {
    const quest = gameState.quests.find(q => q.id === questId);
    if (quest && !quest.completed) {
        quest.progress = Math.min(progress, quest.maxProgress);
        
        if (quest.progress >= quest.maxProgress) {
            quest.completed = true;
            completeQuest(quest);
        }
        
        renderQuests();
    }
}

// Complete Quest
function completeQuest(quest) {
    // Add rewards
    if (quest.reward.includes('EXP')) {
        const expMatch = quest.reward.match(/(\d+) EXP/);
        if (expMatch) {
            addExperience(parseInt(expMatch[1]));
        }
    }
    
    showNotification(`Quest "${quest.name}" selesai! Hadiah: ${quest.reward}`, 'success');
    
    // Check if all tutorial quests are completed
    if (quest.id === 1) {
        updateQuestProgress(2, 1); // Start collection quest
    }
}

// Add Experience
function addExperience(exp) {
    gameState.player.experience += exp;
    
    // Check for level up
    while (gameState.player.experience >= gameState.player.maxExperience) {
        gameState.player.experience -= gameState.player.maxExperience;
        gameState.player.level++;
        gameState.player.maxExperience = Math.floor(gameState.player.maxExperience * 1.5);
        gameState.player.skillPoints += 2;
        gameState.player.maxHealth += 10;
        gameState.player.health = gameState.player.maxHealth;
        
        showNotification(`Level Up! Sekarang Level ${gameState.player.level}`, 'success');
        
        // Unlock new locations based on level
        Object.keys(gameState.locations).forEach(locationKey => {
            const location = gameState.locations[locationKey];
            if (!location.unlocked && gameState.player.level >= location.levelReq) {
                location.unlocked = true;
                showNotification(`Lokasi baru terbuka: ${location.name}`, 'info');
            }
        });
    }
    
    updatePlayerDisplay();
}

// Update Map Display
function updateMapDisplay() {
    const locations = document.querySelectorAll('.location');
    locations.forEach(locationEl => {
        const locationKey = locationEl.dataset.location;
        const location = gameState.locations[locationKey];
        
        if (location.unlocked) {
            locationEl.classList.remove('locked');
            if (locationKey === gameState.player.location) {
                locationEl.classList.add('active');
            } else {
                locationEl.classList.remove('active');
            }
        } else {
            locationEl.classList.add('locked');
            locationEl.classList.remove('active');
        }
    });
}

// Select Location
function selectLocation(locationKey) {
    const locations = document.querySelectorAll('.location');
    locations.forEach(locationEl => {
        locationEl.classList.remove('active');
    });
    
    const selectedLocation = document.querySelector(`[data-location="${locationKey}"]`);
    selectedLocation.classList.add('active');
    
    gameState.selectedLocation = locationKey;
}

// Travel to Location
function travelToLocation() {
    if (gameState.selectedLocation && gameState.selectedLocation !== gameState.player.location) {
        gameState.player.location = gameState.selectedLocation;
        
        // Update scene display
        const location = gameState.locations[gameState.player.location];
        document.getElementById('scene-display').innerHTML = `
            <h2 class="scene-title">${location.name}</h2>
            <div class="scene-content">
                <p>Anda tiba di ${location.name}.</p>
                ${location.enemies && location.enemies.length > 0 ? 
                    `<p>Area ini memiliki musuh: ${location.enemies.join(', ')}</p>
                     <button class="btn btn-danger" id="encounter-btn">Cari Pertarungan</button>` : 
                    `<p>Area ini aman dan damai.</p>`}
            </div>
        `;
        
        // Add encounter button event listener if available
        const encounterBtn = document.getElementById('encounter-btn');
        if (encounterBtn) {
            encounterBtn.addEventListener('click', startRandomEncounter);
        }
        
        showNotification(`Anda tiba di ${location.name}`, 'info');
        updateMapDisplay();
        
        // Close map modal
        document.getElementById('map-modal').style.display = 'none';
    } else {
        showNotification('Pilih lokasi yang berbeda!', 'warning');
    }
}

// Start Random Encounter
function startRandomEncounter() {
    const location = gameState.locations[gameState.player.location];
    if (location.enemies && location.enemies.length > 0) {
        const randomEnemy = location.enemies[Math.floor(Math.random() * location.enemies.length)];
        startCombat(randomEnemy);
    }
}

// Start Combat
function startCombat(enemyType) {
    gameState.inCombat = true;
    gameState.currentEnemy = JSON.parse(JSON.stringify(enemies[enemyType.toLowerCase()]));
    
    // Update combat modal
    document.getElementById('player-name').textContent = getAvatarName(gameState.player.avatar);
    document.getElementById('enemy-name').textContent = gameState.currentEnemy.name;
    
    updateCombatDisplay();
    
    // Show combat modal
    document.getElementById('combat-modal').style.display = 'block';
    
    // Clear combat log
    document.getElementById('combat-log').innerHTML = '<div class="log-entry">Pertarungan dimulai!</div>';
    
    // Add initial log entry
    addCombatLog(`Anda bertemu ${gameState.currentEnemy.name}!`, 'info');
}

// Update Combat Display
function updateCombatDisplay() {
    // Update player HP
    const playerHpPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
    document.getElementById('player-hp').style.width = `${playerHpPercent}%`;
    document.getElementById('player-hp-text').textContent = `${gameState.player.health}/${gameState.player.maxHealth}`;
    
    // Update enemy HP
    const enemyHpPercent = (gameState.currentEnemy.health / gameState.currentEnemy.maxHealth) * 100;
    document.getElementById('enemy-hp').style.width = `${enemyHpPercent}%`;
    document.getElementById('enemy-hp-text').textContent = `${gameState.currentEnemy.health}/${gameState.currentEnemy.maxHealth}`;
}

// Perform Combat Action
function performCombatAction(action) {
    if (!gameState.inCombat) return;
    
    switch(action) {
        case 'attack':
            playerAttack();
            break;
        case 'defend':
            playerDefend();
            break;
        case 'skill':
            useSkill();
            break;
        case 'flee':
            fleeCombat();
            break;
    }
    
    // Check if combat should continue
    if (gameState.inCombat && gameState.currentEnemy.health > 0) {
        enemyTurn();
    }
}

// Player Attack
function playerAttack() {
    const damage = Math.max(1, 5 + Math.floor(Math.random() * 6) - gameState.currentEnemy.defense);
    gameState.currentEnemy.health -= damage;
    
    addCombatLog(`Anda menyerang ${gameState.currentEnemy.name} dan menyebabkan ${damage} damage!`, 'player');
    updateCombatDisplay();
    
    if (gameState.currentEnemy.health <= 0) {
        enemyDefeated();
    }
}

// Player Defend
function playerDefend() {
    // Increase defense for next enemy attack
    const defenseBoost = 3;
    addCombatLog(`Anda bertahan dan meningkatkan pertahanan sebesar ${defenseBoost} untuk serangan berikutnya!`, 'player');
    
    // This would need to be implemented in the enemy attack logic
    // For simplicity, we'll just log it
}

// Use Skill
function useSkill() {
    const availableSkills = gameState.skills.filter(skill => skill.level > 0);
    if (availableSkills.length > 0) {
        const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
        
        switch(randomSkill.type) {
            case 'attack':
                const damage = 8 + randomSkill.level * 2;
                gameState.currentEnemy.health -= damage;
                addCombatLog(`Anda menggunakan ${randomSkill.name} dan menyebabkan ${damage} damage!`, 'player');
                break;
            case 'heal':
                const heal = 10 + randomSkill.level * 5;
                gameState.player.health = Math.min(gameState.player.maxHealth, gameState.player.health + heal);
                addCombatLog(`Anda menggunakan ${randomSkill.name} dan memulihkan ${heal} HP!`, 'player');
                break;
            default:
                addCombatLog(`Anda menggunakan ${randomSkill.name}!`, 'player');
        }
        
        updateCombatDisplay();
        
        if (gameState.currentEnemy.health <= 0) {
            enemyDefeated();
        }
    } else {
        addCombatLog('Anda tidak memiliki skill yang bisa digunakan!', 'warning');
    }
}

// Flee Combat
function fleeCombat() {
    const fleeChance = 0.7; // 70% chance to flee successfully
    if (Math.random() < fleeChance) {
        addCombatLog('Anda berhasil kabur dari pertarungan!', 'info');
        endCombat();
    } else {
        addCombatLog('Anda gagal kabur dari pertarungan!', 'warning');
    }
}

// Enemy Turn
function enemyTurn() {
    if (!gameState.inCombat || gameState.currentEnemy.health <= 0) return;
    
    const damage = Math.max(1, gameState.currentEnemy.attack + Math.floor(Math.random() * 4));
    gameState.player.health -= damage;
    
    addCombatLog(`${gameState.currentEnemy.name} menyerang Anda dan menyebabkan ${damage} damage!`, 'enemy');
    updateCombatDisplay();
    updatePlayerDisplay();
    
    if (gameState.player.health <= 0) {
        playerDefeated();
    }
}

// Enemy Defeated
function enemyDefeated() {
    addCombatLog(`Anda mengalahkan ${gameState.currentEnemy.name}!`, 'success');
    addCombatLog(`Anda mendapatkan ${gameState.currentEnemy.exp} EXP!`, 'info');
    
    addExperience(gameState.currentEnemy.exp);
    
    // Chance to get loot
    if (Math.random() < 0.3) { // 30% chance
        const loot = { 
            id: Date.now(), 
            name: 'Item Musuh', 
            type: 'misc', 
            rarity: 'common', 
            description: 'Item yang didapat dari mengalahkan musuh', 
            value: 5 
        };
        gameState.inventory.push(loot);
        addCombatLog(`Anda mendapatkan ${loot.name}!`, 'success');
        renderInventory();
    }
    
    // Update quest progress
    updateQuestProgress(3, 1);
    
    // End combat after a delay
    setTimeout(() => {
        endCombat();
    }, 2000);
}

// Player Defeated
function playerDefeated() {
    addCombatLog('Anda dikalahkan dalam pertarungan!', 'error');
    addCombatLog('Anda kehilangan 10 EXP dan kembali ke Desa.', 'warning');
    
    // Penalty for losing
    gameState.player.experience = Math.max(0, gameState.player.experience - 10);
    gameState.player.health = gameState.player.maxHealth;
    gameState.player.location = 'desa';
    
    updatePlayerDisplay();
    
    // End combat after a delay
    setTimeout(() => {
        endCombat();
        showNotification('Anda dikalahkan dan kembali ke Desa!', 'error');
    }, 2000);
}

// End Combat
function endCombat() {
    gameState.inCombat = false;
    gameState.currentEnemy = null;
    document.getElementById('combat-modal').style.display = 'none';
}

// Add Combat Log Entry
function addCombatLog(message, type) {
    const log = document.getElementById('combat-log');
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    logEntry.textContent = message;
    log.appendChild(logEntry);
    log.scrollTop = log.scrollHeight;
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add some initial game content when the page loads
window.addEventListener('load', function() {
    // Add a welcome message after a short delay
    setTimeout(() => {
        if (!gameState.player.avatar) {
            showNotification('Selamat datang di Raga Nusantara V3.1! Pilih avatar untuk memulai.', 'info');
        }
    }, 1000);
});