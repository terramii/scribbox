import os
import sqlite3
import json
import csv
import io
from flask import Flask, request, jsonify, send_from_directory, session, make_response, Response
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_folder='.', static_url_path='')
# Use a stable secret key for session encryption
app.secret_key = 'sketchbox_secure_cookie_key_98765'
# Allow large artspace saves (each object canvas is a base64 PNG, can be several MB)
# Use /tmp directory on Vercel because the root directory is read-only
if os.environ.get('VERCEL') or os.environ.get('NOW_REGION'):
    DATABASE = '/tmp/database.db'
else:
    DATABASE = 'database.db'

from dotenv import load_dotenv
load_dotenv()

import sys
import importlib.util

my_adk_agent = None
IMPORT_ERROR = None
IMPORT_ERROR_TRACE = None
try:
    agent_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'my-agent', 'app', 'agent.py'))
    spec = importlib.util.spec_from_file_location("my_adk_agent", agent_path)
    my_adk_agent = importlib.util.module_from_spec(spec)
    sys.modules["my_adk_agent"] = my_adk_agent
    spec.loader.exec_module(my_adk_agent)
    root_agent = getattr(my_adk_agent, 'root_agent', None)
    HAS_ADK_AGENT = (root_agent is not None)
    print("ADK Classifier agent successfully loaded using importlib!")
except Exception as e:
    import traceback
    IMPORT_ERROR = str(e)
    IMPORT_ERROR_TRACE = traceback.format_exc()
    print(f"Warning: Failed to import ADK root_agent: {e}")
    HAS_ADK_AGENT = False

