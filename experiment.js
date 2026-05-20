/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */
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

var createTrialTypes = function (numTrialsPerBlock) {
  var uniqueCombos =
    stopSignalsConditions.length * shapes.length * colors.length;

  var stims = [];
  for (var x = 0; x < stopSignalsConditions.length; x++) {
    for (var j = 0; j < shapes.length; j++) {
      for (var c = 0; c < colors.length; c++) {
        stim = {
          stim: shapes[j],
          color: colors[c],
          correct_response: getResponseForStim(shapes[j], colors[c]),
          condition: stopSignalsConditions[x],
        };
        stims.push(stim);
      }
    }
  }
  var iteration = numTrialsPerBlock / uniqueCombos;
  stims = jsPsych.randomization.repeat(stims, iteration);
  return stims;
};

var renderColoredShape = function (shape, color) {
  var hex = colorHex[color];
  if (shape === 'circle') {
    return (
      '<svg width="160" height="160" viewBox="0 0 160 160" class="center">' +
      '<circle cx="80" cy="80" r="60" fill="' +
      hex +
      '"/></svg>'
    );
  }
  // square — very slight corner softening (rx=4) to approximate the
  // anti-aliased edge of the original square.png stimulus.
  return (
    '<svg width="160" height="160" viewBox="0 0 160 160" class="center">' +
    '<rect x="20" y="20" width="120" height="120" rx="4" ry="4" fill="' +
    hex +
    '"/></svg>'
  );
};

