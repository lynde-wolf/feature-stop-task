/* ************************************ */
/*       Feature Stop Task        */
/* ************************************ */

/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */

/* Roundtable API */
const script = document.createElement('script');
script.src = 'https://cdn.roundtable.ai/v1/rt.js';
script.dataset.siteKey = 'pub-79mS8k3mSPfyoMLcjICe';
window.addEventListener('load', (event) => {
  console.log('Roundtable API loaded');
  document.body.appendChild(script);
});

/* ---- Covert Bot / Automation Detection ---- */
var botFingerprint = {};

var botFingerprintTrial = {
  type: jsPsychCallFunction,
  func: function () {
    var f = {};
    // Automation tool flags
    f.webdriver = !!navigator.webdriver;
    f.headless = /HeadlessChrome/i.test(navigator.userAgent || '');
    f.phantomjs = !!window._phantom || !!window.callPhantom;
    f.selenium =
      !!window.__selenium_evaluate ||
      !!window.__selenium_unwrapped ||
      !!document.querySelector('[selenium-evaluate]');
    f.puppeteer = !!window.__puppeteer_evaluation_script__;
    f.playwright = !!window.__playwright;

    // Browser environment signals
    f.languagesLen = (navigator.languages || []).length;
    f.pluginsLen = (navigator.plugins || []).length;
    f.hardwareConcurrency = navigator.hardwareConcurrency || 0;
    f.platform = navigator.platform || '';
    f.hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Composite flag: any automation indicator detected
    f.anyAutomationFlag =
      f.webdriver || f.headless || f.phantomjs || f.selenium || f.puppeteer || f.playwright;

    botFingerprint = f;
    jsPsych.data.addProperties({ bot_fingerprint: JSON.stringify(f) });
  },
};

// PARAMETERS FOR DECAYING EXPONENTIAL FUNCTION
// var meanITI = 0.5;

// function sampleFromDecayingExponential() {
//   // Decay parameter of the exponential distribution λ = 1 / μ
//   var lambdaParam = 1 / meanITI;
//   var minValue = 0;
//   var maxValue = 5;

//   /**
//    * Sample one value with replacement
//    * from a decaying exponential distribution within a specified range.
//    *
//    * @param {number} lambdaParam
//    * - The decay parameter lambda of the exponential distribution.
//    * @param {number} minValue - The minimum value of the range.
//    * @param {number} maxValue - The maximum value of the range.
//    * @returns {number}
//    * A single value sampled from the decaying
//    * exponential distribution within the specified range.
//    */
//   var sample;
//   do {
//     sample = -Math.log(Math.random()) / lambdaParam;
//   } while (sample < minValue || sample > maxValue);
//   return sample;
// }

var staticITIms = 500; // 0.5 s fixed ITI

