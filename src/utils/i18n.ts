export type Language = 'en' | 'fr' | 'ar';

export const translations = {
    en: {
        play: "PLAY",
        settings: "SETTINGS",
        back: "Back",
        score: "Score",
        level: "Level",
        bossLevel: "BOSS LEVEL",
        gameOver: "GAME OVER",
        home: "Home",
        sound: "Sound",
        language: "Language",
        estimatedIQ: "ESTIMATED IQ",
        modes: {
            anomaly: { name: "Anomaly Hunt", desc: "Find the odd one out!" },
            cipher: { name: "Cipher Crack", desc: "Decipher the code." },
            riddle: { name: "Riddle Rush", desc: "Solve the riddles." },
            detective: { name: "Detective", desc: "Find the culprit." },
            word: { name: "Word Trap", desc: "Word puzzles & anagrams." },
            memory: { name: "Memory Matrix", desc: "Remember the pattern." },
            sequence: { name: "Sequence Breaker", desc: "Predict the pattern." },
            contradiction: { name: "Contradiction", desc: "Spot the flaw." }
        }
    },
    fr: {
        play: "JOUER",
        settings: "PARAMÈTRES",
        back: "Retour",
        score: "Score",
        level: "Niveau",
        bossLevel: "NIVEAU BOSS",
        gameOver: "FIN DE PARTIE",
        home: "Accueil",
        sound: "Son",
        language: "Langue",
        estimatedIQ: "QI ESTIMÉ",
        modes: {
            anomaly: { name: "Chasse Anomalie", desc: "Trouvez l'intrus !" },
            cipher: { name: "Ombre Chiffrée", desc: "Déchiffrez le code." },
            riddle: { name: "Maître Enigme", desc: "Résolvez les énigmes." },
            detective: { name: "Détective", desc: "Trouvez le coupable." },
            word: { name: "Piège de Mots", desc: "Puzzles de mots." },
            memory: { name: "Matrice Mémoire", desc: "Retenez le motif." },
            sequence: { name: "Séquence", desc: "Prédisez le motif." },
            contradiction: { name: "Contradiction", desc: "Trouvez la faille." }
        }
    },
    ar: {
        play: "لعب",
        settings: "إعدادات",
        back: "رجوع",
        score: "النتيجة",
        level: "المستوى",
        bossLevel: "مستوى الزعيم",
        gameOver: "انتهت اللعبة",
        home: "الرئيسية",
        sound: "الصوت",
        language: "الغة",
        estimatedIQ: "معدل الذكاء",
        modes: {
            anomaly: { name: "صيد الشذوذ", desc: "أوجد المختلف!" },
            cipher: { name: "الشفرة الظلية", desc: "فك الشفرة." },
            riddle: { name: "سيد الألغاز", desc: "حل الألغاز." },
            detective: { name: "المحقق", desc: "أوجد الجاني." },
            word: { name: "فخ الكلمات", desc: "ألغاز الكلمات." },
            memory: { name: "مصفوفة الذاكرة", desc: "تذكر النمط." },
            sequence: { name: "كسر التسلسل", desc: "توقع النمط." },
            contradiction: { name: "التناقض", desc: "أوجد الخطأ." }
        }
    }
};

export const currentLang = 'en'; // Default, managed by store
