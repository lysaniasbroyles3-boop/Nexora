
const NexoraPersonality = {

  profile: JSON.parse(
    localStorage.getItem("nexora_personality") || "{}"
  ),

  defaults: {
    energy: 50,
    style: "friendly",
    favoritePhrases: [],
    messages: 0
  },

  initialize() {
    this.profile = {
      ...this.defaults,
      ...this.profile
    };
    this.save();
  },

  save() {
    localStorage.setItem(
      "nexora_personality",
      JSON.stringify(this.profile)
    );
  },

  learn(message) {
    this.profile.messages++;

    const text = message.toLowerCase();

    if (
      text.includes("lets go") ||
      text.includes("let's go") ||
      text.includes("woohoo")
    ) {
      this.profile.energy = Math.min(
        100,
        this.profile.energy + 5
      );
      this.profile.style = "energetic";
    }

    if (
      text.includes("please") ||
      text.includes("thank you")
    ) {
      this.profile.style = "polite";
    }

    if (
      message.length > 0 &&
      message.length < 100 &&
      !this.profile.favoritePhrases.includes(message)
    ) {
      if (this.profile.favoritePhrases.length < 100) {
        this.profile.favoritePhrases.push(message);
      }
    }

    this.save();
  },

  getProfile() {
    return this.profile;
  }

};

NexoraPersonality.initialize();

window.NexoraPersonality = NexoraPersonality;
