// ============================================================
// RAMEN ULTIMATE - FIXED SCRIPT
// PART 1
// ============================================================

// --- NEW SOUND SYSTEM ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'cash') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
            1200,
            audioCtx.currentTime + 0.1
        );

        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audioCtx.currentTime + 0.1
        );

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);

    } else if (type === 'cook') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
            100,
            audioCtx.currentTime + 0.1
        );

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audioCtx.currentTime + 0.1
        );

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);

    } else if (type === 'serve') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audioCtx.currentTime + 0.1
        );

        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);

    } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audioCtx.currentTime + 0.2
        );

        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    }
}


// ============================================================
// FORMATTERS
// ============================================================

const suffixes = [
    "",
    "k",
    "M",
    "B",
    "T",
    "Qa",
    "Qi",
    "Sx",
    "Sp",
    "Oc",
    "No",
    "Dc",
    "Ud",
    "Dd",
    "Td",
    "Qd",
    "Qnd",
    "Sxd",
    "Spd",
    "Ocd"
];

function formatMoney(n) {
    if (!Number.isFinite(n)) return "0";

    if (n < 1000) {
        return Math.floor(n).toString();
    }

    let exponent = Math.floor(Math.log10(n));
    let suffixNum = Math.floor(exponent / 3);

    if (suffixNum < suffixes.length) {
        let shortValue = n / Math.pow(10, suffixNum * 3);
        return shortValue.toFixed(2) + suffixes[suffixNum];
    }

    return n.toExponential(2);
}


// ============================================================
// VISUAL EFFECTS
// ============================================================

function spawnFloatingMoney(amount, targetId, color = '#2ecc71') {
    const targetEl = document.getElementById(targetId);

    const floatText = document.createElement('div');

    floatText.className = 'floating-money';

    floatText.innerText =
        typeof amount === 'number'
            ? `+$${formatMoney(amount)}`
            : amount;

    floatText.style.position = 'absolute';
    floatText.style.color = color;
    floatText.style.fontWeight = 'bold';
    floatText.style.fontSize = '1.2rem';
    floatText.style.pointerEvents = 'none';
    floatText.style.zIndex = '100';
    floatText.style.animation = 'floatUp 1s ease-out forwards';

    if (targetEl) {
        const rect = targetEl.getBoundingClientRect();

        floatText.style.left =
            (rect.left + window.scrollX + 20) + 'px';

        floatText.style.top =
            (rect.top + window.scrollY) + 'px';

    } else {
        floatText.style.left = '50%';
        floatText.style.top = '50%';
    }

    document.body.appendChild(floatText);

    setTimeout(() => {
        if (floatText && floatText.isConnected) {
            floatText.remove();
        }
    }, 1000);
}


if (!document.getElementById('floating-money-style')) {
    const style = document.createElement('style');

    style.id = 'floating-money-style';

    style.innerHTML = `
        @keyframes floatUp {
            0% {
                opacity: 1;
                transform: translateY(0);
            }

            100% {
                opacity: 0;
                transform: translateY(-50px);
            }
        }
    `;

    document.head.appendChild(style);
}


// ============================================================
// GAME DATA
// ============================================================

const TRACK_TABLES = Array.from(
    { length: 1000 },
    (_, i) => ({
        name: `Table ${i + 2}`,
        cost: Math.floor(500 * Math.pow(1.18, i))
    })
);


const TRACK_WOK = Array.from(
    { length: 1000 },
    (_, i) => ({
        name: `Wok Lvl ${i + 2}`,
        cost: Math.floor(100000 * Math.pow(1.19, i))
    })
);


const TRACK_AUTO = Array.from(
    { length: 1000 },
    (_, i) => ({
        name: `Chef Speed Lvl ${i + 1}`,
        cost: Math.floor(2500 * Math.pow(1.16, i))
    })
);


const TRACK_ADS = Array.from(
    { length: 1000 },
    (_, i) => ({
        name: `Marketing Lvl ${i + 1}`,
        cost: Math.floor(2000 * Math.pow(1.20, i))
    })
);


// ============================================================
// RECIPES
// ============================================================

const R_PRE = [
    "Basic",
    "Spicy",
    "Crispy",
    "Golden",
    "Mega",
    "Ultra",
    "Hyper",
    "Quantum",
    "Galactic",
    "Cosmic",
    "Mystic",
    "Atomic",
    "Neon",
    "Shadow",
    "Celestial",
    "Divine",
    "Infernal",
    "Supreme",
    "Ethereal",
    "Infinity"
];


const R_BASE = [
    "Shoyu",
    "Miso",
    "Tonkotsu",
    "Udon",
    "Soba",
    "Truffle",
    "Wagyu",
    "Dragon",
    "Phoenix",
    "Nova",
    "Kelp",
    "Katsu",
    "Kimchi",
    "Kitsune",
    "Bison",
    "Kraken",
    "Leviathan",
    "Titan",
    "Emperor",
    "Godzilla"
];


