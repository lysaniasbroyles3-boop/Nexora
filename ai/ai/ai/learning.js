
/* ==========================================
   NEXORA LEARNING ENGINE v1.0
   Pattern Learning
   Feedback Learning
   Knowledge Library
   Context Understanding
   Response Improvement
========================================== */

(function () {
  "use strict";

  const STORAGE_KEY = "nexora_learning_v1";

  const DEFAULT_DATA = {
    version: 1,

    profile: {
      preferredStyle: "balanced",
      favoriteTopics: [],
      phrases: {},
      totalMessages: 0,
      learningEnabled: true
    },

    knowledge: [],

    feedback: [],

    patterns: {},

    stats: {
      positiveFeedback: 0,
      negativeFeedback: 0,
      learnedFacts: 0
    }
  };

  // LOAD SAVED LEARNING
  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) return structuredClone(DEFAULT_DATA);

      const data = JSON.parse(saved);

      return {
        ...structuredClone(DEFAULT_DATA),
        ...data,
        profile: {
          ...DEFAULT_DATA.profile,
          ...(data.profile || {})
        },
        stats: {
          ...DEFAULT_DATA.stats,
          ...(data.stats || {})
        }
      };

    } catch (error) {
      console.warn("Nexora: Could not load learning data.");
      return structuredClone(DEFAULT_DATA);
    }
  }

  let data = loadData();

  // SAVE LEARNING
  function save() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
      return true;
    } catch (error) {
      console.warn("Nexora: Storage unavailable.");
      return false;
    }
  }

  // TEXT PROCESSING
  function cleanText(text) {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/[^\w\s'-]/g, "")
      .slice(0, 1000);
  }

  function getWords(text) {
    return cleanText(text)
      .split(/\s+/)
      .filter(word => word.length > 2);
  }

  // 1. PATTERN LEARNING
  function learnPattern(message) {
    if (!data.profile.learningEnabled) return;

    const words = getWords(message);

    words.forEach(word => {
      data.patterns[word] =
        (data.patterns[word] || 0) + 1;
    });

    // Remember repeated expressions.
    const phrase = cleanText(message);

    if (phrase.length >= 4 && phrase.length <= 100) {
      data.profile.phrases[phrase] =
        (data.profile.phrases[phrase] || 0) + 1;
    }

    data.profile.totalMessages++;

    save();
  }

  // 2. LEARN USER PREFERENCES
  function setStyle(style) {
    const allowed = [
      "short",
      "detailed",
      "balanced",
      "energetic",
      "professional"
    ];

    if (!allowed.includes(style)) {
      return false;
    }

    data.profile.preferredStyle = style;
    save();

    return true;
  }

  // 3. LEARN FROM FEEDBACK
  function learnFeedback(prompt, response, rating, correction = "") {
    if (!data.profile.learningEnabled) return false;

    if (!["positive", "negative"].includes(rating)) {
      return false;
    }

    const entry = {
      prompt: String(prompt).slice(0, 500),
      response: String(response).slice(0, 1000),
      rating,
      correction: String(correction).slice(0, 500),
      date: new Date().toISOString()
    };

    data.feedback.push(entry);

    // Keep the most recent 200 feedback records.
    if (data.feedback.length > 200) {
      data.feedback.shift();
    }

    if (rating === "positive") {
      data.stats.positiveFeedback++;
    } else {
      data.stats.negativeFeedback++;
    }

    save();

    return true;
  }

  // 4. KNOWLEDGE LIBRARY
  function addKnowledge(topic, information) {
    if (!data.profile.learningEnabled) return false;

    topic = String(topic).trim().slice(0, 100);
    information = String(information).trim().slice(0, 2000);

    if (!topic || !information) return false;

    const existing = data.knowledge.find(
      item => item.topic.toLowerCase() === topic.toLowerCase()
    );

    if (existing) {
      existing.information = information;
      existing.updated = new Date().toISOString();
    } else {
      data.knowledge.push({
        topic,
        information,
        created: new Date().toISOString()
      });
    }

    data.stats.learnedFacts = data.knowledge.length;

    save();

    return true;
  }

  // 5. SEARCH KNOWLEDGE
  function searchKnowledge(query) {
    const searchWords = getWords(query);

    if (!searchWords.length) return [];

    return data.knowledge
      .map(item => {
        const content = getWords(
          item.topic + " " + item.information
        );

        const matches = searchWords.filter(
          word => content.includes(word)
        ).length;

        return {
          ...item,
          score: matches / searchWords.length
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  // 6. BUILD AI CONTEXT
  function buildContext(message) {
    const knowledge = searchKnowledge(message);

    const style = data.profile.preferredStyle;

    return {
      userStyle: style,

      totalMessages: data.profile.totalMessages,

      relevantKnowledge: knowledge,

      frequentlyUsedWords: Object.entries(data.patterns)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(item => item[0]),

      instructions:
        "Use relevant saved knowledge when appropriate. " +
        "Adapt response length and tone to the user's selected style. " +
        "Do not invent facts. Distinguish saved information from verified facts."
    };
  }

  // 7. LEARNING STATISTICS
  function getStats() {
    return {
      totalMessages: data.profile.totalMessages,
      knowledgeItems: data.knowledge.length,
      feedbackRecords: data.feedback.length,
      positiveFeedback: data.stats.positiveFeedback,
      negativeFeedback: data.stats.negativeFeedback,
      learnedFacts: data.stats.learnedFacts,
      learningEnabled: data.profile.learningEnabled
    };
  }

  // 8. MEMORY CONTROLS
  function enableLearning(enabled) {
    data.profile.learningEnabled = Boolean(enabled);
    save();
  }

  function clearLearning() {
    data = structuredClone(DEFAULT_DATA);
    save();
  }

  // 9. EXPORT LEARNING DATA
  function exportData() {
    return JSON.stringify(data, null, 2);
  }

  // 10. PUBLIC NEXORA API
  window.NexoraLearning = {

    version: "1.0",

    learnPattern,
    setStyle,
    learnFeedback,
    addKnowledge,
    searchKnowledge,
    buildContext,
    getStats,
    enableLearning,
    clearLearning,
    exportData,

    getProfile() {
      return structuredClone(data.profile);
    }

  };

  console.log("Nexora Learning Engine v1.0 loaded!");

})();
