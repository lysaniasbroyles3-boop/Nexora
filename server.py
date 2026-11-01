
from flask import Flask, request, jsonify
from flask_cors import CORS
from ai import NexoraAI

app = Flask(__name__)
CORS(app)

# Start the NEXORA AI
ai = NexoraAI()

@app.route("/")
def home():
    return "NEXORA AI SERVER ONLINE!"

@app.route("/api/chat", methods=["POST"])
def chat():

    data = request.get_json(silent=True) or {}

    message = data.get("message", "").strip()
    mode = data.get("mode", "chat")

    if not message:
        return jsonify({"error": "Please enter a message."}), 400

    try:
        answer = ai.ask(message, mode)
        return jsonify({
            "success": True,
            "answer": answer
        })

    except Exception:
        app.logger.exception("NEXORA AI request failed")
        return jsonify({
            "success": False,
            "error": "The AI request failed. Please try again."
        }), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
v
