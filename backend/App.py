from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow CORS so that React can make requests to this API

# In-memory storage for win records
win_records = {
    'playerWins': 0,
    'aiWins': 0,
    'ties': 0
}

# Endpoint to get current win record
@app.route('/api/win-record', methods=['GET'])
def get_win_record():
    return jsonify(win_records)

# Endpoint to update the win record when a game ends
@app.route('/api/update-win-record', methods=['POST'])
def update_win_record():
    data = request.json
    winner = data.get('winner')

    if winner == 'Player':
        win_records['playerWins'] += 1
    elif winner == 'AI':
        win_records['aiWins'] += 1
    elif winner == 'Tie':
        win_records['ties'] += 1
    
    return jsonify(win_records)

if __name__ == '__main__':
    app.run(debug=True)
