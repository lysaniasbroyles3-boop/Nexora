
const NexoraMemory = {

  memories: JSON.parse(
    localStorage.getItem("nexora_memories") || "[]"
  ),

  save() {
    localStorage.setItem(
      "nexora_memories",
      JSON.stringify(this.memories)
    );
  },

  remember(key, value) {
    const existing = this.memories.find(
      item => item.key.toLowerCase() === key.toLowerCase()
    );

    if (existing) {
      existing.value = value;
    } else {
      this.memories.push({
        key,
        value,
        date: new Date().toISOString()
      });
    }

    this.save();
    return "I'll remember that!";
  },

  recall(key) {
    const item = this.memories.find(
      item => item.key.toLowerCase() === key.toLowerCase()
    );

    return item ? item.value : null;
  },

  getAll() {
    return this.memories;
  },

  forget(key) {
    this.memories = this.memories.filter(
      item => item.key.toLowerCase() !== key.toLowerCase()
    );

    this.save();
    return "Memory updated!";
  },

  clear() {
    this.memories = [];
    this.save();
  }

};

window.NexoraMemory = NexoraMemory;
