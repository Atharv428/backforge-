from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_json(filename, data):
    path = os.path.join(DATA_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join('.', path)):
        return send_from_directory('.', path)
    return "File not found", 404

# --- API ENDPOINTS ---

@app.route('/api/problems', methods=['GET'])
def get_problems():
    data = load_json('problems.json')
    return jsonify(data)

@app.route('/api/contests', methods=['GET'])
def get_contests():
    data = load_json('contests.json')
    return jsonify(data)

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    data = load_json('users.json')
    return jsonify(data)

@app.route('/api/submissions', methods=['GET'])
def get_submissions():
    data = load_json('submissions.json')
    return jsonify(data)

@app.route('/api/ai/hint', methods=['GET'])
def get_ai_hints():
    data = load_json('hints.json')
    return jsonify(data)

@app.route('/api/contests/<int:contest_id>', methods=['GET'])
def get_contest(contest_id):
    contests = load_json('contests.json')
    problems = load_json('problems.json')
    for c in contests:
        if c.get('id') == contest_id:
            # Map problemIds to actual problem objects
            c_problems = [p for p in problems if p.get('id') in c.get('problemIds', [])]
            c['problem_list'] = c_problems
            return jsonify(c)
    return jsonify({"success": False, "message": "Contest not found"}), 404

@app.route('/api/contests/<int:contest_id>/register', methods=['POST'])
def register_contest(contest_id):
    contests = load_json('contests.json')
    for c in contests:
        if c.get('id') == contest_id:
            c['participants'] = c.get('participants', 0) + 1
            c['registered'] = True
            save_json('contests.json', contests)
            return jsonify({"success": True, "message": f"Successfully registered for contest {contest_id}"})
    return jsonify({"success": False, "message": "Contest not found"}), 404

if __name__ == '__main__':
    print("Starting Python Flask server on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