# Hardcoded default prototypes matching frontend
DEFAULT_PROTOTYPES = {
    'human': {
        'label': 'Human / Stick Figure',
        'grid': [0.3634, 0.2467, 0.4653, 0.402, 0.3627, 0.2752, 0.3294, 0.3459, 0.2152, 0.097, 0.3806, 0.4098, 0.0585, 0.0308, 0.277, 0.3152],
        'aspectRatio': 0.9902, 'yCentroid': 0.4184, 'hSymmetry': 0.583, 'vSymmetry': 0.6524
    },
    'cat': {
        'label': 'Cat / Animal',
        'grid': [0.3546, 0.2203, 0.5196, 0.4739, 0.3917, 0.2505, 0.506, 0.4641, 0.2239, 0.1172, 0.3481, 0.3447, 0.1139, 0.0726, 0.1893, 0.1633],
        'aspectRatio': 0.9194, 'yCentroid': 0.3806, 'hSymmetry': 0.5951, 'vSymmetry': 0.473
    },
    'car': {
        'label': 'Car / Vehicle',
        'grid': [0.1698, 0.1247, 0.5052, 0.5483, 0.4589, 0.3396, 0.4264, 0.3607, 0.4619, 0.3179, 0.4715, 0.4395, 0.2834, 0.1125, 0.3041, 0.2697],
        'aspectRatio': 0.6892, 'yCentroid': 0.4457, 'hSymmetry': 0.6801, 'vSymmetry': 0.5557
    },
    'ball': {
        'label': 'Ball / Circle',
        'grid': [0.398, 0.2846, 0.51, 0.5044, 0.4561, 0.3519, 0.4847, 0.5062, 0.2423, 0.1082, 0.4122, 0.4264, 0.059, 0.0233, 0.2832, 0.3464],
        'aspectRatio': 0.9859, 'yCentroid': 0.4014, 'hSymmetry': 0.5669, 'vSymmetry': 0.5525
    },
    'spider': {
        'label': 'Spider / Insect',
        'grid': [0.3116, 0.1999, 0.553, 0.5722, 0.3838, 0.2423, 0.5329, 0.4841, 0.2315, 0.1316, 0.3222, 0.3122, 0.104, 0.05, 0.1592, 0.1772],
        'aspectRatio': 0.8229, 'yCentroid': 0.3647, 'hSymmetry': 0.539, 'vSymmetry': 0.4359
    },
    'flower': {
        'label': 'Flower / Plant',
        'grid': [0.2456, 0.1455, 0.6012, 0.615, 0.1506, 0.0987, 0.3973, 0.4629, 0.0455, 0.0369, 0.1921, 0.2421, 0.0604, 0.0425, 0.2754, 0.3668],
        'aspectRatio': 1.0923, 'yCentroid': 0.3853, 'hSymmetry': 0.2386, 'vSymmetry': 0.4794
    },
    'cloud': {
        'label': 'Cloud',
        'grid': [0.2879, 0.2336, 0.4898, 0.4645, 0.4202, 0.334, 0.2211, 0.1753, 0.3089, 0.2387, 0.2228, 0.1933, 0.2197, 0.0883, 0.3132, 0.338],
        'aspectRatio': 0.7227, 'yCentroid': 0.4195, 'hSymmetry': 0.8072, 'vSymmetry': 0.637
    },
    'fish': {
        'label': 'Fish',
        'grid': [0.3669, 0.28, 0.4185, 0.4394, 0.4726, 0.3564, 0.365, 0.3166, 0.4075, 0.3006, 0.3219, 0.31, 0.2594, 0.1573, 0.2218, 0.207],
        'aspectRatio': 0.649, 'yCentroid': 0.4186, 'hSymmetry': 0.8327, 'vSymmetry': 0.6533
    },
    'bird': {
        'label': 'Bird',
        'grid': [0.307, 0.2117, 0.448, 0.4605, 0.299, 0.1696, 0.4134, 0.4312, 0.1394, 0.0665, 0.2514, 0.2832, 0.0757, 0.0402, 0.1954, 0.2188],
        'aspectRatio': 0.8779, 'yCentroid': 0.3746, 'hSymmetry': 0.5007, 'vSymmetry': 0.4554
    },
    'tree': {
        'label': 'Tree / Plant',
        'grid': [0.322, 0.1758, 0.4336, 0.3674, 0.1325, 0.0501, 0.3919, 0.456, 0.0501, 0.027, 0.2612, 0.2901, 0.0736, 0.0345, 0.3039, 0.363],
        'aspectRatio': 0.9969, 'yCentroid': 0.4261, 'hSymmetry': 0.3162, 'vSymmetry': 0.6322
    },
    'house': {
        'label': 'House / Building',
        'grid': [0.2009, 0.1156, 0.4478, 0.3868, 0.3209, 0.1779, 0.35, 0.2727, 0.2698, 0.1293, 0.3925, 0.3677, 0.0322, 0.0085, 0.1541, 0.2605],
        'aspectRatio': 1.009, 'yCentroid': 0.4261, 'hSymmetry': 0.4962, 'vSymmetry': 0.7181
    },
    'star': {
        'label': 'Star',
        'grid': [0.232, 0.1384, 0.4496, 0.5156, 0.2791, 0.1589, 0.5245, 0.5018, 0.1378, 0.062, 0.2749, 0.2664, 0.0289, 0.0126, 0.0934, 0.1652],
        'aspectRatio': 0.974, 'yCentroid': 0.3568, 'hSymmetry': 0.3879, 'vSymmetry': 0.38
    }
}

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    # Enable WAL mode for better concurrency and larger write support
    conn.execute('PRAGMA journal_mode=WAL')
    conn.execute('PRAGMA synchronous=NORMAL')
    return conn