function shuffleArray(array) {
  // Create a copy of the original array
  const shuffledArray = [...array];

  // Perform Fisher-Yates shuffle
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

const getExpStage = () => expStage;

const getCurrAttentionCheckQuestion = () =>
  `${currentAttentionCheckData.Q} <div class=block-text>This screen will advance automatically in 1 minute. Do not press shift.</div>`;

const getCurrAttentionCheckAnswer = () => currentAttentionCheckData.A;

var attentionCheckData = [
  // key presses
  {
    Q: "<p class='block-text'>Press the q key</p>",
    A: 81,
  },
  {
    Q: "<p class='block-text'>Press the p key</p>",
    A: 80,
  },
  {
    Q: "<p class='block-text'>Press the r key</p>",
    A: 82,
  },
  {
    Q: "<p class='block-text'>Press the s key</p>",
    A: 83,
  },
  {
    Q: "<p class='block-text'>Press the t key</p>",
    A: 84,
  },
  {
    Q: "<p class='block-text'>Press the j key</p>",
    A: 74,
  },
  {
    Q: "<p class='block-text'>Press the k key</p>",
    A: 75,
  },
  {
    Q: "<p class='block-text'>Press the e key</p>",
    A: 69,
  },
  {
    Q: "<p class='block-text'>Press the m key</p>",
    A: 77,
  },
  {
    Q: "<p class='block-text'>Press the i key</p>",
    A: 73,
  },
  {
    Q: "<p class='block-text'>Press the u key</p>",
    A: 85,
  },
  // alphabet
  // start
  {
    Q: "<p class='block-text'>Press the key for the first letter of the English alphabet.</p>",
    A: 65,
  },
  {
    Q: "<p class='block-text'>Press the key for the second letter of the English alphabet.</p>",
    A: 66,
  },
  {
    Q: "<p class='block-text'>Press the key for the third letter of the English alphabet.</p>",
    A: 67,
  },
  // end
  {
    Q: "<p class='block-text'>Press the key for the third to last letter of the English alphabet.</p>",
    A: 88,
  },
  {
    Q: "<p class='block-text'>Press the key for the second to last letter of the English alphabet.</p>",
    A: 89,
  },
  {
    Q: "<p class='block-text'>Press the key for the last letter of the English alphabet.</p>",
    A: 90,
  },
];
attentionCheckData = shuffleArray(attentionCheckData);
var currentAttentionCheckData = attentionCheckData.shift();

const getInstructFeedback =
  () => `<div class = centerbox><p class = center-block-text>
    ${feedbackInstructText}
    </p></div>`;

const getFeedback =
  () => `<div class = bigbox><div class = picture_box><p class = block-text>
    ${feedbackText}
    </font></p></div></div>`;

// Trial builders (used by every block: plain, feature, conjunctive).
// Each block practices in two phases — a go-only phase to learn the shape -> key
// binding, then a phase with stop signals — of practicePhaseLen trials each. The
// same builders produce the test set (numTrialsPerBlock trials per test block).

// One fresh 'go' trial object per (shape, color) combo for the given block.
var goCombosForBlock = function (blockCondition) {
  var blockShapes = shapesForBlock(blockCondition);
  var stimColors = stimColorsForBlock(blockCondition);
  var combos = [];
  for (var s = 0; s < blockShapes.length; s++) {
    for (var c = 0; c < stimColors.length; c++) {
      combos.push({
        stim: blockShapes[s],
        color: stimColors[c],
        block_condition: blockCondition,
        correct_response: getResponseForStim(blockShapes[s], stimColors[c]),
        condition: 'go',
      });
    }
  }
  return combos;
};

// n trials drawn as evenly as possible from combos: whole repeats of the full
// combo set, then the remainder sampled with replacement (needed when n is not
// a multiple of the combo count, e.g. 12 trials over the feature block's 8
// (shape,color) combos). Each returned object is a fresh clone so later
// per-trial mutation (assigning stop conditions) can't alias.
var balancedDraw = function (combos, n) {
  var trials = [];
  var whole = Math.floor(n / combos.length);
  for (var r = 0; r < whole; r++) {
    for (var i = 0; i < combos.length; i++) {
      trials.push(Object.assign({}, combos[i]));
    }
  }
  var extra = jsPsych.randomization.sampleWithReplacement(
    combos,
    n - trials.length
  );
  for (var e = 0; e < extra.length; e++) trials.push(Object.assign({}, extra[e]));
  return trials;
};

// Go-only practice round (no stop signals): teaches the shape -> key binding.
var createGoRound = function (n, blockCondition) {
  return shuffleArray(balancedDraw(goCombosForBlock(blockCondition), n));
};

// n trials with stop signals: exactly round(n/3) become stop trials. Used for
// both the with-stop practice phase (n=12) and each test block (n=60).
var createStopRound = function (n, blockCondition) {
  var trials = shuffleArray(balancedDraw(goCombosForBlock(blockCondition), n));
  var nStop = Math.round(n / 3);
  var conds = [];
  for (var i = 0; i < n; i++) conds.push(i < nStop ? 'stop' : 'go');
  conds = shuffleArray(conds);
  for (var j = 0; j < trials.length; j++) trials[j].condition = conds[j];
  return trials;
};

// Geometry shared by renderColoredShape and miniSvg. Returns the inner SVG
// element string for a given shape, sized to a 160x160 viewBox.
var shapeInnerSvg = function (shape, hex) {
  if (shape === 'circle') {
    return '<circle cx="80" cy="80" r="60" fill="' + hex + '"/>';
  }
  if (shape === 'diamond') {
    // Square rotated 45deg, same bounding box as the square stimulus.
    return '<polygon points="80,20 140,80 80,140 20,80" fill="' + hex + '"/>';
  }
  if (shape === 'pentagon') {
    // Regular pentagon, point-up, circumradius 60 (matches circle).
    return (
      '<polygon points="80,20 137.1,61.5 115.3,128.5 44.7,128.5 22.9,61.5" fill="' +
      hex +
      '"/>'
    );
  }
  if (shape === 'triangle') {
    // Equilateral-ish triangle, point up, fills the 120x120 bounding box.
    return '<polygon points="80,20 140,134 20,134" fill="' + hex + '"/>';
  }
  if (shape === 'cross') {
    // Plus/cross, arm width 40, spanning the 120x120 bounding box. Chosen for
    // the conjunctive block instead of a star so the stimulus is not confused
    // with the star-shaped stop signal.
    return (
      '<polygon points="60,20 100,20 100,60 140,60 140,100 100,100 100,140 60,140 60,100 20,100 20,60 60,60" fill="' +
      hex +
      '"/>'
    );
  }
  // --- Plain-block shapes (hourglass, moon, teardrop, heart). Kept visually
  // distinct from the feature-block set (circle/square/diamond/pentagon) so the
  // two conditions never share a shape. ---
  if (shape === 'hourglass') {
    // Two triangles meeting at the centre, within the 120x120 bounding box.
    return (
      '<polygon points="35,25 125,25 80,80" fill="' + hex + '"/>' +
      '<polygon points="35,135 125,135 80,80" fill="' + hex + '"/>'
    );
  }
  if (shape === 'moon') {
    // Waxing crescent: left half of a circle (r=60) closed by a shallower
    // inner arc (rx=40, ry=60) so the two arcs enclose a crescent that opens
    // to the right. The inner ry must equal the vertical half-span (60) or SVG
    // rescales the radius and collapses the crescent to nothing.
    return (
      '<path d="M80,20 A60,60 0 1 0 80,140 A40,60 0 1 1 80,20 Z" fill="' +
      hex +
      '"/>'
    );
  }
  if (shape === 'teardrop') {
    // Point-up teardrop: sharp apex at top, rounded base at bottom.
    return (
      '<path d="M80,20 C130,90 130,140 80,140 C30,140 30,90 80,20 Z" fill="' +
      hex +
      '"/>'
    );
  }
  if (shape === 'heart') {
    // Classic two-lobe heart, point-down, within the 120x120 bounding box.
    return (
      '<path d="M80,45 C70,25 30,25 30,60 C30,95 80,120 80,135 ' +
      'C80,120 130,95 130,60 C130,25 90,25 80,45 Z" fill="' +
      hex +
      '"/>'
    );
  }
  // square — slight corner softening (rx=4).
  return (
    '<rect x="20" y="20" width="120" height="120" rx="4" ry="4" fill="' +
    hex +
    '"/>'
  );
};

var renderColoredShape = function (shape, color) {
  var hex = colorHex[color] || colorHex.neutral;
  return (
    '<svg width="160" height="160" viewBox="0 0 160 160" class="center">' +
    shapeInnerSvg(shape, hex) +
    '</svg>'
  );
};

var getStopStim = function () {
  return "<img class='center' src='" + pathSource + "stopSignal.png'>";
};

var getStim = function () {
  stim = stims.shift();
  shape = stim.stim;
  color = stim.color;
  correct_response = stim.correct_response;
  condition = stim.condition;

  stim = {
    image:
      '<div class = centerbox><div class = cue-text>' +
      renderColoredShape(shape, color) +
      '</div></div>',
    data: {
      stim: shape,
      color: color,
      block_condition: stim.block_condition || currentBlockCondition,
      condition: condition,
      correct_response: condition === 'go' ? correct_response : null,
    },
  };

  stimData = stim.data;
  return stim.image;
};

const getCurrBlockNum = () =>
  getExpStage() === 'practice' ? practiceCount : testCount;

const getSSD = () => SSD;

const getCondition = () => condition;

const getCorrectResponse = () => correct_response;

var appendData = function (data) {
  currentTrial += 1;

  data.stim = stimData.stim;
  data.color = stimData.color;
  data.block_condition = stimData.block_condition;
  data.group_index = group_index;
  data.block_order_idx = blockOrderIdx;
  data.key_config_idx = keyConfigIdx;
  data.pairing_idx = pairingIdx;
  data.correct_response = correct_response;
  data.current_trial = currentTrial;
  data.condition = stimData.condition;
  data.block_num = getExpStage() == 'practice' ? practiceCount : testCount;
  // Practice phase tag ('no_stop' / 'with_stop'; null during the test).
  data.practice_phase =
    getExpStage() === 'practice' ? practicePhase : null;

  if (data.condition == 'stop') {
    data.correct_trial = data.response === null ? 1 : 0;
    if (data.response == null && SSD < maxSSD) {
      SSD += 50;
    } else if (data.response != null && SSD > minSSD) {
      SSD -= 50;
    }
  } else {
    data.correct_trial = data.response === data.correct_response ? 1 : 0;
  }
};

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
const fixationDuration = 500;

// Feature-block shapes.
var shapes = ['circle', 'square', 'diamond', 'pentagon'];

// Plain-block shapes: a DISTINCT set from the feature shapes so the two
// conditions never share a stimulus. Same 4-shape / 2-key-group structure as
// feature, just different icons (rendered as SVG in shapeInnerSvg).
var plainShapes = ['hourglass', 'moon', 'teardrop', 'heart'];

// The three disjoint ways to partition each 4-shape set into two response-key
// groups. Index 0 is the PRIMARY grouping (used for group_index 1, and the
// design's intended grouping): each less-common shape is paired with a more
// common one — feature: circle+diamond / square+pentagon; plain: heart+moon /
// hourglass+teardrop. group[0] -> possibleResponses[0] (comma for key config
// 0), group[1] -> possibleResponses[1] (period). Indices 1-2 are the remaining
// partitions, retained only for the group_index pairing counterbalancing.
// Plain and feature are fully independent block conditions (distinct shape
// sets, no shared shape -> key code), so their pairings need not correspond.
var shapePairings = [
  [['circle', 'diamond'], ['square', 'pentagon']],
  [['circle', 'square'], ['diamond', 'pentagon']],
  [['circle', 'pentagon'], ['square', 'diamond']],
];
var plainShapePairings = [
  [['heart', 'moon'], ['hourglass', 'teardrop']],
  [['hourglass', 'moon'], ['teardrop', 'heart']],
  [['hourglass', 'heart'], ['moon', 'teardrop']],
];

// Dedicated shapes for the conjunctive block, NOT used in plain or feature.
// This isolates the conjunctive AND-binding cost from any proactive
// interference with a previously-learned shape -> key mapping.
var conjShapes = ['triangle', 'cross'];
// pairOf-style mapping for conjunctive: triangle -> group 0, cross -> group 1.
// Combined with color index via XOR inside getKeyMappingForTask, this gives
// the 2-shape x 2-color -> 2-key conjunctive structure.
var conjPairOf = { triangle: 0, cross: 1 };

var possibleResponses;
// keyMap[shape][color] -> key character.
// Rebuilt per block via getKeyMappingForTask(keyConfigIdx, blockCondition).
var keyMap = {};

// All 3 within-subjects block conditions:
//   - plain:       single neutral-color shapes; shape -> key
//   - feature:     violet/orange shapes, color task-irrelevant; shape -> key
//   - conjunctive: pink/blue shapes, color task-relevant; (shape,color) -> key
var blockConditions = ['plain', 'feature', 'conjunctive'];

// 6 permutations of the 3 conditions (full block-order counterbalancing).
var taskOrders = [
  ['plain', 'feature', 'conjunctive'],
  ['plain', 'conjunctive', 'feature'],
  ['feature', 'plain', 'conjunctive'],
  ['feature', 'conjunctive', 'plain'],
  ['conjunctive', 'plain', 'feature'],
  ['conjunctive', 'feature', 'plain'],
];

function getKeyMappingForTask(keyConfigIdx, blockCondition) {
  // keyConfigIdx (0 or 1) counterbalances finger assignment.
  //   keyConfig 0: possibleResponses[0] = index (comma), [1] = middle (period)
  //   keyConfig 1: flipped
  var indexFinger = ['index finger', ',', 'comma key (,)'];
  var middleFinger = ['middle finger', '.', 'period key (.)'];

  if (keyConfigIdx === 0) {
    possibleResponses = [indexFinger, middleFinger];
  } else {
    possibleResponses = [middleFinger, indexFinger];
  }

  // pairing[0] = shapes assigned to possibleResponses[0]'s key in plain/feature.
  // pairing[1] = shapes assigned to possibleResponses[1]'s key in plain/feature.
  var pairing = shapePairings[pairingIdx];
  var pairOf = {};
  for (var p = 0; p < 2; p++) {
    for (var s = 0; s < pairing[p].length; s++) {
      pairOf[pairing[p][s]] = p;
    }
  }

  // Parallel pair-membership map for the plain-block shape set.
  var plainPairing = plainShapePairings[pairingIdx];
  var pairOfPlain = {};
  for (var pp = 0; pp < 2; pp++) {
    for (var sp = 0; sp < plainPairing[pp].length; sp++) {
      pairOfPlain[plainPairing[pp][sp]] = pp;
    }
  }

  // Build keyMap for the current block condition. Each condition uses its own
  // dedicated shape set, so the three maps are fully independent.
  // Plain:       plainShapes, only neutral color exists; pair-membership -> key.
  // Feature:     shapes, shape determines key (color irrelevant); both colors
  //              of a shape share that shape's key.
  // Conjunctive: conjShapes, a SEPARATE shape set; key is pair-membership XOR
  //              color index, where pair-membership is given by conjPairOf.
  keyMap = {};
  for (var i = 0; i < shapes.length; i++) keyMap[shapes[i]] = {};
  for (var ip = 0; ip < plainShapes.length; ip++) keyMap[plainShapes[ip]] = {};
  for (var ic = 0; ic < conjShapes.length; ic++) keyMap[conjShapes[ic]] = {};

  if (blockCondition === 'plain') {
    for (var s2 = 0; s2 < plainShapes.length; s2++) {
      keyMap[plainShapes[s2]][neutralColorKey] =
        possibleResponses[pairOfPlain[plainShapes[s2]]][1];
    }
  } else if (blockCondition === 'feature') {
    for (var s3 = 0; s3 < shapes.length; s3++) {
      for (var c = 0; c < colors.length; c++) {
        keyMap[shapes[s3]][colors[c]] =
          possibleResponses[pairOf[shapes[s3]]][1];
      }
    }
  } else {
    // conjunctive: AND-binding over (shape, color) using the dedicated
    // conjShapes and conjColors sets. pair XOR color.
    for (var s4 = 0; s4 < conjShapes.length; s4++) {
      for (var c2 = 0; c2 < conjColors.length; c2++) {
        var keyIdx = conjPairOf[conjShapes[s4]] ^ c2;
        keyMap[conjShapes[s4]][conjColors[c2]] = possibleResponses[keyIdx][1];
      }
    }
  }
}

var getResponseForStim = function (shape, color) {
  return keyMap[shape][color];
};

var group_index = (function () {
  var gi = typeof window.efVars !== 'undefined' ? window.efVars.group_index : 1;
  return Number.isFinite(gi) ? gi : 1;
})();

// Counterbalance: group_index 1..36 cycles through all 36 unique combos
// (6 block orders x 2 key configs x 3 shape pairings).
// conjShapes are dedicated to the conjunctive block (not in shapePairings),
// so no extra dimension is needed to "pick" them.
var blockOrderIdx = ((group_index - 1) % 6 + 6) % 6;
var keyConfigIdx = Math.floor((group_index - 1) / 6) % 2;
if (keyConfigIdx < 0) keyConfigIdx += 2;
var pairingIdx = Math.floor((group_index - 1) / 12) % 3;
if (pairingIdx < 0) pairingIdx += 3;
var blockOrder = taskOrders[blockOrderIdx];

// Per-block stim set. Each condition uses its own dedicated shape set:
//   plain -> plainShapes (hourglass/moon/teardrop/heart)
//   feature -> shapes (circle/square/diamond/pentagon)
//   conjunctive -> conjShapes (triangle/cross)
// so no shape ever carries a learned shape -> key code across conditions.
function shapesForBlock(blockCondition) {
  if (blockCondition === 'plain') return plainShapes;
  return blockCondition === 'conjunctive' ? conjShapes : shapes;
}

// Per-block stimulus colors. Plain is colorless (neutral); feature uses
// violet/orange; conjunctive uses its own dedicated pink/blue set so the
// color code, like the shape set, is learned fresh.
function stimColorsForBlock(blockCondition) {
  if (blockCondition === 'plain') return [neutralColorKey];
  return blockCondition === 'conjunctive' ? conjColors : colors;
}

// Optional: allow URL/efVars to force a single block condition (for piloting).
var forcedBlockCondition =
  typeof window.efVars !== 'undefined' && window.efVars.task_type
    ? window.efVars.task_type
    : null;
if (
  forcedBlockCondition &&
  blockConditions.indexOf(forcedBlockCondition) !== -1
) {
  blockOrder = [forcedBlockCondition];
}

// Feature-block colors: violet/orange — high contrast in both hue and
// lightness (dark violet vs bright orange), so the pair survives all three
// dichromacy types. Violet is kept dark so it can't be confused with the
// conjunctive block's light blue across blocks.
var colors = ['violet', 'orange'];
// Dedicated colors for the conjunctive block (mirrors conjShapes): pink and
// light blue never appear in the feature block, so neither the shape NOR the
// color code carries over from plain/feature into the conjunctive binding.
// Red/yellow/green are avoided everywhere because of their stop/go
// associations. The 4 hexes were chosen by maximizing the worst-case pairwise
// CIELAB ΔE across normal vision + protanopia/deuteranopia/tritanopia
// (Machado et al., 2009 simulations): min-pair ΔE = 71 (normal), 34 (protan),
// 30 (deutan), 22 (tritan).
var conjColors = ['pink', 'blue'];
var colorHex = {
  violet: '#7A12C9',
  orange: '#FF8A1F',
  pink: '#FF4D9E',
  blue: '#3FE0F0',
  neutral: '#e8e8e8',
};
var neutralColorKey = 'neutral';
var color = null;

// currentBlockCondition is mutated by setupBlock() before each block timeline.
// Initialised to the first block so module-level prompt strings have something
// sensible to render against during script load.
var currentBlockCondition = blockOrder[0];

getKeyMappingForTask(keyConfigIdx, currentBlockCondition);

const choices = [
  possibleResponses[0][1],
  possibleResponses[1][1],
];

var endText = `
  <div class="centerbox">
    <p class="center-block-text">Thanks for completing this task!</p>
    <p class="center-block-text">Press <i>enter</i> to continue.</p>
  </div>
`;

var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 50 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

var expStage = 'practice';
// *: Timing
const stimStimulusDuration = 1000;
const stimTrialDuration = 1500;

// generic task variables
var sumInstructTime = 0; // ms
var instructTimeThresh = 5; // /in seconds
var runAttentionChecks = true;

// Every block practices in two phases of practicePhaseLen trials each:
//   Phase 1 (go only, NO stop signals): learn the shape -> key binding.
//   Then a stop-signal (withhold-your-response) instruction screen.
//   Phase 2 (WITH stop signals, ~1/3 stop): practice stopping.
// Each phase loops (up to practiceThresh times) until its go-accuracy gate
// (practiceAccuracyThresh) is met. 12 divides evenly for plain (4 combos) and
// conjunctive (4 combos); for feature (8 combos) balancedDraw fills the
// non-multiple remainder randomly.
var practicePhaseLen = 12;
// 60 test trials per block (matching experiments 1-3). The test set is built by
// createStopRound, which assigns exactly round(n/3) = 20 stop trials per block
// regardless of the block's (shape,color) combo count -- 60 is not a multiple
// of the feature block's 8 combos, so the balanced-repeat approach can't be
// used there; go trials are near-balanced across stimuli via balancedDraw.
var numTrialsPerBlock = 60;
// numTestBlocks runs of testNode PER block condition. We loop the block
// condition externally (3 conditions x 3 test blocks each = 9 test blocks
// total). 3 blocks x 20 stop = 60 stop trials per condition (matching exp 1-3).
// Within a condition, testNode shows experiment-1-3-style "X out of N blocks of
// trials" progress feedback between blocks.
var numTestBlocks = 3;
// Session-level counter tracking how many block conditions have completed.
var sessionBlockIdx = 0;
// numSessionBlocks set to blockOrder.length in feature_stop_task_init,
// since blockOrder may be a single-element override via efVars.task_type.
var numSessionBlocks = blockConditions.length;

var practiceThresh = 3; // max number of times to repeat practice
var accuracyThresh = 0.8;
var practiceAccuracyThresh = 0.75;

var missedResponseThresh = 0.1;
var rtThresh = 750;

var SSD = 250;
var maxSSD = 1000;
var minSSD = 0;

var currentTrial = 0;
var correct_response = null;
var stimData = null;
var condition = null;

var maxStopCorrect = 0.75;
var minStopCorrect = 0.25;
var maxStopCorrectPractice = 1;
var minStopCorrectPractice = 0;

// shapes and shapePairings are declared earlier (near the keyMap logic) so
// they're defined before the initial getKeyMappingForTask() call.

/* Image paths — resolved dynamically from the URL experiment.js was loaded from,
   so this works under any deploy (local file://, /static/experiments/<folder>/,
   /deployment/repo/<repo>/<sha>/<folder>/, etc.) without hardcoding a folder name. */
var pathSource = (function () {
  var script = document.currentScript;
  if (!script) {
    // Fallback for environments where currentScript isn't set during execution.
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('experiment.js') !== -1) {
        script = scripts[i];
        break;
      }
    }
  }
  return script && script.src
    ? script.src.replace(/[^/]*$/, '') + 'images/'
    : 'images/';
})();

