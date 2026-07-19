# Cesvi

A visual storytelling platform that explains **invisible** computer processes.
Animation first, explanation second, terminology last. Think 3Blue1Brown ×
Kurzgesagt × Brilliant — but clickable, and readable by someone who has never
heard of a CPU.

> Cesvi is **not** a calculator demo. It is a guided story about a Task running
> through a real computer.

## Chapter 1 — *How does a computer run my program?*

The learner **opens the file** on the screen. A glowing spark (the Task) travels
one continuous circuit through a real-looking desktop PC, then dives inside the
CPU to run a **real miniature program** instruction-by-instruction.

**Monitor → System Bus → SSD → RAM → CPU → (inside) → Monitor**

### You open a file; the operating system loads it

- You click the **file** (a familiar action).
- The **operating system** loads the program from the **SSD into RAM**. (The CPU
  never rummages through the SSD itself.)
- Only then does the CPU start running the program's instructions.

### Inside the CPU — a real execution pipeline

The view fades into a dedicated scene. Instead of one calculation, the CPU runs
an **8-instruction program**:

```
1  LOAD  R1, 8
2  LOAD  R2, 5
3  ADD   R1, R2      ← ALU wakes up
4  MOV   R3, R1      ← ALU idle
5  LOAD  R4, 2
6  MUL   R3, R4      ← ALU wakes up
7  STORE  R3         ← ALU idle
8  HALT
```

For **every** instruction the full cycle is visible, with a stage tracker at the
top: **Fetch → Decode → Execute → Write Back → Next**.

- **Program Counter** — the yellow arrow walks down the instruction list, one
  line per instruction, and a `PC: n/8` readout tracks it.
- **RAM** — feeds the program one instruction at a time (the list *is* the
  program in RAM); the current line glows while it is fetched.
- **Control Unit** — the team leader. It reads each instruction and "decodes" it
  into little chips. It is always conducting.
- **Registers** — `R1..R4`, tiny boxes whose values change live as the program
  runs (`8 → 13`, `13 → 26`, …). Evidence of work, not a final number.
- **ALU** — the calculator. It **only activates for arithmetic** (ADD, MUL):
  it visibly *works* — a spinning ring, a pulsing operator, the spark orbiting
  inside. For MOV / LOAD / STORE it shows **"idle"**, because those don't do
  math. It never displays a result number.

The spark is continuous: it walks `RAM → Control Unit → (Registers / ALU) → back`
for every instruction, never teleporting.

### The ending is a success, not a number

When `HALT` completes, the scene shows a green **✓ Program Finished** badge, and
the monitor back in the PC view shows a green check + "Done". No `5`, no `26` —
because the lesson is *"the CPU ran a program"*, not *"the CPU computed a sum."*

### You drive it

- Open the file (on the screen, or the button in the panel) to begin.
- Watch the whole journey, then Replay.
- **EN / VI** switches all text to Vietnamese.

## Run it

```bash
cd cesvi
npm install
npm run dev
```

- **Click the file** on the monitor to begin.
- **Space** — play / pause. **← →** — step between beats. Click any **dot** to
  jump. (Orange-ringed dots are the inside-the-CPU steps.)
- **Replay** restarts.

## Design rules (enforced by the code)

- **One protagonist, never lost.** The spark follows one continuous circuit per
  scene; never teleports, spawns, or vanishes.
- **Two semantic scenes only:** `pc` (whole computer always visible) and `cpu`
  (inside the CPU). Switching is a fade cut, never a disorienting camera fly.
- **Real hardware names:** SSD, RAM, CPU, GPU, Monitor, System Bus, and inside
  the CPU: Control Unit, Registers, ALU, Program Counter.
- **Two-panel layout:** LEFT visualization (unobstructed), RIGHT explanation,
  BOTTOM timeline. No text painted over the animation.
- **The cycle is the lesson.** Every animation answers *"What is the CPU doing
  right now?"* — never *"What number did it produce?"*

## Architecture (two real source files, on purpose)

- `src/story.ts` — the chapter as **data**: the 8-instruction program, the CPU
  state machine (pure functions), the stage model, both scenes' geometry, and
  the plain-language narration/glosses (EN/VI). No rendering logic.
- `src/App.tsx` — the canvas engine: per-scene fit, discovery states, fade
  transition, continuous spark, the execution-pipeline renderer (program list,
  PC, registers, working ALU, stage tracker, success state) + the two-panel UI.

The next chapter is another `story.ts`; the engine stays the same.