def init_db():
    with get_db() as conn:
        # Corrections table for ML feedback
        conn.execute('''
            CREATE TABLE IF NOT EXISTS corrections (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                label TEXT NOT NULL,
                custom_label TEXT,
                grid TEXT NOT NULL,
                aspect_ratio REAL NOT NULL,
                y_centroid REAL NOT NULL,
                h_symmetry REAL NOT NULL,
                v_symmetry REAL NOT NULL,
                parts TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # Add parts column if missing (migration)
        try:
            conn.execute('ALTER TABLE corrections ADD COLUMN parts TEXT')
        except Exception:
            pass
        # Users table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # Artspaces table
        conn.execute('''
            CREATE TABLE IF NOT EXISTS artspaces (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                whiteboard_data TEXT NOT NULL,
                sandbox_data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id),
                UNIQUE(user_id, name)
            )
        ''')
        conn.commit()

# Run database initialization
init_db()

def calculate_prototypes():
    """
    Dynamically recalculate the prototypes by combining the default templates
    with user-submitted corrections in SQLite using a weighted average.
    """
    prototypes = json.loads(json.dumps(DEFAULT_PROTOTYPES))
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT label, grid, aspect_ratio, y_centroid, h_symmetry, v_symmetry FROM corrections")
            rows = cursor.fetchall()
            
        if not rows:
            return prototypes
            
        user_data = {}
        for row in rows:
            label = row['label'].strip().lower()
            if not label:
                continue
            # Dynamically seed new custom classes so the system learns them!
            if label not in prototypes:
                prototypes[label] = {
                    'label': label.capitalize(),
                    'grid': [0.0] * 16,
                    'aspectRatio': 1.0,
                    'yCentroid': 0.5,
                    'hSymmetry': 0.5,
                    'vSymmetry': 0.5
                }
            if label not in user_data:
                user_data[label] = []
            
            try:
                grid = json.loads(row['grid'])
                if len(grid) == 16:
                    user_data[label].append({
                        'grid': grid,
                        'aspect_ratio': row['aspect_ratio'],
                        'y_centroid': row['y_centroid'],
                        'h_symmetry': row['h_symmetry'],
                        'v_symmetry': row['v_symmetry']
                    })
            except Exception:
                continue

        W_DEFAULT = 5.0
        for label, examples in user_data.items():
            if not examples:
                continue
            
            proto = prototypes[label]
            n = len(examples)
            
            # Anchor defaults using W_DEFAULT, but let custom classes rely purely on examples (weight 0.0)
            is_default = label in DEFAULT_PROTOTYPES
            weight_default = W_DEFAULT if is_default else 0.0
            total_weight = weight_default + n
            
            new_grid = []
            for i in range(16):
                sum_user = sum(ex['grid'][i] for ex in examples)
                new_val = (proto['grid'][i] * weight_default + sum_user) / total_weight
                new_grid.append(round(new_val, 4))
            proto['grid'] = new_grid
            
            sum_aspect = sum(ex['aspect_ratio'] for ex in examples)
            proto['aspectRatio'] = round((proto['aspectRatio'] * weight_default + sum_aspect) / total_weight, 4)
            
            sum_centroid = sum(ex['y_centroid'] for ex in examples)
            proto['yCentroid'] = round((proto['yCentroid'] * weight_default + sum_centroid) / total_weight, 4)
            
            sum_symmetry = sum(ex['h_symmetry'] for ex in examples)
            proto['hSymmetry'] = round((proto['hSymmetry'] * weight_default + sum_symmetry) / total_weight, 4)
            
            sum_symmetry_v = sum(ex['v_symmetry'] for ex in examples)
            proto['vSymmetry'] = round((proto['vSymmetry'] * weight_default + sum_symmetry_v) / total_weight, 4)
            
    except Exception as e:
        print(f"Error calculating prototypes: {e}")
        
    return prototypes

# Route to serve the frontend homepage
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/api/dataset', methods=['GET'])
def get_dataset():
    # Returns all stored corrections as a JSON array of feature objects.
    samples = []
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT label, grid, aspect_ratio, y_centroid, h_symmetry, v_symmetry FROM corrections")
            rows = cursor.fetchall()
            for r in rows:
                try:
                    grid = json.loads(r['grid'])
                    if len(grid) != 16:
                        continue
                    samples.append({
                        'label': r['label'].strip().lower(),
                        'grid': grid,
                        'aspectRatio': r['aspect_ratio'],
                        'yCentroid': r['y_centroid'],
                        'hSymmetry': r['h_symmetry'],
                        'vSymmetry': r['v_symmetry']
                    })
                except Exception:
                    continue
    except Exception as e:
        print(f"Error fetching dataset: {e}")
    return jsonify(samples)

# Physics classification endpoint — reads the Excel dataset to determine which
# classes are "Non-Physics" (float in sky) vs "Physics" (affected by gravity).
@app.route('/api/physics-classes', methods=['GET'])
def get_physics_classes():
    try:
        json_path = os.path.join(os.path.dirname(__file__), 'data', 'sketchbox_physics_classes.json')
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify(data)
            
        import openpyxl
        excel_path = os.path.join(os.path.dirname(__file__), 'data', 'sketchbox_1000plus_dataset.xlsx')
        wb = openpyxl.load_workbook(excel_path, read_only=True, data_only=True)
        sheet = wb.active
        non_physics = []
        classes_meta = {}
        for row in sheet.iter_rows(min_row=2, values_only=True):
            obj = row[1]
            action = row[2]
            style = row[3]
            phys = row[5]
            if obj is None:
                continue
            obj_key = str(obj).strip().lower()
            action_str = str(action).strip() if action else 'Float'
            style_str = str(style).strip() if style else 'Slow sky drift'
            phys_str = str(phys).strip() if phys else 'Physics'
            classes_meta[obj_key] = {
                'action': action_str,
                'style': style_str,
                'physics': phys_str
            }
            if phys_str == 'Non-Physics':
                non_physics.append(obj_key)
        wb.close()
        return jsonify({
            'non_physics': non_physics,
            'classes_meta': classes_meta
        })
    except Exception as e:
        print(f"Error reading physics classes: {e}")
        # Fallback hardcoded non-physics list if Excel read fails
        return jsonify({
            'non_physics': [
                'star', 'moon', 'sun', 'cloud', 'rainbow', 'snowflake',
                'planet', 'satellite', 'nebula', 'rain', 'tornado',
                'parachute', 'petal', 'seed', 'zeppelin', 'balloon',
                'bubble', 'feather', 'leaf', 'kite', 'blimp',
                'hot air balloon', 'flying saucer', 'comet', 'meteor',
                'asteroid', 'galaxy', 'black hole', 'hurricane', 'aurora', 'lightning'
            ],
            'classes_meta': {}
        })

# New endpoint to retrieve raw sketch data for ML profile
@app.route('/api/sketches/<label>', methods=['GET'])
def get_sketches(label):
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT label, custom_label, grid, aspect_ratio, y_centroid, h_symmetry, v_symmetry, parts FROM corrections WHERE label = ?', (label,))
            rows = cursor.fetchall()
        samples = []
        for r in rows:
            try:
                grid = json.loads(r['grid'])
                if len(grid) != 16:
                    continue
                samples.append({
                    'label': r['label'],
                    'custom_label': r['custom_label'] or '',
                    'grid': grid,
                    'aspectRatio': r['aspect_ratio'],
                    'yCentroid': r['y_centroid'],
                    'hSymmetry': r['h_symmetry'],
                    'vSymmetry': r['v_symmetry'],
                    'parts': json.loads(r['parts']) if r['parts'] else []
                })
            except Exception:
                continue
        return jsonify(samples)
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Error fetching sketches: {str(e)}'}), 500

# Expose dynamic prototypes
@app.route('/api/prototypes', methods=['GET'])
def get_prototypes():
    centroids = calculate_prototypes()
    raw_samples = []
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT label, grid, aspect_ratio, y_centroid, h_symmetry, v_symmetry FROM corrections")
            rows = cursor.fetchall()
            for r in rows:
                try:
                    grid = json.loads(r['grid'])
                    if len(grid) == 16:
                        raw_samples.append({
                            'label': r['label'].strip().lower(),
                            'grid': grid,
                            'aspectRatio': r['aspect_ratio'],
                            'yCentroid': r['y_centroid'],
                            'hSymmetry': r['h_symmetry'],
                            'vSymmetry': r['v_symmetry']
                        })
                except Exception:
                    continue
    except Exception as e:
        print(f"Error fetching raw samples: {e}")
        
    return jsonify({
        'centroids': centroids,
        'samples': raw_samples
    })

# Endpoint to record user feedback
@app.route('/api/corrections', methods=['POST'])
def add_correction():
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'No JSON payload provided'}), 400
        
    label = data.get('label')
    grid = data.get('grid')
    aspect_ratio = data.get('aspect_ratio')
    y_centroid = data.get('y_centroid')
    h_symmetry = data.get('h_symmetry')
    v_symmetry = data.get('v_symmetry', 0.5)
    custom_label = data.get('custom_label', '')
    
    if not label or not grid or aspect_ratio is None or y_centroid is None or h_symmetry is None:
        return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

    try:
        grid_json = json.dumps(grid)
        with get_db() as conn:
            conn.execute('''
            INSERT INTO corrections (label, custom_label, grid, aspect_ratio, y_centroid, h_symmetry, v_symmetry, parts)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (label, custom_label, grid_json, aspect_ratio, y_centroid, h_symmetry, v_symmetry, json.dumps(data.get('parts', []))))
            conn.commit()
            
        return jsonify({'status': 'success', 'message': 'Correction successfully recorded and retrained.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Database error: {str(e)}'}), 500