// Shape stimuli are rendered as inline SVG (see renderColoredShape),
// so only the stop-signal star needs preloading.
var images = [pathSource + 'stopSignal.png'];

// Per-block label for a (shape,color) stim.
//   plain:       just the shape name ("circle" / "square")
//   feature:     shape name (color shown but ignored by the rule)
//   conjunctive: "pink triangle", "blue cross", etc.
var labelFor = function (shape, color) {
  if (currentBlockCondition === 'conjunctive') return color + ' ' + shape;
  return shape;
};

// mappingLines / promptText / promptTextList / ruleParagraphs are rebuilt
// per block via buildPromptsForBlock() so the wording reflects the current
// rule set.
var mappingLines = [];
var promptTextList = '';
var promptText = '';
var ruleParagraphs = '';

// Whether prompts/instructions mention the stop-signal star. False during every
// block's go-only practice phase; flipped back to true (with prompts rebuilt)
// right before the stop-signal instructions and stop phase.
var includeStopRule = true;
// Tags each practice trial by phase for analysis: 'no_stop' (go-only phase) or
// 'with_stop' (stop phase). null during the test.
var practicePhase = null;

function buildPromptsForBlock(blockCondition) {
  currentBlockCondition = blockCondition;
  var stimColors = stimColorsForBlock(blockCondition);

  // Group stim labels by the key they map to.
  var byKey = [
    { resp: possibleResponses[0], stims: [] },
    { resp: possibleResponses[1], stims: [] },
  ];
  var blockShapes = shapesForBlock(blockCondition);
  for (var s = 0; s < blockShapes.length; s++) {
    for (var c = 0; c < stimColors.length; c++) {
      var key = getResponseForStim(blockShapes[s], stimColors[c]);
      var bucket = byKey[0].resp[1] === key ? byKey[0] : byKey[1];
      bucket.stims.push(labelFor(blockShapes[s], stimColors[c]));
    }
  }
  // Deduplicate the feature/plain case ("circle" appears twice etc).
  for (var b = 0; b < byKey.length; b++) {
    byKey[b].stims = Array.from(new Set(byKey[b].stims));
  }
  mappingLines = byKey;

  promptTextList =
    '<ul style="text-align:left;">' +
    '<li>' + mappingLines[0].stims.join(' or ') + ': ' +
      mappingLines[0].resp[2] + '</li>' +
    '<li>' + mappingLines[1].stims.join(' or ') + ': ' +
      mappingLines[1].resp[2] + '</li>' +
    (includeStopRule
      ? '<li>Do not respond if a star appears.</li>'
      : '') +
    '</ul>';

  promptText =
    '<div class="prompt_box">' +
    '<p class="center-block-text" style="font-size:16px; line-height:80%;">' +
      mappingLines[0].stims.join(' or ') + ': ' +
      mappingLines[0].resp[2] + '</p>' +
    '<p class="center-block-text" style="font-size:16px; line-height:80%;">' +
      mappingLines[1].stims.join(' or ') + ': ' +
      mappingLines[1].resp[2] + '</p>' +
    (includeStopRule
      ? '<p class="center-block-text" style="font-size:16px; line-height:80%;">Do not respond if a star appears.</p>'
      : '') +
    '</div>';

  var article = blockCondition === 'conjunctive' ? '' : 'a ';
  ruleParagraphs =
    '<p class="block-text">If the shape is ' + article + '<b>' +
      mappingLines[0].stims.join('</b> or <b>') +
      '</b>, press the <b>' + mappingLines[0].resp[2] +
      '</b> with your <b>' + mappingLines[0].resp[0] + '</b>.</p>' +
    '<p class="block-text">If the shape is ' + article + '<b>' +
      mappingLines[1].stims.join('</b> or <b>') +
      '</b>, press the <b>' + mappingLines[1].resp[2] +
      '</b> with your <b>' + mappingLines[1].resp[0] + '</b>.</p>';
}

