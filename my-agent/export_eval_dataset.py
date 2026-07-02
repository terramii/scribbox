import json
import os
import sqlite3


def main():
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'database.db'))
    output_path = os.path.join(os.path.dirname(__file__), 'eval_cases.jsonl')

    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return

    print(f"Reading corrections from database: {db_path}")
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        # Select all columns from corrections table
        cursor.execute("SELECT id, label, custom_label, grid, aspect_ratio, y_centroid, h_symmetry, v_symmetry FROM corrections")
        rows = cursor.fetchall()
        conn.close()
    except Exception as e:
        print(f"Database error: {e}")
        return

    if not rows:
        print("No corrections found in the database. Add some corrections from the whiteboard first!")
        return

    print(f"Exporting {len(rows)} corrections to {output_path}...")

    with open(output_path, 'w', encoding='utf-8') as f:
        for row in rows:
            try:
                grid = json.loads(row['grid'])
            except Exception:
                grid = [0.0] * 16

            features = {
                'grid': grid,
                'aspectRatio': row['aspect_ratio'],
                'yCentroid': row['y_centroid'],
                'hSymmetry': row['h_symmetry'],
                'vSymmetry': row['v_symmetry']
            }

            expected_class = row['label']
            expected_action = row['custom_label'] or 'Sway'
            expected_style = 'sway'

            case_id = f"case_{row['id']}"
            input_prompt = f"Analyze the hand-drawn sketch. Features: {json.dumps(features)}"

            expected_output = {
                'class': expected_class,
                'action': expected_action,
                'style': expected_style
            }

            case = {
                'id': case_id,
                'input': input_prompt,
                'expected': json.dumps(expected_output, ensure_ascii=False)
            }

            f.write(json.dumps(case, ensure_ascii=False) + '\n')

    print("Successfully exported dataset!")

if __name__ == '__main__':
    main()