# ----------------- Authentication Endpoints -----------------

@app.route('/api/auth/signup', methods=['POST'])
def auth_signup():
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'Missing signup data'}), 400
        
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    
    if len(username) < 3 or len(password) < 4:
        return jsonify({'status': 'error', 'message': 'Username must be >= 3 chars, Password >= 4 chars'}), 400
        
    try:
        password_hash = generate_password_hash(password)
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO users (username, password_hash)
                VALUES (?, ?)
            ''', (username, password_hash))
            conn.commit()
            user_id = cursor.lastrowid
            
        # Log in the user
        session['user_id'] = user_id
        session['username'] = username
        return jsonify({'status': 'success', 'username': username})
    except sqlite3.IntegrityError:
        return jsonify({'status': 'error', 'message': 'Username already exists'}), 400
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def auth_login():
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'Missing login data'}), 400
        
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()
    
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
            user = cursor.fetchone()
            
        if not user or not check_password_hash(user['password_hash'], password):
            return jsonify({'status': 'error', 'message': 'Invalid username or password'}), 401
            
        # Log in user
        session['user_id'] = user['id']
        session['username'] = user['username']
        return jsonify({'status': 'success', 'username': user['username']})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

@app.route('/api/auth/logout', methods=['POST'])
def auth_logout():
    session.clear()
    return jsonify({'status': 'success'})

# New endpoint to list known part tags (static for now)
@app.route('/api/parts', methods=['GET'])
def get_parts():
    # For simplicity, return a static list of generic part names
    generic_parts = ['head', 'torso', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg']
    return jsonify({'parts': generic_parts})

@app.route('/api/auth/me', methods=['GET'])
def auth_me():
    if 'user_id' in session:
        return jsonify({'authenticated': True, 'username': session['username']})
    return jsonify({'authenticated': False})

# ----------------- Artspace Management Endpoints -----------------

@app.route('/api/artspaces', methods=['GET'])
def get_artspaces():
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
        
    user_id = session['user_id']
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, name, updated_at FROM artspaces 
                WHERE user_id = ? 
                ORDER BY updated_at DESC
            ''', (user_id,))
            rows = cursor.fetchall()
            
        spaces = [{'id': row['id'], 'name': row['name'], 'updated_at': row['updated_at']} for row in rows]
        return jsonify({'status': 'success', 'artspaces': spaces})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

