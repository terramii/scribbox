# ruff: noqa
import os
import json
from google.genai import types

try:
    from google.adk.agents import Agent
    from google.adk.apps import App
    from google.adk.models import Gemini
    HAS_ADK = True
except ImportError:
    HAS_ADK = False

# ===========================================================================
# 1. Original Sketchbox Classifier (DO NOT CHANGE)
# ===========================================================================
MAPPING_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'object_action_mapping.json'))
try:
    with open(MAPPING_PATH, 'r', encoding='utf-8') as f:
        OBJECT_ACTION_MAPPING = json.load(f)
except Exception as e:
    OBJECT_ACTION_MAPPING = {}

SYSTEM_INSTRUCTION = f"""You are the Sketchbox AI Scanner.
You analyze hand-drawn sketches (passed as base64 images) along with their extracted 20-dimensional geometric features.
Your job is to identify the object drawn and suggest the best action and physical movement style.

You have access to a database of 345 standard objects and their mapped actions/styles.
Choose the closest matching category from the 345 standard objects if possible.
Recommend an Action Name (e.g., 'Fly', 'Roll', 'Wobble') and map it to one of the 7 physics templates:
- 'float' (for flying, swimming, hovering, drifting items)
- 'bounce' (for walking, hopping, jumping, running items)
- 'spin' (for spinning, rotating, rolling items)
- 'drive' (for gliding, driving, forward-traveling vehicles)
- 'sway' (for swaying, swinging, waving, tilting items)
- 'pulse' (for breathing, scaling, blinking, glowing, vibrating items)
- 'jiggle' (for vibrating, shaking, shivering items)

You MUST respond in JSON format matching this schema:
{{
  "class": "lowercase_standard_or_custom_class",
  "action": "Recommended Action Name",
  "style": "float | bounce | spin | drive | sway | pulse | jiggle"
}}
"""

if HAS_ADK:
    try:
        root_agent = Agent(
            name="sketchbox_classifier",
            model=Gemini(
                model="gemini-2.5-flash",
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            ),
            instruction=SYSTEM_INSTRUCTION
        )
        
        app = App(
            root_agent=root_agent,
            name="sketchbox_app",
        )
    except Exception as e:
        print(f"Warning: Failed to initialize ADK Agent/App: {e}")
        root_agent = None
        app = None
else:
    root_agent = None
    app = None


# ===========================================================================
# 2. Scribbie Drawing Guide Support Agents (New ADK 2.0 Additions)
# ===========================================================================

# Load Scribbie Drawing Guide Dataset from pre-converted JSON (extremely fast startup)
JSON_DATASET_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'Scribbie_Drawing_Guides.json'))
DRAWING_GUIDES = {}

try:
    if os.path.exists(JSON_DATASET_PATH):
        with open(JSON_DATASET_PATH, 'r', encoding='utf-8') as f:
            DRAWING_GUIDES = json.load(f)
    else:
        # Fallback if JSON doesn't exist
        print(f"Warning: JSON dataset not found at {JSON_DATASET_PATH}, attempting Excel...")
        DATASET_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'Scribbie_Drawing_Guide_Dataset.xlsx'))
        if os.path.exists(DATASET_PATH):
            wb = openpyxl.load_workbook(DATASET_PATH, read_only=True)
            sheet = wb.active
            rows = list(sheet.iter_rows(values_only=True))
            if rows:
                for row in rows[1:]:
                    if not row[1]:
                        continue
                    obj_name = str(row[1]).strip().lower()
                    DRAWING_GUIDES[obj_name] = {
                        'category': row[0],
                        'intent_examples': row[2],
                        'difficulty': row[3],
                        'guide': row[4],
                        'tips': row[5],
                        'keywords': row[6],
                        'out_of_scope': row[7]
                    }
except Exception as e:
    print(f"Warning: Failed to load Scribbie Drawing Guide Dataset: {e}")


