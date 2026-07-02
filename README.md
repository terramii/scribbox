# Scribbox 🎨✨

Scribbox is a premium, interactive AI Sketchbook that blends creative hand-drawn sketching with a 2D physics sandbox and agentic AI. Draw sketches on the digital whiteboard, drop them into a physics-enabled sandbox, and watch them collide, roll, float, or dance based on their real-world classification!

Scribbox features **Scribbie**—a friendly, child-focused drawing tutor agent who provides step-by-step drawing guides, and a high-tech **AI Scanner** that analyzes your drawings.

🔗 **Try the live app here:** [https://scribbox.vercel.app/](https://scribbox.vercel.app/)

---

## 🌟 Key Features

### 1. Digital Whiteboard & Canvas
* **Precision Drawing:** Smooth, high-fidelity canvas drawing supporting customizable line widths and brushes.
* **Smart Brush & Eraser:** Remembers separate Pen and Eraser sizes individually when toggling between tools.
* **Dynamic Visual Cursors:** Custom SVG outlines (circle for pen, square for eraser) that dynamically scale to match the chosen brush diameter in real-time, built with dual-contrast borders for visibility on any background.
* **Unlimited Undo/Redo:** State-managed canvas history for smooth sketching.

### 2. 2D Physics Sandbox
* **Real-Time Rigid Body Engine:** Dropped sketches are automatically segmented and turned into physics objects that bounce off walls, roll, slide, and react to gravity.
* **Interactive Interaction:** Drag, toss, or throw sketches inside the sandbox, or edit them to pull them back onto the whiteboard.
* **Unique Physical Personalities:** Classification-driven animation styles:
  * **Bounce:** Balls, apples, oranges.
  * **Float:** Clouds, stars, moons, helium balloons.
  * **Sway:** Flowers, trees, plants (sways organically from the bottom center).
  * **Drive:** Cars, buses, trains.
  * **Fly/Wiggle:** Birds, fish, cats, butterflies.

### 3. AI Scanner (Geometric + Gemini Vision)
* **Dual-Layer Classification:** Uses lightweight geometric feature extraction (aspect ratio, horizontal/vertical symmetry, and centroid) combined with the **Gemini 2.5 Flash Vision API** for fast, high-confidence shape and object labeling.
* **Behavior Recommendations:** The AI automatically recommends custom physics behaviors, styles, and names for every object you drop.

### 4. Scribbie — Agentic Drawing Guide
* **Conversational AI Tutor:** Powered by the Google GenAI SDK, Scribbie is a kid-friendly AI agent that teaches users how to draw.
* **Fast Semantic RAG:** Equipped with a pre-indexed vector database containing **981 unique drawing guides** (using embeddings built from `Scribbie_Drawing_Guides.json`), loading matching guides in **<1ms**.
* **Search Grounding Fallback:** Integrates live Google Search Grounding to generate fresh, structured step-by-step drawing guides for anything not found in the local database.
* **Bulletproof Offline Fallback:** If the API key hits rate limits (HTTP 429), Scribbie enters **Local Cache Mode**, serving matching drawing guides and friendly greetings directly from the local JSON database with zero API dependencies.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5 Canvas, Vanilla CSS3 (Glassmorphism, animations), Modern ES6 JavaScript.
* **Backend:** Python Flask.
* **Database:** SQLite (local development) / PostgreSQL (production-ready wrapper in `app.py`).
* **AI Engine:** Google GenAI SDK (Gemini 2.5 Flash), Custom TF-IDF vector embeddings matching.

---

## 🚀 Getting Started

### Prerequisites
* Python 3.9+
* A Gemini API key (obtain one from [Google AI Studio](https://aistudio.google.com/))

### Local Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/terramii/scribbox.git
   cd scribbox
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Application:**
   ```bash
   python app.py
   ```
   Open **[http://127.0.0.1:5000](http://127.0.0.1:5000)** in your browser!

---

## ☁️ Deployment

The project is pre-configured for zero-config deployment on **Vercel** using the serverless Python runtime.

1. Install the Vercel CLI: `npm install -g vercel`
2. Run `vercel` in the project root.
3. Configure `GEMINI_API_KEY` in the Vercel dashboard environment variables.