@app.route('/api/artspaces/<int:space_id>', methods=['GET'])
def get_artspace(space_id):
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
        
    user_id = session['user_id']
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM artspaces WHERE id = ? AND user_id = ?', (space_id, user_id))
            row = cursor.fetchone()
            
        if not row:
            return jsonify({'status': 'error', 'message': 'Artspace not found'}), 404
            
        return jsonify({
            'status': 'success',
            'id': row['id'],
            'name': row['name'],
            'whiteboard_data': row['whiteboard_data'],
            'sandbox_data': row['sandbox_data']
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500


@app.route('/api/artspaces/<int:space_id>', methods=['PUT'])
def update_artspace(space_id):
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
        
    user_id = session['user_id']
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'Missing data'}), 400
        
    name = data.get('name', '').strip()
    whiteboard_data = data.get('whiteboard_data', '')
    sandbox_data = data.get('sandbox_data', '')
    
    if len(name) < 1:
        return jsonify({'status': 'error', 'message': 'Artspace name is required'}), 400
        
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            # Verify ownership before update
            cursor.execute('SELECT id FROM artspaces WHERE id = ? AND user_id = ?', (space_id, user_id))
            existing = cursor.fetchone()
            if not existing:
                return jsonify({'status': 'error', 'message': 'Artspace not found or unauthorized'}), 404
                
            cursor.execute('''
                UPDATE artspaces 
                SET name = ?, whiteboard_data = ?, sandbox_data = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ? AND user_id = ?
            ''', (name, whiteboard_data, sandbox_data, space_id, user_id))
            conn.commit()
            
        return jsonify({'status': 'success', 'message': f'Artspace "{name}" has been updated.', 'id': space_id})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