const RAMEN_NAMES = [
    "Basic Shoyu",
    "Miso Pork",
    "Spicy Tonkotsu",
    "Chicken Paitan",
    "Seafood Ramen",
    "Veggie Udon",
    "Truffle Ramen"
];


const TRACK_RECIPES = Array.from(
    { length: 1000 },
    (_, i) => {

        let name =
            i < RAMEN_NAMES.length
                ? RAMEN_NAMES[i]
                : `${R_PRE[i % R_PRE.length]} ${
                    R_BASE[
                        Math.floor(i / R_PRE.length) %
                        R_BASE.length
                    ]
                } Ramen`;

        if (i === 999) {
            name = "The Universal Ramen";
        }

        const cost =
            Math.floor(1000 * Math.pow(1.14, i));

        const value =
            Math.floor(50 * Math.pow(1.11, i));

        return {
            name,
            cost,
            value
        };
    }
);


// ============================================================
// DECOR
// ============================================================

const TRACK_DECOR = [
    {
        id: 'theme-default',
        name: 'Standard Store',
        cost: 0
    },

    {
        id: 'theme-neon',
        name: 'Cyberpunk Neon',
        cost: 500000
    },

    {
        id: 'theme-zen',
        name: 'Zen Garden',
        cost: 10000000
    },

    {
        id: 'theme-gold',
        name: 'Solid Gold Palace',
        cost: 1000000000
    }
];


// ============================================================
// STAFF
// ============================================================

const TRACK_STAFF = [
    {
        id: 'waiter',
        name: 'Waiter Chimp (Auto Serve/Pay)',
        baseCost: 50000,
        mult: 5
    },

    {
        id: 'ninja',
        name: 'Ninja Macaque (Insta-Cook Chance)',
        baseCost: 250000,
        mult: 10
    },

    {
        id: 'mascot',
        name: 'Capuchin Mascot (+Patience/Tips)',
        baseCost: 1000000,
        mult: 15
    }
];


// ============================================================
// RIVALS
// ============================================================

const INITIAL_RIVALS = [
    {
        id: 'sushi',
        name: '🍣 Sushi Pandas',
        hp: 50000,
        maxHp: 50000,
        cost: 5000,
        multReward: 0.5
    },

    {
        id: 'burger',
        name: '🍔 Burger Bears',
        hp: 1000000,
        maxHp: 1000000,
        cost: 50000,
        multReward: 1.0
    },

    {
        id: 'pizza',
        name: '🍕 Pizza Penguins',
        hp: 50000000,
        maxHp: 50000000,
        cost: 1000000,
        multReward: 2.0
    },

    {
        id: 'taco',
        name: '🌮 Taco Tigers',
        hp: 1e10,
        maxHp: 1e10,
        cost: 5e8,
        multReward: 5.0
    },

    {
        id: 'boss',
        name: '🦍 The Silverback Syndicate',
        hp: 1e15,
        maxHp: 1e15,
        cost: 1e12,
        multReward: 20.0
    }
];


// ============================================================
// INVENTORY / SAVE SETTINGS
// ============================================================

const defaultInv = {
    noodle: 10,
    broth: 10,
    spice: 10,
    egg: 10,
    boba: 10
};

const SAVE_KEY = 'RamenUltimateData';
const SAVE_BACKUP_KEY = 'RamenUltimateBackup';

const SAVE_VERSION = 2;

const SAVE_SALT = 'rm-fair-kitchen-2026';


// ============================================================
// GAME STATE
// ============================================================
// IMPORTANT:
// Offline earnings have been removed.
// There is NO lastSaveTime and NO offline reward calculation.
// ============================================================

let game = {
    wallet: 150,

    monkeyMoney: 0,

    turfMult: 1,

    tablesOwned: 1,

    idxTable: 0,

    idxRecipe: 0,

    idxWok: 0,

    idxAuto: 0,

    idxSpecial: 0,

    currentMenuPrice: 50,

    activeDecor: 'theme-default',

    decorOwned: [
        'theme-default'
    ],

    autoRefill: false,

    staff: {
        waiter: 0,
        ninja: 0,
        mascot: 0
    },

    rivals: JSON.parse(
        JSON.stringify(INITIAL_RIVALS)
    ),

    inv: {
        ...defaultInv
    },

    upgrades: {},

    achievements: [],

    autoChefSpeedMulti: 1,

    idxAds: 0,

    servedCount: 0,

    totalEarned: 0,

    vipServed: 0,

    combo: 0,

    bestCombo: 0,

    rivalsDefeated: 0,

    eventsTriggered: 0,

    missionCycle: 0,

    missions: [],

    missionStreak: 0,

    lastMissionReset: Date.now(),

    restaurantXp: 0,

    popularity: 50,

    dailySpecialIndex: 0,

    specialEndsAt: Date.now() + 86400000,

    nightMode: false,

    deliveryActive: null,

    deliveriesCompleted: 0,

    staffTraining: {
        waiter: 0,
        ninja: 0,
        mascot: 0
    },

    reviews: [],

    physical: {
        capacity: 1,

        speedLevel: 0,

        cookingLevel: 0,

        interactionLevel: 0,

        ingredientsReadyFor: null,

        activeOrder: null,

        carriedFood: []
    }
};


