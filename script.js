/**
 * Sketchbox - Whiteboard Drawing & Physics Sandbox
 * Logic, Machine Learning Classifier, and Animation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const wbCanvas = document.getElementById('whiteboard-canvas');
  const sbCanvas = document.getElementById('sandbox-canvas');
  const wbCtx = wbCanvas.getContext('2d');
  const sbCtx = sbCanvas.getContext('2d');

  // Tool buttons
  const brushTool = document.getElementById('tool-brush');
  const eraserTool = document.getElementById('tool-eraser');
  const brushSizeInput = document.getElementById('brush-size');
  const brushSizeVal = document.getElementById('brush-size-val');
  const colorBtns = document.querySelectorAll('.color-btn:not(.picker-btn)');
  const colorPicker = document.getElementById('color-picker');
  const pickerTrigger = document.getElementById('picker-trigger');
  const btnClearBoard = document.getElementById('btn-clear-board');
  const btnDrop = document.getElementById('btn-drop');

  // Sandbox controls
  const activityContainer = document.getElementById('activity-container');
  const btnClearSandbox = document.getElementById('btn-clear-sandbox');
  const selectedIndicator = document.getElementById('selected-object-indicator');
  const btnEditSketch = document.getElementById('btn-edit-sketch');

  // AI Scanner Card elements
  const aiCard = document.getElementById('ai-card');
  const aiScanningState = document.getElementById('ai-scanning-state');
  const aiConfirmState = document.getElementById('ai-confirm-state');
  const aiCorrectState = document.getElementById('ai-correct-state');
  const aiConfirmedState = document.getElementById('ai-confirmed-state');

  const aiDetectedLabel = document.getElementById('ai-detected-label');
  const aiConfidence = document.getElementById('ai-confidence');
  const aiGridPreview = document.getElementById('ai-grid-preview');

  const btnConfirmYes = document.getElementById('btn-confirm-yes');
  const btnConfirmNo = document.getElementById('btn-confirm-no');
  const aiPartsRow = document.getElementById('ai-parts-row');
  const aiPartsBadges = document.getElementById('ai-parts-badges');

  const aiCorrectTags = document.getElementById('ai-correct-tags');
  const aiCustomLabel = document.getElementById('ai-custom-label');
  const btnCustomSubmit = document.getElementById('btn-custom-submit');

  const aiFinalLabel = document.getElementById('ai-final-label');
  const btnReclassify = document.getElementById('btn-reclassify');
  const aiPartsConfirmedRow = document.getElementById('ai-parts-confirmed-row');
  const aiPartsConfirmedBadges = document.getElementById('ai-parts-confirmed-badges');

  // Tips and Modals
  const wbTip = document.getElementById('whiteboard-tip');
  const sbTip = document.getElementById('sandbox-tip');
  const helpToggle = document.getElementById('help-toggle');
  const helpModal = document.getElementById('help-modal');
  const helpClose = document.getElementById('help-close');

  // Auth & Artspace DOM Elements
  const authModal = document.getElementById('auth-modal');
  const btnAuthTrigger = document.getElementById('btn-auth-trigger');
  const btnArtspacesTrigger = document.getElementById('btn-artspaces-trigger');
  const btnLogout = document.getElementById('btn-logout');
  const userDisplay = document.getElementById('user-display');
  const authClose = document.getElementById('auth-close');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginError = document.getElementById('login-error');
  const signupError = document.getElementById('signup-error');

  const artspacesModal = document.getElementById('artspaces-modal');
  const artspaceNameInput = document.getElementById('artspace-name-input');
  const btnSaveArtspace = document.getElementById('btn-save-artspace');
  const saveArtspaceError = document.getElementById('save-artspace-error');
  const saveArtspaceSuccess = document.getElementById('save-artspace-success');
  const artspacesListContainer = document.getElementById('artspaces-list-container');
  const artspacesClose = document.getElementById('artspaces-close');
  const btnNewArtspace = document.getElementById('btn-new-artspace');
  const btnManualSave = document.getElementById('btn-manual-save');

  // New Artspace Confirmation Modal Elements
  const newArtspaceConfirmModal = document.getElementById('new-artspace-confirm-modal');
  const newArtspaceTitle = document.getElementById('new-artspace-title');
  const newArtspaceMessage = document.getElementById('new-artspace-message');
  const newArtspaceSaveInputBlock = document.getElementById('new-artspace-save-input-block');
  const newArtspaceSaveName = document.getElementById('new-artspace-save-name');
  const newArtspaceConfirmError = document.getElementById('new-artspace-confirm-error');
  const btnNewArtspaceSave = document.getElementById('btn-new-artspace-save');
  const btnNewArtspaceDiscard = document.getElementById('btn-new-artspace-discard');
  const btnNewArtspaceCancel = document.getElementById('btn-new-artspace-cancel');

  // Additional Tour and Help Elements
  const btnStartInteractiveGuide = document.getElementById('btn-start-interactive-guide');
  const btnViewStaticHelp = document.getElementById('btn-view-static-help');
  const staticHelpModal = document.getElementById('static-help-modal');
  const staticHelpClose = document.getElementById('static-help-close');

  const tourWelcomeModal = document.getElementById('tour-welcome-modal');
  const btnWelcomeStartTour = document.getElementById('btn-welcome-start-tour');
  const btnWelcomeSkipTour = document.getElementById('btn-welcome-skip-tour');

  const tourCard = document.getElementById('tour-card');
  const tourInstruction = document.getElementById('tour-instruction');
  const tourStepBadge = document.getElementById('tour-step-badge');
  const btnTourPrev = document.getElementById('btn-tour-prev');
  const btnTourNext = document.getElementById('btn-tour-next');
  const btnTourSkip = document.getElementById('btn-tour-skip');



  // Custom Action Modal Elements
  const customActionModal = document.getElementById('custom-action-modal');
  const customActionForm = document.getElementById('custom-action-form');
  const customActionClose = document.getElementById('custom-action-close');
  // Custom Alert Modal Elements
  const customAlertModal = document.getElementById('custom-alert-modal');
  const customAlertTitle = document.getElementById('custom-alert-title');
  const customAlertMessage = document.getElementById('custom-alert-message');
  const btnCustomAlertOk = document.getElementById('btn-custom-alert-ok');

  function showCustomAlert(title, message) {
    customAlertTitle.textContent = title;
    customAlertMessage.textContent = message;
    customAlertModal.classList.remove('hidden');
  }

  btnCustomAlertOk.addEventListener('click', () => {
    customAlertModal.classList.add('hidden');
  });

  function showCustomConfirm(title, message, yesText = null, noText = null) {
    return new Promise((resolve) => {
      const modal = document.getElementById('custom-confirm-modal');
      const titleEl = document.getElementById('custom-confirm-title');
      const msgEl = document.getElementById('custom-confirm-message');
      const btnYes = document.getElementById('btn-custom-confirm-yes');
      const btnNo = document.getElementById('btn-custom-confirm-no');

      titleEl.textContent = title;
      msgEl.textContent = message;

      btnYes.textContent = yesText || 'Yes';
      btnNo.textContent = noText || 'Cancel';

      modal.classList.remove('hidden');

      const onYes = () => {
        cleanup();
        resolve(true);
      };

      const onNo = () => {
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        modal.classList.add('hidden');
        btnYes.removeEventListener('click', onYes);
        btnNo.removeEventListener('click', onNo);
      };

      btnYes.addEventListener('click', onYes);
      btnNo.addEventListener('click', onNo);
    });
  }





  // --- Interactive Onboarding Tour Logic ---
  let tourActive = false;
  let tourStep = 0;

  const tourSteps = [
    {
      selector: '#whiteboard-canvas',
      instructionKey: 'tour_instruction_draw',
      instructionDefault: "Let's draw! Doodle a simple shape, star, or stick person on the whiteboard. Click Next when ready!"
    },
    {
      selector: '#tool-eraser',
      instructionKey: 'tour_instruction_erase',
      instructionDefault: 'Try selecting the Eraser tool from the toolbar to rub out a small portion of your drawing.'
    },
    {
      selector: '.color-palette',
      instructionKey: 'tour_instruction_color',
      instructionDefault: 'Customize your sketch! Click any color button in the palette to choose a new drawing color.'
    },
    {
      selector: '#btn-drop',
      instructionKey: 'tour_instruction_drop',
      instructionDefault: 'Drop it! Click the Drop to Sandbox button to drop your sketch into the physics simulation below.'
    },
    {
      selector: '#ai-card',
      instructionKey: 'tour_instruction_scanner',
      instructionDefault: "The AI Scanner is predicting your sketch's shape. Click Yes! to confirm, or type a custom label."
    },
    {
      selector: '#activity-container',
      instructionKey: 'tour_instruction_activities',
      instructionDefault: 'Select an activity (like Stand, Twinkle, or Bounce) to watch your creation animate in the sandbox!'
    },
    {
      selector: '#scribbie-widget-container',
      instructionKey: 'tour_instruction_scribbie',
      instructionDefault: "If you need any help with sketching, you can always ask Scribbie for help! Try typing in the chat below."
    }
  ];

  function startTour() {
    tourActive = true;
    tourStep = 0;
    tourWelcomeModal.classList.add('hidden');
    helpModal.classList.add('hidden');
    tourCard.classList.remove('hidden');
    updateTourStep();
  }

  function endTour() {
    tourActive = false;
    tourCard.classList.add('hidden');
    clearTourHighlights();
    localStorage.setItem('scribbox_onboarded', 'true');
    if (scribbieChatWindow) {
      scribbieChatWindow.classList.add('hidden');
    }
  }

  function clearTourHighlights() {
    document.querySelectorAll('.tour-highlight').forEach(el => {
      el.classList.remove('tour-highlight');
    });
  }

  function updateTourStep() {
    clearTourHighlights();
    if (!tourActive) return;

    const step = tourSteps[tourStep];
    const target = document.querySelector(step.selector);
    if (target) {
      target.classList.add('tour-highlight');
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    tourInstruction.textContent = step.instructionDefault;
    tourStepBadge.textContent = `Step ${tourStep + 1} / ${tourSteps.length}`;

    btnTourPrev.disabled = tourStep === 0;
    if (tourStep === tourSteps.length - 1) {
      btnTourNext.textContent = 'Finish';
    } else {
      btnTourNext.textContent = 'Next';
    }

    if (tourStep === 4 && selectedObject) {
      if (selectedObject.class === 'unknown') {
        selectedObject.classificationStatus = 'correcting';
      } else {
        selectedObject.classificationStatus = 'confirming';
      }
      updateScannerUIForObject(selectedObject);
    }

    if (tourStep === 6) { // Last step pointing to Scribbie
      if (scribbieChatWindow) {
        scribbieChatWindow.classList.remove('hidden');
      }
      if (scribbieWelcomeBubble) {
        scribbieWelcomeBubble.classList.add('hidden');
      }
      if (chatInputField) {
        chatInputField.focus();
        chatInputField.placeholder = "Try asking: 'How do I draw a cat?'";
      }
      scrollToBottom();
    } else {
      if (scribbieChatWindow) {
        scribbieChatWindow.classList.add('hidden');
      }
    }
  }

  btnTourPrev.addEventListener('click', () => {
    if (tourStep > 0) {
      tourStep--;
      updateTourStep();
    }
  });

  btnTourNext.addEventListener('click', () => {
    if (tourStep < tourSteps.length - 1) {
      tourStep++;
      updateTourStep();
    } else {
      endTour();
    }
  });

  btnTourSkip.addEventListener('click', endTour);

  // Hook tour events to tool buttons
  eraserTool.addEventListener('click', () => {
    if (tourActive && tourStep === 1) {
      setTimeout(() => {
        tourStep = 2;
        updateTourStep();
      }, 500);
    }
  });

  // Attach help click events
  btnStartInteractiveGuide.addEventListener('click', startTour);
  btnViewStaticHelp.addEventListener('click', () => {
    helpModal.classList.add('hidden');
    staticHelpModal.classList.remove('hidden');
  });
  staticHelpClose.addEventListener('click', () => {
    staticHelpModal.classList.add('hidden');
  });
  btnWelcomeStartTour.addEventListener('click', startTour);
  btnWelcomeSkipTour.addEventListener('click', () => {
    tourWelcomeModal.classList.add('hidden');
    localStorage.setItem('scribbox_onboarded', 'true');
  });

  // Workspace tracking states
  let currentArtspaceId = null;
  let currentArtspaceName = null;
  let isDroppingSketch = false;

  const activeArtspaceIndicatorName = document.getElementById('active-artspace-name');

  let isWorkspaceSaved = true;

  function saveDraftToLocalStorage() {
    try {
      const state = getWorkspaceState();
      localStorage.setItem('scribbox_draft_active_id', currentArtspaceId || '');
      localStorage.setItem('scribbox_draft_active_name', currentArtspaceName || '');
      localStorage.setItem('scribbox_draft_whiteboard_data', state.whiteboard_data);
      localStorage.setItem('scribbox_draft_sandbox_data', JSON.stringify(state.sandbox_data));
      localStorage.setItem('scribbox_draft_saved', 'false');
    } catch (e) {
      console.error('Failed to autosave draft:', e);
    }
  }

  function clearDraftFromLocalStorage() {
    localStorage.removeItem('scribbox_draft_active_id');
    localStorage.removeItem('scribbox_draft_active_name');
    localStorage.removeItem('scribbox_draft_whiteboard_data');
    localStorage.removeItem('scribbox_draft_sandbox_data');
    localStorage.removeItem('scribbox_draft_saved');
  }

  function markUnsaved() {
    isWorkspaceSaved = false;
    if (currentUser) {
      const saveCheck = document.getElementById('icon-save-check');
      const saveUnsaved = document.getElementById('icon-save-unsaved');
      const saveSpinner = document.getElementById('icon-save-spinner');
      if (saveCheck) saveCheck.classList.add('hidden');
      if (saveUnsaved) saveUnsaved.classList.remove('hidden');
      if (saveSpinner) saveSpinner.classList.add('hidden');
    }
    saveDraftToLocalStorage();
  }

  function markSaved() {
    isWorkspaceSaved = true;
    if (currentUser) {
      const saveCheck = document.getElementById('icon-save-check');
      const saveUnsaved = document.getElementById('icon-save-unsaved');
      const saveSpinner = document.getElementById('icon-save-spinner');
      if (saveCheck) saveCheck.classList.remove('hidden');
      if (saveUnsaved) saveUnsaved.classList.add('hidden');
      if (saveSpinner) saveSpinner.classList.add('hidden');
    }
    clearDraftFromLocalStorage();
  }

  function markSaving() {
    const saveCheck = document.getElementById('icon-save-check');
    const saveUnsaved = document.getElementById('icon-save-unsaved');
    const saveSpinner = document.getElementById('icon-save-spinner');
    if (saveCheck) saveCheck.classList.add('hidden');
    if (saveUnsaved) saveUnsaved.classList.add('hidden');
    if (saveSpinner) saveSpinner.classList.remove('hidden');
  }

  function updateActiveArtspaceIndicator() {
    if (!activeArtspaceIndicatorName) return;
    if (currentArtspaceName) {
      activeArtspaceIndicatorName.textContent = currentArtspaceName;
    } else {
      activeArtspaceIndicatorName.textContent = 'Local Sandbox';
    }
  }

  // --- State Variables ---
  let isDrawing = false;
  let drawTool = 'brush'; // 'brush' or 'eraser'
  let drawColor = '#000000';
  let drawSize = 5;
  let lastX = 0;
  let lastY = 0;
  let drawPoints = [];
  let strokes = []; // Keep track of all drawn strokes for dynamic segmentation
  let wbZoomLevel = 1.0;
  let sbZoomLevel = 1.0;

  // Undo history stack
  const undoStack = [];
  const MAX_UNDO_STACK = 25;

  function saveState() {
    if (undoStack.length >= MAX_UNDO_STACK) {
      undoStack.shift();
    }
    undoStack.push(wbCtx.getImageData(0, 0, wbCanvas.width, wbCanvas.height));
    markUnsaved();
  }

  function undo() {
    if (undoStack.length > 0) {
      const state = undoStack.pop();
      wbCtx.putImageData(state, 0, 0);
      strokes.pop();
      markUnsaved();
    }
  }

  // User authentication state
  let currentUser = null;

  // Sandbox State
  let sandboxObjects = [];
  let sandboxParticles = [];
  let selectedObject = null;
  let dragObject = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let mouseX = 0;
  let mouseY = 0;

  // Physics constants
  const GRAVITY = 0.35;
  const AIR_FRICTION = 0.99;
  const GROUND_FRICTION = 0.95;
  const DEFAULT_BOUNCE = 0.55;

  // --- Physics / Non-Physics classification (from sketchbox_1000plus_dataset.xlsx) ---
  // Non-physics objects float in the sky and are never pulled down by gravity.
  // Populated by fetchPhysicsClasses() on startup.
  let NON_PHYSICS_CLASSES = new Set([
    // Default seed set; overridden by server data
    'star', 'moon', 'sun', 'cloud', 'rainbow', 'snowflake',
    'planet', 'satellite', 'nebula', 'rain', 'tornado',
    'parachute', 'petal', 'seed', 'zeppelin', 'balloon',
    'bubble', 'feather', 'leaf', 'kite', 'blimp',
    'hot air balloon', 'flying saucer', 'comet', 'meteor',
    'asteroid', 'galaxy', 'black hole', 'hurricane', 'aurora', 'lightning'
  ]);
  // { className: { action: 'Float'|'Pulse/Glow'|'Spin'|'Fly', style: '...' } }
  let PHYSICS_CLASS_META = {};

  // --- Machine Learning Prototypes ---
  // We use a Nearest Centroid classifier. Each prototype has:
  // - grid: a 4x4 spatial density profile (16 cells, representing drawn pixel density)
  // - aspectRatio: height / width
  // - yCentroid: relative Y coordinate of the center of mass
  // - hSymmetry: horizontal symmetry (0 to 1)
  let RAW_SAMPLES = [];
  let PROTOTYPES = {
    human: {
      label: 'Human / Stick Figure',
      grid: [0.3634, 0.2467, 0.4653, 0.402, 0.3627, 0.2752, 0.3294, 0.3459, 0.2152, 0.097, 0.3806, 0.4098, 0.0585, 0.0308, 0.277, 0.3152],
      aspectRatio: 0.9902, yCentroid: 0.4184, hSymmetry: 0.583, vSymmetry: 0.6524
    },
    cat: {
      label: 'Cat / Animal',
      grid: [0.3546, 0.2203, 0.5196, 0.4739, 0.3917, 0.2505, 0.506, 0.4641, 0.2239, 0.1172, 0.3481, 0.3447, 0.1139, 0.0726, 0.1893, 0.1633],
      aspectRatio: 0.9194, yCentroid: 0.3806, hSymmetry: 0.5951, vSymmetry: 0.473
    },
    car: {
      label: 'Car / Vehicle',
      grid: [0.1698, 0.1247, 0.5052, 0.5483, 0.4589, 0.3396, 0.4264, 0.3607, 0.4619, 0.3179, 0.4715, 0.4395, 0.2834, 0.1125, 0.3041, 0.2697],
      aspectRatio: 0.6892, yCentroid: 0.4457, hSymmetry: 0.6801, vSymmetry: 0.5557
    },
    ball: {
      label: 'Ball / Circle',
      grid: [0.398, 0.2846, 0.51, 0.5044, 0.4561, 0.3519, 0.4847, 0.5062, 0.2423, 0.1082, 0.4122, 0.4264, 0.059, 0.0233, 0.2832, 0.3464],
      aspectRatio: 0.9859, yCentroid: 0.4014, hSymmetry: 0.5669, vSymmetry: 0.5525
    },
    spider: {
      label: 'Spider / Insect',
      grid: [0.3116, 0.1999, 0.553, 0.5722, 0.3838, 0.2423, 0.5329, 0.4841, 0.2315, 0.1316, 0.3222, 0.3122, 0.104, 0.05, 0.1592, 0.1772],
      aspectRatio: 0.8229, yCentroid: 0.3647, hSymmetry: 0.539, vSymmetry: 0.4359
    },
    flower: {
      label: 'Flower / Plant',
      grid: [0.2456, 0.1455, 0.6012, 0.615, 0.1506, 0.0987, 0.3973, 0.4629, 0.0455, 0.0369, 0.1921, 0.2421, 0.0604, 0.0425, 0.2754, 0.3668],
      aspectRatio: 1.0923, yCentroid: 0.3853, hSymmetry: 0.2386, vSymmetry: 0.4794
    },
    cloud: {
      label: 'Cloud',
      grid: [0.2879, 0.2336, 0.4898, 0.4645, 0.4202, 0.334, 0.2211, 0.1753, 0.3089, 0.2387, 0.2228, 0.1933, 0.2197, 0.0883, 0.3132, 0.338],
      aspectRatio: 0.7227, yCentroid: 0.4195, hSymmetry: 0.8072, vSymmetry: 0.637
    },
    fish: {
      label: 'Fish',
      grid: [0.3669, 0.28, 0.4185, 0.4394, 0.4726, 0.3564, 0.365, 0.3166, 0.4075, 0.3006, 0.3219, 0.31, 0.2594, 0.1573, 0.2218, 0.207],
      aspectRatio: 0.649, yCentroid: 0.4186, hSymmetry: 0.8327, vSymmetry: 0.6533
    },
    bird: {
      label: 'Bird',
      grid: [0.307, 0.2117, 0.448, 0.4605, 0.299, 0.1696, 0.4134, 0.4312, 0.1394, 0.0665, 0.2514, 0.2832, 0.0757, 0.0402, 0.1954, 0.2188],
      aspectRatio: 0.8779, yCentroid: 0.3746, hSymmetry: 0.5007, vSymmetry: 0.4556
    },
    tree: {
      label: 'Tree / Plant',
      grid: [0.322, 0.1758, 0.4336, 0.3674, 0.1325, 0.0501, 0.3919, 0.456, 0.0501, 0.027, 0.2612, 0.2901, 0.0736, 0.0345, 0.3039, 0.363],
      aspectRatio: 0.9969, yCentroid: 0.4261, hSymmetry: 0.3162, vSymmetry: 0.6322
    },
    house: {
      label: 'House / Building',
      grid: [0.2009, 0.1156, 0.4478, 0.3868, 0.3209, 0.1779, 0.35, 0.2727, 0.2698, 0.1293, 0.3925, 0.3677, 0.0322, 0.0085, 0.1541, 0.2605],
      aspectRatio: 1.009, yCentroid: 0.4261, hSymmetry: 0.4962, vSymmetry: 0.7181
    },
    star: {
      label: 'Star',
      grid: [0.232, 0.1384, 0.4496, 0.5156, 0.2791, 0.1589, 0.5245, 0.5018, 0.1378, 0.062, 0.2749, 0.2664, 0.0289, 0.0126, 0.0934, 0.1652],
      aspectRatio: 0.974, yCentroid: 0.3568, hSymmetry: 0.3879, vSymmetry: 0.38
    }
  };

  // Dynamically defined activities recommended per classification
  const CLASS_ACTIVITIES = {
    human: [
      { id: 'stand', label: 'Stand' },
      { id: 'walk', label: 'Walk' },
      { id: 'wave', label: 'Wave' },
      { id: 'run', label: 'Run' },
      { id: 'bounce', label: 'Bounce' },
      { id: 'float', label: 'Float' }
    ],
    cat: [
      { id: 'stand', label: 'Stand' },
      { id: 'prowl', label: 'Prowl' },
      { id: 'yawn', label: 'Yawn' },
      { id: 'pounce', label: 'Pounce' },
      { id: 'bounce', label: 'Bounce' }
    ],
    car: [
      { id: 'stand', label: 'Park' },
      { id: 'drive', label: 'Drive' },
      { id: 'honk', label: 'Honk' },
      { id: 'crash', label: 'Crash' },
      { id: 'float', label: 'Float' }
    ],
    ball: [
      { id: 'stand', label: 'Still' },
      { id: 'roll', label: 'Roll' },
      { id: 'bounce', label: 'Bounce' },
      { id: 'deflate', label: 'Deflate' },
      { id: 'spin', label: 'Spin' }
    ],
    spider: [
      { id: 'stand', label: 'Stand' },
      { id: 'scuttle', label: 'Scuttle' },
      { id: 'web', label: 'Spin Web' },
      { id: 'jiggle', label: 'Jiggle' },
      { id: 'bounce', label: 'Bounce' }
    ],
    flower: [
      { id: 'stand', label: 'Still' },
      { id: 'sway', label: 'Sway (Wind)' },
      { id: 'bloom', label: 'Bloom' },
      { id: 'dropLeaves', label: 'Drop Leaves' }
    ],
    cloud: [
      { id: 'stand', label: 'Float' },
      { id: 'rain', label: 'Rain' },
      { id: 'thunder', label: 'Thunder' },
      { id: 'bounce', label: 'Bounce' }
    ],
    fish: [
      { id: 'stand', label: 'Float' },
      { id: 'swim', label: 'Swim Wiggle' },
      { id: 'splash', label: 'Splash Jump' }
    ],
    bird: [
      { id: 'stand', label: 'Perch' },
      { id: 'fly', label: 'Flap Fly' },
      { id: 'glide', label: 'Glide' },
      { id: 'peck', label: 'Peck Ground' }
    ],
    tree: [
      { id: 'stand', label: 'Still' },
      { id: 'sway', label: 'Wind Sway' },
      { id: 'loseLeaves', label: 'Lose Leaves' }
    ],
    house: [
      { id: 'stand', label: 'Solid Stand' },
      { id: 'lightsOn', label: 'Glow Lights' },
      { id: 'shake', label: 'Earthquake' }
    ],
    star: [
      { id: 'stand', label: 'Stand' },
      { id: 'twinkle', label: 'Twinkle' },
      { id: 'float', label: 'Float' }
    ],
    unknown: [
      { id: 'stand', label: 'Stand' },
      { id: 'drive', label: 'Move' },
      { id: 'bounce', label: 'Bounce' },
      { id: 'float', label: 'Float' },
      { id: 'jiggle', label: 'Shake' }
    ]
  };

  // --- Dynamic Canvas Resolution (matches container size at 1:1 with screen pixels) ---
  function resizeCanvas(canvas, context, preserveContent = false) {
    const dpr = window.devicePixelRatio || 1;
    const zoom = canvas === wbCanvas ? wbZoomLevel : sbZoomLevel;
    const wrapper = canvas.parentElement;
    const rect = wrapper.getBoundingClientRect();

    // Use the actual visible container dimensions
    const targetW = Math.round(rect.width / zoom) || 1200;
    const targetH = Math.round(rect.height / zoom) || 600;

    let newWidth = Math.round(targetW * dpr);
    let newHeight = Math.round(targetH * dpr);

    if (preserveContent) {
      // Only grow, never shrink the physical drawing buffer of the whiteboard
      newWidth = Math.max(canvas.width || 0, newWidth);
      newHeight = Math.max(canvas.height || 0, newHeight);
    }

    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      let tempCanvas = null;
      if (preserveContent && canvas.width > 0 && canvas.height > 0) {
        tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        // Copy physical pixels 1:1 using the 9-argument drawImage to bypass browser CSS scaling
        tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      if (preserveContent) {
        // Set CSS size to match the full buffer size so it doesn't squish
        canvas.style.width = `${(canvas.width / dpr) * zoom}px`;
        canvas.style.height = `${(canvas.height / dpr) * zoom}px`;
      } else {
        canvas.style.width = `${targetW * zoom}px`;
        canvas.style.height = `${targetH * zoom}px`;
      }

      // Restore content using physical 1:1 pixel mapping
      if (tempCanvas) {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(tempCanvas, 0, 0);
        context.restore();
      }

      // Re-apply DPR scaling for future drawing operations
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);
      context.lineCap = 'round';
      context.lineJoin = 'round';
    } else {
      if (preserveContent) {
        canvas.style.width = `${(canvas.width / dpr) * zoom}px`;
        canvas.style.height = `${(canvas.height / dpr) * zoom}px`;
      } else {
        canvas.style.width = `${targetW * zoom}px`;
        canvas.style.height = `${targetH * zoom}px`;
      }

      context.setTransform(1, 0, 0, 1, 0, 0); // reset scale transformations
      context.scale(dpr, dpr);
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }
  }

  function initCanvases() {
    resizeCanvas(wbCanvas, wbCtx);
    resizeCanvas(sbCanvas, sbCtx);
  }

  function getHeatmapColor(val) {
    // Vibrant thermal colormap: Blue (240) to Red (0) based on value 0..1
    const hue = 240 - val * 240;
    const opacity = 0.15 + val * 0.85;
    return `hsla(${hue}, 100%, 50%, ${opacity})`;
  }

  window.addEventListener('resize', () => {
    resizeCanvas(wbCanvas, wbCtx, true);
    resizeCanvas(sbCanvas, sbCtx, false);
  });

  initCanvases();

  // --- API Communications ---
  async function fetchPrototypes() {
    try {
      const response = await fetch('/api/prototypes');
      if (response.ok) {
        const data = await response.json();
        if (data.centroids) {
          PROTOTYPES = data.centroids;
          RAW_SAMPLES = data.samples || [];
        } else {
          PROTOTYPES = data;
        }
        console.log('Centroid prototypes loaded:', Object.keys(PROTOTYPES).length);
        console.log('Raw training samples loaded:', RAW_SAMPLES.length);
      }
    } catch (err) {
      console.warn('Failed to fetch prototypes from server. Using offline fallback:', err);
    }
  }

  async function sendCorrection(obj, correctLabel) {
    if (!obj || !obj.features) return;
    const payload = {
      label: correctLabel,
      custom_label: obj.customLabel || '',
      grid: obj.features.grid,
      aspect_ratio: obj.features.aspectRatio,
      y_centroid: obj.features.yCentroid,
      h_symmetry: obj.features.hSymmetry,
      v_symmetry: obj.features.vSymmetry || 0.5,
      parts: obj.parts || []
    };
    
    try {
      const response = await fetch('/api/corrections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        console.log('Correction saved successfully');
        await fetchPrototypes();
      }
    } catch (err) {
      console.warn('Failed to send correction to server:', err);
    }
  }

  // Load prototypes, restore session, and fetch object action mappings on startup
  fetchPrototypes();
  checkSession();
  fetchObjectActionMapping();
  fetchPhysicsClasses();


  const onboarded = localStorage.getItem('scribbox_onboarded');
  if (!onboarded) {
    setTimeout(() => {
      tourWelcomeModal.classList.remove('hidden');
    }, 1000);
  }

  // --- Drawing Logic on Whiteboard ---
  function getCoordinates(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const zoom = canvas === wbCanvas ? wbZoomLevel : sbZoomLevel;
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    };
  }

  function startDrawing(e) {
    saveState();
    isDrawing = true;
    const coords = getCoordinates(e, wbCanvas);
    lastX = coords.x;
    lastY = coords.y;
    drawPoints = [coords];
    wbTip.classList.add('fade-out');

    wbCtx.beginPath();
    wbCtx.arc(coords.x, coords.y, drawSize / 2, 0, Math.PI * 2);
    wbCtx.fillStyle = drawTool === 'eraser' ? '#ffffff' : drawColor;
    wbCtx.fill();
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();

    const coords = getCoordinates(e, wbCanvas);
    drawPoints.push(coords);

    wbCtx.beginPath();
    if (drawPoints.length > 2) {
      wbCtx.moveTo(drawPoints[0].x, drawPoints[0].y);
      for (let i = 1; i < drawPoints.length - 2; i++) {
        const xc = (drawPoints[i].x + drawPoints[i + 1].x) / 2;
        const yc = (drawPoints[i].y + drawPoints[i + 1].y) / 2;
        wbCtx.quadraticCurveTo(drawPoints[i].x, drawPoints[i].y, xc, yc);
      }
      wbCtx.quadraticCurveTo(
        drawPoints[drawPoints.length - 2].x,
        drawPoints[drawPoints.length - 2].y,
        drawPoints[drawPoints.length - 1].x,
        drawPoints[drawPoints.length - 1].y
      );
    } else {
      wbCtx.moveTo(lastX, lastY);
      wbCtx.lineTo(coords.x, coords.y);
    }

    wbCtx.strokeStyle = drawTool === 'eraser' ? '#ffffff' : drawColor;
    wbCtx.lineWidth = drawSize;
    wbCtx.stroke();

    lastX = coords.x;
    lastY = coords.y;
  }

  function stopDrawing() {
    if (isDrawing && drawPoints.length > 0) {
      strokes.push([...drawPoints]);
    }
    isDrawing = false;
    drawPoints = [];
  }

  wbCanvas.addEventListener('pointerdown', startDrawing);
  wbCanvas.addEventListener('pointermove', draw);
  wbCanvas.addEventListener('pointerup', stopDrawing);
  wbCanvas.addEventListener('pointerleave', stopDrawing);

  // --- Whiteboard Cursor Helper ---
  function updateWhiteboardCursor() {
    if (drawTool === 'eraser') {
      wbCanvas.style.cursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><rect x='3' y='3' width='14' height='14' fill='none' stroke='%23ffffff' stroke-width='3' rx='2'/><rect x='3' y='3' width='14' height='14' fill='none' stroke='%23111827' stroke-width='1.5' rx='2'/></svg>") 10 10, cell`;
    } else {
      wbCanvas.style.cursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><circle cx='8' cy='8' r='3.5' fill='%23ffffff'/><circle cx='8' cy='8' r='2' fill='%23111827'/></svg>") 8 8, crosshair`;
    }
  }

  // --- Toolbar Controls ---
  brushTool.addEventListener('click', () => {
    drawTool = 'brush';
    brushTool.classList.add('active');
    eraserTool.classList.remove('active');
    updateWhiteboardCursor();
  });

  eraserTool.addEventListener('click', () => {
    drawTool = 'eraser';
    eraserTool.classList.add('active');
    brushTool.classList.remove('active');
    updateWhiteboardCursor();
  });

  brushSizeInput.addEventListener('input', (e) => {
    drawSize = parseInt(e.target.value);
    brushSizeVal.textContent = `${drawSize}px`;
  });

  colorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      drawColor = e.target.getAttribute('data-color');
      colorBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      drawTool = 'brush';
      brushTool.classList.add('active');
      eraserTool.classList.remove('active');
      updateWhiteboardCursor();
    });
  });

  pickerTrigger.addEventListener('click', () => {
    colorPicker.click();
  });

  colorPicker.addEventListener('input', (e) => {
    drawColor = e.target.value;
    pickerTrigger.style.borderColor = drawColor;
    pickerTrigger.style.backgroundColor = drawColor;
    colorBtns.forEach(b => b.classList.remove('active'));
    drawTool = 'brush';
    brushTool.classList.add('active');
    eraserTool.classList.remove('active');
    updateWhiteboardCursor();
  });

  btnClearBoard.addEventListener('click', () => {
    saveState();
    wbCtx.clearRect(0, 0, wbCanvas.width, wbCanvas.height);
    wbTip.classList.remove('fade-out');
    strokes = [];
  });

  // Call initially to set pen cursor
  updateWhiteboardCursor();

  // --- Parts Detection & Canvas Slicing Helpers ---
  function segmentStrokes(strokes, k = 3) {
    if (!strokes || strokes.length === 0) return [];
    
    const strokesWithCentroids = strokes.map((stroke, index) => {
      let sumX = 0, sumY = 0;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      stroke.forEach(p => {
        sumX += p.x;
        sumY += p.y;
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
      return {
        index,
        stroke,
        cx: sumX / stroke.length,
        cy: sumY / stroke.length,
        box: { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
      };
    });

    if (strokesWithCentroids.length === 1) {
      const s = strokesWithCentroids[0];
      const parts = [];
      const sliceH = s.box.h / k;
      for (let i = 0; i < k; i++) {
        parts.push({
          box: {
            x: s.box.x,
            y: s.box.y + i * sliceH,
            w: s.box.w,
            h: sliceH
          },
          strokes: [s.stroke]
        });
      }
      return parts;
    }

    strokesWithCentroids.sort((a, b) => a.cy - b.cy);

    const numStrokes = strokesWithCentroids.length;
    const clusters = Array.from({ length: k }, () => []);
    
    if (numStrokes <= k) {
      strokesWithCentroids.forEach((s, idx) => {
        clusters[Math.min(idx, k - 1)].push(s);
      });
    } else {
      const size = numStrokes / k;
      strokesWithCentroids.forEach((s, idx) => {
        const clusterIdx = Math.min(Math.floor(idx / size), k - 1);
        clusters[clusterIdx].push(s);
      });
    }

    const parts = [];
    clusters.forEach((cluster, idx) => {
      if (cluster.length === 0) return;
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      cluster.forEach(s => {
        if (s.box.x < minX) minX = s.box.x;
        if (s.box.x + s.box.w > maxX) maxX = s.box.x + s.box.w;
        if (s.box.y < minY) minY = s.box.y;
        if (s.box.y + s.box.h > maxY) maxY = s.box.y + s.box.h;
      });
      parts.push({
        box: { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
        strokes: cluster.map(c => c.stroke)
      });
    });

    return parts;
  }

  function sliceCanvasDynamic(wbCanvas, box, strokes) {
    const dpr = window.devicePixelRatio || 1;
    const parts = segmentStrokes(strokes, 3);
    
    if (parts.length < 3) {
      return sliceCanvasStandard(wbCanvas, box);
    }
    
    parts.sort((a, b) => a.box.y - b.box.y);
    
    function createSliceFromBox(partBox) {
      const c = document.createElement('canvas');
      const pw = Math.max(1, Math.round(partBox.w * dpr));
      const ph = Math.max(1, Math.round(partBox.h * dpr));
      c.width = pw;
      c.height = ph;
      const ctx = c.getContext('2d');
      ctx.drawImage(
        wbCanvas,
        partBox.x * dpr, partBox.y * dpr, partBox.w * dpr, partBox.h * dpr,
        0, 0, pw, ph
      );
      
      const relX = (partBox.x + partBox.w / 2) - (box.x + box.width / 2);
      const relY = (partBox.y + partBox.h / 2) - (box.y + box.height / 2);
      
      return {
        canvas: c,
        w: partBox.w,
        h: partBox.h,
        relX: relX,
        relY: relY
      };
    }

    const topSlice = createSliceFromBox(parts[0].box);
    const midSlice = createSliceFromBox(parts[1].box);
    const botSlice = createSliceFromBox(parts[2].box);

    return {
      isDynamic: true,
      top: topSlice.canvas,
      mid: midSlice.canvas,
      bot: botSlice.canvas,
      topW: topSlice.w,
      topH: topSlice.h,
      topRelX: topSlice.relX,
      topRelY: topSlice.relY,
      midW: midSlice.w,
      midH: midSlice.h,
      midRelX: midSlice.relX,
      midRelY: midSlice.relY,
      botW: botSlice.w,
      botH: botSlice.h,
      botRelX: botSlice.relX,
      botRelY: botSlice.relY
    };
  }

  function sliceCanvasStandard(wbCanvas, box) {
    const dpr = window.devicePixelRatio || 1;
    const w = box.width;
    const h = box.height;
    
    const topH = Math.max(1, Math.round(h * 0.33));
    const midH = Math.max(1, Math.round(h * 0.34));
    const botH = Math.max(1, h - topH - midH);

    function createSlice(startY, sliceHeight) {
      const c = document.createElement('canvas');
      c.width = w * dpr;
      c.height = sliceHeight * dpr;
      const ctx = c.getContext('2d');
      ctx.drawImage(
        wbCanvas,
        box.x * dpr, (box.y + startY) * dpr, w * dpr, sliceHeight * dpr,
        0, 0, w * dpr, sliceHeight * dpr
      );
      return c;
    }

    return {
      isDynamic: false,
      top: createSlice(0, topH),
      mid: createSlice(topH, midH),
      bot: createSlice(topH + midH, botH),
      topH: topH,
      midH: midH,
      botH: botH
    };
  }

  // Slices an already-cropped offscreen canvas into three equal parts (no DPR dependency)
  function sliceObjectCanvasStandard(objectCanvas, logicalW, logicalH) {
    const pw = objectCanvas.width;
    const ph = objectCanvas.height;
    
    const topH = Math.max(1, Math.round(ph * 0.33));
    const midH = Math.max(1, Math.round(ph * 0.34));
    const botH = Math.max(1, ph - topH - midH);

    function createSlice(startY, sliceHeight) {
      const c = document.createElement('canvas');
      c.width = pw;
      c.height = sliceHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(
        objectCanvas,
        0, startY, pw, sliceHeight,
        0, 0, pw, sliceHeight
      );
      return c;
    }

    return {
      isDynamic: false,
      top: createSlice(0, topH),
      mid: createSlice(topH, midH),
      bot: createSlice(topH + midH, botH),
      topH: logicalH * 0.33,
      midH: logicalH * 0.34,
      botH: logicalH * 0.33
    };
  }

  function detectBodyPartsDynamic(obj) {
    const cls = obj.class;
    if (cls === 'human') {
      return ['Head 👤', 'Torso 👕', 'Legs 👖'];
    } else if (cls === 'cat') {
      return ['Ears & Head 🐱', 'Body 🐈', 'Paws & Tail 🐾'];
    } else if (cls === 'car') {
      return ['Cabin 🚗', 'Chassis 🛠️', 'Wheels ⚙️'];
    } else if (cls === 'flower') {
      return ['Blossom 🌸', 'Stem 🌿', 'Roots 🪵'];
    } else if (cls === 'cloud') {
      return ['Vapor body ☁️', 'Rain ducts 💧', 'Precipitation 🌧️'];
    } else if (cls === 'ball') {
      return ['Outer Shell ⚽', 'Core 🟡', 'Bounce Base 🛹'];
    } else if (cls === 'spider') {
      return ['Head & Eyes 🕷️', 'Thorax 🔴', '8 Legs 🕷️'];
    } else if (cls === 'fish') {
      return ['Mouth & Eyes 🐟', 'Body & Fin 🐠', 'Tail Fin 🦈'];
    } else if (cls === 'bird') {
      return ['Head & Beak 🐦', 'Wings & Body 🪶', 'Claws & Tail 👣'];
    } else if (cls === 'tree') {
      return ['Canopy & Leaves 🌳', 'Trunk 🪵', 'Branches & Roots 🌿'];
    } else if (cls === 'house') {
      return ['Roof & Chimney 🏠', 'Walls & Windows 🧱', 'Door & Foundation 🚪'];
    } else {
      return ['Upper Section 📐', 'Middle Section 📐', 'Lower Section 📐'];
    }
  }

  function detectBodyParts(obj) {
    if (obj.slices && obj.slices.isDynamic) {
      return detectBodyPartsDynamic(obj);
    }
    const parts = [];
    const cls = obj.class;

    if (cls === 'human') {
      parts.push('Head 👤', 'Torso 👕', 'Arms 👐', 'Legs 👖');
    } else if (cls === 'cat') {
      parts.push('Ears 🐱', 'Body 🐈', 'Mouth 👅', 'Paws 🐾');
    } else if (cls === 'car') {
      parts.push('Cabin 🚗', 'Chassis 🛠️', 'Wheels ⚙️');
    } else if (cls === 'flower') {
      parts.push('Blossom 🌸', 'Stem 🌿', 'Roots 🪵');
    } else if (cls === 'cloud') {
      parts.push('Vapor body ☁️', 'Rain ducts 💧');
    } else if (cls === 'ball') {
      parts.push('Shell ⚽', 'Core 🟡');
    } else if (cls === 'spider') {
      parts.push('Head 🕷️', 'Thorax 🔴', '8 Legs 🕷️');
    } else if (cls === 'fish') {
      parts.push('Head 🐟', 'Body 🐠', 'Fin 🦈', 'Tail 🪶');
    } else if (cls === 'bird') {
      parts.push('Head 🐦', 'Wings 🪶', 'Beak 👄', 'Claws 👣');
    } else if (cls === 'tree') {
      parts.push('Canopy 🌳', 'Trunk 🪵', 'Branches 🌿');
    } else if (cls === 'house') {
      parts.push('Roof 🏠', 'Walls 🧱', 'Door 🚪', 'Window 🪟');
    } else {
      parts.push('Body Shape 📐');
    }
    return parts;
  }

  function mapCustomClass(label) {
    const clean = label.toLowerCase().trim();

    // ── HUMAN ──────────────────────────────────────────────────────────────────
    const humanKw = [
      // EN
      'man','human','boy','girl','person','stick','robot','dancer','woman','child','baby','people',
      // VI
      'người','con người','đàn ông','phụ nữ','trẻ em','em bé','nhân vật','người que',
      // ZH
      '人','男人','女人','孩子','婴儿','机器人','舞者','人物','火柴人',
      // JA
      '人','男','女','子供','赤ちゃん','ロボット','ダンサー','人物','棒人間',
      // KO
      '사람','남자','여자','아이','아기','로봇','댄서','인물','막대인간',
      // ID
      'orang','manusia','laki-laki','perempuan','anak','bayi','robot','penari','tokoh',
    ];
    if (humanKw.some(k => clean.includes(k))) return 'human';

    // ── CAT (animals) ──────────────────────────────────────────────────────────
    const catKw = [
      // EN
      'cat','dog','animal','lion','tiger','bear','wolf','puppy','kitty','fox','rabbit','horse','cow','pig','sheep','goat',
      // VI
      'mèo','chó','động vật','thú','sư tử','hổ','gấu','chó sói','thỏ','ngựa','bò','lợn','cừu','dê',
      // ZH
      '猫','狗','动物','兽','狮子','老虎','熊','狼','兔子','马','牛','猪','羊','山羊',
      // JA
      '猫','犬','動物','ライオン','虎','熊','オオカミ','ウサギ','馬','牛','豚','羊','ヤギ',
      // KO
      '고양이','개','동물','사자','호랑이','곰','늑대','토끼','말','소','돼지','양','염소',
      // ID
      'kucing','anjing','hewan','binatang','singa','harimau','beruang','serigala','kelinci','kuda','sapi','babi','domba','kambing',
    ];
    if (catKw.some(k => clean.includes(k))) return 'cat';

    // ── CAR (vehicles) ────────────────────────────────────────────────────────
    const carKw = [
      // EN
      'car','truck','bus','vehicle','train','bike','rocket','plane','boat','airplane','ship','helicopter','motorcycle',
      // VI
      'xe','ô tô','xe hơi','xe tải','xe buýt','phương tiện','tàu','tên lửa','máy bay','thuyền','tàu thủy','xe đạp','xe máy',
      // ZH
      '车','汽车','卡车','公共汽车','交通工具','火车','火箭','飞机','船','直升机','摩托车','自行车',
      // JA
      '車','自動車','トラック','バス','乗り物','電車','ロケット','飛行機','船','ヘリコプター','バイク','自転車',
      // KO
      '차','자동차','트럭','버스','탈것','기차','로켓','비행기','배','헬리콥터','오토바이','자전거',
      // ID
      'mobil','truk','bus','kendaraan','kereta','roket','pesawat','kapal','helikopter','motor','sepeda',
    ];
    if (carKw.some(k => clean.includes(k))) return 'car';

    // ── BALL (round shapes) ────────────────────────────────────────────────────
    const ballKw = [
      // EN
      'ball','circle','sphere','wheel','sun','moon','balloon','egg','planet','dot',
      // VI
      'bóng','vòng tròn','hình cầu','bánh xe','mặt trời','mặt trăng','bóng bay','quả trứng','hành tinh',
      // ZH
      '球','圆','圆形','球形','轮子','太阳','月亮','气球','鸡蛋','星球',
      // JA
      'ボール','円','丸','球','ホイール','太陽','月','風船','卵','惑星',
      // KO
      '공','원','동그라미','구','바퀴','태양','달','풍선','달걀','행성',
      // ID
      'bola','lingkaran','bulat','roda','matahari','bulan','balon','telur','planet',
    ];
    if (ballKw.some(k => clean.includes(k))) return 'ball';

    // ── SPIDER (bugs & crawlies) ───────────────────────────────────────────────
    const spiderKw = [
      // EN
      'spider','bug','insect','ant','crab','lobster','scorpion','beetle','cockroach','centipede',
      // VI
      'nhện','bọ','côn trùng','kiến','cua','tôm hùm','bọ cạp','bọ cánh cứng','gián','rết',
      // ZH
      '蜘蛛','虫','昆虫','蚂蚁','螃蟹','龙虾','蝎子','甲虫','蟑螂','蜈蚣',
      // JA
      'クモ','虫','昆虫','アリ','カニ','ロブスター','サソリ','カブトムシ','ゴキブリ','ムカデ',
      // KO
      '거미','벌레','곤충','개미','게','바닷가재','전갈','딱정벌레','바퀴벌레','지네',
      // ID
      'laba-laba','serangga','semut','kepiting','lobster','kalajengking','kumbang','kecoa','kelabang',
    ];
    if (spiderKw.some(k => clean.includes(k))) return 'spider';

    // ── FLOWER (plants & flora) ────────────────────────────────────────────────
    const flowerKw = [
      // EN
      'flower','plant','rose','tulip','daisy','sunflower','dandelion','blossom','petal','grass',
      // VI
      'hoa','cây','hoa hồng','hoa tulip','hoa cúc','hoa hướng dương','cánh hoa','cỏ',
      // ZH
      '花','植物','玫瑰','郁金香','雏菊','向日葵','蒲公英','花瓣','草',
      // JA
      '花','植物','バラ','チューリップ','デイジー','ひまわり','タンポポ','花びら','草',
      // KO
      '꽃','식물','장미','튤립','데이지','해바라기','민들레','꽃잎','풀',
      // ID
      'bunga','tanaman','mawar','tulip','sedap malam','bunga matahari','kelopak','rumput',
    ];
    if (flowerKw.some(k => clean.includes(k))) return 'flower';

    // ── CLOUD (sky & weather) ──────────────────────────────────────────────────
    const cloudKw = [
      // EN
      'cloud','sky','smoke','ghost','fog','storm','weather','rain','snowflake',
      // VI
      'mây','bầu trời','khói','ma','sương mù','bão','mưa','bông tuyết',
      // ZH
      '云','天空','烟','幽灵','雾','风暴','天气','雨','雪花',
      // JA
      '雲','空','煙','幽霊','霧','嵐','天気','雨','雪',
      // KO
      '구름','하늘','연기','유령','안개','폭풍','날씨','비','눈송이',
      // ID
      'awan','langit','asap','hantu','kabut','badai','cuaca','hujan','kepingan salju',
    ];
    if (cloudKw.some(k => clean.includes(k))) return 'cloud';

    // ── FISH (aquatic) ─────────────────────────────────────────────────────────
    const fishKw = [
      // EN
      'fish','shark','whale','dolphin','eel','shrimp','seahorse','octopus','squid','turtle',
      // VI
      'cá','cá mập','cá voi','cá heo','lươn','tôm','cá ngựa','bạch tuộc','mực','rùa',
      // ZH
      '鱼','鲨鱼','鲸鱼','海豚','鳗鱼','虾','海马','章鱼','鱿鱼','海龟',
      // JA
      '魚','サメ','クジラ','イルカ','ウナギ','エビ','タコ','イカ','カメ','タツノオトシゴ',
      // KO
      '물고기','상어','고래','돌고래','장어','새우','해마','문어','오징어','거북이',
      // ID
      'ikan','hiu','paus','lumba-lumba','belut','udang','kuda laut','gurita','cumi','penyu',
    ];
    if (fishKw.some(k => clean.includes(k))) return 'fish';

    // ── BIRD ───────────────────────────────────────────────────────────────────
    const birdKw = [
      // EN
      'bird','eagle','duck','chicken','owl','parrot','pigeon','flamingo','penguin','crow','sparrow',
      // VI
      'chim','đại bàng','vịt','gà','cú','vẹt','chim bồ câu','hạc','chim cánh cụt','quạ','chim sẻ',
      // ZH
      '鸟','老鹰','鸭子','鸡','猫头鹰','鹦鹉','鸽子','火烈鸟','企鹅','乌鸦','麻雀',
      // JA
      '鳥','ワシ','アヒル','鶏','フクロウ','オウム','ハト','フラミンゴ','ペンギン','カラス','スズメ',
      // KO
      '새','독수리','오리','닭','올빼미','앵무새','비둘기','홍학','펭귄','까마귀','참새',
      // ID
      'burung','elang','bebek','ayam','burung hantu','beo','merpati','flamingo','penguin','gagak','gereja',
    ];
    if (birdKw.some(k => clean.includes(k))) return 'bird';

    // ── TREE (nature & plants) ─────────────────────────────────────────────────
    const treeKw = [
      // EN
      'tree','bush','forest','palm','pine','jungle','cactus','mushroom','bamboo',
      // VI
      'cây','bụi','rừng','cọ','thông','rừng nhiệt đới','cây xương rồng','nấm','tre',
      // ZH
      '树','灌木','森林','棕榈树','松树','丛林','仙人掌','蘑菇','竹子',
      // JA
      '木','茂み','森','ヤシ','松','ジャングル','サボテン','キノコ','竹',
      // KO
      '나무','덤불','숲','야자수','소나무','정글','선인장','버섯','대나무',
      // ID
      'pohon','semak','hutan','kelapa','pinus','rimba','kaktus','jamur','bambu',
    ];
    if (treeKw.some(k => clean.includes(k))) return 'tree';

    // ── HOUSE (buildings & structures) ────────────────────────────────────────
    const houseKw = [
      // EN
      'house','building','castle','home','tent','tower','hut','barn','school','church','temple','skyscraper',
      // VI
      'nhà','tòa nhà','lâu đài','ngôi nhà','lều','tháp','túp lều','chuồng','trường học','nhà thờ','chùa','nhà chọc trời',
      // ZH
      '房子','建筑','城堡','家','帐篷','塔','小屋','谷仓','学校','教堂','寺庙','摩天大楼',
      // JA
      '家','建物','城','城castle','テント','塔','小屋','納屋','学校','教会','寺','高層ビル',
      // KO
      '집','건물','성','텐트','탑','오두막','헛간','학교','교회','사원','고층빌딩',
      // ID
      'rumah','gedung','kastil','tenda','menara','gubuk','kandang','sekolah','gereja','kuil','pencakar langit',
    ];
    if (houseKw.some(k => clean.includes(k))) return 'house';

    // ── STAR (celestial / shapes) ──────────────────────────────────────────────
    const starKw = [
      // EN
      'star','twinkle','sparkle','polygon','asterisk',
      // VI
      'ngôi sao','sao','lấp lánh',
      // ZH
      '星星','星','闪烁',
      // JA
      '星','スター','きらきら',
      // KO
      '별','스타','반짝',
      // ID
      'bintang','kelap-kelip',
    ];
    if (starKw.some(k => clean.includes(k))) return 'star';

    return 'unknown';
  }

  // --- Machine Learning Feature Extraction & Classifier ---
  function getWhiteboardBoundingBox() {
    const dpr = window.devicePixelRatio || 1;
    const w = wbCanvas.width;
    const h = wbCanvas.height;
    const imgData = wbCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let minX = w, minY = h, maxX = 0, maxY = 0;
    let foundPixels = false;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        if (a > 10 && !(r > 250 && g > 250 && b > 250)) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          foundPixels = true;
        }
      }
    }

    if (!foundPixels) return null;

    const padding = 10;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(w, maxX + padding);
    maxY = Math.min(h, maxY + padding);

    return {
      x: minX / dpr,
      y: minY / dpr,
      width: (maxX - minX) / dpr,
      height: (maxY - minY) / dpr
    };
  }

  function extractFeatures(box) {
    const dpr = window.devicePixelRatio || 1;
    const bx = Math.round(box.x * dpr);
    const by = Math.round(box.y * dpr);
    const bw = Math.round(box.width * dpr);
    const bh = Math.round(box.height * dpr);

    if (bw <= 0 || bh <= 0) return null;

    const imgData = wbCtx.getImageData(bx, by, bw, bh);
    const data = imgData.data;

    const grid = Array(16).fill(0);
    const cellW = bw / 4;
    const cellH = bh / 4;
    let totalDrawn = 0;
    let sumY = 0;
    let pixelCount = 0;

    let leftHalf = 0, rightHalf = 0;
    let topHalf = 0, bottomHalf = 0;

    for (let y = 0; y < bh; y++) {
      for (let x = 0; x < bw; x++) {
        const idx = (y * bw + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        if (a > 10 && !(r > 250 && g > 250 && b > 250)) {
          totalDrawn++;
          sumY += y;
          pixelCount++;

          const gx = Math.min(3, Math.floor(x / cellW));
          const gy = Math.min(3, Math.floor(y / cellH));
          grid[gy * 4 + gx]++;

          if (x < bw / 2) leftHalf++; else rightHalf++;
          if (y < bh / 2) topHalf++; else bottomHalf++;
        }
      }
    }

    const maxPixelsPerCell = cellW * cellH;
    const normalizedGrid = grid.map(val => maxPixelsPerCell > 0 ? val / maxPixelsPerCell : 0);
    const yCentroid = pixelCount > 0 ? (sumY / pixelCount) / bh : 0.5;
    const aspectRatio = bh / bw;
    const hSymmetry = Math.min(leftHalf, rightHalf) / Math.max(1, Math.max(leftHalf, rightHalf));
    const vSymmetry = Math.min(topHalf, bottomHalf) / Math.max(1, Math.max(topHalf, bottomHalf));

    return {
      grid: normalizedGrid,
      aspectRatio: aspectRatio,
      yCentroid: yCentroid,
      hSymmetry: hSymmetry,
      vSymmetry: vSymmetry
    };
  }

  function classifySketch(features) {
    let bestClass = 'human';
    let minDistance = Infinity;

    for (const [name, proto] of Object.entries(PROTOTYPES)) {
      let gridDist = 0;
      for (let i = 0; i < 16; i++) {
        gridDist += Math.pow(features.grid[i] - proto.grid[i], 2);
      }

      const aspectDist = Math.pow(features.aspectRatio - proto.aspectRatio, 2) * 2.5;
      const centroidDist = Math.pow(features.yCentroid - proto.yCentroid, 2) * 4.0;
      const symmetryDist = Math.pow(features.hSymmetry - proto.hSymmetry, 2) * 1.5;
      const symmetryVDist = Math.pow(features.vSymmetry - (proto.vSymmetry || 0.5), 2) * 1.5;

      const totalDist = Math.sqrt(gridDist + aspectDist + centroidDist + symmetryDist + symmetryVDist);

      if (totalDist < minDistance) {
        minDistance = totalDist;
        bestClass = name;
      }
    }

    // 2. K-Nearest Neighbor (KNN) check against raw user-submitted correction samples
    RAW_SAMPLES.forEach(sample => {
      let gridDist = 0;
      for (let i = 0; i < 16; i++) {
        gridDist += Math.pow(features.grid[i] - sample.grid[i], 2);
      }

      const aspectDist = Math.pow(features.aspectRatio - sample.aspectRatio, 2) * 2.5;
      const centroidDist = Math.pow(features.yCentroid - sample.yCentroid, 2) * 4.0;
      const symmetryDist = Math.pow(features.hSymmetry - sample.hSymmetry, 2) * 1.5;
      const symmetryVDist = Math.pow(features.vSymmetry - (sample.vSymmetry || 0.5), 2) * 1.5;

      // We give raw user corrections a slight bias boost (multiply distance by 0.85)
      // to prioritize learning from their personal drawing style!
      const totalDist = Math.sqrt(gridDist + aspectDist + centroidDist + symmetryDist + symmetryVDist) * 0.85;

      if (totalDist < minDistance) {
        minDistance = totalDist;
        bestClass = sample.label;
      }
    });

    // Convert Euclidean distance to pseudo confidence percent
    const confidence = Math.max(35, Math.round(100 - (minDistance * 45)));

    return {
      classification: bestClass,
      confidence: Math.min(98, confidence)
    };
  }

  // --- Dynamic Toolbar Render ---
  function renderActivityButtons(obj) {
    activityContainer.innerHTML = '';

    const label = document.createElement('span');
    label.className = 'activity-label';
    label.textContent = 'Activity:';
    activityContainer.appendChild(label);

    // Combine predefined and custom user activities
    let activities = [...(CLASS_ACTIVITIES[obj.class] || [{ id: 'stand', label: 'Stand' }])];
    if (obj.customActivities) {
      const presetIds = new Set(activities.map(a => a.id));
      obj.customActivities.forEach(c => {
        if (!presetIds.has(c.id)) {
          activities.push(c);
        }
      });
    }

    activities.forEach(act => {
      const btn = document.createElement('button');
      btn.className = 'activity-btn';
      if (obj.activity === act.id) {
        btn.classList.add('active');
      }
      btn.textContent = act.label;
      btn.setAttribute('data-activity', act.id);

      btn.addEventListener('click', (e) => {
        const actionId = e.currentTarget.getAttribute('data-activity');
        
        activityContainer.querySelectorAll('.activity-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        if (selectedObject) {
          selectedObject.activity = actionId;
          selectedObject.time = 0;
          selectedObject.direction = Math.random() > 0.5 ? 1 : -1;
          selectedObject.state = 'active';
          markUnsaved();
        }
      });

      activityContainer.appendChild(btn);
    });

    // Append "+ Add Action" button
    const addBtn = document.createElement('button');
    addBtn.className = 'activity-btn add-action-btn';
    addBtn.style.borderColor = 'var(--border-color-dark)';
    addBtn.innerHTML = '<span style="font-weight: 600;">+ Add Action</span>';
    addBtn.addEventListener('click', () => {
      document.getElementById('custom-action-name').value = '';
      document.getElementById('custom-action-style').value = 'jiggle';
      customActionModal.classList.remove('hidden');
    });
    activityContainer.appendChild(addBtn);
  }

  // --- AI Card Flow Management ---
  function showAiCardState(stateName) {
    aiScanningState.classList.add('hidden');
    aiConfirmState.classList.add('hidden');
    aiCorrectState.classList.add('hidden');
    aiConfirmedState.classList.add('hidden');

    if (stateName === 'scanning') {
      aiScanningState.classList.remove('hidden');
    } else if (stateName === 'confirming') {
      aiConfirmState.classList.remove('hidden');
    } else if (stateName === 'correcting') {
      aiCorrectState.classList.remove('hidden');
    } else if (stateName === 'confirmed') {
      aiConfirmedState.classList.remove('hidden');
    }
  }

  function triggerScannerCard(obj, features) {
    aiCard.classList.remove('hidden');
    showAiCardState('scanning');

    // Draw 4x4 feature grid preview
    aiGridPreview.innerHTML = '';
    features.grid.forEach(density => {
      const cell = document.createElement('div');
      cell.className = 'ai-grid-cell';
      cell.style.backgroundColor = getHeatmapColor(density);
      aiGridPreview.appendChild(cell);
    });

    // Scan progress animation delay
    setTimeout(() => {
      obj.classificationStatus = (obj.class === 'unknown') ? 'correcting' : 'confirming';
      if (selectedObject === obj) {
        showAiCardState(obj.classificationStatus);
        
        if (obj.classificationStatus === 'confirming') {
          // Show guess & confidence
          const protoLabel = PROTOTYPES[obj.class] ? PROTOTYPES[obj.class].label : 'Unknown';
          aiDetectedLabel.textContent = protoLabel;
          aiConfidence.textContent = `${obj.confidence}% confidence`;
          
          // Render parts badges
          renderPartsBadges(obj, aiPartsRow, aiPartsBadges);
        } else {
          // Focus input
          setTimeout(() => {
            aiCustomLabel.focus();
          }, 50);
        }
      }
    }, 300);
  }

  function renderPartsBadges(obj, rowElement, badgesElement) {
    badgesElement.innerHTML = '';
    const isConfirmedRow = (rowElement === aiPartsConfirmedRow);
    
    if (obj.class === 'unknown' && isConfirmedRow) {
      rowElement.classList.remove('hidden');
      
      const labelEl = rowElement.querySelector('.ai-parts-label');
      if (labelEl) {
        labelEl.textContent = 'Parts:';
      }
      
      const availableParts = [
        { key: 'Head 👤', label: 'Head 👤' },
        { key: 'Torso 👕', label: 'Body 👕' },
        { key: 'Legs 👖', label: 'Legs 👖' },
        { key: 'Wings 🪶', label: 'Wings 🪶' },
        { key: 'Wheels ⚙️', label: 'Wheels ⚙️' },
        { key: 'Tail 🐾', label: 'Tail 🐾' }
      ];
      
      availableParts.forEach(part => {
        const btn = document.createElement('button');
        btn.className = 'override-tag';
        btn.style.fontSize = '0.65rem';
        btn.style.padding = '2px 8px';
        btn.style.margin = '2px';
        btn.textContent = part.label;
        
        const hasPart = obj.parts && obj.parts.includes(part.key);
        if (hasPart) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
        
        btn.addEventListener('click', () => {
          if (!obj.parts) obj.parts = [];
          const idx = obj.parts.indexOf(part.key);
          if (idx > -1) {
            obj.parts.splice(idx, 1);
            btn.classList.remove('active');
          } else {
            obj.parts.push(part.key);
            btn.classList.add('active');
          }
        });
        
        badgesElement.appendChild(btn);
      });
    } else {
      const labelEl = rowElement.querySelector('.ai-parts-label');
      if (labelEl) {
        labelEl.textContent = 'Parts:';
      }
      
      if (obj.parts && obj.parts.length > 0) {
        rowElement.classList.remove('hidden');
        obj.parts.forEach(part => {
          const badge = document.createElement('span');
          badge.className = 'part-badge';
          badge.textContent = part;
          badgesElement.appendChild(badge);
        });
      } else {
        rowElement.classList.add('hidden');
      }
    }
  }

  // --- Confirm Flow Listeners ---
  btnConfirmYes.addEventListener('click', () => {
    if (!selectedObject) return;
    selectedObject.classificationStatus = 'confirmed';
    updateScannerUIForObject(selectedObject);
    sendCorrection(selectedObject, selectedObject.class);

    if (tourActive && tourStep === 4) {
      tourStep = 5;
      updateTourStep();
    }
  });

  btnConfirmNo.addEventListener('click', () => {
    if (!selectedObject) return;
    selectedObject.classificationStatus = 'correcting';
    updateScannerUIForObject(selectedObject);
  });

  // Custom Category Text Submit
  function submitCustomLabel() {
    if (!selectedObject) return;
    const typed = aiCustomLabel.value.trim();
    if (typed.length === 0) {
      showCustomAlert('Warning', 'Please enter a label name or choose a category tag below.');
      return;
    }

    const mapped = mapCustomClass(typed);
    selectedObject.class = mapped;
    selectedObject.customLabel = typed;
    
    if (mapped !== 'unknown') {
      if (!selectedObject.slices) {
        selectedObject.slices = sliceObjectCanvasStandard(selectedObject.canvas, selectedObject.width, selectedObject.height);
      }
      selectedObject.parts = detectBodyParts(selectedObject);
    } else {
      selectedObject.slices = null;
      selectedObject.parts = [];
    }
    
    selectedObject.classificationStatus = 'confirmed';
    initObjectActivities(selectedObject);
    selectedObject.time = 0;
    selectedObject.state = 'active';

    aiCustomLabel.value = ''; // clear input
    updateScannerUIForObject(selectedObject);
    sendCorrection(selectedObject, mapped);

    if (tourActive && tourStep === 4) {
      tourStep = 5;
      updateTourStep();
    }
  }

  btnCustomSubmit.addEventListener('click', submitCustomLabel);
  aiCustomLabel.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitCustomLabel();
  });

  // Click on override tags in correct state
  const correctionTags = aiCorrectTags.querySelectorAll('.override-tag');
  correctionTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      if (!selectedObject) return;
      const chosenClass = e.target.getAttribute('data-label');
      
      selectedObject.class = chosenClass;
      // Strip emojis from the tag label for cleaner matching
      selectedObject.customLabel = e.target.textContent.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, "").trim();
      
      if (chosenClass !== 'unknown') {
        if (!selectedObject.slices) {
          selectedObject.slices = sliceObjectCanvasStandard(selectedObject.canvas, selectedObject.width, selectedObject.height);
        }
        selectedObject.parts = detectBodyParts(selectedObject);
      } else {
        selectedObject.slices = null;
        selectedObject.parts = [];
      }
      
      selectedObject.classificationStatus = 'confirmed';
      initObjectActivities(selectedObject);
      selectedObject.time = 0;
      selectedObject.state = 'active';

      updateScannerUIForObject(selectedObject);
      sendCorrection(selectedObject, chosenClass);

      if (tourActive && tourStep === 4) {
        tourStep = 5;
        updateTourStep();
      }
    });
  });

  // Change classification button click
  btnReclassify.addEventListener('click', () => {
    if (!selectedObject) return;
    selectedObject.classificationStatus = 'correcting';
    updateScannerUIForObject(selectedObject);
  });

  // Core UI updater for selected object's classification status
  function updateScannerUIForObject(obj) {
    if (!obj) {
      aiCard.classList.add('hidden');
      activityContainer.innerHTML = `
        <span class="activity-label">Activity:</span>
        <span class="activity-placeholder">Select a sketch to choose activities</span>
      `;
      return;
    }

    aiCard.classList.remove('hidden');
    showAiCardState(obj.classificationStatus);

    if (obj.classificationStatus === 'confirming') {
      const protoLabel = PROTOTYPES[obj.class] ? PROTOTYPES[obj.class].label : 'Unknown';
      aiDetectedLabel.textContent = protoLabel;
      aiConfidence.textContent = `${obj.confidence}% confidence`;
      renderPartsBadges(obj, aiPartsRow, aiPartsBadges);
      
      // Hide activity buttons during confirmation
      activityContainer.innerHTML = `
        <span class="activity-label">Activity:</span>
        <span class="activity-placeholder">Confirm classification in AI Scanner...</span>
      `;
    } 
    else if (obj.classificationStatus === 'correcting') {
      // Highlight correct active tag if matches
      correctionTags.forEach(tag => {
        if (tag.getAttribute('data-label') === obj.class) {
          tag.classList.add('active');
        } else {
          tag.classList.remove('active');
        }
      });
      // Hide activities toolbar
      activityContainer.innerHTML = `
        <span class="activity-label">Activity:</span>
        <span class="activity-placeholder">Awaiting correct label...</span>
      `;
      // Auto-focus text input box
      setTimeout(() => {
        aiCustomLabel.focus();
      }, 50);
    } 
    else if (obj.classificationStatus === 'confirmed') {
      const labelText = obj.customLabel || (PROTOTYPES[obj.class] ? PROTOTYPES[obj.class].label : obj.class);
      aiFinalLabel.textContent = labelText;
      renderPartsBadges(obj, aiPartsConfirmedRow, aiPartsConfirmedBadges);
      renderActivityButtons(obj);
    }
  }

  // --- Whiteboard Drop Interaction ---
  btnDrop.addEventListener('click', () => {
    if (isDroppingSketch) return; // Prevent double clicks
    
    const box = getWhiteboardBoundingBox();

    if (!box || box.width < 5 || box.height < 5) {
      showCustomAlert('Warning', 'Please draw something on the whiteboard first!');
      return;
    }

    isDroppingSketch = true;
    btnDrop.disabled = true;

    if (tourActive && tourStep === 3) {
      tourStep = 4;
      updateTourStep();
    }

    sbTip.classList.add('fade-out');

    const scanLine = document.createElement('div');
    scanLine.className = 'scan-line';
    wbCanvas.parentElement.appendChild(scanLine);

    setTimeout(() => {
      const dpr = window.devicePixelRatio || 1;
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = box.width * dpr;
      cropCanvas.height = box.height * dpr;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(
        wbCanvas,
        box.x * dpr, box.y * dpr, box.width * dpr, box.height * dpr,
        0, 0, box.width * dpr, box.height * dpr
      );
      
      const imageBase64 = cropCanvas.toDataURL('image/png');
      const features = extractFeatures(box);

      // Async fetch prediction from ADK Agent, fallback to local model
      fetch('/api/ai/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageBase64,
          features: features
        })
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('AI Endpoint not available');
      })
      .then(data => {
        if (data.status === 'success') {
          const pred = data.prediction;
          handlePredictionResult({
            classification: pred.class,
            confidence: 95,
            action: pred.action,
            style: pred.style
          });
        } else {
          throw new Error('Failed response status');
        }
      })
      .catch(() => {
        let localPred = { classification: 'human', confidence: 75 };
        if (features) {
          localPred = classifySketch(features);
        }
        handlePredictionResult(localPred);
      });

      function handlePredictionResult(prediction) {
        let canvasSlices = null;
        if (prediction.classification !== 'unknown') {
          canvasSlices = sliceCanvasDynamic(wbCanvas, box, strokes);
        }
        
        const newObj = {
          id: Date.now().toString(),
          canvas: cropCanvas,
          slices: canvasSlices,
          width: box.width,
          height: box.height,
          x: box.x + box.width / 2,
          y: -box.height / 2,
          vx: (Math.random() - 0.5) * 2,
          vy: 3,
          angle: 0,
          angularVelocity: 0,
          class: prediction.classification,
          confidence: prediction.confidence,
          classificationStatus: 'scanning',
          parts: [],
          activity: 'stand',
          time: 0,
          isDragging: false,
          dragOffsetX: 0,
          dragOffsetY: 0,
          lastX: 0,
          lastY: 0,
          bounceFactor: DEFAULT_BOUNCE,
          onGround: false,
          direction: Math.random() > 0.5 ? 1 : -1,
          state: 'active',
          features: features,
          strokes: strokes // Keep copy of strokes for potential re-slicing
        };

        if (prediction.classification !== 'unknown') {
          newObj.parts = detectBodyParts(newObj);
        } else {
          newObj.parts = [];
        }
        
        // Initialize activities from custom action recommendation
        if (prediction.action && prediction.style) {
          const actionId = prediction.action.toLowerCase().replace(/[^a-z0-9]/g, '');
          newObj.customActivities = [{
            id: actionId,
            label: prediction.action,
            style: prediction.style
          }];
          newObj.activity = actionId;
        } else {
          initObjectActivities(newObj);
        }

        sandboxObjects.push(newObj);
        markUnsaved();
        selectObject(newObj);
        triggerScannerCard(newObj, features);

        // Erase board
        wbCtx.clearRect(0, 0, wbCanvas.width, wbCanvas.height);
        wbTip.classList.remove('fade-out');
        scanLine.remove();
        strokes = [];
        
        // Reset drop flag & enable button
        isDroppingSketch = false;
        btnDrop.disabled = false;
      }
    }, 450);
  });

  // --- Selection Logic ---
  function selectObject(obj) {
    selectedObject = obj;
    if (obj) {
      selectedIndicator.textContent = `Selected: Sketch #${obj.id.slice(-4)}`;
      selectedIndicator.classList.add('active');
      updateScannerUIForObject(obj);
    } else {
      selectedIndicator.textContent = 'No sketch selected';
      selectedIndicator.classList.remove('active');
      updateScannerUIForObject(null);
    }
  }

  // --- Particle Engine ---
  function spawnParticle(type, x, y, options = {}) {
    sandboxParticles.push({
      type: type,
      x: x,
      y: y,
      vx: options.vx || 0,
      vy: options.vy || 0,
      size: options.size || 3,
      color: options.color || '#000000',
      alpha: 1,
      life: options.life || 60,
      maxLife: options.life || 60,
      rotation: options.rotation || 0,
      rotSpeed: options.rotSpeed || 0
    });
  }

  function updateParticles() {
    const sbHeight = sbCanvas.height / (window.devicePixelRatio || 1);
    const dpr = window.devicePixelRatio || 1;

    for (let i = sandboxParticles.length - 1; i >= 0; i--) {
      const p = sandboxParticles[i];
      p.life--;

      if (p.life <= 0) {
        sandboxParticles.splice(i, 1);
        continue;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.alpha = p.life / p.maxLife;

      // Handle custom particle interactions
      if (p.type === 'rain') {
        p.vy += 0.1; // gravity for rain
        // Check splash
        if (p.y >= sbHeight - 4) {
          // Spawn water splash ripple
          for (let k = 0; k < 3; k++) {
            spawnParticle('splash', p.x, sbHeight - 1, {
              vx: (Math.random() - 0.5) * 3,
              vy: -Math.random() * 2,
              color: '#a1a1aa',
              life: 15
            });
          }
          sandboxParticles.splice(i, 1);
        }
      } else if (p.type === 'leaf') {
        // leaf air resistance float
        p.vx = Math.sin(p.life * 0.1) * 0.8;
      }
    }
  }

  function drawParticles() {
    sandboxParticles.forEach(p => {
      sbCtx.save();
      sbCtx.globalAlpha = p.alpha;
      sbCtx.fillStyle = p.color;
      sbCtx.strokeStyle = p.color;

      if (p.type === 'soundwave') {
        // Concentric expanding ring
        const currentRadius = p.size * (1 - p.alpha);
        sbCtx.beginPath();
        sbCtx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        sbCtx.lineWidth = 1.5;
        sbCtx.stroke();
      } else if (p.type === 'leaf') {
        // Draw little falling leaf shape
        sbCtx.translate(p.x, p.y);
        sbCtx.rotate(p.rotation);
        sbCtx.beginPath();
        // Leaf design
        sbCtx.ellipse(0, 0, p.size * 1.5, p.size * 0.8, 0, 0, Math.PI * 2);
        sbCtx.fill();
      } else if (p.type === 'lightning') {
        // Draw lightning bolts
        sbCtx.lineWidth = 2.5;
        sbCtx.beginPath();
        sbCtx.moveTo(p.x, p.y);
        // Draw jagged lines down
        let currentX = p.x;
        let currentY = p.y;
        while (currentY < p.vy) {
          currentX += (Math.random() - 0.5) * 20;
          currentY += Math.random() * 30 + 15;
          sbCtx.lineTo(currentX, currentY);
        }
        sbCtx.stroke();
      } else if (p.type === 'sparkle') {
        // Draw 4-pointed star/sparkle shape
        sbCtx.translate(p.x, p.y);
        sbCtx.rotate(p.rotation);
        sbCtx.beginPath();
        for (let i = 0; i < 4; i++) {
          sbCtx.rotate(Math.PI / 2);
          sbCtx.lineTo(p.size * 1.8, 0);
          sbCtx.lineTo(p.size * 0.4, p.size * 0.4);
        }
        sbCtx.closePath();
        sbCtx.fill();
      } else {
        // Splash or Rain dot
        sbCtx.beginPath();
        sbCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        sbCtx.fill();
      }

      sbCtx.restore();
    });
  }

  function applyMovementStyle(obj, style, sbWidth, sbHeight) {
    switch (style) {
      case 'jiggle':
        obj.vy += GRAVITY;
        if (obj.onGround) {
          obj.vx *= 0.7;
          obj.angularVelocity = 0;
          obj.angle = Math.sin(obj.time * 0.4) * 0.08;
          obj.x += (Math.random() - 0.5) * 1.2;
        }
        break;
      case 'sway':
        obj.vy += GRAVITY;
        if (obj.onGround) {
          obj.vx *= 0.7;
          obj.angularVelocity = 0;
          obj.angle = Math.sin(obj.time * 0.04) * 0.22;
        }
        break;
      case 'float':
        obj.bounceFactor = 0.3;
        // Float higher up in the ceiling
        const floatTargetY = sbHeight / 5;
        obj.vy += (floatTargetY - obj.y) * 0.03;
        obj.vy *= 0.9;
        
        // Pacing slowly horizontal
        const floatTargetVx = obj.direction * 1.0;
        obj.vx += (floatTargetVx - obj.vx) * 0.05;
        obj.angle = Math.sin(obj.time * 0.02) * 0.03;
        obj.angularVelocity = 0;
        obj.onGround = false;
        break;
      case 'bounce':
        obj.vy += GRAVITY;
        if (obj.onGround && Math.abs(obj.vy) < 0.25) {
          obj.vy = -6.8;
          obj.onGround = false;
        }
        break;
      case 'spin':
        obj.vy += GRAVITY;
        if (obj.onGround) {
          const targetVx = obj.direction * 2.5;
          obj.vx += (targetVx - obj.vx) * 0.12;
          const radius = Math.min(obj.width, obj.height) / 2;
          obj.angularVelocity = obj.vx / radius;
        } else {
          obj.angularVelocity = obj.direction * 0.08;
        }
        break;
      case 'drive':
        if (obj.onGround) {
          const targetVx = obj.direction * 4.0;
          obj.vx += (targetVx - obj.vx) * 0.15;
          obj.vy = 0;
          obj.angle = (Math.random() - 0.5) * 0.015;
          obj.angularVelocity = 0;
        } else {
          obj.vy += GRAVITY;
        }
        break;
      case 'pulse':
        obj.vy += GRAVITY;
        if (obj.onGround) {
          obj.vx *= 0.7;
          obj.angularVelocity = 0;
          obj.angle += (0 - obj.angle) * 0.1;
        }
        break;
      default:
        obj.vy += GRAVITY;
    }
  }

  // --- Physics Sandbox Engine ---
  function updatePhysics() {
    const sbWidth = sbCanvas.width / (window.devicePixelRatio || 1);
    const sbHeight = sbCanvas.height / (window.devicePixelRatio || 1);

    sandboxObjects.forEach(obj => {
      // --- Suspended State before Confirmation ---
      if (obj.classificationStatus !== 'confirmed') {
        obj.time++;
        if (obj.isDragging) {
          obj.vx = 0;
          obj.vy = 0;
          obj.angularVelocity = 0;
          obj.onGround = false;
          return;
        }
        obj.vx = 0;
        obj.vy = 0;
        obj.angularVelocity = 0;
        obj.angle = 0;
        obj.x = sbWidth / 2;
        obj.y = sbHeight * 0.25 + obj.height / 2;
        obj.onGround = false;
        return;
      }

      obj.time++;

      if (obj.isDragging) {
        obj.onGround = false;
        return;
      }

      // --- Pull-back to Whiteboard animation handler ---
      if (obj.activity === 'pulling') {
        obj.onGround = false;
        
        const targetX = sbWidth / 2;
        const targetY = -obj.height / 2;

        obj.x += (targetX - obj.x) * 0.15;
        obj.y += (targetY - obj.y) * 0.15;
        obj.angle += (0 - obj.angle) * 0.15;

        if (obj.scaleFactor === undefined) obj.scaleFactor = 1.0;
        obj.scaleFactor *= 0.9;

        const distY = Math.abs(obj.y - targetY);
        const distX = Math.abs(obj.x - targetX);
        if (distY < 10 && distX < 10) {
          // Draw back onto the whiteboard (scale down if it exceeds bounds to prevent cropping!)
          const dpr = window.devicePixelRatio || 1;
          const maxW = wbCanvas.width / dpr;
          const maxH = wbCanvas.height / dpr;
          
          let drawW = obj.width;
          let drawH = obj.height;
          
          if (drawW > maxW || drawH > maxH) {
            const scale = Math.min(maxW / drawW, maxH / drawH);
            drawW *= scale;
            drawH *= scale;
          }
          
          const destX = Math.max(0, (maxW - drawW) / 2);
          const destY = Math.max(0, (maxH - drawH) / 2);

          saveState();
          wbCtx.drawImage(obj.canvas, destX, destY, drawW, drawH);
          
          wbTip.classList.add('fade-out');

          // Set active tool back to brush
          drawTool = 'brush';
          brushTool.classList.add('active');
          eraserTool.classList.remove('active');
          updateWhiteboardCursor();

          // Remove object
          sandboxObjects = sandboxObjects.filter(o => o.id !== obj.id);
          selectObject(null);

          // Sparkle particles
          for (let k = 0; k < 10; k++) {
            spawnParticle('splash', targetX, 5, {
              vx: (Math.random() - 0.5) * 5,
              vy: Math.random() * 3,
              color: '#000000',
              size: 2.0,
              life: 25
            });
          }
        }
        return;
      }

      // --- Non-Physics Objects (from sketchbox_1000plus_dataset.xlsx) ---
      // These objects float freely in the sky and are never pulled down by gravity.
      // Animation style is determined by the dataset's "Recommended Action" field.
      // Classes with their own dedicated switch-case (cloud, bird, fish, etc.) are
      // excluded here so their existing rich animations remain intact.
      const objClassNorm = (obj.class || '').toLowerCase();
      const HAS_BUILTIN_SWITCH = new Set(['human','cat','car','ball','spider','flower','cloud','fish','bird','tree','house']);
      if (NON_PHYSICS_CLASSES.has(objClassNorm) && !HAS_BUILTIN_SWITCH.has(objClassNorm)) {
        const meta = PHYSICS_CLASS_META[objClassNorm] || {};
        const action = (meta.action || 'Float').toLowerCase();
        obj.bounceFactor = 0.1;
        obj.onGround = false;

        // Target Y: upper portion of the sky (top 40% of sandbox)
        const skyZoneTop = sbHeight * 0.08;
        const skyZoneBot = sbHeight * 0.42;
        const skyBand = skyZoneBot - skyZoneTop;

        if (action.includes('spin') || action.includes('continuous rotation')) {
          // --- SPIN: planet, satellite, galaxy, black hole, hurricane, asteroid, tornado ---
          // Hold a fixed sky position with gentle drift, rotate continuously
          const spinTargetY = skyZoneTop + (skyBand * 0.5) + Math.sin(obj.time * 0.015 + obj.id.charCodeAt(0)) * (skyBand * 0.2);
          const spinTargetX = sbWidth / 2 + Math.cos(obj.time * 0.01 + obj.id.charCodeAt(0)) * (sbWidth * 0.25);
          obj.vy += (spinTargetY - obj.y) * 0.02;
          obj.vy *= 0.88;
          obj.vx += (spinTargetX - obj.x) * 0.01;
          obj.vx *= 0.92;
          obj.angularVelocity = 0.025; // continuous clockwise spin
          obj.angle += obj.angularVelocity;

        } else if (action.includes('pulse') || action.includes('glow')) {
          // --- PULSE/GLOW: star, moon, sun, rainbow, nebula, aurora, lightning ---
          // Gently bob in sky, pulse scale/glow effect
          const pulseTargetY = skyZoneTop + (skyBand * 0.4) + Math.sin(obj.time * 0.02 + obj.id.charCodeAt(0)) * (skyBand * 0.25);
          const pulseTargetX = sbWidth * 0.5 + Math.cos(obj.time * 0.012 + obj.id.charCodeAt(0) * 0.5) * (sbWidth * 0.3);
          obj.vy += (pulseTargetY - obj.y) * 0.02;
          obj.vy *= 0.9;
          obj.vx += (pulseTargetX - obj.x) * 0.008;
          obj.vx *= 0.93;
          obj.angularVelocity = 0;
          obj.angle += (0 - obj.angle) * 0.05; // settle to upright

          // Glow pulse stored in obj.glowPhase (used by drawObjects for scale/glow)
          obj.glowPhase = (obj.glowPhase || 0) + 0.05;
          obj.scaleFactor = 1.0 + Math.sin(obj.glowPhase) * 0.07;

          // Sparkle particles for star/sun/moon every ~60 frames
          if ((objClassNorm === 'star' || objClassNorm === 'sun' || objClassNorm === 'moon') && obj.time % 55 === 0) {
            for (let k = 0; k < 4; k++) {
              spawnParticle('splash', obj.x + (Math.random() - 0.5) * obj.width,
                obj.y + (Math.random() - 0.5) * obj.height, {
                  vx: (Math.random() - 0.5) * 1.8,
                  vy: -Math.random() * 2.0 - 0.5,
                  size: 1.5 + Math.random() * 2,
                  color: objClassNorm === 'moon' ? '#c8d8ff' : '#fff176',
                  life: 35
                });
            }
          }

        } else {
          // --- FLOAT / FLY / default: balloon, cloud, feather, leaf, snowflake, seed, parachute, zeppelin etc. ---
          // Slow sinusoidal drift across the sky
          const driftPhase = obj.time * 0.018 + obj.id.charCodeAt(0) * 0.7;
          const floatTargetY = skyZoneTop + (skyBand * 0.45) + Math.sin(driftPhase) * (skyBand * 0.35);
          const floatTargetVx = Math.cos(obj.time * 0.013 + obj.id.charCodeAt(0) * 0.3) * 1.2 * obj.direction;
          obj.vy += (floatTargetY - obj.y) * 0.018;
          obj.vy *= 0.9;
          obj.vx += (floatTargetVx - obj.vx) * 0.04;
          obj.vx *= 0.94;

          // Gentle tilt sway (like feather / leaf falling sideways)
          obj.angularVelocity = 0;
          obj.angle += (Math.sin(obj.time * 0.022) * 0.12 - obj.angle) * 0.06;

          // Snowflake: soft swirl and tiny particles
          if (objClassNorm === 'snowflake' && obj.time % 40 === 0) {
            spawnParticle('splash', obj.x + (Math.random() - 0.5) * obj.width * 0.5,
              obj.y + obj.height / 2, {
                vx: (Math.random() - 0.5) * 0.8,
                vy: 0.4 + Math.random() * 0.6,
                size: 1.5,
                color: '#ddeeff',
                life: 50
              });
          }
        }

        // Reverse horizontal direction at walls (non-physics floaters bounce gently)
        const hw2 = obj.width / 2;
        if (obj.x - hw2 < 10) { obj.direction = 1; obj.vx = Math.abs(obj.vx); }
        if (obj.x + hw2 > sbWidth - 10) { obj.direction = -1; obj.vx = -Math.abs(obj.vx); }

        // Apply velocity
        obj.vx *= AIR_FRICTION;
        obj.vy *= AIR_FRICTION;
        obj.x += obj.vx;
        obj.y += obj.vy;
        obj.angle += obj.angularVelocity;
        return; // skip gravity and all other physics
      }

      // --- Behavior Controllers based on Class & Action ---
      const customAct = obj.customActivities && obj.customActivities.find(a => a.id === obj.activity);
      if (customAct) {
        applyMovementStyle(obj, customAct.style, sbWidth, sbHeight);
      } else {
        switch (obj.class) {
        case 'human':
          if (obj.activity === 'walk') {
            obj.bounceFactor = 0.3;
            if (obj.onGround) {
              const targetVx = obj.direction * 1.6;
              obj.vx += (targetVx - obj.vx) * 0.15;
              obj.angle = Math.sin(obj.time * 0.12) * 0.12; // light waddle tilt
              obj.angularVelocity = 0;
              // Small bouncing steps
              if (Math.abs(Math.sin(obj.time * 0.12)) > 0.9 && obj.onGround) {
                obj.vy = -1.8;
                obj.onGround = false;
              }
            } else {
              obj.vy += GRAVITY;
            }
          } else if (obj.activity === 'run') {
            obj.bounceFactor = 0.3;
            if (obj.onGround) {
              const targetVx = obj.direction * 3.2;
              obj.vx += (targetVx - obj.vx) * 0.2;
              // Lean forward into run
              obj.angle = obj.direction * 0.22 + Math.sin(obj.time * 0.25) * 0.08;
              obj.angularVelocity = 0;
              if (Math.abs(Math.sin(obj.time * 0.25)) > 0.85 && obj.onGround) {
                obj.vy = -3.2;
                obj.onGround = false;
              }
            } else {
              obj.vy += GRAVITY;
            }
          } else if (obj.activity === 'wave') {
            obj.bounceFactor = DEFAULT_BOUNCE;
            if (obj.onGround) {
              obj.vx *= 0.7;
              obj.angularVelocity = 0;
              // High frequency shake for hand wave
              obj.angle = Math.sin(obj.time * 0.3) * 0.06;
              // Spawn waving line indicators
              if (obj.time % 12 === 0) {
                spawnParticle('splash', obj.x + obj.width/2 - 4, obj.y - obj.height/2 + 8, {
                  vx: 1 + Math.random(),
                  vy: -1 - Math.random(),
                  color: '#8e8e93',
                  life: 15,
                  size: 1.5
                });
              }
            } else {
              obj.vy += GRAVITY;
            }
          } else {
            // default fall behavior for stand/bounce/float
            obj.vy += GRAVITY;
          }
          break;

        case 'cat':
          if (obj.activity === 'prowl') {
            obj.bounceFactor = 0.2;
            if (obj.onGround) {
              const targetVx = obj.direction * 0.9; // very slow creep
              obj.vx += (targetVx - obj.vx) * 0.1;
              obj.angle = Math.sin(obj.time * 0.08) * 0.05; // tiny tilt
              obj.angularVelocity = 0;
            } else {
              obj.vy += GRAVITY;
            }
          } else if (obj.activity === 'yawn') {
            obj.bounceFactor = DEFAULT_BOUNCE;
            if (obj.onGround) {
              obj.vx *= 0.6;
              obj.angularVelocity = 0;
              // Animate yawn stretching in rendering loop
            } else {
              obj.vy += GRAVITY;
            }
          } else if (obj.activity === 'pounce') {
            obj.bounceFactor = 0.2;
            obj.vy += GRAVITY;
            if (obj.onGround) {
              // Crouch and Leap loop
              if (obj.state === 'crouch') {
                obj.vx *= 0.5;
                if (obj.time > 45) { // 45 frames crouched -> LEAP
                  obj.vy = -7.5;
                  obj.vx = obj.direction * 5.0;
                  obj.angularVelocity = obj.direction * 0.15;
                  obj.onGround = false;
                  obj.state = 'leap';
                  obj.time = 0;
                }
              } else {
                obj.state = 'crouch';
                obj.time = 0;
              }
            }
          } else {
            obj.vy += GRAVITY;
          }
          break;

        case 'car':
          if (obj.activity === 'drive') {
            obj.bounceFactor = 0.3;
            if (obj.onGround) {
              const targetVx = obj.direction * 4.5; // fast horizontal glide
              obj.vx += (targetVx - obj.vx) * 0.15;
              obj.vy = 0;
              // slight vibration shake
              obj.angle = (Math.random() - 0.5) * 0.02;
              obj.angularVelocity = 0;
            } else {
              obj.vy += GRAVITY;
            }
          } else if (obj.activity === 'honk') {
            obj.bounceFactor = DEFAULT_BOUNCE;
            if (obj.onGround) {
              obj.vx *= 0.7;
              obj.angularVelocity = 0;
              // honk shake
              obj.angle = (Math.random() - 0.5) * 0.04;
              if (obj.time % 20 === 0) {
                // Spawn honk soundwaves from the front bumper
                const frontX = obj.x + (obj.width / 2 + 10) * obj.direction;
                spawnParticle('soundwave', frontX, obj.y, {
                  size: 55,
                  color: '#4a4a4a',
                  life: 25
                });
              }
            } else {
              obj.vy += GRAVITY;
            }
          } else if (obj.activity === 'crash') {
            obj.vy += GRAVITY;
            if (obj.state === 'crashed') {
              obj.vx *= 0.8;
              obj.angularVelocity *= 0.85;
            } else {
              // Accelerate forward until hitting wall
              if (obj.onGround) {
                obj.vx = obj.direction * 6.5;
                obj.angle = 0;
                obj.angularVelocity = 0;
              }
              // Check wall hits trigger crash spinout
              const hw = obj.width / 2;
              if (obj.x - hw <= 1 || obj.x + hw >= sbWidth - 1) {
                obj.state = 'crashed';
                obj.vy = -6.0; // flies up in air
                obj.vx = -obj.direction * 3.5;
                obj.angularVelocity = (Math.random() - 0.5) * 0.5; // rapid spinout
                
                // Spawn debris particles
                for (let k = 0; k < 8; k++) {
                  spawnParticle('splash', obj.x, obj.y, {
                    vx: (Math.random() - 0.5) * 8,
                    vy: -Math.random() * 6 - 2,
                    color: '#e02424',
                    size: 2,
                    life: 30
                  });
                }
              }
            }
          } else {
            obj.vy += GRAVITY;
          }
          break;

        case 'ball':
          if (obj.activity === 'roll') {
            obj.bounceFactor = 0.55;
            if (obj.onGround) {
              const targetVx = obj.direction * 3.0;
              obj.vx += (targetVx - obj.vx) * 0.1;
              const radius = Math.min(obj.width, obj.height) / 2;
              obj.angularVelocity = obj.vx / radius;
            } else {
              obj.vy += GRAVITY;
            }
          } else if (obj.activity === 'bounce') {
            obj.bounceFactor = 0.90; // extra high bounce
            obj.vy += GRAVITY;
            if (obj.onGround && Math.abs(obj.vy) < 0.2) {
              obj.vy = -9.0;
              obj.vx = (Math.random() - 0.5) * 5;
              obj.angularVelocity = (Math.random() - 0.5) * 0.1;
              obj.onGround = false;
            }
          } else if (obj.activity === 'deflate') {
            obj.bounceFactor = 0.1;
            obj.vy += GRAVITY;
            if (obj.onGround) {
              obj.vx *= 0.6;
              obj.angularVelocity = 0;
              // flat scale (handled in draw)
            }
          } else {
            obj.vy += GRAVITY;
          }
          break;

        case 'spider':
          if (obj.activity === 'scuttle') {
            obj.bounceFactor = 0.3;
            if (obj.onGround) {
              // Rapid direction changes
              if (obj.time % 30 === 0 && Math.random() > 0.5) {
                obj.direction = -obj.direction;
              }
              const targetVx = obj.direction * 3.8;
              obj.vx += (targetVx - obj.vx) * 0.25;
              // jittery vertical scuttle hop
              obj.vy = (Math.random() - 0.5) * 1.5;
              obj.angle = Math.sin(obj.time * 0.4) * 0.15;
              obj.angularVelocity = 0;
            } else {
              obj.vy += GRAVITY;
            }
          } else if (obj.activity === 'web') {
            obj.bounceFactor = 0.3;
            // Climb up and down thread, ignore normal gravity
            const targetY = sbHeight / 3 + Math.sin(obj.time * 0.05) * (sbHeight / 4);
            obj.vy += (targetY - obj.y) * 0.08;
            obj.vy *= 0.85;
            obj.vx *= 0.85;
            // spinning web sway
            obj.angle = Math.sin(obj.time * 0.04) * 0.25;
            obj.angularVelocity = 0;
            obj.onGround = false;
          } else if (obj.activity === 'jiggle') {
            obj.bounceFactor = DEFAULT_BOUNCE;
            if (obj.onGround) {
              obj.vx *= 0.7;
              obj.angularVelocity = 0;
              // High frequency shake
              obj.angle = Math.sin(obj.time * 0.5) * 0.12;
            } else {
              obj.vy += GRAVITY;
            }
          } else {
            obj.vy += GRAVITY;
          }
          break;

        case 'flower':
          if (obj.activity === 'sway') {
            obj.bounceFactor = 0.3;
            if (obj.onGround) {
              obj.vx *= 0.6;
              obj.angularVelocity = 0;
              // Wind sway tilt
              obj.angle = Math.sin(obj.time * 0.04) * 0.28;
            } else {
              obj.vy += GRAVITY;
            }
          } else if (obj.activity === 'bloom') {
            obj.bounceFactor = 0.3;
            if (obj.onGround) {
              obj.vx *= 0.7;
              obj.angularVelocity = 0;
              obj.angle += (0 - obj.angle) * 0.15;
              
              // Spawn shiny sparkle particles during bloom!
              if (obj.time % 8 === 0) {
                const rx = obj.x + (Math.random() - 0.5) * (obj.width * 0.8);
                const ry = obj.y - obj.height/2 - Math.random() * (obj.height * 0.5);
                const colors = ['#facc15', '#fef08a', '#ffffff', '#fb7185', '#67e8f9']; // gold, pale yellow, white, rose, cyan
                spawnParticle('sparkle', rx, ry, {
                  vx: (Math.random() - 0.5) * 0.8,
                  vy: -0.6 - Math.random() * 0.8, // rise slowly
                  size: 2.5 + Math.random() * 2.5,
                  color: colors[Math.floor(Math.random() * colors.length)],
                  life: 30 + Math.random() * 30,
                  rotation: Math.random() * Math.PI,
                  rotSpeed: (Math.random() - 0.5) * 0.08
                });
              }
            } else {
              obj.vy += GRAVITY;
            }
          } else if (obj.activity === 'dropLeaves') {
            obj.bounceFactor = 0.3;
            if (obj.onGround) {
              obj.vx *= 0.7;
              obj.angularVelocity = 0;
              obj.angle = Math.sin(obj.time * 0.03) * 0.05; // tiny sway
              
              // Spawn leaf particles
              if (obj.time % 24 === 0) {
                const rx = obj.x + (Math.random() - 0.5) * (obj.width * 0.6);
                const ry = obj.y - Math.random() * (obj.height * 0.3);
                spawnParticle('leaf', rx, ry, {
                  vx: (Math.random() - 0.5) * 0.5,
                  vy: 1.0 + Math.random() * 0.8,
                  size: 4 + Math.random() * 3,
                  color: '#059669', // green petals
                  life: 140,
                  rotation: Math.random() * Math.PI * 2,
                  rotSpeed: (Math.random() - 0.5) * 0.04
                });
              }
            } else {
              obj.vy += GRAVITY;
            }
          } else {
            obj.vy += GRAVITY;
          }
          break;

        case 'cloud':
          if (obj.activity === 'rain') {
            obj.bounceFactor = 0.3;
            // Float higher up in the ceiling
            const targetY = sbHeight / 5;
            obj.vy += (targetY - obj.y) * 0.03;
            obj.vy *= 0.9;
            
            // Pacing slowly horizontal
            const targetVx = obj.direction * 1.0;
            obj.vx += (targetVx - obj.vx) * 0.05;
            obj.angle = Math.sin(obj.time * 0.02) * 0.03;
            obj.angularVelocity = 0;
            obj.onGround = false;

            // Spawn rain particles
            if (obj.time % 3 === 0) {
              const rx = obj.x - obj.width/2 + Math.random() * obj.width;
              const ry = obj.y + obj.height/2;
              spawnParticle('rain', rx, ry, {
                vy: 5.5,
                color: '#2563eb', // blue rain
                size: 1.5,
                life: 90
              });
            }
          } else if (obj.activity === 'thunder') {
            obj.bounceFactor = 0.3;
            const targetY = sbHeight / 5;
            obj.vy += (targetY - obj.y) * 0.03;
            obj.vy *= 0.9;
            obj.vx *= 0.9;
            obj.onGround = false;
            obj.angle = (Math.random() - 0.5) * 0.02; // tremble

            // Strike lightning
            if (obj.time % 110 === 0) {
              // Spawn lightning lightning particle
              spawnParticle('lightning', obj.x, obj.y + obj.height/2, {
                vy: sbHeight - 10, // target ground
                color: '#000000', // aesthetic solid black bolt
                life: 15
              });
              
              // Flash sandbox background screen visually
                // Flash sandbox background screen visually
                obj.state = 'flash';
              obj.state = 'flash';
            }
          } else {
            // standard float
            obj.bounceFactor = 0.6;
            const floatTargetY = sbHeight / 2.5 + Math.sin(obj.time * 0.02) * (sbHeight / 7);
            obj.vy += (floatTargetY - obj.y) * 0.015;
            obj.vy *= 0.92;
            const floatTargetVx = Math.cos(obj.time * 0.03) * 1.5;
            obj.vx += (floatTargetVx - obj.vx) * 0.05;
            obj.angle += (Math.sin(obj.time * 0.025) * 0.08 - obj.angle) * 0.1;
            obj.angularVelocity = 0;
            obj.onGround = false;
          }
          break;

        case 'fish':
          obj.bounceFactor = 0.45;
          if (obj.activity === 'swim') {
            // Swim in the water (middle-height float with horizontal wiggle)
            const targetY = sbHeight / 2 + Math.sin(obj.time * 0.05) * (sbHeight / 6);
            obj.vy += (targetY - obj.y) * 0.04;
            obj.vy *= 0.9;

            const targetVx = obj.direction * 2.2;
            obj.vx += (targetVx - obj.vx) * 0.12;

            // Fish wiggle rotation
            obj.angle = Math.sin(obj.time * 0.25) * 0.15;
            obj.angularVelocity = 0;
            obj.onGround = false;
          } else if (obj.activity === 'splash') {
            obj.vy += GRAVITY;
            if (obj.onGround) {
              // splash jump
              obj.vy = -8.0;
              obj.vx = obj.direction * 3.5;
              obj.angularVelocity = obj.direction * 0.1;
              obj.onGround = false;

              // Spawn splash particles
              for (let k = 0; k < 6; k++) {
                spawnParticle('splash', obj.x, sbHeight - 4, {
                  vx: (Math.random() - 0.5) * 5,
                  vy: -Math.random() * 4 - 2,
                  color: '#2563eb',
                  life: 20
                });
              }
            }
          } else {
            obj.vy += GRAVITY;
          }
          break;

        case 'bird':
          obj.bounceFactor = 0.35;
          if (obj.activity === 'fly') {
            // Flaps up and down
            const targetY = sbHeight / 3 + Math.sin(obj.time * 0.08) * (sbHeight / 8);
            obj.vy += (targetY - obj.y) * 0.03;
            obj.vy *= 0.9;

            const targetVx = obj.direction * 2.6;
            obj.vx += (targetVx - obj.vx) * 0.1;

            // bird tilt
            obj.angle = Math.sin(obj.time * 0.08) * 0.08;
            obj.angularVelocity = 0;
            obj.onGround = false;
          } else if (obj.activity === 'glide') {
            // Slow gliding
            const targetY = sbHeight / 2.5;
            obj.vy += (targetY - obj.y) * 0.01;
            obj.vy *= 0.95;

            const targetVx = obj.direction * 1.5;
            obj.vx += (targetVx - obj.vx) * 0.08;

            obj.angle = obj.direction * 0.05;
            obj.angularVelocity = 0;
            obj.onGround = false;
          } else if (obj.activity === 'peck') {
            obj.vy += GRAVITY;
            if (obj.onGround) {
              obj.vx *= 0.7;
              obj.angularVelocity = 0;
              // Animate head pecking ground: handled in draw via slices
            }
          } else {
            obj.vy += GRAVITY;
          }
          break;

        case 'tree':
          obj.bounceFactor = 0.1;
          obj.vy += GRAVITY;
          if (obj.onGround) {
            obj.vx *= 0.6;
            obj.angularVelocity = 0;
            if (obj.activity === 'sway') {
              obj.angle = Math.sin(obj.time * 0.035) * 0.05; // Base tree sway
            } else if (obj.activity === 'loseLeaves') {
              obj.angle = Math.sin(obj.time * 0.02) * 0.02;
              // Spawn leaf particles
              if (obj.time % 20 === 0) {
                const rx = obj.x + (Math.random() - 0.5) * (obj.width * 0.7);
                const ry = obj.y - obj.height/4 + (Math.random() - 0.5) * (obj.height * 0.2);
                spawnParticle('leaf', rx, ry, {
                  vx: (Math.random() - 0.5) * 0.6,
                  vy: 0.8 + Math.random() * 0.8,
                  size: 3 + Math.random() * 3,
                  color: '#059669',
                  life: 120,
                  rotation: Math.random() * Math.PI * 2,
                  rotSpeed: (Math.random() - 0.5) * 0.03
                });
              }
            } else {
              obj.angle += (0 - obj.angle) * 0.15;
            }
          }
          break;

        case 'house':
          obj.bounceFactor = 0.15;
          obj.vy += GRAVITY;
          if (obj.onGround) {
            obj.vx *= 0.6;
            obj.angularVelocity = 0;
            if (obj.activity === 'shake') {
              // Earthquake tremor jitter
              obj.x += (Math.random() - 0.5) * 2;
              obj.angle = (Math.random() - 0.5) * 0.03;
            } else if (obj.activity === 'lightsOn') {
              obj.angle += (0 - obj.angle) * 0.15;
              // Spawn little glowing sparkles from the windows (center area)
              if (obj.time % 12 === 0) {
                const rx = obj.x + (Math.random() - 0.5) * (obj.width * 0.6);
                const ry = obj.y + (Math.random() - 0.5) * (obj.height * 0.4);
                spawnParticle('splash', rx, ry, {
                  vx: (Math.random() - 0.5) * 1.5,
                  vy: -Math.random() * 1.5,
                  size: 2 + Math.random() * 2,
                  color: '#eab308', // yellow glow spark
                  life: 25
                });
              }
            } else {
              obj.angle += (0 - obj.angle) * 0.15;
            }
          }
          break;

        default:
          obj.vy += GRAVITY;
      }
    }

      // --- Universal Physics updates & wall collisions ---
      obj.vx *= AIR_FRICTION;
      obj.vy *= AIR_FRICTION;
      obj.x += obj.vx;
      obj.y += obj.vy;
      obj.angle += obj.angularVelocity;

      const hw = obj.width / 2;
      const hh = obj.height / 2;

      // Floor
      if (obj.y + hh >= sbHeight) {
        obj.y = sbHeight - hh;
        obj.vy = -obj.vy * obj.bounceFactor;
        obj.vx *= GROUND_FRICTION;
        obj.onGround = true;

        if (Math.abs(obj.vy) < 0.25) {
          obj.vy = 0;
        }
      } else {
        obj.onGround = false;
      }

      // Ceiling (except cloud and web spider which float)
      if (obj.y - hh <= 0 && obj.class !== 'cloud' && obj.activity !== 'web') {
        obj.y = hh;
        obj.vy = -obj.vy * obj.bounceFactor;
      }

      // Left Wall
      if (obj.x - hw <= 0) {
        obj.x = hw;
        obj.vx = -obj.vx * obj.bounceFactor;
        obj.direction = 1;
        if (obj.activity === 'roll') {
          obj.angularVelocity = -obj.angularVelocity;
        }
      }

      // Right Wall
      if (obj.x + hw >= sbWidth) {
        obj.x = sbWidth - hw;
        obj.vx = -obj.vx * obj.bounceFactor;
        obj.direction = -1;
        if (obj.activity === 'roll') {
          obj.angularVelocity = -obj.angularVelocity;
        }
      }
    });
  }

  function drawSandbox() {
    const dpr = window.devicePixelRatio || 1;
    const sbWidth = sbCanvas.width / dpr;
    const sbHeight = sbCanvas.height / dpr;

    // Check if any cloud triggered lightning flash
    let isFlashing = false;
    sandboxObjects.forEach(obj => {
      if (obj.class === 'cloud' && obj.activity === 'thunder' && obj.state === 'flash') {
        isFlashing = true;
        // Turn off flash for next frames
        obj.state = 'active';
      }
    });

    // Draw background
    sbCtx.clearRect(0, 0, sbWidth, sbHeight);
    if (isFlashing) {
      sbCtx.fillStyle = 'rgba(0, 0, 0, 0.08)'; // Flash off-black screen
      sbCtx.fillRect(0, 0, sbWidth, sbHeight);
    }

    sandboxObjects.forEach(obj => {
      sbCtx.save();
      sbCtx.translate(obj.x, obj.y);
      sbCtx.rotate(obj.angle);

      let scaleX = 1;
      let scaleY = 1;

      const baseScale = obj.scaleFactor !== undefined ? obj.scaleFactor : 1.0;
      scaleX *= baseScale;
      scaleY *= baseScale;

      // --- Apply Whole-Body Animations (Living Sticker style, no cutting) ---
      let animRotation = 0;
      let animScaleX = 1;
      let animScaleY = 1;
      let animOffsetX = 0;
      let animOffsetY = 0;
      let pivotY = 0; // 0 is center, obj.height/2 is bottom (for swaying)

      const act = obj.activity;

      if (act === 'walk' || act === 'run' || act === 'prowl' || act === 'scuttle' || act === 'drive') {
        let speed = 0.15;
        let tiltAmp = 0.10;
        let bobAmp = 2.5;

        if (act === 'run') {
          speed = 0.25;
          tiltAmp = 0.18;
          bobAmp = 5;
        } else if (act === 'prowl') {
          speed = 0.08;
          tiltAmp = 0.04;
          bobAmp = 1;
        } else if (act === 'scuttle') {
          speed = 0.35;
          tiltAmp = 0.22;
          bobAmp = 3.5;
        } else if (act === 'drive') {
          speed = 0.2;
          tiltAmp = 0.02; // very flat drive
          bobAmp = 0.8;
        }

        // Rock back and forth
        animRotation = Math.sin(obj.time * speed) * tiltAmp;
        // Bob up and down
        animOffsetY = Math.abs(Math.sin(obj.time * speed * 2)) * -bobAmp;
        // Squash and stretch cycle
        const cycle = Math.sin(obj.time * speed * 2);
        animScaleY = 1 + cycle * 0.05;
        animScaleX = 1 - cycle * 0.03;
      } 
      else if (act === 'sway' || act === 'loseLeaves' || act === 'dropLeaves') {
        // Sway from the base (bottom of the object)
        pivotY = obj.height / 2;
        animRotation = Math.sin(obj.time * 0.04) * 0.15;
        animScaleY = 1 + Math.sin(obj.time * 0.04) * 0.02;
      } 
      else if (act === 'swim' || act === 'splash') {
        // Swim wiggle
        animRotation = Math.sin(obj.time * 0.25) * 0.12;
        animOffsetX = Math.sin(obj.time * 0.25) * 3;
        animScaleX = 1 + Math.sin(obj.time * 0.5) * 0.05;
      } 
      else if (act === 'fly' || act === 'glide' || act === 'web' || act === 'rain') {
        // Wing flap / suspension float: squash/stretch width
        const isGlide = (act === 'glide');
        const speed = isGlide ? 0.08 : 0.25;
        const flapAmp = isGlide ? 0.03 : 0.20;
        
        animScaleX = 1 + Math.sin(obj.time * speed) * flapAmp;
        animScaleY = 1 - Math.sin(obj.time * speed) * (flapAmp * 0.4);
        animOffsetY = Math.sin(obj.time * 0.12) * 5;
      } 
      else if (act === 'yawn') {
        // Slow vertical stretch
        const phase = obj.time % 160;
        if (phase < 80) {
          animScaleY = 1 + (phase / 80) * 0.25;
          animScaleX = 1 - (phase / 80) * 0.10;
          animOffsetY = -(phase / 80) * 4;
        } else if (phase < 100) {
          animScaleY = 1.25;
          animScaleX = 0.90;
          animOffsetY = -4;
        } else {
          const snap = (phase - 100) / 60;
          animScaleY = 1.25 - snap * 0.25;
          animScaleX = 0.90 + snap * 0.10;
          animOffsetY = -4 + snap * 4;
        }
      } 
      else if (act === 'peck' || act === 'pounce') {
        if (act === 'peck') {
          // Bird pecks ground
          pivotY = obj.height / 2;
          const cycle = Math.sin(obj.time * 0.15);
          if (cycle > 0) {
            animRotation = cycle * 0.45; // peck down
          }
        } else {
          // Cat pounce leap
          if (obj.state === 'crouch') {
            animScaleY = 0.75;
            animScaleX = 1.25;
            animOffsetY = obj.height * 0.12;
          } else {
            animScaleY = 1.20;
            animScaleX = 0.85;
            animRotation = obj.direction * 0.15;
          }
        }
      }
      else if (act === 'bloom') {
        // Pivot from bottom center
        pivotY = obj.height / 2;
        // Expand horizontally and vertically, pulsing gently at the end
        const bloomDuration = 90; // 90 frames to fully bloom
        const t = Math.min(bloomDuration, obj.time);
        const progress = t / bloomDuration;
        
        // Start smaller and expand to normal/slightly larger size
        const baseScale = 0.7 + progress * 0.35; // grows from 70% to 105%
        
        // Add a soft breathing/pulsing once fully bloomed
        const pulse = (t === bloomDuration) ? Math.sin(obj.time * 0.05) * 0.03 : 0;
        
        animScaleX = baseScale + pulse;
        animScaleY = baseScale - pulse; // opposite direction for organic feel
      }
      else if (act === 'bounce') {
        // Squash on impact with ground/walls
        if (!obj.onGround && Math.abs(obj.vy) > 1) {
          animScaleY = 1.15;
          animScaleX = 0.85;
        } else if (obj.onGround) {
          animScaleY = 0.80;
          animScaleX = 1.20;
          animOffsetY = obj.height * 0.1;
        }
      }
      else if (act === 'float' || act === 'thunder' || act === 'lightsOn') {
        // Gentle float bobbing, lights glow pulse
        animOffsetY = Math.sin(obj.time * 0.06) * 4;
        animRotation = Math.sin(obj.time * 0.03) * 0.05;
        if (act === 'lightsOn') {
          animScaleX = animScaleY = 1 + Math.sin(obj.time * 0.1) * 0.05;
        }
      }
      else if (act === 'jiggle' || act === 'honk' || act === 'crash' || act === 'shake') {
        // Rapid shake/tremble
        animOffsetX = (Math.random() - 0.5) * 3;
        animOffsetY = (Math.random() - 0.5) * 3;
        animRotation = (Math.random() - 0.5) * 0.08;
      }

      // Draw human waving line indicators on canvas next to sprite
      if (obj.class === 'human' && obj.activity === 'wave' && obj.onGround) {
        sbCtx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        sbCtx.lineWidth = 1;
        // Wavy action indicators
        const waveAngle = Math.sin(obj.time * 0.4) * 0.1;
        sbCtx.beginPath();
        sbCtx.arc(obj.width / 2 + 5, -obj.height / 3, 5, -Math.PI / 3 + waveAngle, Math.PI / 3 + waveAngle);
        sbCtx.stroke();
      }
      // Draw the whole object with the calculated transforms
      sbCtx.save();
      sbCtx.translate(animOffsetX, animOffsetY);
      
      if (pivotY !== 0) {
        // Pivot translation (e.g. rotate from bottom center)
        sbCtx.translate(0, pivotY);
        sbCtx.rotate(animRotation);
        sbCtx.scale(animScaleX * scaleX, animScaleY * scaleY);
        sbCtx.drawImage(obj.canvas, -obj.width / 2, -obj.height, obj.width, obj.height);
      } else {
        // Rotate from center
        sbCtx.rotate(animRotation);
        sbCtx.scale(animScaleX * scaleX, animScaleY * scaleY);
        sbCtx.drawImage(obj.canvas, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
      }

      // Draw yawning cat mouth
      if (obj.class === 'cat' && obj.activity === 'yawn') {
        const phase = obj.time % 160;
        if (phase > 20 && phase < 140) {
          sbCtx.fillStyle = '#000000';
          sbCtx.beginPath();
          sbCtx.arc(0, -obj.height * 0.1, Math.min(obj.width, obj.height) * 0.08, 0, Math.PI * 2);
          sbCtx.fill();
        }
      }
      sbCtx.restore();

      sbCtx.restore();

      // --- Non-Physics Glow Halo (for Pulse/Glow objects: star, moon, sun, rainbow, nebula, aurora) ---
      const npClassNorm2 = (obj.class || '').toLowerCase();
      if (NON_PHYSICS_CLASSES.has(npClassNorm2) && obj.glowPhase !== undefined) {
        const meta2 = PHYSICS_CLASS_META[npClassNorm2] || {};
        const act2 = (meta2.action || '').toLowerCase();
        if (act2.includes('pulse') || act2.includes('glow')) {
          const glowIntensity = 0.3 + Math.abs(Math.sin(obj.glowPhase)) * 0.45;
          const glowRadius = Math.max(obj.width, obj.height) * 0.75 * (obj.scaleFactor || 1.0);
          const glowColor = npClassNorm2 === 'moon' ? '180, 210, 255'
            : npClassNorm2 === 'sun' ? '255, 230, 100'
            : npClassNorm2 === 'rainbow' ? '180, 130, 255'
            : npClassNorm2 === 'aurora' ? '100, 255, 180'
            : npClassNorm2 === 'lightning' ? '200, 220, 255'
            : '255, 248, 150'; // default: warm white-yellow for star/nebula

          sbCtx.save();
          const grad = sbCtx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, glowRadius);
          grad.addColorStop(0, `rgba(${glowColor}, ${glowIntensity})`);
          grad.addColorStop(1, `rgba(${glowColor}, 0)`);
          sbCtx.globalCompositeOperation = 'lighter';
          sbCtx.fillStyle = grad;
          sbCtx.beginPath();
          sbCtx.arc(obj.x, obj.y, glowRadius, 0, Math.PI * 2);
          sbCtx.fill();
          sbCtx.globalCompositeOperation = 'source-over';
          sbCtx.restore();
        }
      }

      // Draw Spider Web line from ceiling
      if (obj.class === 'spider' && obj.activity === 'web') {
        sbCtx.save();
        sbCtx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
        sbCtx.lineWidth = 1.2;
        sbCtx.beginPath();
        sbCtx.moveTo(obj.x, 0);
        sbCtx.lineTo(obj.x, obj.y - obj.height/4);
        sbCtx.stroke();
        sbCtx.restore();
      }

      // Outline selected object
      if (obj === selectedObject) {
        sbCtx.save();
        sbCtx.translate(obj.x, obj.y);
        sbCtx.rotate(obj.angle);
        sbCtx.scale(scaleX, scaleY);

        sbCtx.strokeStyle = '#000000';
        sbCtx.lineWidth = 1;
        sbCtx.setLineDash([4, 4]);
        sbCtx.strokeRect(-obj.width / 2 - 4, -obj.height / 2 - 4, obj.width + 8, obj.height + 8);

        sbCtx.fillStyle = '#000000';
        sbCtx.beginPath();
        sbCtx.arc(0, -obj.height / 2 - 4, 3, 0, Math.PI * 2);
        sbCtx.fill();

        sbCtx.restore();
      }
    });

    // Draw active particle systems
    drawParticles();

    // Position/hide the floating Edit button over the selected object
    if (selectedObject && selectedObject.activity !== 'pulling' && !selectedObject.isDragging) {
      btnEditSketch.classList.remove('hidden');
      
      const left = selectedObject.x + selectedObject.width / 2 - 12;
      const top = selectedObject.y - selectedObject.height / 2 - 12;
      
      btnEditSketch.style.left = `${left}px`;
      btnEditSketch.style.top = `${top}px`;
    } else {
      btnEditSketch.classList.add('hidden');
    }
  }

  // Unified Frame Loop
  function tick() {
    updatePhysics();
    updateParticles();
    drawSandbox();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // --- Sandbox Drag & Drop / Throw ---
  function getSandboxMousePos(e) {
    const rect = sbCanvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / sbZoomLevel,
      y: (e.clientY - rect.top) / sbZoomLevel
    };
  }

  sbCanvas.addEventListener('pointerdown', (e) => {
    const pos = getSandboxMousePos(e);
    let clickedObj = null;

    for (let i = sandboxObjects.length - 1; i >= 0; i--) {
      const obj = sandboxObjects[i];
      const hw = obj.width / 2;
      const hh = obj.height / 2;

      if (pos.x >= obj.x - hw && pos.x <= obj.x + hw &&
          pos.y >= obj.y - hh && pos.y <= obj.y + hh) {
        clickedObj = obj;
        break;
      }
    }

    if (clickedObj) {
      dragObject = clickedObj;
      selectObject(clickedObj);
      dragObject.isDragging = true;
      dragObject.dragOffsetX = pos.x - dragObject.x;
      dragObject.dragOffsetY = pos.y - dragObject.y;
      dragObject.vx = 0;
      dragObject.vy = 0;
      dragObject.angularVelocity = 0;
      dragObject.lastX = dragObject.x;
      dragObject.lastY = dragObject.y;
    } else {
      selectObject(null);
    }
  });

  sbCanvas.addEventListener('pointermove', (e) => {
    const pos = getSandboxMousePos(e);
    mouseX = pos.x;
    mouseY = pos.y;

    if (dragObject && dragObject.isDragging) {
      dragObject.x = pos.x - dragObject.dragOffsetX;
      dragObject.y = pos.y - dragObject.dragOffsetY;

      const hw = dragObject.width / 2;
      const hh = dragObject.height / 2;
      const sbWidth = sbCanvas.width / (window.devicePixelRatio || 1);
      const sbHeight = sbCanvas.height / (window.devicePixelRatio || 1);

      dragObject.x = Math.max(hw, Math.min(sbWidth - hw, dragObject.x));
      dragObject.y = Math.max(hh, Math.min(sbHeight - hh, dragObject.y));

      dragObject.vx = (dragObject.x - dragObject.lastX);
      dragObject.vy = (dragObject.y - dragObject.lastY);

      dragObject.lastX = dragObject.x;
      dragObject.lastY = dragObject.y;
    }
  });

  function releaseDrag() {
    if (dragObject) {
      dragObject.isDragging = false;
      const maxSpeed = 16;
      dragObject.vx = Math.max(-maxSpeed, Math.min(maxSpeed, dragObject.vx));
      dragObject.vy = Math.max(-maxSpeed, Math.min(maxSpeed, dragObject.vy));
      dragObject.angularVelocity = dragObject.vx * 0.02;
      dragObject = null;
      markUnsaved();
    }
  }

  window.addEventListener('pointerup', releaseDrag);
  window.addEventListener('pointercancel', releaseDrag);

  // --- Edit Sketch Pull-back Trigger ---
  function getWorkspaceState() {
    // Use PNG format to preserve transparent drawing backgrounds
    const whiteboardData = wbCanvas.toDataURL('image/png');
    const serializedObjects = sandboxObjects.map(obj => {
      let canvasData = '';
      try {
        // Objects may have transparent bg — use PNG for fidelity but at reduced size
        canvasData = obj.canvas ? obj.canvas.toDataURL('image/png') : '';
      } catch(e) { canvasData = ''; }
      return {
        id: obj.id,
        canvasData: canvasData,
        width: obj.width,
        height: obj.height,
        x: obj.x,
        y: obj.y,
        vx: obj.vx || 0,
        vy: obj.vy || 0,
        angle: obj.angle || 0,
        angularVelocity: obj.angularVelocity || 0,
        class: obj.class,
        confidence: obj.confidence,
        classificationStatus: obj.classificationStatus,
        customLabel: obj.customLabel || '',
        parts: obj.parts || [],
        activity: obj.activity,
        direction: obj.direction || 1,
        state: obj.state || 'active',
        bounceFactor: obj.bounceFactor,
        onGround: obj.onGround || false,
        customActivities: obj.customActivities || []
      };
    });
    
    return {
      whiteboard_data: whiteboardData,
      sandbox_data: JSON.stringify(serializedObjects)
    };
  }

  btnEditSketch.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent canvas click deselect
    if (!selectedObject) return;

    selectedObject.activity = 'pulling';
    selectedObject.time = 0;
    selectedObject.vx = 0;
    selectedObject.vy = 0;
    selectedObject.angularVelocity = 0;
    btnEditSketch.classList.add('hidden');
  });

  // --- Reset Sandbox ---
  const clearChoiceModal = document.getElementById('clear-sandbox-choice-modal');
  const btnClearChoiceSave = document.getElementById('btn-clear-choice-save');
  const btnClearChoiceMove = document.getElementById('btn-clear-choice-move');
  const btnClearChoiceDiscard = document.getElementById('btn-clear-choice-discard');
  const btnClearChoiceCancel = document.getElementById('btn-clear-choice-cancel');

  function clearSandboxNow() {
    sandboxObjects = [];
    sandboxParticles = [];
    selectObject(null);
    sbTip.classList.remove('fade-out');
  }

  btnClearSandbox.addEventListener('click', () => {
    if (sandboxObjects.length === 0) {
      clearSandboxNow();
      return;
    }
    // Show choices modal
    clearChoiceModal.classList.remove('hidden');
  });

  btnClearChoiceSave.addEventListener('click', () => {
    clearChoiceModal.classList.add('hidden');
    // Open save artspace flow
    artspacesModal.classList.remove('hidden');
    artspaceNameInput.value = currentArtspaceName || '';
    artspaceNameInput.focus();
  });

  btnClearChoiceMove.addEventListener('click', () => {
    clearChoiceModal.classList.add('hidden');
    
    // Save whiteboard undo state
    saveState();
    
    // Clear whiteboard
    wbCtx.clearRect(0, 0, wbCanvas.width, wbCanvas.height);
    
    const dpr = window.devicePixelRatio || 1;
    
    // Draw each sandbox object back onto the whiteboard (scale down if height exceeds bounds)
    sandboxObjects.forEach(obj => {
      const maxW = wbCanvas.width / dpr;
      const maxH = wbCanvas.height / dpr;
      
      let drawW = obj.width;
      let drawH = obj.height;
      
      if (drawH > maxH || drawW > maxW) {
        const scale = Math.min(maxW / drawW, maxH / drawH);
        drawW *= scale;
        drawH *= scale;
      }
      
      // Center vertically, keep horizontal X (scaled appropriately), clamp to >= 0
      const targetX = Math.max(0, obj.x - drawW / 2);
      const targetY = Math.max(0, (maxH - drawH) / 2);
      
      wbCtx.drawImage(
        obj.canvas,
        targetX,
        targetY,
        drawW,
        drawH
      );
    });
    
    wbTip.classList.add('fade-out'); // hide tip since we drew something
    
    // Clear sandbox
    clearSandboxNow();
  });

  btnClearChoiceDiscard.addEventListener('click', () => {
    clearChoiceModal.classList.add('hidden');
    clearSandboxNow();
  });

  function setLoggedInUser(username) {
    currentUser = username;
    userDisplay.textContent = username;
    btnAuthTrigger.classList.add('hidden');
    btnArtspacesTrigger.classList.remove('hidden');
    btnNewArtspace.classList.remove('hidden');
    btnLogout.classList.remove('hidden');
    if (btnManualSave) btnManualSave.classList.remove('hidden');
    
    // Set status as saved (but don't delete local draft yet since checkSession runs on startup)
    isWorkspaceSaved = true;
    const saveCheck = document.getElementById('icon-save-check');
    const saveUnsaved = document.getElementById('icon-save-unsaved');
    const saveSpinner = document.getElementById('icon-save-spinner');
    if (saveCheck) saveCheck.classList.remove('hidden');
    if (saveUnsaved) saveUnsaved.classList.add('hidden');
    if (saveSpinner) saveSpinner.classList.add('hidden');
  }

  function setLoggedOut() {
    currentUser = null;
    userDisplay.textContent = 'Guest';
    btnAuthTrigger.classList.remove('hidden');
    btnArtspacesTrigger.classList.add('hidden');
    btnNewArtspace.classList.add('hidden');
    btnLogout.classList.add('hidden');
    if (btnManualSave) btnManualSave.classList.add('hidden');
    
    // Close modals
    authModal.classList.add('hidden');
    artspacesModal.classList.add('hidden');
    customActionModal.classList.add('hidden');
    newArtspaceConfirmModal.classList.add('hidden');
    
    // Clear tracked workspace
    currentArtspaceId = null;
    currentArtspaceName = null;
    updateActiveArtspaceIndicator();
    
    // Set status as saved (but don't delete local draft yet since checkSession runs on startup)
    isWorkspaceSaved = true;
    const saveCheck = document.getElementById('icon-save-check');
    const saveUnsaved = document.getElementById('icon-save-unsaved');
    const saveSpinner = document.getElementById('icon-save-spinner');
    if (saveCheck) saveCheck.classList.remove('hidden');
    if (saveUnsaved) saveUnsaved.classList.add('hidden');
    if (saveSpinner) saveSpinner.classList.add('hidden');
  }

  btnClearChoiceCancel.addEventListener('click', () => {
    clearChoiceModal.classList.add('hidden');
  });

  // --- Help Modal Events ---
  helpToggle.addEventListener('click', () => {
    helpModal.classList.remove('hidden');
  });

  helpClose.addEventListener('click', () => {
    helpModal.classList.add('hidden');
  });

  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) {
      helpModal.classList.add('hidden');
    }
  });

  // --- Authentication & Artspaces Operations ---
  async function checkSession() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated) {
        setLoggedInUser(data.username);
      } else {
        setLoggedOut();
      }
    } catch (err) {
      console.error('Error checking session:', err);
    }
    updateActiveArtspaceIndicator();
    checkAndRestoreDraft();
  }

  // Intercept reload and tab close to show the browser's generic alert if changes are unsaved
  window.addEventListener('beforeunload', (e) => {
    if (!isWorkspaceSaved && (strokes.length > 0 || sandboxObjects.length > 0)) {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Do you want to save your progress before leaving?';
      return 'You have unsaved changes. Do you want to save your progress before leaving?';
    }
  });

  function checkAndRestoreDraft() {
    const hasDraft = localStorage.getItem('scribbox_draft_whiteboard_data');
    if (!hasDraft) return;

    // Load the draft onto the canvases
    const wbData = localStorage.getItem('scribbox_draft_whiteboard_data');
    const sbDataStr = localStorage.getItem('scribbox_draft_sandbox_data');
    const draftId = localStorage.getItem('scribbox_draft_active_id');
    const draftName = localStorage.getItem('scribbox_draft_active_name');

    if (wbData && wbData.startsWith('data:')) {
      const wbImg = new Image();
      wbImg.onload = () => {
        wbCtx.clearRect(0, 0, wbCanvas.width, wbCanvas.height);
        const dpr = window.devicePixelRatio || 1;
        
        const maxW = wbCanvas.width / dpr;
        const maxH = wbCanvas.height / dpr;
        
        const imgAspect = wbImg.width / wbImg.height;
        const canvasAspect = maxW / maxH;
        
        let drawW = maxW;
        let drawH = maxH;
        
        if (imgAspect > canvasAspect) {
          drawH = maxW / imgAspect;
        } else {
          drawW = maxH * imgAspect;
        }
        
        const destX = (maxW - drawW) / 2;
        const destY = (maxH - drawH) / 2;
        
        wbCtx.drawImage(wbImg, destX, destY, drawW, drawH);
        wbTip.classList.add('fade-out');
      };
      wbImg.src = wbData;
    }

    if (sbDataStr) {
      try {
        const list = JSON.parse(sbDataStr);
        sandboxObjects = [];
        list.forEach(sobj => {
          if (!sobj.canvasData) return;
          const objImg = new Image();
          objImg.onload = () => {
            const objCanvas = document.createElement('canvas');
            objCanvas.width = sobj.width * (window.devicePixelRatio || 1);
            objCanvas.height = sobj.height * (window.devicePixelRatio || 1);
            const objCtx = objCanvas.getContext('2d');
            objCtx.drawImage(objImg, 0, 0, objCanvas.width, objCanvas.height);

            const newObj = {
              id: sobj.id || Date.now().toString(),
              canvas: objCanvas,
              slices: sobj.slices || null,
              width: sobj.width,
              height: sobj.height,
              x: sobj.x,
              y: sobj.y,
              vx: sobj.vx || 0,
              vy: sobj.vy || 0,
              angle: sobj.angle || 0,
              angularVelocity: sobj.angularVelocity || 0,
              class: sobj.class || 'unknown',
              confidence: sobj.confidence || 100,
              classificationStatus: sobj.classificationStatus || 'confirmed',
              parts: sobj.parts || [],
              activity: sobj.activity || 'stand',
              time: sobj.time || 0,
              isDragging: false,
              dragOffsetX: 0,
              dragOffsetY: 0,
              lastX: 0,
              lastY: 0,
              bounceFactor: sobj.bounceFactor || DEFAULT_BOUNCE,
              onGround: sobj.onGround || false,
              direction: sobj.direction || 1,
              state: sobj.state || 'active',
              features: sobj.features || null,
              strokes: sobj.strokes || []
            };

            sandboxObjects.push(newObj);
            sbTip.classList.add('fade-out');
          };
          objImg.src = sobj.canvasData;
        });
      } catch (e) {
        console.error('Failed to parse sandbox draft data:', e);
      }
    }

    if (draftId) currentArtspaceId = parseInt(draftId);
    if (draftName) currentArtspaceName = draftName;

    // Show Restored Choice Modal
    const restoredModal = document.getElementById('restored-draft-modal');
    const msgEl = document.getElementById('restored-draft-message');
    
    const btnSaveExisting = document.getElementById('btn-draft-save-existing');
    const btnSaveNew = document.getElementById('btn-draft-save-new');
    const btnLogin = document.getElementById('btn-draft-login');
    
    // Hide all action buttons by default, then show based on auth
    btnSaveExisting.classList.add('hidden');
    btnSaveNew.classList.add('hidden');
    btnLogin.classList.add('hidden');
    
    if (currentUser) {
      // User is logged in
      msgEl.textContent = `We restored your unsaved progress! Would you like to overwrite your active Artspace "${currentArtspaceName || 'Untitled'}", save it as a new Artspace, or continue editing?`;
      if (currentArtspaceId) {
        btnSaveExisting.classList.remove('hidden');
      }
      btnSaveNew.classList.remove('hidden');
    } else {
      // User is a guest
      msgEl.textContent = "We restored your unsaved progress! Please log in if you want to save this progress to your account, or you can continue editing as a guest.";
      btnLogin.classList.remove('hidden');
    }
    
    restoredModal.classList.remove('hidden');
    
    // Mark as unsaved so beforeunload will warn if they try to leave again
    isWorkspaceSaved = false;
  }

  // Restored Draft Modal Event Listeners
  const restoredDraftModal = document.getElementById('restored-draft-modal');
  const btnDraftSaveExisting = document.getElementById('btn-draft-save-existing');
  const btnDraftSaveNew = document.getElementById('btn-draft-save-new');
  const btnDraftLogin = document.getElementById('btn-draft-login');
  const btnDraftContinue = document.getElementById('btn-draft-continue');
  const btnDraftDiscard = document.getElementById('btn-draft-discard');
  const restoredDraftError = document.getElementById('restored-draft-error');
  const restoredDraftSaveInputBlock = document.getElementById('restored-draft-save-input-block');
  const restoredDraftSaveName = document.getElementById('restored-draft-save-name');

  btnDraftSaveExisting.addEventListener('click', async () => {
    restoredDraftError.classList.add('hidden');
    if (!currentArtspaceId) return;
    
    const state = getWorkspaceState();
    try {
      const res = await fetch(`/api/artspaces/${currentArtspaceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whiteboard_data: state.whiteboard_data,
          sandbox_data: state.sandbox_data
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        markSaved();
        restoredDraftModal.classList.add('hidden');
        showCustomAlert('Saved', 'Your progress has been successfully saved to your existing Artspace!');
      } else {
        restoredDraftError.textContent = data.message || 'Failed to save.';
        restoredDraftError.classList.remove('hidden');
      }
    } catch(e) {
      restoredDraftError.textContent = 'Server error. Please try again.';
      restoredDraftError.classList.remove('hidden');
    }
  });

  btnDraftSaveNew.addEventListener('click', async () => {
    restoredDraftError.classList.add('hidden');
    
    if (restoredDraftSaveInputBlock.classList.contains('hidden')) {
      restoredDraftSaveInputBlock.classList.remove('hidden');
      restoredDraftSaveName.focus();
      return;
    }
    
    const name = restoredDraftSaveName.value.trim();
    if (!name) {
      restoredDraftError.textContent = 'Please enter an Artspace name.';
      restoredDraftError.classList.remove('hidden');
      return;
    }
    
    const state = getWorkspaceState();
    try {
      const res = await fetch('/api/artspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          whiteboard_data: state.whiteboard_data,
          sandbox_data: state.sandbox_data
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        currentArtspaceId = data.id;
        currentArtspaceName = name;
        updateActiveArtspaceIndicator();
        markSaved();
        restoredDraftModal.classList.add('hidden');
        showCustomAlert('Saved', 'Your progress has been saved as a new Artspace!');
      } else {
        restoredDraftError.textContent = data.message || 'Failed to save.';
        restoredDraftError.classList.remove('hidden');
      }
    } catch(e) {
      restoredDraftError.textContent = 'Server error. Please try again.';
      restoredDraftError.classList.remove('hidden');
    }
  });

  btnDraftLogin.addEventListener('click', () => {
    restoredDraftModal.classList.add('hidden');
    document.getElementById('auth-modal').classList.remove('hidden');
  });

  btnDraftContinue.addEventListener('click', () => {
    console.log('btnDraftContinue clicked (✏️ Just Keep Editing)');
    restoredDraftModal.classList.add('hidden');
  });

  btnDraftDiscard.addEventListener('click', async () => {
    console.log('btnDraftDiscard clicked (🗑️ Discard Progress)');
    const confirmed = await showCustomConfirm(
      'Warning', 
      "All progress will be cleared and this action can't be undone.", 
      'Proceed', 
      'Cancel'
    );
    if (confirmed) {
      clearDraftFromLocalStorage();
      wbCtx.clearRect(0, 0, wbCanvas.width, wbCanvas.height);
      wbTip.classList.remove('fade-out');
      sandboxObjects = [];
      sandboxParticles = [];
      selectObject(null);
      sbTip.classList.remove('fade-out');
      currentArtspaceId = null;
      currentArtspaceName = null;
      updateActiveArtspaceIndicator();
      markSaved();
      restoredDraftModal.classList.add('hidden');
    }
  });



  // Modal switches
  btnAuthTrigger.addEventListener('click', () => {
    loginError.classList.add('hidden');
    signupError.classList.add('hidden');
    loginForm.reset();
    signupForm.reset();
    
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    
    authModal.classList.remove('hidden');
  });

  authClose.addEventListener('click', () => {
    authModal.classList.add('hidden');
  });

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });

  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) authModal.classList.add('hidden');
  });

  // Login Form Submit
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedInUser(data.username);
        authModal.classList.add('hidden');
        loginForm.reset();
      } else {
        loginError.textContent = data.message || 'Login failed';
        loginError.classList.remove('hidden');
      }
    } catch (err) {
      loginError.textContent = 'Network error occurred';
      loginError.classList.remove('hidden');
    }
  });

  // Signup Form Submit
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupError.classList.add('hidden');
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedInUser(data.username);
        authModal.classList.add('hidden');
        signupForm.reset();
      } else {
        signupError.textContent = data.message || 'Sign up failed';
        signupError.classList.remove('hidden');
      }
    } catch (err) {
      signupError.textContent = 'Network error occurred';
      signupError.classList.remove('hidden');
    }
  });

  // Logout Click
  async function loadArtspaceDetails(spaceId) {
    try {
      const res = await fetch(`/api/artspaces/${spaceId}`);
      const data = await res.json();
      if (!res.ok) {
        showCustomAlert('Error', data.message || 'Failed to load workspace.');
        return;
      }

      // 1. Restore Whiteboard
      if (data.whiteboard_data && data.whiteboard_data.startsWith('data:')) {
        const wbImg = new Image();
        wbImg.onload = () => {
          saveState();
          wbCtx.clearRect(0, 0, wbCanvas.width, wbCanvas.height);
          const dpr = window.devicePixelRatio || 1;
          
          const maxW = wbCanvas.width / dpr;
          const maxH = wbCanvas.height / dpr;
          
          const imgAspect = wbImg.width / wbImg.height;
          const canvasAspect = maxW / maxH;
          
          let drawW = maxW;
          let drawH = maxH;
          
          if (imgAspect > canvasAspect) {
            drawH = maxW / imgAspect;
          } else {
            drawW = maxH * imgAspect;
          }
          
          const destX = (maxW - drawW) / 2;
          const destY = (maxH - drawH) / 2;
          
          wbCtx.drawImage(wbImg, destX, destY, drawW, drawH);
          wbTip.classList.add('fade-out');
        };
        wbImg.src = data.whiteboard_data;
      }

      // 2. Restore Sandbox Objects
      let serializedObjects = [];
      try {
        serializedObjects = JSON.parse(data.sandbox_data || '[]');
      } catch(e) {
        serializedObjects = [];
      }

      sandboxObjects = [];
      sandboxParticles = [];
      selectObject(null);

      if (serializedObjects.length > 0) {
        sbTip.classList.add('fade-out');
      }

      const loadPromises = serializedObjects.map(sobj => {
        return new Promise((resolve) => {
          if (!sobj.canvasData || !sobj.canvasData.startsWith('data:')) {
            // Skip objects with no image data
            resolve(null);
            return;
          }

          const img = new Image();
          img.onload = () => {
            // Store the off-screen canvas at logical pixel size (not scaled by DPR)
            // so rendering and serialization remain consistent
            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = Math.round(sobj.width);
            cropCanvas.height = Math.round(sobj.height);
            const cropCtx = cropCanvas.getContext('2d');
            cropCtx.drawImage(img, 0, 0, cropCanvas.width, cropCanvas.height);

            const canvasSlices = sliceObjectCanvasStandard(cropCanvas, sobj.width, sobj.height);

            const newObj = {
              id: sobj.id || Date.now().toString(),
              canvas: cropCanvas,
              slices: canvasSlices,
              width: sobj.width,
              height: sobj.height,
              x: sobj.x,
              y: sobj.y,
              vx: sobj.vx || 0,
              vy: sobj.vy || 0,
              angle: sobj.angle || 0,
              angularVelocity: sobj.angularVelocity || 0,
              class: sobj.class || 'unknown',
              confidence: sobj.confidence || 50,
              classificationStatus: sobj.classificationStatus || 'confirmed',
              customLabel: sobj.customLabel || '',
              parts: sobj.parts || [],
              activity: sobj.activity || 'stand',
              direction: sobj.direction || 1,
              state: sobj.state || 'active',
              bounceFactor: sobj.bounceFactor || DEFAULT_BOUNCE,
              onGround: sobj.onGround || false,
              customActivities: sobj.customActivities || [],
              time: 0,
              isDragging: false,
              dragOffsetX: 0,
              dragOffsetY: 0,
              lastX: sobj.x,
              lastY: sobj.y,
              scaleFactor: 1.0
            };
            resolve(newObj);
          };
          img.onerror = () => resolve(null);  // Skip on error
          img.src = sobj.canvasData;
        });
      });

      const loadedObjects = await Promise.all(loadPromises);
      // Filter out nulls (failed or missing image data)
      sandboxObjects = loadedObjects.filter(o => o !== null);

      currentArtspaceId = spaceId;
      currentArtspaceName = data.name;
      updateActiveArtspaceIndicator();
      markSaved();

      artspacesModal.classList.add('hidden');
    } catch (err) {
      console.error('Error loading artspace details:', err);
      showCustomAlert('Error', 'An error occurred while loading the workspace.');
    }
  };

  btnLogout.addEventListener('click', async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setLoggedOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  });

  btnSaveArtspace.addEventListener('click', async () => {
    saveArtspaceError.classList.add('hidden');
    saveArtspaceSuccess.classList.add('hidden');
    
    const name = artspaceNameInput.value.trim();
    if (!name) {
      saveArtspaceError.textContent = 'Please enter a name for the Artspace.';
      saveArtspaceError.classList.remove('hidden');
      return;
    }
    
    const workspace = getWorkspaceState();
    try {
      const res = await fetch('/api/artspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          whiteboard_data: workspace.whiteboard_data,
          sandbox_data: workspace.sandbox_data
        })
      });
      const data = await res.json();
      if (res.ok) {
        saveArtspaceSuccess.textContent = data.message || 'Workspace saved successfully!';
        saveArtspaceSuccess.classList.remove('hidden');
        artspaceNameInput.value = '';
        currentArtspaceName = name;
        currentArtspaceId = data.id;
        updateActiveArtspaceIndicator();
        markSaved();
        loadArtspacesList();
      } else {
        saveArtspaceError.textContent = data.message || 'Failed to save workspace.';
        saveArtspaceError.classList.remove('hidden');
      }
    } catch (err) {
      saveArtspaceError.textContent = 'Network error occurred.';
      saveArtspaceError.classList.remove('hidden');
    }
  });

  btnManualSave.addEventListener('click', async (e) => {
    e.stopPropagation();
    if (!currentUser) return;

    if (!currentArtspaceId) {
      // No active artspace loaded, open naming modal
      artspacesModal.classList.remove('hidden');
      artspaceNameInput.value = '';
      artspaceNameInput.focus();
      return;
    }

    // Quick Save to existing Artspace
    markSaving();
    const state = getWorkspaceState();
    
    try {
      const res = await fetch(`/api/artspaces/${currentArtspaceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentArtspaceName,
          whiteboard_data: state.whiteboard_data,
          sandbox_data: state.sandbox_data
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        markSaved();
      } else {
        markUnsaved();
        showCustomAlert('Error', 'Failed to save: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      markUnsaved();
      showCustomAlert('Error', 'Network error occurred while saving.');
    }
  });

  // Load & List saved spaces
  btnArtspacesTrigger.addEventListener('click', () => {
    saveArtspaceError.classList.add('hidden');
    saveArtspaceSuccess.classList.add('hidden');
    artspaceNameInput.value = '';
    artspacesModal.classList.remove('hidden');
    loadArtspacesList();
  });

  artspacesClose.addEventListener('click', () => {
    artspacesModal.classList.add('hidden');
  });

  artspacesModal.addEventListener('click', (e) => {
    if (e.target === artspacesModal) artspacesModal.classList.add('hidden');
  });

  // Create New Artspace Warn Modal Flow
  btnNewArtspace.addEventListener('click', () => {
    newArtspaceConfirmError.classList.add('hidden');
    newArtspaceSaveName.value = '';
    
    if (currentArtspaceName) {
      newArtspaceTitle.textContent = "Save Changes?";
      newArtspaceMessage.textContent = `Do you want to save changes to your "${currentArtspaceName}" Artspace before creating a new one?`;
      newArtspaceSaveInputBlock.classList.add('hidden');
    } else {
      newArtspaceTitle.textContent = "Save Artspace?";
      newArtspaceMessage.textContent = "Do you want to save your current Artspace before creating a new one?";
      newArtspaceSaveInputBlock.classList.remove('hidden');
    }
    
    newArtspaceConfirmModal.classList.remove('hidden');
  });

  btnNewArtspaceCancel.addEventListener('click', () => {
    newArtspaceConfirmModal.classList.add('hidden');
  });

  newArtspaceConfirmModal.addEventListener('click', (e) => {
    if (e.target === newArtspaceConfirmModal) newArtspaceConfirmModal.classList.add('hidden');
  });

  btnNewArtspaceDiscard.addEventListener('click', () => {
    resetArtspaceLocally();
    newArtspaceConfirmModal.classList.add('hidden');
  });

  function resetArtspaceLocally() {
    saveState();
    wbCtx.clearRect(0, 0, wbCanvas.width, wbCanvas.height);
    wbTip.classList.remove('fade-out');
    
    sandboxObjects = [];
    sandboxParticles = [];
    selectObject(null);
    sbTip.classList.remove('fade-out');
    
    currentArtspaceId = null;
    currentArtspaceName = null;
    updateActiveArtspaceIndicator();
    markSaved();
  }

  btnNewArtspaceSave.addEventListener('click', async () => {
    newArtspaceConfirmError.classList.add('hidden');
    
    let name = currentArtspaceName;
    if (!name) {
      name = newArtspaceSaveName.value.trim();
      if (!name) {
        newArtspaceConfirmError.textContent = "Please enter an Artspace name.";
        newArtspaceConfirmError.classList.remove('hidden');
        return;
      }
    }
    
    const workspace = getWorkspaceState();
    try {
      const res = await fetch('/api/artspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          whiteboard_data: workspace.whiteboard_data,
          sandbox_data: workspace.sandbox_data
        })
      });
      const data = await res.json();
      if (res.ok) {
        resetArtspaceLocally();
        newArtspaceConfirmModal.classList.add('hidden');
      } else {
        newArtspaceConfirmError.textContent = data.message || "Failed to save Artspace.";
        newArtspaceConfirmError.classList.remove('hidden');
      }
    } catch (err) {
      newArtspaceConfirmError.textContent = "Network error occurred.";
      newArtspaceConfirmError.classList.remove('hidden');
    }
  });



  // Custom Action Modal Handlers
  customActionClose.addEventListener('click', () => {
    customActionModal.classList.add('hidden');
  });

  customActionModal.addEventListener('click', (e) => {
    if (e.target === customActionModal) customActionModal.classList.add('hidden');
  });

  customActionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedObject) {
      showCustomAlert('Warning', 'No sketch selected to add custom activity to!');
      customActionModal.classList.add('hidden');
      return;
    }
    
    const actionName = document.getElementById('custom-action-name').value.trim();
    const actionStyle = document.getElementById('custom-action-style').value;
    
    if (!actionName) return;
    
    const actionId = actionName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (!selectedObject.customActivities) {
      selectedObject.customActivities = [];
    }
    
    selectedObject.customActivities.push({
      id: actionId,
      label: actionName,
      style: actionStyle
    });
    
    selectedObject.activity = actionId;
    selectedObject.time = 0;
    selectedObject.state = 'active';
    selectedObject.direction = Math.random() > 0.5 ? 1 : -1;
    
    customActionModal.classList.add('hidden');
    renderActivityButtons(selectedObject);
  });

  async function loadArtspacesList() {
    artspacesListContainer.innerHTML = '<p class="empty-list-placeholder">Loading saved Artspaces...</p>';
    try {
      const res = await fetch('/api/artspaces');
      const data = await res.json();
      if (!res.ok) {
        artspacesListContainer.innerHTML = `<p class="empty-list-placeholder">Error: ${data.message}</p>`;
        return;
      }
      
      const list = data.artspaces;
      if (!list || list.length === 0) {
        artspacesListContainer.innerHTML = '<p class="empty-list-placeholder">No saved Artspaces yet. Draw something and save it above!</p>';
        return;
      }
      
      artspacesListContainer.innerHTML = '';
      list.forEach(space => {
        const item = document.createElement('div');
        item.className = 'artspace-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'artspace-item-name';
        nameSpan.textContent = space.name;
        nameSpan.title = space.name;
        item.appendChild(nameSpan);
        
        const actions = document.createElement('div');
        actions.className = 'artspace-item-actions';
        
        const loadBtn = document.createElement('button');
        loadBtn.className = 'btn btn-primary btn-mini';
        loadBtn.textContent = 'Load';
        loadBtn.addEventListener('click', () => loadArtspaceDetails(space.id));
        actions.appendChild(loadBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-secondary btn-mini';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const confirmed = await showCustomConfirm('Warning', `Are you sure you want to delete Artspace "${space.name}"?`);
          if (confirmed) {
            try {
              const delRes = await fetch(`/api/artspaces/${space.id}`, { method: 'DELETE' });
              if (delRes.ok) {
                if (currentArtspaceId === space.id) {
                  currentArtspaceId = null;
                  currentArtspaceName = null;
                  updateActiveArtspaceIndicator();
                }
                loadArtspacesList();
              } else {
                showCustomAlert('Error', 'Failed to delete workspace.');
              }
            } catch (err) {
              console.error('Delete error:', err);
            }
          }
        });
        actions.appendChild(deleteBtn);
        
        item.appendChild(actions);
        artspacesListContainer.appendChild(item);
      });
    } catch (err) {
      console.error('Error loading list:', err);
      artspacesListContainer.innerHTML = '<p class="empty-list-placeholder">Failed to load saved Artspaces.</p>';
    }
  }

  // --- Object Action Mapping Helpers ---

  let OBJECT_ACTION_MAPPING = {};

  async function fetchObjectActionMapping() {
    try {
      const res = await fetch('/object_action_mapping.json');
      if (res.ok) {
        OBJECT_ACTION_MAPPING = await res.json();
        console.log('Object action mapping loaded:', Object.keys(OBJECT_ACTION_MAPPING).length);
      }
    } catch (err) {
      console.error('Failed to load object action mapping:', err);
    }
  }

  // Fetches physics/non-physics classification from the Excel dataset via the server.
  // Populates NON_PHYSICS_CLASSES (Set) and PHYSICS_CLASS_META (object lookup).
  async function fetchPhysicsClasses() {
    try {
      const res = await fetch('/api/physics-classes');
      if (res.ok) {
        const data = await res.json();
        if (data.non_physics && Array.isArray(data.non_physics)) {
          NON_PHYSICS_CLASSES = new Set(data.non_physics.map(s => s.toLowerCase()));
          console.log('Non-physics classes loaded from dataset:', NON_PHYSICS_CLASSES.size);
        }
        if (data.classes_meta) {
          PHYSICS_CLASS_META = data.classes_meta;
          console.log('Physics class metadata loaded:', Object.keys(PHYSICS_CLASS_META).length, 'classes');
        }
      }
    } catch (err) {
      console.warn('Failed to load physics classes from server, using defaults:', err);
    }
  }

  function initObjectActivities(obj) {
    const term = obj.customLabel || obj.class;
    if (!term) {
      obj.customActivities = [];
      obj.activity = 'stand';
      return;
    }
    const key = term.toLowerCase().replace(/[^a-z0-9]/g, '');
    const mapped = OBJECT_ACTION_MAPPING[key];
    if (mapped) {
      const actionName = mapped.action;
      const actionStyle = mapped.style;
      const actionId = actionName.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      obj.customActivities = [{
        id: actionId,
        label: actionName,
        style: actionStyle
      }];
      obj.activity = actionId;
    } else {
      // Check if this is a non-physics object — use its dataset action as default
      const classNorm = (obj.class || '').toLowerCase();
      const nphysMeta = PHYSICS_CLASS_META[classNorm];
      if (NON_PHYSICS_CLASSES.has(classNorm) && nphysMeta) {
        const npAction = (nphysMeta.action || 'Float').toLowerCase();
        let defaultActivity = 'float';
        if (npAction.includes('spin')) defaultActivity = 'spin';
        else if (npAction.includes('pulse') || npAction.includes('glow')) defaultActivity = 'twinkle';
        else if (npAction.includes('fly')) defaultActivity = 'fly';
        obj.customActivities = [];
        obj.activity = defaultActivity;
      } else {
        obj.customActivities = [];
        obj.activity = 'stand';
      }
    }
  }


  // --- Ctrl+Z Undo Key Listener ---
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        undo();
      }
    }
  });

  // --- Workspace Zoom Functionality ---
  const btnWbZoomIn = document.getElementById('btn-wb-zoom-in');
  const btnWbZoomOut = document.getElementById('btn-wb-zoom-out');
  const wbZoomVal = document.getElementById('wb-zoom-val');

  const btnSbZoomIn = document.getElementById('btn-sb-zoom-in');
  const btnSbZoomOut = document.getElementById('btn-sb-zoom-out');
  const sbZoomVal = document.getElementById('sb-zoom-val');

  function updateZoom(canvas, type, zoomIn) {
    const scaleStep = 0.1;
    if (type === 'wb') {
      if (zoomIn) {
        wbZoomLevel = Math.min(2.5, wbZoomLevel + scaleStep);
      } else {
        wbZoomLevel = Math.max(0.5, wbZoomLevel - scaleStep);
      }
      wbZoomVal.textContent = `${Math.round(wbZoomLevel * 100)}%`;
      resizeCanvas(wbCanvas, wbCtx, true);
    } else {
      if (zoomIn) {
        sbZoomLevel = Math.min(2.5, sbZoomLevel + scaleStep);
      } else {
        sbZoomLevel = Math.max(0.5, sbZoomLevel - scaleStep);
      }
      sbZoomVal.textContent = `${Math.round(sbZoomLevel * 100)}%`;
      resizeCanvas(sbCanvas, sbCtx, false);
    }
  }

  btnWbZoomIn.addEventListener('click', () => updateZoom(wbCanvas, 'wb', true));
  btnWbZoomOut.addEventListener('click', () => updateZoom(wbCanvas, 'wb', false));
  btnSbZoomIn.addEventListener('click', () => updateZoom(sbCanvas, 'sb', true));
  btnSbZoomOut.addEventListener('click', () => updateZoom(sbCanvas, 'sb', false));

  // --- Workspace Resizing (Drag Splitter) ---
  const portalDivider = document.querySelector('.portal-divider');
  const whiteboardPanel = document.querySelector('.whiteboard-panel');
  const mainWorkspace = document.querySelector('.main-workspace');
  let isResizing = false;

  portalDivider.addEventListener('mousedown', (e) => {
    isResizing = true;
    portalDivider.classList.add('resizing');
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const rect = mainWorkspace.getBoundingClientRect();
    let newHeight = e.clientY - rect.top - 4; // 4 is half of new divider height (8px)
    
    // Bounds check
    const minH = 120;
    const maxH = rect.height - 120;
    newHeight = Math.max(minH, Math.min(maxH, newHeight));
    
    whiteboardPanel.style.flex = `0 0 ${newHeight}px`;
  });

  window.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      portalDivider.classList.remove('resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Resize canvas buffers once drag is completed to avoid layout race conditions
      resizeCanvas(wbCanvas, wbCtx, true);
      resizeCanvas(sbCanvas, sbCtx, false);
    }
  });

  // Touch support for resizing
  portalDivider.addEventListener('touchstart', (e) => {
    isResizing = true;
    portalDivider.classList.add('resizing');
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('touchmove', (e) => {
    if (!isResizing) return;
    const rect = mainWorkspace.getBoundingClientRect();
    const touchY = e.touches[0].clientY;
    let newHeight = touchY - rect.top - 4; // 4 is half of new divider height (8px)
    
    const minH = 120;
    const maxH = rect.height - 120;
    newHeight = Math.max(minH, Math.min(maxH, newHeight));
    
    whiteboardPanel.style.flex = `0 0 ${newHeight}px`;
  });

  window.addEventListener('touchend', () => {
    if (isResizing) {
      isResizing = false;
      portalDivider.classList.remove('resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Resize canvas buffers once drag is completed
      resizeCanvas(wbCanvas, wbCtx, true);
      resizeCanvas(sbCanvas, sbCtx, false);
    }
  });

  // --- AI Card Draggable within sandbox-panel ---
  const aiCardHeader = aiCard.querySelector('.ai-card-header');
  let isDraggingAiCard = false;
  let aiCardOffsetX = 0;
  let aiCardOffsetY = 0;

  if (aiCardHeader) {
    aiCardHeader.style.cursor = 'move';
    aiCardHeader.style.userSelect = 'none';

    aiCardHeader.addEventListener('pointerdown', (e) => {
      isDraggingAiCard = true;
      const rect = aiCard.getBoundingClientRect();
      aiCardOffsetX = e.clientX - rect.left;
      aiCardOffsetY = e.clientY - rect.top;
      aiCardHeader.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    aiCardHeader.addEventListener('pointermove', (e) => {
      if (!isDraggingAiCard) return;
      const panelEl = document.querySelector('.sandbox-panel');
      if (!panelEl) return;
      const panelRect = panelEl.getBoundingClientRect();

      let left = e.clientX - panelRect.left - aiCardOffsetX;
      let top = e.clientY - panelRect.top - aiCardOffsetY;

      const maxLeft = panelRect.width - aiCard.offsetWidth;
      const maxTop = panelRect.height - aiCard.offsetHeight;

      left = Math.max(0, Math.min(maxLeft, left));
      top = Math.max(0, Math.min(maxTop, top));

      aiCard.style.left = `${left}px`;
      aiCard.style.top = `${top}px`;
      aiCard.style.right = 'auto';
    });

    aiCardHeader.addEventListener('pointerup', (e) => {
      if (isDraggingAiCard) {
        isDraggingAiCard = false;
        aiCardHeader.releasePointerCapture(e.pointerId);
      }
    });

    aiCardHeader.addEventListener('pointercancel', (e) => {
      if (isDraggingAiCard) {
        isDraggingAiCard = false;
        aiCardHeader.releasePointerCapture(e.pointerId);
      }
    });
  }

  // --- Scribbie Chat Support Logic ---
  const scribbieWidget = document.getElementById('scribbie-widget-container');
  const scribbieWelcomeBubble = document.getElementById('scribbie-welcome-bubble');
  const btnCloseWelcome = document.getElementById('btn-close-welcome');
  const scribbieChatTrigger = document.getElementById('scribbie-chat-trigger');
  const scribbieChatWindow = document.getElementById('scribbie-chat-window');
  const btnCloseChat = document.getElementById('btn-close-chat');
  const chatMessagesContainer = document.getElementById('chat-messages-container');
  const chatInputField = document.getElementById('chat-input-field');
  const btnSendChat = document.getElementById('btn-send-chat');

  let chatHistory = [];

  // Scroll to bottom helper
  function scrollToBottom() {
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  }

  // Load chat history from localStorage on initialization
  function loadChatHistory() {
    const savedHistory = localStorage.getItem('scribbox_chat_history');
    if (savedHistory) {
      try {
        chatHistory = JSON.parse(savedHistory);
        // Render the loaded history
        chatHistory.forEach(msg => {
          addMessage(msg.content, msg.role === 'model' || msg.role === 'assistant');
        });
      } catch (e) {
        console.error("Error parsing chat history:", e);
        chatHistory = [];
      }
    }
  }

  // Toggle Welcome message
  if (btnCloseWelcome) {
    btnCloseWelcome.addEventListener('click', (e) => {
      e.stopPropagation();
      if (scribbieWelcomeBubble) {
        scribbieWelcomeBubble.classList.add('hidden');
      }
      localStorage.setItem('scribbox_welcome_closed', 'true');
    });
  }

  // Toggle Chat Window
  if (scribbieChatTrigger) {
    scribbieChatTrigger.addEventListener('click', () => {
      if (scribbieChatWindow) {
        const isHidden = scribbieChatWindow.classList.toggle('hidden');
        localStorage.setItem('scribbox_chat_open', !isHidden ? 'true' : 'false');
      }
      if (scribbieWelcomeBubble) {
        scribbieWelcomeBubble.classList.add('hidden');
        localStorage.setItem('scribbox_welcome_closed', 'true');
      }
      if (scribbieChatWindow && !scribbieChatWindow.classList.contains('hidden')) {
        if (chatInputField) chatInputField.focus();
        scrollToBottom();
      }
    });
  }

  if (btnCloseChat) {
    btnCloseChat.addEventListener('click', () => {
      if (scribbieChatWindow) {
        scribbieChatWindow.classList.add('hidden');
        localStorage.setItem('scribbox_chat_open', 'false');
      }
    });
  }

  // Load saved state and history
  loadChatHistory();

  if (localStorage.getItem('scribbox_welcome_closed') === 'true') {
    if (scribbieWelcomeBubble) {
      scribbieWelcomeBubble.classList.add('hidden');
    }
  }

  if (localStorage.getItem('scribbox_chat_open') === 'true') {
    if (scribbieChatWindow) {
      scribbieChatWindow.classList.remove('hidden');
      // Delay slightly to allow rendering before scrolling
      setTimeout(scrollToBottom, 50);
    }
  }

  // Simple markdown-like formatting helper for chat replies
  function formatMarkdown(text) {
    if (!text) return '';
    // Escape HTML first to prevent XSS
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold (**text**)
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Bullet points (- or * at start of line)
    let lines = html.split('\n');
    let inList = false;
    let formattedLines = [];

    for (let line of lines) {
      let trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          inList = true;
          formattedLines.push('<ul style="margin: 4px 0; padding-left: 20px; list-style-type: disc;">');
        }
        formattedLines.push(`<li style="margin-bottom: 4px;">${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          inList = false;
          formattedLines.push('</ul>');
        }
        // Handle numbered lists (e.g. "1. Step")
        let numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          formattedLines.push(`<div style="margin: 6px 0; font-weight: 500;"><span style="color: var(--accent-color, #2563eb); font-weight: 700;">${numMatch[1]}.</span> ${numMatch[2]}</div>`);
        } else if (trimmed === '') {
          formattedLines.push('<div style="height: 6px;"></div>');
        } else {
          formattedLines.push(`<p style="margin: 4px 0;">${trimmed}</p>`);
        }
      }
    }
    if (inList) {
      formattedLines.push('</ul>');
    }

    return formattedLines.join('');
  }

  // Add Message helper
  function addMessage(text, isBot = false) {
    if (!chatMessagesContainer) return;
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${isBot ? 'bot-message' : 'user-message'}`;
    if (isBot) {
      bubble.innerHTML = formatMarkdown(text);
    } else {
      bubble.textContent = text;
    }
    chatMessagesContainer.appendChild(bubble);
    scrollToBottom();
  }

  // Send Message logic
  async function sendMessage() {
    if (!chatInputField) return;
    const text = chatInputField.value.trim();
    if (!text) return;

    // Add user message to UI
    addMessage(text, false);
    chatInputField.value = '';

    // Show typing indicator
    if (!chatMessagesContainer) return;
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'message-bubble bot-message typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    chatMessagesContainer.appendChild(typingIndicator);
    scrollToBottom();

    // Call support endpoint
    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: chatHistory
        })
      });

      // Remove typing indicator
      typingIndicator.remove();

      if (!response.ok) {
        addMessage("Failed to send message. Server returned an error.", true);
        return;
      }

      // Create bot bubble for streaming text
      const botBubble = document.createElement('div');
      botBubble.className = 'message-bubble bot-message';
      chatMessagesContainer.appendChild(botBubble);
      scrollToBottom();

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let fullResponseText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.substring(6);
            try {
              const dataObj = JSON.parse(dataStr);
              if (dataObj.error) {
                botBubble.textContent = "Error: " + dataObj.error;
                return;
              }
              if (dataObj.chunk) {
                fullResponseText += dataObj.chunk;
                botBubble.innerHTML = formatMarkdown(fullResponseText);
                scrollToBottom();
              }
            } catch (err) {
              console.warn("Failed to parse stream JSON chunk:", err, "Line:", line);
            }
          }
        }
      }

      if (fullResponseText) {
        // Keep track of history
        chatHistory.push({ role: 'user', content: text });
        chatHistory.push({ role: 'model', content: fullResponseText });
        if (chatHistory.length > 20) {
          chatHistory = chatHistory.slice(-20);
        }
        localStorage.setItem('scribbox_chat_history', JSON.stringify(chatHistory));
      } else {
        botBubble.textContent = "Sorry, I encountered an empty response. Please try again.";
      }
    } catch (error) {
      typingIndicator.remove();
      addMessage("Failed to send message. Please check your connection.", true);
      console.error("Support API error:", error);
    }
  }

  // Events
  if (btnSendChat) {
    btnSendChat.addEventListener('click', sendMessage);
  }

  if (chatInputField) {
    chatInputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

});

