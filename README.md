# Feature Stop Task

Adapted from `experiment_3_task/simple_stop_signal_e3/`. Adds a color dimension
(**blue**, **pink**) to the two shapes (circle, square). Each participant runs
**three within-subjects blocks**, one per rule condition:

- **plain** — shapes appear in a single neutral color; respond based on shape.
  Equivalent to the original simple stop task.
- **feature** — shapes are blue or pink, but color is task-irrelevant; respond
  based on shape (color is a perceptual distractor).
- **conjunctive** — shape + color jointly determine the correct key:
  `{blue circle, pink square}` → one key; `{pink circle, blue square}` → the
  other (XOR-like mapping).

## Counterbalancing (`group_index` 1–12)

`group_index` is the single dial that determines both block order and key
mapping. With 1–12 it cycles through all 12 unique combos:

- `blockOrderIdx = (group_index − 1) % 6` → one of 6 permutations of
  `{plain, feature, conjunctive}`.
- `keyConfigIdx = ⌊(group_index − 1) / 6⌋ % 2` → 2 key configs (which shape /
  conjunctive pair goes to comma vs. period). Configs are *consistent across
  conditions*: in config 0, circle goes to comma in plain & feature blocks,
  and blue-circle → comma in conjunctive too.

Saved per trial: `group_index`, `block_order_idx`, `key_config_idx`,
`block_condition`, `block_order` (e.g. `"plain_feature_conjunctive"`).

## Timeline per block

For each block in `blockOrder`:

1. setup callback (sets `currentBlockCondition`, rebuilds `keyMap`, prompts, and
   instructions; resets practice/test counters and SSD)
2. block-specific instructions (rule + visual stim→key mapping panel +
   stop-signal explanation + practice intro)
3. per-block practice (loops until accuracy threshold or `practiceThresh`)
4. one test block (60 trials, 33% stop)
5. between-block feedback (or end-of-task message after the final block)

## Repo layout

```
feature_stop_task/   # experiment dir: config.json + experiment.js + style.css + images/
index.html           # local-test runner that loads from feature_stop_task/
README.md
```

The experiment files live in the `feature_stop_task/` subfolder so that
[expfactory-deploy](https://github.com/poldracklab/expfactory-deploy) discovers
the task. `config.json` and `index.html` cannot share a folder, so the
local-test runner stays at the repo root.

## Local preview

```bash
python3 -m http.server 8786
```

Open `http://localhost:8786/`. Defaults to a full 3-block session counterbalanced
by `group_index=1`. To pilot a single block in isolation, pick one from the
dropdown or pass `?task_type=plain|feature|conjunctive` in the URL.

---

## Trial Structure

| Event    | Duration (ms)                                           |
| -------- | ------------------------------------------------------- |
| Fixation | 500                                                     |
| Probe    | 1500 (1000ms stimulus presentation, 500ms blank screen) |
| ITI      | 500 (mean), 0 (min), 5000 (max)                         |

## Blocks

| Block Type | Number of Blocks | Trials per Block |
| ---------- | ---------------- | ---------------- |
| Test       | 3                | 60               |

## Conditions and Probabilities

| Condition | Probability |
| --------- | ----------- |
| Go        | 66.66%      |
| Stop      | 33.33%      |

---

## Stop-Signal Task Instructions

### Enable Fullscreen

> The experiment will switch to full screen mode when you press the button below.

### Welcome Screen

> Welcome! This experiment will take around 10 minutes. To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and fullscreen for the whole duration of each task. Press enter to begin.

---

### Task Instructions

#### Page 1: Setup

> Place your index finger on the comma key (,) and your middle finger on the period key (.).
>
> During this task, on each trial, you will see shapes appear on the screen one at a time.
>
> If the shape is a circle, press your index finger.
>
> If the shape is a square, press your middle finger.
>
> You should respond as quickly and accurately as possible to each shape.

#### Page 2: Setup cont.

> On some trials, a star will appear around the shape, shortly after the shape appears.
>
> If you see the star, please try your best to withhold your response on that trial.
>
> If the star appears and you try your best to withhold your response, you will find that you will be able to stop sometimes, but not always.
>
> Please do not slow down your responses in order to wait for the star. It is equally important to respond quickly on trials without the star as it is to stop on trials with the star.

#### Page 3: Practice Round

> We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.
>
> Try to respond as quickly and accurately as possible.

#### Page 4: Start Practice

> Press enter to begin practice.