window.vipPartyActive = 0;


// ============================================================
// MISSIONS
// ============================================================

const MISSION_DEFINITIONS = [
    {
        id: 'serve',
        icon: '🍜',
        title: 'Bowl Rush',
        description: 'Serve hungry customers',
        type: 'servedCount',
        baseTarget: 5,
        reward: 250
    },

    {
        id: 'revenue',
        icon: '💰',
        title: 'Stack the Cash',
        description: 'Earn restaurant revenue',
        type: 'totalEarned',
        baseTarget: 500,
        reward: 400
    },

    {
        id: 'vip',
        icon: '👑',
        title: 'VIP Treatment',
        description: 'Serve VIP or critic customers',
        type: 'vipServed',
        baseTarget: 1,
        reward: 750
    },

    {
        id: 'combo',
        icon: '🔥',
        title: 'Perfect Service',
        description: 'Build a payment combo',
        type: 'bestCombo',
        baseTarget: 5,
        reward: 650
    },

    {
        id: 'rivals',
        icon: '⚔️',
        title: 'Market Takeover',
        description: 'Defeat rival restaurants',
        type: 'rivalsDefeated',
        baseTarget: 1,
        reward: 1000
    },

    {
        id: 'events',
        icon: '⚡',
        title: 'Chaos Coordinator',
        description: 'Trigger special events',
        type: 'eventsTriggered',
        baseTarget: 2,
        reward: 500
    }
];


// ============================================================
// ACHIEVEMENTS
// ============================================================

const ACHIEVEMENT_DEFINITIONS = [
    {
        id: 'first-bowl',
        icon: '🥢',
        title: 'First Bowl',
        description: 'Serve your first customer',
        check: () => game.servedCount >= 1
    },

    {
        id: 'busy-kitchen',
        icon: '🍥',
        title: 'Busy Kitchen',
        description: 'Serve 25 customers',
        check: () => game.servedCount >= 25
    },

    {
        id: 'combo-master',
        icon: '🔥',
        title: 'Combo Master',
        description: 'Reach a 10 bowl combo',
        check: () => game.bestCombo >= 10
    },

    {
        id: 'vip-club',
        icon: '👑',
        title: 'VIP Club',
        description: 'Serve 5 VIPs or critics',
        check: () => game.vipServed >= 5
    },

    {
        id: 'tycoon',
        icon: '💎',
        title: 'True Tycoon',
        description: 'Earn $100,000 lifetime revenue',
        check: () => game.totalEarned >= 100000
    },

    {
        id: 'warlord',
        icon: '⚔️',
        title: 'Turf Warlord',
        description: 'Defeat your first rival',
        check: () => game.rivalsDefeated >= 1
    }
];


// ============================================================
// DAILY SPECIALS
// ============================================================

const DAILY_SPECIALS = [
    {
        name: 'Golden Egg Ramen',
        icon: '🥚',
        description: 'Eggs taste legendary today',
        multiplier: 1.5
    },

    {
        name: 'Neon Boba Blast',
        icon: '🧋',
        description: 'Boba fans pay premium prices',
        multiplier: 1.35
    },

    {
        name: 'Chef’s Secret Miso',
        icon: '🥣',
        description: 'A cozy bowl for serious foodies',
        multiplier: 1.25
    },

    {
        name: 'Dragon Spice Challenge',
        icon: '🌶️',
        description: 'Brave guests leave giant tips',
        multiplier: 1.75
    },

    {
        name: 'Midnight Tonkotsu',
        icon: '🌙',
        description: 'Late-night broth is twice as rich',
        multiplier: 1.6
    }
];


// ============================================================
// MISSION GENERATOR
// ============================================================

function createMissionSet() {
    const cycle = game.missionCycle || 0;

    const start =
        cycle % MISSION_DEFINITIONS.length;

    return [0, 1, 2].map((offset) => {

        const definition =
            MISSION_DEFINITIONS[
                (start + offset) %
                MISSION_DEFINITIONS.length
            ];

        const scale =
            1 +
            Math.floor(cycle / 3) * 0.25;

        return {
            id: `${definition.id}-${cycle}`,

            title: definition.title,

            icon: definition.icon,

            description: definition.description,

            type: definition.type,

            target:
                Math.ceil(
                    definition.baseTarget * scale
                ),

            reward:
                Math.ceil(
                    definition.reward * scale
                ),

            claimed: false
        };
    });
}


// ============================================================
// CHARACTER DATA
// ============================================================

const charColors = {
    skin: [
        "#ffdbac",
        "#f1c27d",
        "#e0ac69",
        "#8d5524",
        "#4a3219"
    ],

    hair: [
        "#090806",
        "#4a2511",
        "#b7a69e",
        "#d6c4c2",
        "#e25822"
    ],

    shirt: [
        "#e74c3c",
        "#3498db",
        "#2ecc71",
        "#f1c40f",
        "#9b59b6"
    ],

    pants: [
        "#2980b9",
        "#2c3e50",
        "#7f8c8d"
    ]
};