var getStopStim = function () {
  return preFileType + 'stopSignal' + postFileType;
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
  data.task_type = task_type;
  data.correct_response = correct_response;
  data.current_trial = currentTrial;
  data.condition = stimData.condition;
  data.block_num = getExpStage() == 'practice' ? practiceCount : testCount;

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

var possibleResponses;
// keyMap[shape][color] -> key character (only used for conjunctive)
var keyMap = {};

function getKeyMappingForTask(group_index, task_type) {
  // group_index counterbalances index/middle assignment
  var indexFinger = ['index finger', ',', 'comma key (,)'];
  var middleFinger = ['middle finger', '.', 'period key (.)'];

  if (group_index <= 1) {
    possibleResponses = [indexFinger, middleFinger];
  } else {
    possibleResponses = [middleFinger, indexFinger];
  }

  // Build keyMap for both task types.
  // Feature: response depends only on shape (color is task-irrelevant).
  //   possibleResponses[0] -> shapes[0] (circle); possibleResponses[1] -> shapes[1] (square)
  // Conjunctive: response depends on the shape+color conjunction (XOR-like).
  //   {circle+colors[0], square+colors[1]} -> possibleResponses[0]
  //   {circle+colors[1], square+colors[0]} -> possibleResponses[1]
  keyMap = { circle: {}, square: {} };
  if (task_type === 'conjunctive') {
    keyMap.circle[colors[0]] = possibleResponses[0][1];
    keyMap.square[colors[1]] = possibleResponses[0][1];
    keyMap.circle[colors[1]] = possibleResponses[1][1];
    keyMap.square[colors[0]] = possibleResponses[1][1];
  } else {
    keyMap.circle[colors[0]] = possibleResponses[0][1];
    keyMap.circle[colors[1]] = possibleResponses[0][1];
    keyMap.square[colors[0]] = possibleResponses[1][1];
    keyMap.square[colors[1]] = possibleResponses[1][1];
  }
}

var getResponseForStim = function (shape, color) {
  return keyMap[shape][color];
};

var group_index =
  typeof window.efVars !== 'undefined' ? window.efVars.group_index : 1;

var task_type =
  typeof window.efVars !== 'undefined' && window.efVars.task_type
    ? window.efVars.task_type
    : 'feature';
if (task_type !== 'conjunctive' && task_type !== 'feature') {
  task_type = 'feature';
}

var colors = ['cyan', 'magenta'];
var colorHex = { cyan: '#00bcd4', magenta: '#e91e63' };
var color = null;

getKeyMappingForTask(group_index, task_type);

const choices = [possibleResponses[0][1], possibleResponses[1][1]];

var endText = `
  <div class="centerbox">
    <p class="center-block-text">Thanks for completing this task!</p>
    <p class="center-block-text">Press <i>enter</i> to continue.</p>
  </div>
`;

var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 10 to 15 minutes.
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

var practiceLen = 12; // must be divisible by shapes.length * colors.length * stopSignalsConditions.length
var numTrialsPerBlock = 60; // must be divisible by shapes.length * colors.length * stopSignalsConditions.length
var numTestBlocks = 3;

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

var stopSignalsConditions = ['go', 'go', 'stop'];
var shapes = ['circle', 'square'];

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

var postFileType = ".png'></img>";
var preFileType = "<img class = center src='" + pathSource;
// append to images array to preload
var images = [pathSource + 'stopSignal' + '.png'];
// Shape stimuli are rendered as inline SVG (see renderColoredShape),
// so only the stop-signal star needs preloading.

var labelFor = function (shape, color) {
  return task_type === 'conjunctive' ? color + ' ' + shape : shape;
};

var mappingLines = (function () {
  // Group stim labels by the key they map to, in the order
  // possibleResponses[0] then possibleResponses[1].
  var lines = [['index finger', ',', 'comma key (,)'], possibleResponses[1]]
    .slice(0, 0); // placeholder so eslint is happy
  var byKey = [
    { resp: possibleResponses[0], stims: [] },
    { resp: possibleResponses[1], stims: [] },
  ];
  for (var s = 0; s < shapes.length; s++) {
    for (var c = 0; c < colors.length; c++) {
      var key = getResponseForStim(shapes[s], colors[c]);
      var bucket = byKey[0].resp[1] === key ? byKey[0] : byKey[1];
      bucket.stims.push(labelFor(shapes[s], colors[c]));
    }
  }
  // Deduplicate the feature case ("circle" appears twice etc).
  for (var b = 0; b < byKey.length; b++) {
    byKey[b].stims = Array.from(new Set(byKey[b].stims));
  }
  return byKey;
})();

var promptTextList = `
  <ul style="text-align:left;">
    <li>${mappingLines[0].stims.join(' or ')}: ${
  mappingLines[0].resp[2]
}</li>
    <li>${mappingLines[1].stims.join(' or ')}: ${
  mappingLines[1].resp[2]
}</li>
    <li>Do not respond if a star appears.</li>
  </ul>
`;

var promptText = `
  <div class="prompt_box">
    <p class="center-block-text" style="font-size:16px; line-height:80%;">${
      mappingLines[0].stims.join(' or ')
    }: ${mappingLines[0].resp[2]}</p>
    <p class="center-block-text" style="font-size:16px; line-height:80%;">${
      mappingLines[1].stims.join(' or ')
    }: ${mappingLines[1].resp[2]}</p>
    <p class="center-block-text" style="font-size:16px; line-height:80%;">Do not respond if a star appears.</p>
  </div>
`;

var speedReminder =
  '<p class = block-text>Try to respond as quickly and accurately as possible.</p>';

var ruleParagraphs = (function () {
  // Each bucket already lists the stims that map to that finger/key.
  return (
    `<p class="block-text">If the shape is ${
      task_type === 'conjunctive' ? '' : 'a '
    }<b>${mappingLines[0].stims.join('</b> or <b>')}</b>, press with your <b>${
      mappingLines[0].resp[0]
    }</b>.</p>` +
    `<p class="block-text">If the shape is ${
      task_type === 'conjunctive' ? '' : 'a '
    }<b>${mappingLines[1].stims.join('</b> or <b>')}</b>, press with your <b>${
      mappingLines[1].resp[0]
    }</b>.</p>`
  );
})();

var pageInstruct = [
  `
  <div class="centerbox">
    <p class="block-text">Place your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
    <p class="block-text">During this task, on each trial you will see ${
      task_type === 'conjunctive' ? 'a colored shape' : 'shapes'
    } appear on the screen one at a time. ${
      task_type === 'conjunctive'
        ? 'Both the <b>color</b> and the <b>shape</b> determine the correct response.'
        : 'The shape will be one of two colors, but <b>only the shape matters</b>: ignore the color.'
    }</p>
    ${ruleParagraphs}
    <p class="block-text">You should respond as quickly and accurately as possible.</p>
  </div>
  `,
  `
  <div class="centerbox">
    <p class="block-text">On some trials, a star will appear around the shape, with or shortly after the shape appears.</p>
    <p class="block-text">If you see the star, please try your best to <b>withhold your response</b> on that trial.</p>
    <p class="block-text">Please <b>do not</b> slow down your responses in order to wait for the star. It is equally important to respond quickly on trials without the star as it is to stop on trials with the star.</p>
  </div>
  `,
  `
  <div class="centerbox">
    <p class="block-text">We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will not count towards your performance on the task. Please make sure you understand the instructions before moving on.</p>
    ${speedReminder}
  </div>
  `,
];

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
  prompt: promptText,
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

var practiceTrials = [];
for (i = 0; i < practiceLen; i++) {
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
    prompt: promptText,
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
    prompt: promptText,
  };

  practiceTrials.push(
    practiceFixation,
    practiceTrial,
    practiceFeedbackBlock,
    ITIBlock
  );
}