// Initial build so module-level pageInstruct etc. have non-empty strings.
buildPromptsForBlock(currentBlockCondition);

var speedReminder =
  '<p class = block-text>Try to respond as quickly and accurately as possible.</p>';

// Renders a small visual stimulus -> key mapping panel for use in
// instructions. `size` controls the SVG side length (px).
var renderMappingPanel = function (size) {
  size = size || 90;
  var miniSvg = function (shape, color) {
    var hex = colorHex[color];
    return (
      '<svg width="' +
      size +
      '" height="' +
      size +
      '" viewBox="0 0 160 160">' +
      shapeInnerSvg(shape, hex) +
      '</svg>'
    );
  };

  var stimColors = stimColorsForBlock(currentBlockCondition);
  var panelShapes = shapesForBlock(currentBlockCondition);
  var rowHtml = function (bucket) {
    // List the unique (shape,color) pairs that map to this bucket's key.
    var pairs = [];
    for (var s = 0; s < panelShapes.length; s++) {
      for (var c = 0; c < stimColors.length; c++) {
        if (
          getResponseForStim(panelShapes[s], stimColors[c]) === bucket.resp[1]
        ) {
          pairs.push([panelShapes[s], stimColors[c]]);
        }
      }
    }
    // In feature mode, color is task-irrelevant, but still SHOW both colored
    // exemplars side-by-side so the participant sees what the stimuli look like.
    var stimCells = pairs
      .map(function (p) {
        return (
          '<div style="display:inline-block;margin:0 6px;">' +
          miniSvg(p[0], p[1]) +
          '</div>'
        );
      })
      .join('');
    return (
      '<div style="display:flex;align-items:center;justify-content:center;gap:18px;margin:10px 0;">' +
      '<div>' +
      stimCells +
      '</div>' +
      '<div style="font-size:32px;">&rarr;</div>' +
      '<div style="font-family:monospace;font-size:24px;padding:6px 14px;border:2px solid white;border-radius:6px;">' +
      bucket.resp[2] +
      '</div>' +
      '</div>'
    );
  };

  return (
    '<div style="margin:18px auto;">' +
    rowHtml(mappingLines[0]) +
    rowHtml(mappingLines[1]) +
    '</div>'
  );
};