function generateRandomChar() {

    let isVipRoll =
        Math.random() < 0.01;

    if (window.vipPartyActive > 0) {
        isVipRoll = true;
        window.vipPartyActive--;
    }

    return {
        skin:
            charColors.skin[
                Math.floor(
                    Math.random() * 5
                )
            ],

        hair:
            charColors.hair[
                Math.floor(
                    Math.random() * 5
                )
            ],

        shirt:
            charColors.shirt[
                Math.floor(
                    Math.random() * 5
                )
            ],

        pants:
            charColors.pants[
                Math.floor(
                    Math.random() * 3
                )
            ],

        isVIP: isVipRoll,

        isCritic:
            Math.random() < 0.02,

        wantsBoba:
            Math.random() < 0.2
    };
}


function renderCharHTML(c) {

    const crown =
        c.isVIP
            ? `<div class="vip-crown">👑</div>`
            : '';

    const critic =
        c.isCritic
            ? `<div style="
                position:absolute;
                top:-20px;
                right:-10px;
                font-size:1.2rem;
                z-index:10;
              ">🧐</div>`
            : '';

    const boba =
        c.wantsBoba
            ? `<div style="
                position:absolute;
                top:-5px;
                right:-20px;
                font-size:1.2rem;
                z-index:15;
              ">🧋</div>`
            : '';

    const vipClass =
        c.isVIP
            ? ' vip-char'
            : '';

    return `
        <div
            class="rpg-char${vipClass}"
            style="
                --skin:${c.skin};
                --hair:${c.hair};
                --shirt:${c.isVIP ? '#f1c40f' : c.shirt};
                --pants:${c.pants};
            "
        >
            ${crown}
            ${critic}
            ${boba}

            <div class="rpg-head">
                <div class="rpg-hair"></div>

                <div class="rpg-eyes">
                    <div class="rpg-eye"></div>
                    <div class="rpg-eye"></div>
                </div>
            </div>

            <div class="rpg-body"></div>

            <div class="rpg-legs">
                <div class="rpg-leg"></div>
                <div class="rpg-leg"></div>
            </div>
        </div>
    `;
}


// ============================================================
// GAME STATE NORMALIZATION
// ============================================================

function normalizeGameState() {

    const numericDefaults = {

        wallet: 150,

        monkeyMoney: 0,

        turfMult: 1,

        tablesOwned: 1,

        idxTable: 0,

        idxRecipe: 0,

        idxWok: 0,

        idxAuto: 0,

        idxAds: 0,

        currentMenuPrice: 50,

        autoChefSpeedMulti: 1,

        restaurantXp: 0,

        popularity: 50,

        dailySpecialIndex: 0,

        specialEndsAt:
            Date.now() + 86400000,

        deliveriesCompleted: 0
    };


    Object.entries(
        numericDefaults
    ).forEach(
        ([key, fallback]) => {

            if (
                !Number.isFinite(
                    game[key]
                )
            ) {
                game[key] = fallback;
            }
        }
    );


    game.activeDecor =
        typeof game.activeDecor === 'string'
            ? game.activeDecor
            : 'theme-default';


    if (!Array.isArray(game.decorOwned)) {
        game.decorOwned = [
            'theme-default'
        ];
    }


    if (!game.decorOwned.includes('theme-default')) {
        game.decorOwned.unshift(
            'theme-default'
        );
    }


    if (!game.staff || typeof game.staff !== 'object') {
        game.staff = {
            waiter: 0,
            ninja: 0,
            mascot: 0
        };
    }


    if (!game.inv || typeof game.inv !== 'object') {
        game.inv = {
            ...defaultInv
        };
    }


    Object.entries(defaultInv).forEach(
        ([key, value]) => {

            if (
                !Number.isFinite(
                    game.inv[key]
                )
            ) {
                game.inv[key] = value;
            }
        }
    );


    if (!Array.isArray(game.rivals)) {
        game.rivals =
            JSON.parse(
                JSON.stringify(
                    INITIAL_RIVALS
                )
            );
    }


    if (!Array.isArray(game.achievements)) {
        game.achievements = [];
    }


    if (!Array.isArray(game.missions)) {
        game.missions =
            createMissionSet();
    }


    if (!game.physical || typeof game.physical !== 'object') {

        game.physical = {
            capacity: 1,
            speedLevel: 0,
            cookingLevel: 0,
            interactionLevel: 0,
            ingredientsReadyFor: null,
            activeOrder: null,
            carriedFood: []
        };
    }


    if (!Number.isFinite(game.physical.capacity)) {
        game.physical.capacity = 1;
    }


    if (!Number.isFinite(game.physical.speedLevel)) {
        game.physical.speedLevel = 0;
    }


    if (!Number.isFinite(game.physical.cookingLevel)) {
        game.physical.cookingLevel = 0;
    }


    if (!Number.isFinite(game.physical.interactionLevel)) {
        game.physical.interactionLevel = 0;
    }


    if (!Array.isArray(game.physical.carriedFood)) {
        game.physical.carriedFood = [];
    }


    // --------------------------------------------------------
    // SAFETY LIMITS
    // --------------------------------------------------------

    game.wallet =
        Math.max(
            0,
            Math.min(
                Number.MAX_SAFE_INTEGER,
                game.wallet
            )
        );


    game.monkeyMoney =
        Math.max(
            0,
            Math.min(
                Number.MAX_SAFE_INTEGER,
                game.monkeyMoney
            )
        );


    game.turfMult =
        Math.max(
            1,
            Math.min(
                1000000,
                game.turfMult
            )
        );


    game.tablesOwned =
        Math.max(
            1,
            Math.min(
                TRACK_TABLES.length + 1,
                Math.floor(game.tablesOwned)
            )
        );


    game.idxTable =
        Math.max(
            0,
            Math.min(
                TRACK_TABLES.length,
                Math.floor(game.idxTable)
            )
        );


    game.idxRecipe =
        Math.max(
            0,
            Math.min(
                TRACK_RECIPES.length,
                Math.floor(game.idxRecipe)
            )
        );


    game.idxWok =
        Math.max(
            0,
            Math.min(
                TRACK_WOK.length,
                Math.floor(game.idxWok)
            )
        );


    game.idxAuto =
        Math.max(
            0,
            Math.min(
                TRACK_AUTO.length,
                Math.floor(game.idxAuto)
            )
        );


    game.idxAds =
        Math.max(
            0,
            Math.min(
                TRACK_ADS.length,
                Math.floor(game.idxAds)
            )
        );
}// ============================================================
// PART 2 - GAME SYSTEMS + ANTI-CHEAT
// ============================================================

