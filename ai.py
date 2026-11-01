
import os
from openai import OpenAI

# =================================
# NEXORA AI ENGINE
# =================================

class NexoraAI:

    def __init__(self):
        api_key = os.environ.get("OPENAI_API_KEY")

        if not api_key:
            raise ValueError("Missing OPENAI_API_KEY environment variable.")

        self.client = OpenAI(api_key=api_key)
        self.model = "gpt-4.1-mini"

    def ask(self, prompt, mode="chat"):

        instructions = {
            "chat": "You are Nexora AI, a helpful and intelligent assistant.",
            "write": "Write professional, clear, high-quality content.",
            "summarize": "Summarize the supplied text clearly.",
            "rewrite": "Rewrite the supplied text to improve clarity and quality.",
            "ideas": "Generate creative and practical ideas.",
            "document": "Create a well-organized professional document."
        }

        if mode not in instructions:
            mode = "chat"

        response = self.client.responses.create(
            model=self.model,
            instructions=instructions[mode],
            input=prompt
        )

        return response.output_text


# =================================
# TEST NEXORA AI
# =================================

if __name__ == "__main__":

    ai = NexoraAI()

    print("================================")
    print("       NEXORA AI ONLINE")
    print("================================")

    while True:

        question = input("\nYOU: ")

        if question.lower() == "exit":
            print("NEXORA AI shutting down.")
            break

        answer = ai.ask(question)

        print("\nNEXORA AI:", answer)