var practiceCount = 0;
var practiceNode = {
  timeline: [feedbackBlock].concat(practiceTrials),
  loop_function: function (data) {
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

    if (
      practiceCount == practiceThresh ||
      aveShapeRespondCorrect > practiceAccuracyThresh
    ) {
      feedbackText = `
      <div class="centerbox">
        <p class="block-text">We will now begin the test portion.</p>
        <p class="block-text">Keep your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
        <p class="block-text">Press <i>enter</i> to continue.</p>
      </div>`;

      expStage = 'test';
      stims = createTrialTypes(numTrialsPerBlock);
      return false;
    } else {
      feedbackText =
        '<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 1 minute.</p>';

      if (aveShapeRespondCorrect <= practiceAccuracyThresh) {
        feedbackText += `
        <p class="block-text">Your accuracy is low. Remember:</p>
        ${promptTextList}`;
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

      if (stopSignalRespond === maxStopCorrectPractice) {
        feedbackText += `
        <p class="block-text">You have not been stopping your response when stars are present.</p>
        <p class="block-text">Please try your best to stop your response if you see a star.</p>`;
      }

      if (stopSignalRespond === minStopCorrectPractice) {
        feedbackText += `
        <p class="block-text">Please do not slow down and wait for the star to appear. Respond as quickly and accurately as possible when a star does not appear.</p>`;
      }

      feedbackText +=
        `<p class="block-text">We are now going to repeat the practice round.</p>` +
        `<p class="block-text">Press <i>enter</i> to begin.</p></div>`;

      stims = createTrialTypes(practiceLen);
      return true;
    }
  },
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
      feedbackText = `<div class=centerbox>
        <p class=block-text>Done with this task.</p>
        <p class=centerbox>Press <i>enter</i> to continue.</p>
        </div>`;

      return false;
    } else {
      feedbackText =
        '<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 1 minute.</p>';

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      if (aveShapeRespondCorrect < accuracyThresh) {
        feedbackText += `
        <p class="block-text">Your accuracy is low. Remember:</p>
        ${promptTextList}`;
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

      stims = createTrialTypes(numTrialsPerBlock);
      return true;
    }
  },
  on_timeline_finish: function () {
    window.dataSync();
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
  stims = createTrialTypes(practiceLen);
  feature_stop_task_experiment.push(fullscreen);
  feature_stop_task_experiment.push(instructionNode);
  feature_stop_task_experiment.push(practiceNode);
  feature_stop_task_experiment.push(testNode);
  feature_stop_task_experiment.push(postTaskBlock);
  feature_stop_task_experiment.push(endBlock);
  feature_stop_task_experiment.push(exitFullscreen);
};
