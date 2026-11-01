
const NexoraPhraseRecognizer = {

  categories: {
    greetings: [
      "hello", "hi", "hey", "heyyy",
      "yo", "whats up", "what's up",
      "good morning", "good evening"
    ],

    excitement: [
      "lets go", "let's go", "awesome",
      "amazing", "yay", "woohoo",
      "incredible", "im excited"
    ],

    gratitude: [
      "thanks", "thank you", "thx",
      "appreciate it", "ty"
    ],

    goodbyes: [
      "bye", "goodbye", "see you",
      "later", "gotta go"
    ],

    questions: [
      "what", "why", "how", "when",
      "where", "who", "can you",
      "could you"
    ],

    help: [
      "help", "i need help",
      "im stuck", "i'm stuck",
      "how do i", "can you help"
    ]
  },

  normalize(message) {
    return message
      .toLowerCase()
      .normalize("NFKC")
      .replace(/(.)\1{2,}/g, "$1$1")
      .replace(/[^a-z0-9\s']/g, "")
      .trim();
  },

  recognize(message) {
    const normalized = this.normalize(message);

    for (const category in this.categories) {
      for (const phrase of this.categories[category]) {

        const normalizedPhrase = this.normalize(phrase);

        if (
          normalized === normalizedPhrase ||
          normalized.includes(normalizedPhrase)
        ) {
          return category;
        }
      }
    }

    return "unknown";
  }

};

window.NexoraPhraseRecognizer = NexoraPhraseRecognizer;