game.autoRefill = Boolean(game.autoRefill);
game.nightMode = Boolean(game.nightMode);

game.popularity = Math.max(
    0,
    Math.min(100, game.popularity)
);

game.staffTraining = {
    waiter: 0,
    ninja: 0,
    mascot: 0,
    ...(game.staffTraining || {})
};

game.reviews = Array.isArray(game.reviews)
    ? game.reviews.slice(0, 6)
    : [];

game.physical = {
    capacity: 1,
    speedLevel: 0,
    cookingLevel: 0,
    interactionLevel: 0,
    ingredientsReadyFor: null,
    activeOrder: null,
    carriedFood: [],
    ...(game.physical || {})
};

game.physical.capacity = Math.max(
    1,
    Math.min(
        4,
        Number(game.physical.capacity) || 1
    )
);

game.physical.speedLevel = Math.max(
    0,
    Number(game.physical.speedLevel) || 0
);

game.physical.cookingLevel = Math.max(
    0,
    Number(game.physical.cookingLevel) || 0
);

game.physical.interactionLevel = Math.max(
    0,
    Number(game.physical.interactionLevel) || 0
);

game.physical.carriedFood =
    Array.isArray(game.physical.carriedFood)
        ? game.physical.carriedFood
        : [];


// Runtime-only data should never be restored
// from an old saved session.

game.physical.activeOrder = null;
game.physical.ingredientsReadyFor = null;
game.physical.carriedFood = [];


if (
    !game.deliveryActive ||
    !Number.isFinite(game.deliveryActive.endsAt) ||
    game.deliveryActive.endsAt <= Date.now()
) {
    game.deliveryActive = null;
}


game.inv = {
    ...defaultInv,
    ...(game.inv || {})
};


game.staff = {
    waiter: 0,
    ninja: 0,
    mascot: 0,
    ...(game.staff || {})
};


game.rivals =
    Array.isArray(game.rivals) &&
    game.rivals.length
        ? game.rivals
        : JSON.parse(
            JSON.stringify(INITIAL_RIVALS)
        );


game.decorOwned =
    Array.isArray(game.decorOwned) &&
    game.decorOwned.length
        ? game.decorOwned
        : ['theme-default'];


game.achievements =
    Array.isArray(game.achievements)
        ? game.achievements
        : [];


game.missionCycle =
    Number.isFinite(game.missionCycle)
        ? game.missionCycle
        : 0;


game.missionStreak =
    Number.isFinite(game.missionStreak)
        ? game.missionStreak
        : 0;


game.lastMissionReset =
    Number.isFinite(game.lastMissionReset)
        ? game.lastMissionReset
        : Date.now();


[
    'servedCount',
    'totalEarned',
    'vipServed',
    'combo',
    'bestCombo',
    'rivalsDefeated',
    'eventsTriggered'
].forEach((key) => {

    game[key] =
        Number.isFinite(game[key])
            ? game[key]
            : 0;

});


if (
    !Array.isArray(game.missions) ||
    game.missions.length !== 3
) {
    game.missions = createMissionSet();
}


game.wallet = Math.max(
    0,
    Math.min(1e100, game.wallet)
);


game.monkeyMoney = Math.max(
    0,
    Math.min(
        50000,
        Math.floor(game.monkeyMoney)
    )
);


game.turfMult = Math.max(
    1,
    Math.min(100, game.turfMult)
);