// Block-specific instructions. Rebuilt by setupBlock() before each block;
// instructionsBlock holds the same array reference and reads contents at
// trial start, so in-place mutation refreshes the displayed pages.
var pageInstruct = [];

// Per-block intro copy (varies by condition).
function buildPageInstruct(blockCondition, blockIdx, totalBlocks) {
  var blockHeading =
    '<p class="block-text"><b>Block ' + (blockIdx + 1) + ' of ' +
    totalBlocks + '</b></p>';

  var ruleDescription;
  if (blockCondition === 'plain') {
    ruleDescription =
      'In this block, shapes will appear in a neutral color. ' +
      'Respond based on the <b>shape</b>.';
  } else if (blockCondition === 'feature') {
    ruleDescription =
      'In this block, shapes will appear in one of two colors. ' +
      '<b>Only the shape matters</b>: ignore the color.';
  } else {
    ruleDescription =
      'In this block, shapes will appear in one of two colors. ' +
      '<p class="block-text">Both the <b>color</b> and the <b>shape</b> determine the correct response.</p>';
  }

  var rulePage =
    '<div class="centerbox">' +
    blockHeading +
    '<p class="block-text">Place your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>' +
    '<p class="block-text">During this task, on each trial you will see shapes appear on the screen one at a time.</p>' +
    '<p class="block-text">' + ruleDescription + '</p>' +
    ruleParagraphs +
    renderMappingPanel(90) +
    '<p class="block-text">You should respond as quickly and accurately as possible.</p>' +
    '</div>';

  // No star page up front: every block starts with a go-only practice phase to
  // learn the shape -> key binding. The withhold-your-response instructions are
  // shown afterwards (stopInstructNode), before the stop phase.
  var pages = [
    rulePage,
    '<div class="centerbox">' +
      '<p class="block-text">We\'ll start with a practice round to learn the rules for this block.</p>' +
      '<p class="block-text">During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>' +
      speedReminder +
      '</div>',
  ];

  // Mutate pageInstruct in place so the instructionsBlock's captured
  // reference picks up the new content.
  pageInstruct.length = 0;
  for (var i = 0; i < pages.length; i++) pageInstruct.push(pages[i]);
}

// setupBlock is called once before each block timeline. It updates all
// per-block globals so the existing practice/test nodes render the right
// stimuli, key mappings, and prompts for the current block condition.
function setupBlock(blockCondition, blockIdx, totalBlocks) {
  currentBlockCondition = blockCondition;
  getKeyMappingForTask(keyConfigIdx, blockCondition);
  // Every block starts with a go-only practice phase, so suppress the star line
  // in prompts/instructions until stopPhaseSetup flips it back on.
  includeStopRule = false;
  practicePhase = 'no_stop';
  buildPromptsForBlock(blockCondition);
  buildPageInstruct(blockCondition, blockIdx, totalBlocks);

  // Reset per-block state so the practice phases / testNode start fresh.
  practiceCount = 0;
  testCount = 0;
  currentTrial = 0;
  SSD = 250;
  expStage = 'practice';
  sumInstructTime = 0;

  // Blocks 2+ would otherwise reopen with the stale "Done with instructions"
  // text left over from the previous block's instruction loop.
  if (blockIdx > 0) {
    feedbackInstructText =
      '<p class="center-block-text">Press <i>enter</i> to view the instructions for the next block.</p>';
  }

  // Pre-fill the go-only phase-1 stims; the stop phase reseeds via
  // stopPhaseSetup, and testNode reseeds test stims via its loop_function.
  stims = createGoRound(practicePhaseLen, blockCondition);

  // Reset the feedbackText shown by feedbackBlock at the start of practice.
  feedbackText =
    '<div class="centerbox"><p class="center-block-text">' +
    'Press <i>enter</i> to begin practice for block ' + (blockIdx + 1) +
    ' of ' + totalBlocks + '.</p></div>';
}

