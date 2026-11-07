# How I Design Electronics with AI Agents

*The method behind the control board for my MLCC analyzer*

Boris Kuznetsov, HighSNR Lab

Draft for author review, November 2026.

---

A few days ago I posted that I designed the control board for my MLCC analyzer without drawing a single schematic connection or routing a single trace. An AI agent did the schematic capture, placement, and routing in KiCad. In the comments, an engineer building a similar pipeline compared his setup with mine. We're tackling the same problem, but we've organized the work quite differently. Explaining the difference would have taken more room than a comment allowed, so here's the longer version.

If you've been following this site, the project isn't new. [Engineering Note 001](https://highsnr.org/lab-notes/mlcc-distortion-meter-functional-architecture/) described the functional architecture of the measurement system, and a later post covered [the design of the measurement board](https://highsnr.org/lab-notes/measurement-board-designed/). The control board described here develops the same idea further. Together with a separate high-voltage regulator board, it forms the control system for the meter's analog section and the DC bias source. The control board switches the measurement board's relays, sets the bias on the part under test anywhere from −50 V to +50 V through the regulator, measures that bias, and communicates with the host PC.

Before going further, I should be clear about the state of the hardware. This board hasn't seen the bench yet. It exists as a four-layer, 120 × 80 mm KiCad project, fully routed, with no DRC errors and matching schematic and PCB netlists. It hasn't been fabricated or tested. What follows is an account of the design process; whether the board works as intended is still an open question.

![Figure 1. Project workflow](../images/fig1_workflow_en.png)

*Figure 1. Project workflow. The agent carries out each stage and updates the project files; the engineer decides when to move on.*

## The project is a folder, not a chat history

The first decision, and probably the most important one, was to keep everything in the project folder. Sessions end, context gets lost, and models change. I used both Codex and Claude on this project, and I don't expect either to remember what we decided last week. The folder remembers.

![Figure 2. Project folder structure](../images/fig2_project_structure_en.png)

*Figure 2. Project folder structure and the files the agent reads before starting work.*

Four files at the top level hold the project together.

`AGENTS.md` contains the agent's working rules. It's short. Before starting a task, read the status file and the relevant decisions. After every verified change, update the status file. Don't report an intention or a hypothesis as a result. Support decisions with evidence: a file revision, a calculation, a datasheet, or an ERC or DRC report. Identify assumptions and explain how they will be checked. Don't release a board or place an order without my approval. There's also a rule about schematic symbols, which I'll get to later.

`PROJECT_STATUS.md` records where the project stands: what's done, what's been verified and how, what's still open, the current risks, and the next steps. The agent starts there, whether it's a new session, a different model, or the first day back after a week away. That file tells it where to pick up and which documents to read.

`README.md` provides the project overview and points to the current revisions. `DEVICE_CONTEXT.md` collects the device context in one place, with each fact marked as confirmed, proposed, or TBD.

Below those files are folders for each stage of the project, numbered 00 through 09. `00_management` contains the project charter, roadmap, decision log, working-session notes, risk register, and methods log. `01_idea_and_requirements` holds the requirements. `02_system_architecture` contains the architecture and the interface control document for the connection to the measurement board. `03_electronics` holds the schematics and PCB layouts, organized by revision, plus a `tools` folder of Python scripts.

The remaining folders cover firmware, verification, parts and BOM, PCB release, manufacturing, and frozen releases. Some are still empty, but the structure was there from the start.

Two support folders sit alongside them. `references` contains datasheets, external documents, and vendor CAD files with their checksums. `outputs` holds the evidence produced during the work: ERC and DRC reports in JSON, ngspice and autorouter logs, simulation results, renders, and SHA-256 manifests. Claims about verified results in the status file point to the corresponding evidence in `outputs`.

## Where a project starts

The project starts with a kickoff discussion: what the instrument needs to do, where its boundaries are, what I've already decided, and what remains open. That discussion produces a project charter covering goals, scope, constraints, roles, and success criteria.

Some choices were already fixed. I had chosen the STM32H750 as the microcontroller. The bias output had to be bipolar, from −50 V to +50 V. No parts were to be ordered, and no Gerbers sent to a fabricator, without my explicit approval.

With those choices recorded, we worked through the requirements before selecting the remaining parts. Every numerical requirement gets written down with explicit units and an acceptance criterion. That rule came from experience: voice recognition once garbled an accuracy requirement, and the wrong number nearly made it into the calculations.

## Architecture

The agent proposes options. I push back, reject some, and ask for recalculations.

The initial architecture was documented as provisional: a block diagram, candidate parts for the main blocks, back-of-the-envelope estimates, and a separate list of unresolved questions. One estimate was the bias settling time with the measurement board connected: about 85 seconds to get within 10 mV. The document explicitly identified that as a calculation requiring bench verification.

The architecture changed as we worked through the details. We dropped the local display and moved the operator interface to the PC. For the high-voltage stage, we compared an integrated high-voltage op amp with a hybrid circuit using a precision op amp and discrete output transistors. We checked specifications and actual prices at the distributor I use, then chose the hybrid.

One detail from that comparison stuck with me. The agent acknowledged that its earlier strong preferences—first for the discrete design, then for the integrated one—hadn't been supported by a complete comparison of cost and requirements.

Later, the regulator moved to its own board, and the controller was split into several boards. The controller was first meant to be hand-wired on perfboard; we then switched to a proper SMD PCB, with the STM32H750VBT6 mounted directly on the control board as a separate chip. Each change had a recorded reason. I wanted added complexity to solve an identified problem, with a measurable criterion behind it.

## Working sessions and the decision log

Some working sessions last several hours. The key ones end with written notes: what we decided, what we deferred, and what still needs checking. Decisions then go into the decision log, which now has about forty entries, ranging from making the controller a separate project to details of the latest board revision. Each entry includes a rationale and a reference to the supporting evidence.

I also learned something about how I work during those sessions. I find it hard to follow a long verbal explanation that mixes what a circuit block does, how it's calculated, and why it's safe. It's even harder to approve a design on that basis. So we take one block at a time: a direct answer first, the most important constraint next, and the supporting details in writing.

## Calculations and simulation

Simulation is a separate stage, and I expect it to answer specific design questions.

The agent simulated the high-voltage regulator in ngspice using generic op amp and transistor models and a simplified model of the measurement board's load. Each results file states those limitations and identifies what the model doesn't cover.

The circuit is checked across a range of conditions. That includes transistor beta variation, applied independently to each half of the output stage; high-voltage rails at 58, 68, and 83 V; temperatures of −20, 25, and 85 °C; and tolerance on the ±12 V supply. Fault cases get separate runs: loss of one or both low-voltage rails, an open setpoint wire, and a command driven to its limit.

Some component values changed as a result. One example is the resistor that holds the regulator input in a defined state if the setpoint wire opens. It started at 220 kΩ, but with that value the model only reached about ±49.6 V at the part under test. With 470 kΩ it reached about ±50.9 V, so 470 kΩ went into the schematic.

For the DAC reference buffer, the model provided an estimate of phase margin. The results file also states that this wasn't the vendor's macromodel and that stability still needs to be checked on the bench.

These simulations helped reject poor options and choose values to carry into the design. They haven't established how the real circuit will behave.

## Schematic

The agent builds the KiCad schematic programmatically, using Python scripts it writes and runs itself. I set the rules.

One rule came from an attempt to make a sheet look tidier: the agent stretched some imported symbols. After that, I restricted it to unmodified stock symbols from the KiCad libraries. There has been one exception. For a DAC missing from the library, we used the manufacturer's CAD model, retained the original file and its checksum, and checked every pin against the datasheet.

Every part is checked against the full datasheet at its intended operating point. A product-page summary isn't enough. One relay driver looked suitable from its description, but the datasheet showed that fully driving its outputs required a supply voltage the design didn't have. We rejected it before it reached the schematic.

Availability has a similarly practical definition: the distributor I actually buy from must have the part. Stock elsewhere doesn't help if I can't order it.

The schematic took about 30 rounds.

## Revisions and comparisons

The project went from V0.9 to V0.39, and revisions are kept in separate folders. The V0.9 draft came from earlier development work: one large project that was reworked and split into separate parts. Once a revision has passed review, it stays untouched. Further changes go into a new revision alongside it. The original V0.9 draft is still there.

Each new revision is compared with the previous one using fresh netlists exported from KiCad. The comparison shows which components and nets match, what changed, and whether any nets unexpectedly merged or split. It gives us a way to check the intended changes and catch unintended ones, while keeping a version to roll back to.

For connectivity and CAD rule checks, I rely on KiCad's own netlist, ERC, and DRC. The agent's tools are useful for preliminary checks, but they don't get the final say. A netlist parser the agent wrote once reported two touching wires as connected when KiCad's ERC showed they weren't.

## Review

I keep schematic review separate from schematic creation. The review is a read-only pass: the reviewer reports findings without changing the files. Each finding identifies its basis, whether that's the netlist, a calculation, or a question requiring a datasheet check or bench test.

We then work through the findings against the netlist and datasheets, using the model where needed. Some are confirmed, some need to be narrowed down, and some don't hold up.

For example, a review suggested series resistors on the lines to the indicator panel. They would limit current, but a calculation showed that they wouldn't prevent a cable short from falsely energizing a relay. That distinction mattered. I approve the resulting fixes, and they go into the next revision.

This process found real problems in a controller schematic that already passed ERC: missing local decoupling at the DAC and op amp, thermistor inputs connected from an external cable straight to the ADC, and no monitoring of the −12 V rail. A clean ERC doesn't tell you whether those design choices are acceptable.

## Independent review

I also have the schematic reviewed by a different model in a fresh context. Codex usually takes that role. The reviewer doesn't get the working-session history or the explanations behind the design decisions.

The idea is to get a second look from something that hasn't spent hours helping build the circuit. The design agent already knows what each block is supposed to do, and it can use that knowledge to explain away a questionable detail. A fresh reviewer has less of that history to work around.

I use a different model in the hope that it will catch things the first one missed. That's a practical choice, not a measured guarantee of independence. Their blind spots can still overlap.

The fresh context has drawbacks.

The reviewer doesn't know about deliberate constraints: a single distributor, through-hole connectors and relays, a purchased power module, or the decision to omit a relay on the high-voltage output. Some findings challenge choices we've already discussed and logged. Sorting those out takes time.

It also lacks the information needed to judge the design against the instrument's full requirements. Without the requirements and operating modes, it can check general engineering practice and identify local problems. It can't reliably decide whether the circuit meets this instrument's accuracy budget. Missing decoupling, an unprotected input, or an undefined fault state are useful things to catch, but they aren't the whole review.

There's another risk when the findings go back to the design agent: it may tend to defend its work. So a finding can't be dismissed with a plausible explanation alone. Rejecting it requires something we can check—a calculation, a counterexample, a datasheet reference, or a documented decision relevant to the concern. I make the final call.

The review isn't completely blind, either. Net names, sheet notes, and file names already convey intent. I'm comfortable with that; removing useful information would make the schematic harder to review.

Input quality matters too. A model can misread connections in a schematic PDF. Providing the exported netlist alongside the PDF gives it a more reliable way to check connectivity.

## Placement and routing

Placement and routing took another 10 to 12 rounds. The agent used KiCad's Python API and the Freerouting autorouter.

Freerouting didn't finish the board on its own. The first general pass stopped with 63 connections unrouted. Separate runs targeting power, the inner layers, and the remaining signals left between 36 and 60 connections unrouted.

The agent completed the remaining connections using its own grid search on the outer layers. A trace was kept only if KiCad's geometry checks accepted it. USB and the crystal connections were routed separately with fixed geometry.

Then came cleanup: removing redundant vias and dangling track stubs. Before cleanup, the DRC report had 25 findings; after cleanup, no errors remained. Six silkscreen warnings at the board edge were deliberately left unresolved because they came from the stock connector footprints.

![Figure 3. Control board, V0.33](../images/fig3_board_v033_render_web.jpg)

*Figure 3. Control board, V0.33. Unretouched render of the KiCad 3D model.*

There are still places where the routing is poor, and a few that are just ugly. I'll clean those up by hand before fabrication.

## The methods log

The methods log may be the most useful file in the project. Each mistake gets written up in the same format: the situation, the assumption, what was checked and how, what went wrong, how we caught it, and what to do differently next time.

There are close to twenty entries so far. Several have already appeared in this article: the requirement garbled by voice recognition, the stretched symbols, the netlist parser, the relay driver, and the part that was "available" from a distributor I couldn't buy from.

Some mistakes are purely mechanical. The agent once inserted a text note into a schematic sheet without escaping the quotation marks, and KiCad could no longer open the file. That led to a rule: after every programmatic edit to a CAD source file, check that the file is valid and keep the pre-edit version.

The log is there to make repeat mistakes less likely. When an entry leads to a useful rule, that rule goes into `AGENTS.md` or the relevant working instructions. The next session can use it regardless of which model is running.

## Responsibility

The division of responsibility is written into the charter. The agent analyzes, proposes options, calculates, simulates, builds, checks, and maintains the project documents. I approve the requirements, architecture decisions, fixes after review, board release, and every order.

A reported result needs supporting evidence that I can inspect: a project file, a calculation, or a report.

What has changed is where I spend my time. More of it goes into defining the problem, discussing constraints, and evaluating results. Less goes into operating the CAD tools.

## Other approaches

This isn't the only way to organize the work. Kaan Evran, the engineer who compared his setup with mine, builds his workflow around tested Python tools. Each is packaged as an agent skill and handles a specific task: looking up a datasheet parameter, selecting a part with derating, checking a SPICE model, or running LTspice or QSPICE.

He also keeps project state in Markdown. Execution happens in short sessions with narrowly defined tasks, so each session doesn't need to carry the entire project history. Milestones require his explicit approval.

The differences are mostly in where we put reusable knowledge and how we divide the work. In my setup, much of that knowledge lives in project documents and the methods log. In his, it also lives in the tools themselves. I tend to organize work around a project revision; he gives individual sessions narrower tasks.

Our verification processes are organized differently as well. Mine uses KiCad's checks, simulation, and separate review passes. In his description, datasheet-based part selection and simulation are distinct checkpoints, with the engineer approving each milestone.

I can see a clear advantage in his approach to tools. My scripts are mostly written for a particular revision. There are about eighty files in `tools`, many of them variations of the same script for V0.34, V0.35, and V0.36. The verification method carried over between revisions more consistently than the code did.

## What's still open

The board hasn't been fabricated or bench-tested. A few sections of routing need manual cleanup. Firmware for the new functions hasn't been written. The scripts haven't been developed into a tested toolset. The simulations used generic models, so stability and accuracy with the actual parts remain to be checked.

The workflow has held up through about forty logged decisions, thirty revisions, and work on separate regulator and indicator boards. It has also let me switch models and return after breaks without having to reconstruct the project from old conversations.

That's the part I can report on now. The files are there, the decisions can be traced, and the next session has somewhere to start. The bench results will have to wait for the board.