game.tablesOwned = Math.max(
    1,
    Math.min(
        1000,
        Math.floor(game.tablesOwned)
    )
);


[
    'idxTable',
    'idxRecipe',
    'idxWok',
    'idxAuto',
    'idxAds'
].forEach((key) => {

    game[key] = Math.max(
        0,
        Math.min(
            999,
            Math.floor(game[key])
        )
    );

});


Object.keys(game.inv).forEach((key) => {

    game.inv[key] = Math.max(
        0,
        Math.min(
            1e12,
            Math.floor(
                Number(game.inv[key]) || 0
            )
        )
    );

});


Object.keys(game.staff).forEach((key) => {

    game.staff[key] = Math.max(
        0,
        Math.min(
            1000,
            Math.floor(
                Number(game.staff[key]) || 0
            )
        )
    );

});


// ============================================================
// RESTAURANT LEVEL
// ============================================================

function getRestaurantLevel() {

    return (
        1 +
        Math.floor(
            Math.sqrt(
                Math.max(
                    0,
                    game.restaurantXp
                ) / 25
            )
        )
    );
}


function gainRestaurantXp(amount) {

    const oldLevel =
        getRestaurantLevel();

    game.restaurantXp += Math.max(
        0,
        Number(amount) || 0
    );

    const newLevel =
        getRestaurantLevel();

    if (newLevel > oldLevel) {

        game.wallet += newLevel * 100;

        showAchievementToast({
            icon: '🏆',
            title: `Restaurant Level ${newLevel}!`
        });
    }
}


// ============================================================
// DAILY SPECIAL
// ============================================================

function rotateDailySpecialIfNeeded() {

    if (
        Date.now() <
        game.specialEndsAt
    ) {
        return;
    }

    game.dailySpecialIndex =
        (
            game.dailySpecialIndex + 1
        ) %
        DAILY_SPECIALS.length;

    game.specialEndsAt =
        Date.now() + 86400000;

    saveGame();
}


function getDailySpecial() {

    rotateDailySpecialIfNeeded();

    return (
        DAILY_SPECIALS[
            game.dailySpecialIndex
        ] ||
        DAILY_SPECIALS[0]
    );
}


// ============================================================
// POPULARITY
// ============================================================

function getPopularityMultiplier() {

    return (
        0.75 +
        game.popularity / 200
    );
}


// ============================================================
// REVIEWS
// ============================================================

function addReview(
    text,
    positive = true
) {

    game.reviews.unshift({
        text,
        positive,
        time: Date.now()
    });

    game.reviews =
        game.reviews.slice(0, 6);
}


function renderReviewFeed() {

    const container =
        document.getElementById(
            'review-feed'
        );

    if (!container) return;


    if (!game.reviews.length) {

        container.innerHTML =
            '<div class="empty-reviews">' +
            'Your first guests are still deciding what to write...' +
            '</div>';

        return;
    }


    container.innerHTML =
        game.reviews.map(
            review => `
                <div class="review-card ${
                    review.positive
                        ? 'positive'
                        : 'negative'
                }">
                    <span>
                        ${
                            review.positive
                                ? '⭐'
                                : '💬'
                        }
                    </span>

                    <p>
                        ${review.text}
                    </p>
                </div>
            `
        ).join('');
}


// ============================================================
// DELIVERY PANEL
// ============================================================

function renderDeliveryPanel() {

    const status =
        document.getElementById(
            'delivery-status'
        );

    const button =
        document.getElementById(
            'btn-delivery'
        );

    if (!status || !button) {
        return;
    }


    if (game.deliveryActive) {

        const remaining =
            Math.max(
                0,
                Math.ceil(
                    (
                        game.deliveryActive.endsAt -
                        Date.now()
                    ) / 1000
                )
            );

        status.innerText =
            `In transit · ${remaining}s`;

        button.innerText =
            'Cooking...';

        button.disabled = true;

    } else {

        status.innerText =
            `${game.deliveriesCompleted} delivered`;

        button.innerText =
            'Dispatch Order';

        button.disabled = false;
    }
}


// ============================================================
// RESTAURANT CONTROLS
// ============================================================

function renderRestaurantControls() {

    const special =
        getDailySpecial();

    const specialLabel =
        document.getElementById(
            'daily-special'
        );

    const countdown =
        document.getElementById(
            'special-countdown'
        );

    const nightButton =
        document.getElementById(
            'btn-night'
        );


    if (specialLabel) {

        specialLabel.innerText =
            `${special.icon} ${special.name} · ${special.multiplier}x`;
    }


    if (countdown) {

        countdown.innerText =
            `${special.description} · ${
                Math.max(
                    1,
                    Math.ceil(
                        (
                            game.specialEndsAt -
                            Date.now()
                        ) / 3600000
                    )
                )
            }h left`;
    }


    if (nightButton) {

        nightButton.innerText =
            game.nightMode
                ? '☀️ Day Shift'
                : '🌙 Night Shift';
    }


    renderDeliveryPanel();
}


// ============================================================
// MISSIONS
// ============================================================