/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */
var attentionCheckBlock = {
  type: jsPsychAttentionCheckRdoc,
  data: {
    trial_id: 'test_attention_check',
    trial_duration: 60000,
    timing_post_trial: 1000,
    exp_stage: 'test',
  },
  question: getCurrAttentionCheckQuestion,
  key_answer: getCurrAttentionCheckAnswer,
  response_ends_trial: true,
  timing_post_trial: 1000,
  trial_duration: 60000,
  on_finish: (data) => (data['block_num'] = testCount),
};

var attentionNode = {
  timeline: [attentionCheckBlock],
  conditional_function: function () {
    return runAttentionChecks;
  },
};

var feedbackInstructBlock = {
  type: jsPsychHtmlKeyboardResponse,
  choices: ['Enter'],
  data: {
    trial_id: 'instruction_feedback',
    trial_duration: 180000,
  },
  stimulus: getInstructFeedback,
  trial_duration: 180000,
};

var instructionsBlock = {
  type: jsPsychInstructions,
  data: {
    trial_id: 'instructions',
    trial_duration: null,
    stimulus: pageInstruct,
  },
  pages: pageInstruct,
  allow_keys: false,
  show_clickable_nav: true,
};

var instructionNode = {
  timeline: [feedbackInstructBlock, instructionsBlock],
  loop_function: function (data) {
    for (i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == 'instructions' &&
        data.trials[i].rt != null
      ) {
        sumInstructTime += data.trials[i].rt;
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedbackInstructText =
        '<p class=block-text>Read through instructions too quickly. Please take your time and make sure you understand the instructions.</p><p class=block-text>Press <i>enter</i> to continue.</p>';
      return true;
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedbackInstructText =
        '<p class=block-text>Done with instructions. Press <i>enter</i> to continue.</p>';
      return false;
    }
  },
};

var fixationBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  choices: ['NO_KEYS'],
  data: {
    trial_id: 'test_fixation',
    trial_duration: fixationDuration,
    stimulus_duration: fixationDuration,
    exp_stage: 'test',
  },
  stimulus_duration: fixationDuration, // 500
  trial_duration: fixationDuration, // 500
  on_finish: (data) => (data['block_num'] = testCount),
};

var practiceFixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  choices: ['NO_KEYS'],
  data: {
    trial_id: 'practice_fixation',
    trial_duration: 500,
    stimulus_duration: 500,
    exp_stage: 'practice',
  },
  stimulus_duration: 500, // 500
  trial_duration: 500, // 500
  prompt: function () { return promptText; },
  on_finish: (data) => (data['block_num'] = practiceCount),
};

var feedbackText =
  '<div class = centerbox><p class = center-block-text>Press <i>enter</i> to begin practice.</p></div>';
var feedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_feedback`,
      exp_stage: stage,
      trial_duration: 60000,
      block_num: stage === 'practice' ? practiceCount : testCount,
    };
  },
  stimulus: getFeedback,
  trial_duration: 60000,
  choices: ['Enter'],
  response_ends_trial: true,
};

// var ITIms = null;

// *** ITI *** //
var ITIBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: ['NO_KEYS'],
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_ITI`,
      // ITIParams: {
      //   min: 0,
      //   max: 5,
      //   mean: 0.5,
      // },
      block_num: stage === 'practice' ? practiceCount : testCount,
      exp_stage: stage,
    };
  },
  // trial_duration: function () {
  //   ITIms = sampleFromDecayingExponential();
  //   return ITIms * 1000;
  // },
  trial_duration: staticITIms,
  prompt: function () {
    return getExpStage() === 'practice' ? promptText : '';
  },
  on_finish: function (data) {
    // data['trial_duration'] = ITIms * 1000;
    // data['stimulus_duration'] = ITIms * 1000;
    data['trial_duration'] = staticITIms;
    data['stimulus_duration'] = staticITIms;
  },
};

/** ******************************************/
/*				Set up nodes				*/
/** ******************************************/

// Per-trial practice nodes. Defined once and pushed by reference into each
// practice slot; jsPsych re-executes the same node definition fresh each time it
// appears in a timeline, so a single shared reference is safe.
var practiceTrial = {
  type: jsPoldracklabStopSignal,
  stimulus: getStim,
  SS_stimulus: getStopStim,
  SS_trial_type: getCondition,
  data: {
    trial_id: 'practice_trial',
    exp_stage: 'practice',
    trial_duration: stimTrialDuration,
    stimulus_duration: stimStimulusDuration,
  },
  choices: choices,
  correct_choice: getCorrectResponse,
  stimulus_duration: stimStimulusDuration, // 1000
  trial_duration: stimTrialDuration, // 1500
  response_ends_trial: false,
  SSD: getSSD,
  SS_duration: 500, // 500
  post_trial_gap: 0,
  on_finish: function (data) {
    appendData(data);
  },
  prompt: function () { return promptText; },
};

var practiceFeedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: function () {
    return {
      exp_stage: 'practice',
      trial_id: 'practice_feedback',
      trial_duration: 500,
      stimulus_duration: 500,
      block_num: practiceCount,
    };
  },
  choices: ['NO_KEYS'],
  stimulus: function () {
    var last = jsPsych.data.get().last(1).trials[0];
    if (last.condition == 'stop') {
      if (last.response === null) {
        return (
          '<div class=center-box><div class=center-text><font size = 20>Correct!</font></div></div>' +
          promptText
        );
      } else {
        return (
          '<div class=center-box><div class=center-text><font size = 20>There was a star</font></div></div>' +
          promptText
        );
      }
    } else {
      if (last.response == null) {
        return (
          '<div class=center-box><div class=center-text><font size = 20>Respond Faster!</font></div></div>' +
          promptText
        );
      } else if (last.response === last.correct_response) {
        return (
          '<div class=center-box><div class=center-text><font size = 20>Correct!</font></div></div>' +
          promptText
        );
      } else {
        return (
          '<div class=center-box><div class=center-text><font size = 20>Incorrect</font></div></div>' +
          promptText
        );
      }
    }
  },
  post_trial_gap: 0,
  stimulus_duration: 500, // 500
  trial_duration: 500, // 500
  response_ends_trial: false,
  prompt: function () { return promptText; },
};

// Build an n-trial practice timeline: fixation -> stimulus -> feedback -> ITI.
function buildPracticeTimeline(nTrials) {
  var trials = [];
  for (var i = 0; i < nTrials; i++) {
    trials.push(practiceFixation, practiceTrial, practiceFeedbackBlock, ITIBlock);
  }
  return trials;
}

// One practicePhaseLen-trial timeline, reused for both the go-only and the
// with-stop practice phase of every block.
var practicePhaseTrials = buildPracticeTimeline(practicePhaseLen);