DRAWING_FAQ_INSTRUCTION = """You are a super playful, enthusiastic, and friendly drawing and sketching guide named Scribbie 🎨✨!
working for Scribbox — an awesome, creative drawing app for beginners.

Your ONLY job is to help users learn how to draw basic things. 
You are knowledgeable about basic shapes (circles, ovals, squares, triangles, rectangles, ovals), lines, and simple animals/objects.

When answering:
1. Greet the user with high energy and artistic excitement, introducing yourself as Scribbie if starting a conversation! 🌟🎨
2. Give clear, numbered step-by-step instructions.
3. Mention which basic shapes are used (e.g., "Start with a big, round circle for the head! 🐱").
4. Keep answers concise, highly encouraging, and super kid-friendly! Use lots of positive exclamation marks and playful, colorful emojis (e.g., 🎨, ✏️, ✨, 🐱, 🌟, 🌈).
5. Base your response on the reference drawing guide and tips if provided.
6. End with an inspiring, artistic encouraging sign-off (e.g., "Happy sketching! ✏️✨", "You've got this, future artist! 🌈").
"""

drawing_faq_agent = Agent(
    name="drawing_faq_agent",
    model=Gemini(model="gemini-2.5-flash"),
    instruction=DRAWING_FAQ_INSTRUCTION,
    description="Guides beginners on how to draw basic shapes, lines, shading, proportions, animals, etc."
)

DECLINE_INSTRUCTION = """You are Scribbie, a friendly support representative for Scribbox — 
a creative drawing app for beginners.

The user has asked a question that is OUTSIDE of your expertise. 
Your sole purpose is to politely let the user know that you can only help with drawing and sketching guidance.

Always:
1. Acknowledge the user's question kindly.
2. Explain that you are Scribbie, Scribbox's drawing guide, and can ONLY help with drawing, sketching, and basic arts topics.
3. Invite them to ask a drawing-related question instead.
4. Keep your response warm, friendly, and brief (2–3 sentences max).
"""

SCRIBBIE_INSTRUCTION = """You are Scribbie, the friendly support representative for Scribbox.
Your role is to classify whether the user query is related to drawing, sketching, or arts guidance.
If it IS related, transfer to the `drawing_faq_agent`.
If it is NOT related, transfer to the `decline_agent`.
"""

if HAS_ADK:
    drawing_faq_agent = Agent(
        name="drawing_faq_agent",
        model=Gemini(model="gemini-2.5-flash"),
        instruction=DRAWING_FAQ_INSTRUCTION,
        description="Guides beginners on how to draw basic shapes, lines, shading, proportions, animals, etc."
    )

    decline_agent = Agent(
        name="decline_agent",
        model=Gemini(model="gemini-2.5-flash"),
        instruction=DECLINE_INSTRUCTION,
        description="Politely declines to answer any questions unrelated to drawing, sketching, or basic arts."
    )

    scribbie_agent = Agent(
        name="scribbie",
        model=Gemini(model="gemini-2.5-flash"),
        instruction=SCRIBBIE_INSTRUCTION,
        description="Scribbox customer support and drawing assistant. Classifies queries and routes to specialists.",
        sub_agents=[drawing_faq_agent, decline_agent]
    )

    scribbie_app = App(
        root_agent=scribbie_agent,
        name="scribbox_support_app",
    )
else:
    drawing_faq_agent = None
    decline_agent = None
    scribbie_agent = None
    scribbie_app = None


# ===========================================================================
# 3. Python Execution Helper for Scribbie Workflow (Optimized & Streaming)
# ===========================================================================
EMBEDDINGS_CACHE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'Scribbie_Drawing_Guide_Embeddings.json'))
EMBEDDING_MODEL = "models/gemini-embedding-2"

def cosine_similarity(v1, v2):
    dot_product = sum(a * b for a, b in zip(v1, v2))
    magnitude_v1 = sum(a * a for a in v1) ** 0.5
    magnitude_v2 = sum(b * b for b in v2) ** 0.5
    if not magnitude_v1 or not magnitude_v2:
        return 0.0
    return dot_product / (magnitude_v1 * magnitude_v2)

GUIDE_EMBEDDINGS = {}