function resetMissionsIfNeeded() {

    if (
        Date.now() -
        game.lastMissionReset <
        86400000
    ) {
        return;
    }


    game.missionCycle++;

    game.missionStreak = 0;

    game.lastMissionReset =
        Date.now();

    game.missions =
        createMissionSet();

    saveGame();
}


function getMissionProgress(mission) {

    return Math.min(
        mission.target,
        Number(
            game[mission.type] || 0
        )
    );
}


// ============================================================
// ACHIEVEMENT TOAST
// ============================================================

function showAchievementToast(
    achievement
) {

    const toast =
        document.getElementById(
            'achieve-toast'
        );

    const name =
        document.getElementById(
            'achieve-name'
        );

    if (!toast || !name) {
        return;
    }


    name.innerText =
        `${achievement.icon} ${achievement.title}`;


    toast.classList.remove(
        'hidden-toast'
    );


    clearTimeout(
        window.achievementToastTimeout
    );


    window.achievementToastTimeout =
        setTimeout(
            () => {
                toast.classList.add(
                    'hidden-toast'
                );
            },
            4500
        );
}


// ============================================================
// ACHIEVEMENTS
// ============================================================

function checkAchievements() {

    ACHIEVEMENT_DEFINITIONS.forEach(
        (achievement) => {

            if (
                !game.achievements.includes(
                    achievement.id
                ) &&
                achievement.check()
            ) {

                game.achievements.push(
                    achievement.id
                );

                game.monkeyMoney += 1;

                showAchievementToast(
                    achievement
                );

                spawnFloatingMoney(
                    '+1 Monkey Money',
                    'money',
                    '#f1c40f'
                );
            }
        }
    );
}


// ============================================================
// CLAIM MISSION
// ============================================================

function claimMission(index) {

    const mission =
        game.missions[index];

    if (!mission) return;

    if (mission.claimed) return;

    if (
        getMissionProgress(
            mission
        ) <
        mission.target
    ) {
        return;
    }


    mission.claimed = true;

    game.wallet +=
        mission.reward;

    game.missionStreak++;

    playSound('cash');


    showAchievementToast({
        icon: '🎯',
        title: `${mission.title} Complete`
    });


    updateUI();

    saveGame();
}


// ============================================================
// ACHIEVEMENT PANEL
// ============================================================

function renderAchievementsPanel() {

    const container =
        document.getElementById(
            'achievements-container'
        );

    if (!container) {
        return;
    }


    container.innerHTML =
        ACHIEVEMENT_DEFINITIONS.map(
            (achievement) => {

                const unlocked =
                    game.achievements.includes(
                        achievement.id
                    );

                return `
                    <div class="achievement-card ${
                        unlocked
                            ? 'unlocked'
                            : ''
                    }">

                        <span class="achievement-icon">
                            ${
                                unlocked
                                    ? achievement.icon
                                    : '🔒'
                            }
                        </span>

                        <div>
                            <b>
                                ${achievement.title}
                            </b>

                            <small>
                                ${achievement.description}
                            </small>
                        </div>

                    </div>
                `;
            }
        ).join('');
}


// ============================================================
// MISSION PANEL
// ============================================================

function renderMissionsPanel() {

    resetMissionsIfNeeded();

    const container =
        document.getElementById(
            'mission-container'
        );

    if (!container) {
        return;
    }


    const streak =
        document.getElementById(
            'mission-streak'
        );

    const served =
        document.getElementById(
            'mission-served'
        );

    const revenue =
        document.getElementById(
            'mission-revenue'
        );

    const bestCombo =
        document.getElementById(
            'mission-best-combo'
        );


    if (streak) {
        streak.innerText =
            game.missionStreak;
    }

    if (served) {
        served.innerText =
            formatMoney(
                game.servedCount
            );
    }

    if (revenue) {
        revenue.innerText =
            `$${formatMoney(
                game.totalEarned
            )}`;
    }

    if (bestCombo) {
        bestCombo.innerText =
            game.bestCombo;
    }


    container.innerHTML =
        game.missions.map(
            (mission, index) => {

                const progress =
                    getMissionProgress(
                        mission
                    );

                const percent =
                    Math.min(
                        100,
                        (
                            progress /
                            mission.target
                        ) * 100
                    );

                const complete =
                    progress >=
                    mission.target;

                const buttonText =
                    mission.claimed
                        ? 'CLAIMED'
                        : complete
                            ? 'CLAIM REWARD'
                            : 'IN PROGRESS';


                return `
                    <div class="mission-card ${
                        mission.claimed
                            ? 'claimed'
                            : ''
                    }">

                        <div class="mission-card-top">

                            <span class="mission-icon">
                                ${mission.icon}
                            </span>

                            <div>
                                <b>
                                    ${mission.title}
                                </b>

                                <small>
                                    ${mission.description}
                                </small>
                            </div>

                        </div>


                        <div class="mission-progress">

                            <div
                                style="
                                    width:${percent}%;
                                "
                            ></div>

                        </div>


                        <div class="mission-card-bottom">

                            <span>
                                ${formatMoney(progress)}
                                /
                                ${formatMoney(
                                    mission.target
                                )}
                            </span>


                            <button
                                class="mission-claim ${
                                    complete &&
                                    !mission.claimed
                                        ? 'ready'
                                        : ''
                                }"

                                onclick="claimMission(${index})"

                                ${
                                    complete &&
                                    !mission.claimed
                                        ? ''
                                        : 'disabled'
                                }
                            >
                                ${buttonText}
                            </button>

                        </div>


                        <div class="mission-reward">

                            Reward:
                            <strong>
                                $${formatMoney(
                                    mission.reward
                                )}
                            </strong>

                        </div>

                    </div>
                `;
            }
        ).join('');


    renderAchievementsPanel();

    renderReviewFeed();
}


