// Perfect score calculation:
// 60s / 1.9s per question = ~31 questions max
// Each question at max speed (<2s) with streak 8+ = (100 + 50) * 2.5 = 375 pts
// First 8 questions build combo gradually
// Total perfect score = 10,455
export const PERFECT_SCORE = 10455;

export const BATTLE_CONFIG = {
    GAME_DURATION_SEC: 60,
    BASE_POINTS: 100,
    
    // Bonus for answering fast
    SPEED_BONUS: {
        TIER_1: { maxTimeMs: 2000, points: 50 },
        TIER_2: { maxTimeMs: 4000, points: 30 },
    },
    
    // Combo multipliers based on streak (e.g. 3 streak -> 1.5x)
    COMBO_MULTIPLIERS: [
        { minStreak: 8, multiplier: 2.5 },
        { minStreak: 5, multiplier: 2.0 },
        { minStreak: 3, multiplier: 1.5 },
        { minStreak: 2, multiplier: 1.2 },
        { minStreak: 0, multiplier: 1.0 } // default
    ],
    
    // Rank logic based on final score
    RANKS: [
        { minScore: 10455, title: "Chrono King 👑", color: "#F59E0B" }, // Only achievable with a PERFECT game
        { minScore: 5000, title: "History Legend", color: "#A855F7" },
        { minScore: 2500, title: "History Hacker", color: "#8B5CF6" },
        { minScore: 1500, title: "Date Destroyer", color: "#3B82F6" },
        { minScore: 800, title: "Time Warrior", color: "#0EA5E9" },
        { minScore: 0, title: "Timeline Trainee", color: "#10B981" }
    ]
};

export function calculateScore(basePoints: number, timeTakenMs: number, streak: number) {
    let speedBonus = 0;
    if (timeTakenMs <= BATTLE_CONFIG.SPEED_BONUS.TIER_1.maxTimeMs) {
        speedBonus = BATTLE_CONFIG.SPEED_BONUS.TIER_1.points;
    } else if (timeTakenMs <= BATTLE_CONFIG.SPEED_BONUS.TIER_2.maxTimeMs) {
        speedBonus = BATTLE_CONFIG.SPEED_BONUS.TIER_2.points;
    }

    const multiplierObj = BATTLE_CONFIG.COMBO_MULTIPLIERS.find(m => streak >= m.minStreak) || BATTLE_CONFIG.COMBO_MULTIPLIERS[BATTLE_CONFIG.COMBO_MULTIPLIERS.length - 1];
    
    return Math.floor((basePoints + speedBonus) * multiplierObj.multiplier);
}

export function getRankObj(score: number) {
    return BATTLE_CONFIG.RANKS.find(r => score >= r.minScore) || BATTLE_CONFIG.RANKS[BATTLE_CONFIG.RANKS.length - 1];
}