@app.route('/api/artspaces', methods=['POST'])
def save_artspace():
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
        
    user_id = session['user_id']
    data = request.get_json()
    if not data:
        return jsonify({'status': 'error', 'message': 'Missing data'}), 400
        
    name = data.get('name', '').strip()
    whiteboard_data = data.get('whiteboard_data', '')
    sandbox_data = data.get('sandbox_data', '')
    
    if len(name) < 1:
        return jsonify({'status': 'error', 'message': 'Artspace name is required'}), 400
        
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            # Check if this name already exists for the user to perform overwrite
            cursor.execute('SELECT id FROM artspaces WHERE user_id = ? AND name = ?', (user_id, name))
            existing = cursor.fetchone()
            
            if existing:
                # Update existing artspace
                cursor.execute('''
                    UPDATE artspaces 
                    SET whiteboard_data = ?, sandbox_data = ?, updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?
                ''', (whiteboard_data, sandbox_data, existing['id']))
                space_id = existing['id']
                action = 'overwritten'
            else:
                # Insert new artspace
                cursor.execute('''
                    INSERT INTO artspaces (user_id, name, whiteboard_data, sandbox_data)
                    VALUES (?, ?, ?, ?)
                ''', (user_id, name, whiteboard_data, sandbox_data))
                space_id = cursor.lastrowid
                action = 'saved'
                
            conn.commit()
            
        return jsonify({'status': 'success', 'message': f'Artspace "{name}" has been {action}.', 'id': space_id})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

@app.route('/api/artspaces/<int:space_id>', methods=['DELETE'])
def delete_artspace(space_id):
    if 'user_id' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
        
    user_id = session['user_id']
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('DELETE FROM artspaces WHERE id = ? AND user_id = ?', (space_id, user_id))
            conn.commit()
            rows_deleted = cursor.rowcount
            
        if rows_deleted == 0:
            return jsonify({'status': 'error', 'message': 'Artspace not found or unauthorized'}), 404
            
        return jsonify({'status': 'success', 'message': 'Artspace deleted successfully.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Server error: {str(e)}'}), 500