var practiceCount = 0;
// Loop-function factory for the two practice phases. `phase` is 'go' (go-only:
// gates on practiceAccuracyThresh, then falls through to the stop-signal
// instructions) or 'stop' (with stop signals: then seeds the test). Both phases
// gate on practiceAccuracyThresh. On a repeat each phase reseeds its own round type.
// practiceCount is reset to 0 at the start of each phase (setupBlock for go,
// stopPhaseSetup for stop), so each phase gets its own up-to-practiceThresh cap.
var makePracticeLoop = function (phase) {
  return function (data) {
    practiceCount += 1;
    currentTrial = 0;

    // go trials
    var goLength = 0;
    var sumGoRT = 0;
    var numGoResponses = 0;
    var sumGoCorrect = 0;
    // stop trials
    var stopLength = 0;
    var numStopResponses = 0;

    for (i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].condition == 'go' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        goLength += 1;
        if (data.trials[i].rt != null) {
          numGoResponses += 1;
          sumGoRT += data.trials[i].rt;
          if (data.trials[i].response == data.trials[i].correct_response) {
            sumGoCorrect += 1;
          }
        }
      } else if (
        data.trials[i].condition == 'stop' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        stopLength += 1;
        if (data.trials[i].rt != null) {
          numStopResponses += 1;
        }
      }
    }

    var avgRT = sumGoRT / numGoResponses;
    var missedResponses = (goLength - numGoResponses) / goLength;
    var aveShapeRespondCorrect = sumGoCorrect / goLength;
    var stopSignalRespond = numStopResponses / stopLength;

    // Both phases gate on the same go-accuracy bar (practiceAccuracyThresh).
    var accThresh = practiceAccuracyThresh;

    if (
      practiceCount == practiceThresh ||
      aveShapeRespondCorrect > accThresh
    ) {
      // Go phase passed: fall through (return false) to the stop-signal
      // instructions and stop phase; no test seeding here.
      if (phase === 'stop') {
        feedbackText = `
        <div class="centerbox">
          <p class="block-text">We will now begin the test portion.</p>
          <p class="block-text">Keep your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
          <p class="block-text">Press <i>enter</i> to continue.</p>
        </div>`;

        expStage = 'test';
        stims = createStopRound(numTrialsPerBlock, currentBlockCondition);
      }
      return false;
    } else {
      feedbackText =
        '<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 1 minute.</p>';

      if (aveShapeRespondCorrect <= accThresh) {
        feedbackText += `
        <p class="block-text">Your accuracy is low. Remember:</p>
        ${promptTextList}` + renderMappingPanel(90);
      }

      if (avgRT > rtThresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.</p>
        ${speedReminder}`;
      }

      if (missedResponses > missedResponseThresh) {
        feedbackText += `
          <p class="block-text">We have detected a number of trials that required a response, where no response was made. Please ensure that you are responding quickly and accurately to the shapes.</p>`;
      }

      // Stop-signal reminders only apply to the stop phase.
      if (phase === 'stop' && stopSignalRespond === maxStopCorrectPractice) {
        feedbackText += `
        <p class="block-text">You have not been stopping your response when stars are present.</p>
        <p class="block-text">Please try your best to stop your response if you see a star.</p>`;
      }

      if (phase === 'stop' && stopSignalRespond === minStopCorrectPractice) {
        feedbackText += `
        <p class="block-text">Please do not slow down and wait for the star to appear. Respond as quickly and accurately as possible when a star does not appear.</p>`;
      }

      feedbackText +=
        `<p class="block-text">We are now going to repeat the practice round.</p>` +
        `<p class="block-text">Press <i>enter</i> to begin.</p></div>`;

      stims =
        phase === 'stop'
          ? createStopRound(practicePhaseLen, currentBlockCondition)
          : createGoRound(practicePhaseLen, currentBlockCondition);
      return true;
    }
  };
};

// Phase 1 (every block): go-only practice to learn the shape -> key binding.
// Stims seeded by setupBlock. Loops until accuracy or practiceThresh rounds.
var goPhaseNode = {
  timeline: [feedbackBlock].concat(practicePhaseTrials),
  loop_function: makePracticeLoop('go'),
};

// Between phases: turn the star rule back on, rebuild prompts, reset the loop
// counter, and seed the first stop-phase round.
var stopPhaseSetup = {
  type: jsPsychCallFunction,
  func: function () {
    includeStopRule = true;
    practicePhase = 'with_stop';
    practiceCount = 0;
    buildPromptsForBlock(currentBlockCondition);
    stims = createStopRound(practicePhaseLen, currentBlockCondition);
    feedbackText =
      '<div class="centerbox">' +
      '<p class="center-block-text">Practice will now include star trials.</p>' +
      '<p class="center-block-text">Press <i>enter</i> to begin.</p>' +
      '</div>';
  },
};

// Stop-signal (withhold-your-response) instructions, shown after the go-only
// phase and before the stop phase.
var stopInstructNode = {
  type: jsPsychInstructions,
  data: {
    trial_id: 'instructions',
    trial_duration: null,
  },
  pages: [
    '<div class="centerbox">' +
      '<p class="block-text">From now on, on some trials a star will appear around the shape, with or shortly after the shape appears.</p>' +
      '<p class="block-text">If you see the star, please try your best to <b>withhold your response</b> on that trial.</p>' +
      '<p class="block-text">If the star appears and you try your best to withhold your response, you will find that you will be able to stop sometimes, but not always.</p>' +
      '<p class="block-text">Please <b>do not</b> slow down your responses in order to wait for the star. It is equally important to respond quickly on trials without the star as it is to stop on trials with the star.</p>' +
      '<p class="block-text">The next practice round will include star trials.</p>' +
      '</div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
};

// Phase 2 (every block): practice WITH stop signals. Repeats until the
// go-accuracy bar (practiceAccuracyThresh) or practiceThresh (3) rounds.
var stopPhaseNode = {
  timeline: [feedbackBlock].concat(practicePhaseTrials),
  loop_function: makePracticeLoop('stop'),
};

var testTrials = [];
testTrials.push(attentionNode);
for (i = 0; i < numTrialsPerBlock; i++) {
  var testTrial = {
    type: jsPoldracklabStopSignal,
    stimulus: getStim,
    SS_stimulus: getStopStim,
    SS_trial_type: getCondition,
    data: {
      trial_id: 'test_trial',
      exp_stage: 'test',
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
    },
    choices: choices,
    correct_choice: getCorrectResponse,
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    timing_duration: 1500,
    response_ends_trial: false,
    SSD: getSSD,
    SS_duration: 500, // 500
    on_finish: function (data) {
      appendData(data);
    },
    post_trial_gap: 0,
  };
  testTrials.push(fixationBlock, testTrial, ITIBlock);
}

var testCount = 0;
var testNode = {
  timeline: [feedbackBlock].concat(testTrials),
  loop_function: function (data) {
    currentTrial = 0;
    testCount += 1;

    var sumGoRT = 0;
    var sumGoCorrect = 0;
    var numGoResponses = 0;
    var numStopResponses = 0;
    var goLength = 0;
    var stopLength = 0;

    for (i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].condition == 'go' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        goLength += 1;
        if (data.trials[i].rt != null) {
          numGoResponses += 1;
          sumGoRT += data.trials[i].rt;
          if (data.trials[i].response == data.trials[i].correct_response) {
            sumGoCorrect += 1;
          }
        }
      } else if (
        data.trials[i].condition == 'stop' &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        stopLength += 1;
        if (data.trials[i].rt != null) {
          numStopResponses += 1;
        }
      }
    }

    var avgRT = sumGoRT / numGoResponses;
    var missedResponses = (goLength - numGoResponses) / goLength;
    var aveShapeRespondCorrect = sumGoCorrect / goLength;
    var stopSignalRespond = numStopResponses / stopLength;

    currentAttentionCheckData = attentionCheckData.shift(); // Shift the first object from the array

    if (testCount == numTestBlocks) {
      // Each testNode invocation runs one block condition. The session
      // wraps a counter `sessionBlockIdx` (1-indexed within the loop body
      // here, since this fires after block completion).
      var blocksDone = sessionBlockIdx + 1;
      if (blocksDone >= numSessionBlocks) {
        feedbackText = `<div class=centerbox>
          <p class=block-text>Done with this task.</p>
          <p class=centerbox>Press <i>enter</i> to continue.</p>
          </div>`;
      } else {
        // Between-condition feedback (last test block of a condition, more
        // conditions remain): carries the same accuracy/RT/missed/stop warnings
        // as experiment 3's between-block feedback. renderMappingPanel still
        // reflects the block that just finished (setupBlock for the next
        // condition runs after the trailing feedbackBlock displays this text).
        feedbackText =
          '<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 1 minute.</p>';

        feedbackText += `<p class="block-text">You have completed block ${blocksDone} of ${numSessionBlocks}.</p>`;

        if (aveShapeRespondCorrect < accuracyThresh) {
          feedbackText += `
          <p class="block-text">Your accuracy is low. Remember:</p>
          ${promptTextList}` + renderMappingPanel(90);
        }

        if (avgRT > rtThresh) {
          feedbackText += `
          <p class="block-text">You have been responding too slowly.</p>
          ${speedReminder}`;
        }

        if (missedResponses > missedResponseThresh) {
          feedbackText += `
            <p class="block-text">We have detected a number of trials that required a response, where no response was made. Please ensure that you are responding quickly and accurately to the shapes.</p>`;
        }

        if (stopSignalRespond >= maxStopCorrect) {
          feedbackText += `
          <p class="block-text">You have not been stopping your response when stars are present.</p>
          <p class="block-text">Please try your best to stop your response if you see a star.</p>`;
        }

        if (stopSignalRespond <= minStopCorrect) {
          feedbackText += `
          <p class="block-text">Please do not slow down and wait for the star to appear. Respond as quickly and accurately as possible when a star does not appear.</p>`;
        }

        feedbackText +=
          '<p class="block-text">The next block has a <b>different rule</b>; ' +
            'you\'ll see new instructions and a short practice round before it starts.</p>' +
          '<p class="block-text">Press <i>enter</i> to continue.</p>' +
          '</div>';
      }

      return false;
    } else {
      feedbackText =
        '<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 1 minute.</p>';

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      if (aveShapeRespondCorrect < accuracyThresh) {
        feedbackText += `
        <p class="block-text">Your accuracy is low. Remember:</p>
        ${promptTextList}` + renderMappingPanel(90);
      }

      if (avgRT > rtThresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.</p>
        ${speedReminder}`;
      }

      if (missedResponses > missedResponseThresh) {
        feedbackText += `
          <p class="block-text">We have detected a number of trials that required a response, where no response was made. Please ensure that you are responding quickly and accurately to the shapes.</p>`;
      }

      if (stopSignalRespond >= maxStopCorrect) {
        feedbackText += `
        <p class="block-text">You have not been stopping your response when stars are present.</p>
        <p class="block-text">Please try your best to stop your response if you see a star.</p>`;
      }

      if (stopSignalRespond <= minStopCorrect) {
        feedbackText += `
        <p class="block-text">Please do not slow down and wait for the star to appear. Respond as quickly and accurately as possible when a star does not appear.</p>`;
      }

      feedbackText +=
        '<p class=block-text>Press <i>enter</i> to continue.</p>' + '</div>';

      stims = createStopRound(numTrialsPerBlock, currentBlockCondition);
      return true;
    }
  },
  on_timeline_finish: function () {
    if (typeof window.dataSync === 'function') window.dataSync();
  },
};