def load_or_generate_embeddings(client):
    global GUIDE_EMBEDDINGS
    if GUIDE_EMBEDDINGS:
        return GUIDE_EMBEDDINGS
        
    if os.path.exists(EMBEDDINGS_CACHE_PATH):
        try:
            with open(EMBEDDINGS_CACHE_PATH, 'r', encoding='utf-8') as f:
                GUIDE_EMBEDDINGS = json.load(f)
            # Self-healing: make sure it's fully populated
            if len(GUIDE_EMBEDDINGS) >= len(DRAWING_GUIDES) - 10:
                print(f"Loaded {len(GUIDE_EMBEDDINGS)} cached drawing guide embeddings.")
                return GUIDE_EMBEDDINGS
            else:
                print(f"Embedding cache is incomplete ({len(GUIDE_EMBEDDINGS)}/{len(DRAWING_GUIDES)}). Rebuilding...")
                GUIDE_EMBEDDINGS = {}
        except Exception as e:
            print(f"Failed to load cached embeddings: {e}")
            GUIDE_EMBEDDINGS = {}
            
    if not DRAWING_GUIDES:
        return {}
        
    print("Generating drawing guide embeddings (first run)...")
    keys = list(DRAWING_GUIDES.keys())
    batch_size = 100
    GUIDE_EMBEDDINGS = {}
    import time
    
    for i in range(0, len(keys), batch_size):
        batch = keys[i:i+batch_size]
        retries = 5
        backoff = 35.0
        for attempt in range(retries):
            try:
                # Wrap strings in Content objects for correct batching behavior in google-genai
                contents = [types.Content(parts=[types.Part.from_text(text=t)]) for t in batch]
                res = client.models.embed_content(
                    model=EMBEDDING_MODEL,
                    contents=contents
                )
                for key, emb in zip(batch, res.embeddings):
                    GUIDE_EMBEDDINGS[key] = emb.values
                print(f"Embedded batch {i // batch_size + 1} ({len(GUIDE_EMBEDDINGS)} / {len(keys)})")
                break
            except Exception as e:
                if "429" in str(e) and attempt < retries - 1:
                    print(f"Rate limited (429) on batch starting at {i}. Retrying in {backoff} seconds...")
                    time.sleep(backoff)
                    backoff = backoff * 1.5
                else:
                    print(f"Error embedding batch starting at {i}: {e}")
                    # Skip or fail this batch
                    break
        # Short sleep between successful batches
        time.sleep(1.0)
            
    try:
        os.makedirs(os.path.dirname(EMBEDDINGS_CACHE_PATH), exist_ok=True)
        with open(EMBEDDINGS_CACHE_PATH, 'w', encoding='utf-8') as f:
            json.dump(GUIDE_EMBEDDINGS, f)
        print(f"Successfully cached {len(GUIDE_EMBEDDINGS)} embeddings.")
    except Exception as e:
        print(f"Failed to save embeddings cache: {e}")
        
    return GUIDE_EMBEDDINGS

