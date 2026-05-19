# Feature Stop Task

Adapted from `experiment_3_task/simple_stop_signal_e3/`. Adds a task-irrelevant
**color** dimension (cyan, magenta) to the two shapes (circle, square), yielding
4 unique stimuli. Between-subjects manipulation of how color enters the
stop-signal task:

- **feature** (`task_type=feature`) — color is task-irrelevant; key
  responses depend only on shape (identical to the original simple stop task).
- **conjunctive** (`task_type=conjunctive`) — key responses depend on the
  conjunction of color and shape. With two keys, two color+shape pairs map to
  each key (e.g. `{cyan circle, magenta square}` → comma;
  `{magenta circle, cyan square}` → period).

Local preview: serve the folder with `python3 -m http.server` and open
`index.html`. Pick the group from the dropdown, or pass
`?task_type=conjunctive&group_index=1` (or `?task_type=feature&...`) in the URL. Counterbalancing of finger
assignment uses the existing `group_index` parameter (≤1 → pair-0 = index
finger; ≥2 → flipped).

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