var postTaskQuestion =
  'Do you have any comments, concerns, or issues pertaining to this task?';

var postTaskBlock = {
  type: jsPsychSurveyText,
  questions: [
    {
      prompt: `<h1 class=block-text>${postTaskQuestion}</h1>`,
      name: postTaskQuestion,
      required: false,
      rows: 20,
      columns: 80,
    },
  ],
  response_ends_trial: true,
  data: {
    trial_id: 'post_task_feedback',
  },
  on_finish: function (data) {
    data.question = postTaskQuestion;
    data.response = data.response[postTaskQuestion];
  },
};

var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
};
var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var expID = 'feature_stop_task';

var endBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'end',
    exp_id: expID,
    trial_duration: 180000,
  },
  trial_duration: 180000,
  stimulus: endText,
  choices: ['Enter'],
};

var feature_stop_task_experiment = [];
var feature_stop_task_init = () => {
  jsPsych.pluginAPI.preloadImages(images);

  // blockOrder may be overridden to a single condition by ?task_type=...
  // (useful for piloting). Update numSessionBlocks accordingly.
  numSessionBlocks = blockOrder.length;

  // Initial seed; will be overwritten by setupBlock() before each block.
  stims = createGoRound(practicePhaseLen, blockOrder[0]);

  // Persist counterbalancing info on every saved trial. The plain and feature
  // blocks use independent shape sets/pairings, so each grouping is recorded
  // separately (feature_shape_pairing / plain_shape_pairing). shape_pairing is
  // kept as an alias of the feature pairing for backward compatibility.
  var pairingStr = function (pairing) {
    return pairing.map(function (g) { return g.join('+'); }).join('_vs_');
  };
  jsPsych.data.addProperties({
    group_index: group_index,
    block_order_idx: blockOrderIdx,
    key_config_idx: keyConfigIdx,
    pairing_idx: pairingIdx,
    feature_shape_pairing: pairingStr(shapePairings[pairingIdx]),
    plain_shape_pairing: pairingStr(plainShapePairings[pairingIdx]),
    shape_pairing: pairingStr(shapePairings[pairingIdx]),
    conj_shapes: conjShapes.join('+'),
    conj_colors: conjColors.join('+'),
    block_order: blockOrder.join('_'),
  });

  feature_stop_task_experiment.push(fullscreen);

  for (var bi = 0; bi < blockOrder.length; bi++) {
    (function (idx) {
      // Per-block setup: rebuild keyMap, prompts, pageInstruct, and reset
      // counters before the block's instructions/practice/test run.
      feature_stop_task_experiment.push({
        type: jsPsychCallFunction,
        func: function () {
          sessionBlockIdx = idx;
          setupBlock(blockOrder[idx], idx, numSessionBlocks);
        },
      });
      // Block-specific instructions (mutated pageInstruct content).
      feature_stop_task_experiment.push(instructionNode);
      // Uniform per-block practice: go-only phase (learn the shape -> key
      // binding), then the stop-signal instructions, then the with-stop phase.
      feature_stop_task_experiment.push(goPhaseNode);
      feature_stop_task_experiment.push(stopPhaseSetup);
      feature_stop_task_experiment.push(stopInstructNode);
      feature_stop_task_experiment.push(stopPhaseNode);
      // One test block under this block condition.
      feature_stop_task_experiment.push(testNode);
      // After testNode's loop terminates, its loop_function has set
      // feedbackText to either the "between blocks" or the "done with task"
      // message. Display it before moving to the next block setup.
      feature_stop_task_experiment.push(feedbackBlock);
    })(bi);
  }

  feature_stop_task_experiment.push(postTaskBlock);
  feature_stop_task_experiment.push(endBlock);
  feature_stop_task_experiment.push(exitFullscreen);
};