def run_scribbie_workflow_stream(client, query: str, history: list | None = None):
    """
    Executes the Scribbie support agent workflow in a streaming fashion.
    
    1. Detects simple greetings to bypass embedding and search overhead.
    2. Performs local keyword matching.
    3. Fallbacks to local vector similarity if cache exists.
    4. Fallbacks to Google Search Grounding if similarity is low.
    """
    if history is None:
        history = []
    
    query_lower = query.lower().strip().rstrip('!?.')
    best_match = None
    best_score = -1.0
    
    # 1. Quick greeting/conversational check to prevent unnecessary search/embedding overhead
    greetings = {"hi", "hello", "hey", "yo", "yoo", "sup", "howdy", "greetings", "good morning", "good afternoon", "good evening", "hi scribbie", "hello scribbie"}
    is_greeting = query_lower in greetings or any(query_lower.startswith(g + " ") for g in greetings)
    
    use_web_search = not is_greeting
    
    if not is_greeting:
        # 2. Quick direct keyword match
        import re
        query_words = re.findall(r'\w+', query_lower)
        sorted_keys = sorted(DRAWING_GUIDES.keys(), key=len, reverse=True)
        
        for key in sorted_keys:
            key_words = re.findall(r'\w+', key)
            if key_words and all(any(w.startswith(kw) or kw.startswith(w) for w in query_words) for kw in key_words):
                best_match = key
                best_score = 1.0
                break
                
            # Check intent examples
            guide_info = DRAWING_GUIDES[key]
            intent_str = str(guide_info.get('intent_examples', '')).lower()
            if intent_str:
                intents = [i.strip() for i in intent_str.split(';') if i.strip()]
                for intent in intents:
                    intent_words = re.findall(r'\w+', intent)
                    if intent_words and all(any(w.startswith(iw) or iw.startswith(w) for w in query_words) for iw in intent_words):
                        best_match = key
                        best_score = 1.0
                        break
                if best_match:
                    break
                    
        # 3. Fallback to cached embeddings only if the cache file exists (never rebuild on the fly during request)
        if not best_match and os.path.exists(EMBEDDINGS_CACHE_PATH):
            try:
                res = client.models.embed_content(
                    model=EMBEDDING_MODEL,
                    contents=[query]
                )
                if res.embeddings:
                    query_emb = res.embeddings[0].values
                    embeddings = load_or_generate_embeddings(client)
                    for obj, emb in embeddings.items():
                        score = cosine_similarity(query_emb, emb)
                        if score > best_score:
                            best_score = score
                            best_match = obj
            except Exception as e:
                print(f"Error in fallback semantic similarity: {e}")
                
    print(f"Best match: {best_match} with score: {best_score:.4f}")
    
    rag_context = ""
    if best_match and best_score >= 0.60:
        use_web_search = False
        guide_info = DRAWING_GUIDES.get(best_match)
        if guide_info:
            rag_context = f"""
--- REFERENCE DRAWING GUIDE FOR '{best_match}' ---
Category: {guide_info['category']}
Difficulty: {guide_info['difficulty']}
Drawing Steps: {guide_info['guide']}
Tips: {guide_info['tips']}
-------------------------------------------------
"""
    
    history_context = ""
    if history:
        history_context = "Chat History:\n" + "\n".join([f"{msg['role']}: {msg['content']}" for msg in history]) + "\n\n"
        
    prompt = f"""You are a super playful, enthusiastic, and friendly drawing and sketching guide named Scribbie 🎨✨!
working for Scribbox — an awesome, creative drawing app for beginners.

Your ONLY job is to help users learn how to draw basic things, shapes, animals, objects, or patterns.

--- RESPONSE RULES ---
1. If the user query is related to drawing, sketching, or basic arts (or is a general friendly greeting like 'hi'):
   - Greet the user with high energy and artistic excitement, introducing yourself as Scribbie if starting a conversation! 🌟🎨
   - If they ask how to draw, give clear, numbered step-by-step instructions.
   - Mention which basic shapes are used (e.g., "Start with a big, round circle for the head! 🐱").
   - Keep answers concise, highly encouraging, and super kid-friendly! Use lots of positive exclamation marks and playful, colorful emojis (e.g., 🎨, ✏️, ✨, 🐱, 🌟, 🌈).
   - Base your response on the provided reference drawing guide and tips if available.
   - End with an inspiring, encouraging sign-off (e.g., "Happy sketching! ✏️✨", "You've got this, future artist! 🌈").
   
2. If the user query is NOT related to drawing, sketching, or basic arts:
   - Kindly acknowledge the query, but explain that you are Scribbie, Scribbox's drawing guide, and can ONLY help with drawing, sketching, and basic arts topics.
   - Invite them to ask a drawing-related question instead.
   - Keep this response warm, friendly, and brief (2–3 sentences max).

{history_context}
{rag_context}
User Question: {query}
Scribbie Response:"""

    try:
        config_args = {"temperature": 0.7}
        if use_web_search:
            print(f"Fallback to Web Search Grounding for query: '{query}'")
            config_args["tools"] = [types.Tool(google_search=types.GoogleSearch())]
            
        config = types.GenerateContentConfig(**config_args)
        
        response_stream = client.models.generate_content_stream(
            model='gemini-2.5-flash',
            contents=[prompt],
            config=config
        )
        
        for chunk in response_stream:
            if chunk.text:
                yield chunk.text
                
    except Exception as e:
        print(f"Error in run_scribbie_workflow_stream: {e}")
        err_msg = str(e)
        if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg or "quota" in err_msg.lower():
            yield "Oh no! Scribbie's coloring pencils are a bit warm from all this drawing! 🖍️🔥 Let's take a quick 10-second breather, and then we can get right back to sketching! Sparkle on! 🌟🎨"
        elif "blocked" in err_msg.lower() or "safety" in err_msg.lower():
            yield "Oops! Scribbie can only draw safe and happy things! Let's choose another fun drawing project to work on together! 🌈🎨"
        else:
            yield "Oops! My sketchpad slipped! 🙈 Let's try that drawing request again in a moment! ✏️✨"

def run_scribbie_workflow(client, query: str, history: list | None = None) -> str:
    """Consolidated compatibility wrapper that gathers all stream chunks."""
    return "".join(run_scribbie_workflow_stream(client, query, history))