@app.route('/api/dataset/import', methods=['POST'])
def import_dataset():
    if 'username' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
        
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file uploaded'}), 400
        
    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({'status': 'error', 'message': 'Only CSV files are supported'}), 400
        
    try:
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        reader = csv.DictReader(stream)
        
        # Verify required headers
        required_headers = [
            'label', 'aspect_ratio', 'y_centroid', 'h_symmetry', 'v_symmetry'
        ] + [f'grid_{i}' for i in range(16)]
        
        headers = reader.fieldnames
        if not headers:
            return jsonify({'status': 'error', 'message': 'Empty CSV file'}), 400
            
        missing = [h for h in required_headers if h not in headers]
        if missing:
            return jsonify({'status': 'error', 'message': f'Missing columns: {", ".join(missing)}'}), 400
            
        imported_count = 0
        with get_db() as conn:
            for row in reader:
                label = row['label'].strip().lower()
                if not label:
                    continue
                    
                try:
                    grid = [float(row[f'grid_{i}']) for i in range(16)]
                    aspect_ratio = float(row['aspect_ratio'])
                    y_centroid = float(row['y_centroid'])
                    h_symmetry = float(row['h_symmetry'])
                    v_symmetry = float(row['v_symmetry'])
                except ValueError:
                    continue
                    
                conn.execute('''
                    INSERT INTO corrections (label, grid, aspect_ratio, y_centroid, h_symmetry, v_symmetry)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (label, json.dumps(grid), aspect_ratio, y_centroid, h_symmetry, v_symmetry))
                imported_count += 1
                
            conn.commit()
            
        # Trigger prototype recalculation
        calculate_prototypes()
        
        return jsonify({
            'status': 'success',
            'message': f'Successfully imported {imported_count} examples and retrained the model.'
        })
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed to parse CSV: {str(e)}'}), 500

@app.route('/api/dataset/export', methods=['GET'])
def export_dataset():
    if 'username' not in session:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 401
        
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT label, grid, aspect_ratio, y_centroid, h_symmetry, v_symmetry FROM corrections")
            rows = cursor.fetchall()
            
        dest = io.StringIO()
        writer = csv.writer(dest)
        
        # Write headers
        headers = [
            'label', 'aspect_ratio', 'y_centroid', 'h_symmetry', 'v_symmetry'
        ] + [f'grid_{i}' for i in range(16)]
        writer.writerow(headers)
        
        for row in rows:
            grid = json.loads(row['grid'])
            row_data = [
                row['label'],
                row['aspect_ratio'],
                row['y_centroid'],
                row['h_symmetry'],
                row['v_symmetry']
            ] + grid
            writer.writerow(row_data)
            
        output = make_response(dest.getvalue())
        output.headers["Content-Disposition"] = "attachment; filename=sketchbox_dataset.csv"
        output.headers["Content-type"] = "text/csv"
        return output
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed to export: {str(e)}'}), 500

@app.route('/api/ai/predict', methods=['POST'])
def ai_predict():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'status': 'error', 'message': 'No image data provided'}), 400
        
    image_b64 = data['image']
    features = data.get('features', {})
    
    if ',' in image_b64:
        image_b64 = image_b64.split(',')[1]
        
    try:
        from google import genai
        from google.genai import types
        import base64
        
        # Load API key from env
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if api_key:
            client = genai.Client(api_key=api_key)
        else:
            client = genai.Client()
            
        # Get active prototypes to align the AI with recent user training
        prototypes = calculate_prototypes()
        
        # Extract features summaries of all active prototypes to feed into Gemini prompt
        proto_summaries = {}
        for key, p in prototypes.items():
            proto_summaries[key] = {
                'label': p.get('label', key),
                'aspectRatio': p.get('aspectRatio'),
                'yCentroid': p.get('yCentroid'),
                'hSymmetry': p.get('hSymmetry'),
                'vSymmetry': p.get('vSymmetry')
            }

        system_instruction = None
        if HAS_ADK_AGENT:
            system_instruction = getattr(my_adk_agent, 'SYSTEM_INSTRUCTION', None)
            
        if not system_instruction:
            system_instruction = """You are the Sketchbox AI Scanner.
You analyze hand-drawn sketches along with their geometric features.
Identify the object drawn and recommend the best action and physical movement style.
You MUST respond in JSON format matching this schema:
{
  "class": "lowercase_standard_or_custom_class",
  "action": "Recommended Action Name",
  "style": "float | bounce | spin | drive | sway | pulse | jiggle"
}
"""

        prompt = f"""Analyze the hand-drawn sketch.
Here are the geometric features extracted from the user's sketch:
{json.dumps(features, indent=2)}

Here is the current database of trained class prototypes (with their average features):
{json.dumps(proto_summaries, indent=2)}

Please combine your visual understanding of the sketch image with the geometric features listed above. 
If the user's sketch features align closely with a trained prototype (especially user-trained custom classes), recommend that class.
Identify the object, select/create a custom action, and map it to the closest physical template style.
You MUST respond in JSON format matching this schema:
{{
  "class": "lowercase_standard_or_custom_class",
  "action": "Recommended Action Name",
  "style": "float | bounce | spin | drive | sway | pulse | jiggle"
}}
Do not include any extra text, only the raw JSON.
"""
        image_bytes = base64.b64decode(image_b64)
        
        image_part = types.Part.from_bytes(
            data=image_bytes,
            mime_type="image/png"
        )
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[prompt, image_part],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                temperature=0.2
            )
        )
        
        res_text = response.text.strip()
        prediction = json.loads(res_text)
        
        # Calculate real mathematical ML confidence based on prototype distance
        predicted_class = prediction.get('class', 'unknown').strip().lower()
        confidence = 85 # fallback
        if predicted_class in prototypes:
            try:
                proto = prototypes[predicted_class]
                grid_dist = sum((features['grid'][i] - proto['grid'][i])**2 for i in range(16))
                aspect_dist = (features['aspectRatio'] - proto['aspectRatio'])**2
                centroid_dist = (features['yCentroid'] - proto['yCentroid'])**2
                symmetry_dist = (features['hSymmetry'] - proto['hSymmetry'])**2
                symmetry_v_dist = (features['vSymmetry'] - proto['vSymmetry'])**2
                
                total_dist = (grid_dist + aspect_dist + centroid_dist + symmetry_dist + symmetry_v_dist)**0.5
                # Map distance to percentage (dist = 0 -> 98%, dist >= 3.0 -> 15%)
                confidence = max(15, min(98, round((1 - total_dist / 3.0) * 100)))
            except Exception as dist_err:
                print(f"Error calculating distance: {dist_err}")
                
        return jsonify({
            'status': 'success',
            'prediction': {
                'class': predicted_class,
                'action': prediction.get('action', 'Sway'),
                'style': prediction.get('style', 'sway'),
                'confidence': confidence
            }
        })
        
    except Exception as e:
        print(f"AI Predict exception: {e}")
        return jsonify({'status': 'error', 'message': f'AI prediction failed: {str(e)}'}), 500

# New endpoint for Scribbie Chat Support
@app.route('/api/support', methods=['POST'])
def scribbie_support():
    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'status': 'error', 'message': 'No message provided'}), 400
        
    query = data['message']
    history = data.get('history', [])
    
    try:
        from google import genai
        
        # Load API key from env
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        if api_key:
            client = genai.Client(api_key=api_key)
        else:
            client = genai.Client()
            
        run_wf_stream = getattr(my_adk_agent, 'run_scribbie_workflow_stream', None) if my_adk_agent else None
        if not run_wf_stream:
            run_wf = getattr(my_adk_agent, 'run_scribbie_workflow', None) if my_adk_agent else None
            if run_wf:
                def fallback_generator():
                    text = run_wf(client, query, history)
                    yield f"data: {json.dumps({'chunk': text})}\n\n"
                return Response(fallback_generator(), mimetype='text/event-stream')
            else:
                def error_generator():
                    agent_status = "my_adk_agent is None" if not my_adk_agent else f"my_adk_agent is loaded, but run_scribbie_workflow_stream is missing. Attributes: {list(dir(my_adk_agent))}"
                    err_msg = f"Scribbie drawing support is currently unavailable. Status: {agent_status}. Import error: {IMPORT_ERROR}. Trace: {IMPORT_ERROR_TRACE}"
                    yield f"data: {json.dumps({'error': err_msg})}\n\n"
                return Response(error_generator(), mimetype='text/event-stream')
        
        def stream_generator():
            try:
                for chunk in run_wf_stream(client, query, history):
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            except Exception as ex:
                yield f"data: {json.dumps({'error': str(ex)})}\n\n"
                
        return Response(stream_generator(), mimetype='text/event-stream')
        
    except Exception as e:
        print(f"Scribbie Support exception: {e}")
        return jsonify({'status': 'error', 'message': f'Support chat failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)