// ============================================================
// CUSTOMER / RESTAURANT RUNTIME
// ============================================================

let seats = Array.from(
    { length: 1000 },
    () => ({
        occupied: false,
        needsMenu: false,
        isCooking: false,
        cookStep: 0,
        needsServing: false,
        needsToPay: false,
        patience: 100,
        charData: null
    })
);


let waitList = [];

let isRushHour = false;

let rushMultiplier = 1;


// ============================================================
// ANTI-CHEAT SYSTEM
// ============================================================
// This protects against extremely fast repeated actions.
// It is a CLIENT-SIDE system, so it is useful for your game,
// but a real multiplayer game should also validate everything
// on the server.
// ============================================================

const antiCheat = {

    actionTimes: {},

    strikes: 0,

    blockedUntil: 0,

    log: [],

    maxLogEntries: 50
};


function recordAntiCheat(
    action,
    reason
) {

    const entry = {

        action,

        reason,

        time: Date.now()

    };


    antiCheat.log.unshift(
        entry
    );


    if (
        antiCheat.log.length >
        antiCheat.maxLogEntries
    ) {

        antiCheat.log =
            antiCheat.log.slice(
                0,
                antiCheat.maxLogEntries
            );
    }


    antiCheat.strikes++;


    // Temporary cooldown after repeated
    // suspicious activity.

    if (
        antiCheat.strikes >= 5
    ) {

        antiCheat.blockedUntil =
            Date.now() + 5000;

        antiCheat.strikes = 0;
    }


    console.warn(
        `[ANTI-CHEAT] ${action}: ${reason}`
    );
}


function antiCheatGuard(
    action,
    minimumDelay = 100
) {

    const now = Date.now();


    if (
        now <
        antiCheat.blockedUntil
    ) {

        return false;
    }


    const previous =
        antiCheat.actionTimes[action] ||
        0;


    if (
        now - previous <
        minimumDelay
    ) {

        recordAntiCheat(
            action,
            `Action repeated too quickly (${now - previous}ms)`
        );

        return false;
    }


    antiCheat.actionTimes[action] =
        now;


    return true;
}


// ============================================================
// ECONOMY VALIDATION
// ============================================================

function validateEconomy() {

    let changed = false;


    if (
        !Number.isFinite(
            game.wallet
        ) ||
        game.wallet < 0
    ) {

        game.wallet = Math.max(
            0,
            Number(game.wallet) || 0
        );

        recordAntiCheat(
            'wallet',
            'Invalid wallet value'
        );

        changed = true;
    }


    if (
        !Number.isFinite(
            game.monkeyMoney
        ) ||
        game.monkeyMoney < 0
    ) {

        game.monkeyMoney =
            Math.max(
                0,
                Math.floor(
                    Number(
                        game.monkeyMoney
                    ) || 0
                )
            );

        recordAntiCheat(
            'monkeyMoney',
            'Invalid Monkey Money value'
        );

        changed = true;
    }


    if (
        !Number.isFinite(
            game.turfMult
        ) ||
        game.turfMult < 1
    ) {

        game.turfMult = 1;

        recordAntiCheat(
            'turfMult',
            'Invalid turf multiplier'
        );

        changed = true;
    }


    if (changed) {
        updateUI();
    }


    return !changed;
}


// ============================================================
// SAFE NUMBER HELPERS
// ============================================================

function safeNumber(
    value,
    fallback = 0
) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


function safePositiveNumber(
    value,
    fallback = 0
) {

    const number =
        safeNumber(
            value,
            fallback
        );

    return Math.max(
        0,
        number
    );
}


// ============================================================
// FPS / PLAYER RUNTIME
// ============================================================

const FPS_MAP = [
    '################',
    '#..............#',
    '#..#.....#.....#',
    '#..............#',
    '#.....##..####.#',
    '#..............#',
    '#..#........#..#',
    '#..............#',
    '#..............#'
];


// ============================================================
// ANTI-CHEAT STATUS
// ============================================================

function getAntiCheatStatus() {

    if (
        Date.now() <
        antiCheat.blockedUntil
    ) {

        return {
            blocked: true,

            remaining:
                Math.ceil(
                    (
                        antiCheat.blockedUntil -
                        Date.now()
                    ) / 1000
                )
        };
    }


    return {
        blocked: false,
        remaining: 0
    };
}
