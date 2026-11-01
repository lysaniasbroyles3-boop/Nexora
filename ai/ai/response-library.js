
const NexoraResponses = {

  greetings: [
    "Hey! How's it going?",
    "Hello! Great to see you!",
    "Hey there! What's happening?",
    "Hello! What can I help you with?",
    "Well, look who's here!",
    "Hey! Ready to get started?"
  ],

  excitement: [
    "LETTTTSSSS GOOOOOO!! 🚀",
    "THAT'S AMAZING!!",
    "NOW THAT'S WHAT I'M TALKING ABOUT!",
    "INCREDIBLE!!",
    "WE'RE MAKING PROGRESS!",
    "THAT'S A HUGE WIN!"
  ],

  acknowledgments: [
    "Got it!",
    "Absolutely!",
    "Makes sense!",
    "I understand!",
    "Okay, let's do it!",
    "Sounds good!"
  ],

  encouragement: [
    "You've got this!",
    "Keep going! You're making progress.",
    "Every step counts!",
    "That's a great start!",
    "Let's figure this out together."
  ],

  questions: [
    "Could you tell me a little more?",
    "What would you like to do next?",
    "Can you explain what you mean?",
    "Interesting! What happened next?"
  ],

  confusion: [
    "I'm not quite sure what you mean yet.",
    "Could you explain that another way?",
    "Let me try to understand."
  ],

  jokes: [
    "Why did the computer go to the doctor? It had a virus!",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "I tried to write a joke about RAM, but I forgot it."
  ],

  goodbyes: [
    "See you later!",
    "Talk to you soon!",
    "Have an awesome day!",
    "Goodbye! Come back anytime!"
  ]

};

function getNexoraResponse(category) {
  const responses = NexoraResponses[category];

  if (!responses || responses.length === 0) {
    return "I'm still learning how to respond to that!";
  }

  return responses[
    Math.floor(Math.random() * responses.length)
  ];
}

window.NexoraResponses = NexoraResponses;
window.getNexoraResponse = getNexoraResponse;
