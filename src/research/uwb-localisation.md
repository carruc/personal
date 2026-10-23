---
title: People localisation with UWB radar on a microcontroller
summary: A compact heatmap model for locating up to four people, balancing localisation accuracy, causal streaming, and ESP32-S3 memory constraints.
date: 2026-10-23
lang: en-GB
draft: false
toc: true
researchModules: true
image: /assets/figures/uwb/spatial-coverage.png
imageAlt: Dataset spatial coverage in the 4.8 by 7.2 metre room, with six radar locations marked.
links:
  report: /assets/papers/uwb-report.pdf
  dataset: https://huggingface.co/datasets/HAEEAI/multi-person-localization
---
{% from "components/research.njk" import figure %}

**Joint work by Davide Metauro and Pietro Carrucciu.** This page summarises our report, *Embedded and Edge AI for UWB Time-Series*.

## The task

Can a small neural network estimate how many people are in a room and where they are, using radar signals rather than cameras?

We use six synchronised UWB radar boards, each with three antennas, in a **4.8 × 7.2 m room**. The dataset contains 24 five-minute acquisitions at 25 Hz: **180,000 frames**, including walking, seated occupants, and empty-room recordings. The output is an unordered set of zero to four 2D positions.

The deployment target is an ESP32-S3, with stated limits of **800 KiB model storage** and **300 KiB activation memory**, including preprocessing requirements.

{{ figure('/assets/figures/uwb/room-setup.png', 'Six radars arranged around a rectangular room, with a sample walking trajectory.', 'Room layout and a trajectory from acquisition window 19. Reproduced from report Figure 1a.', 'plain', 'small') }}

## From radar signals to positions

The front end removes static background, retains **30 of 120 range bins**, and extracts log-magnitude plus the sine and cosine of inter-antenna phase differences. Five feature frames form an **18 × 30 × 15** network input.

A convolutional encoder first combines range, temporal, and within-radar antenna information. A dense bottleneck fuses the six radars into a room representation; an upsampling convolutional decoder produces a **36 × 24 heatmap**, with one cell per **0.2 × 0.2 m** region. The formulation follows the centre-point approach of [CenterNet](https://arxiv.org/abs/1904.07850).

At inference, local peaks become coordinates after suppression and centroid refinement. A short coasting tracker bridges intermittent missed detections. The exported full-INT8 model contains **482,021 total parameters** and requires **12.14 million MACs per frame**.

## Accuracy and streaming

We evaluate predictions using per-frame Hungarian matching, accepting a matched position within **1 m** of its target. On held-out windows 3 and 11, covering **15,000 frames**, the two pipelines give:

| Pipeline | Precision | Recall | F1 at 1 m | Median matched error |
| --- | ---: | ---: | ---: | ---: |
| Accuracy-first INT8 | 0.9864 | 0.9641 | **0.9751** | **0.1391 m** |
| Causal front end with submitted weights | 0.9455 | 0.9542 | 0.9498 | 0.159 m |

Table: Same held-out windows, different preprocessing and temporal access. This is a pipeline comparison, not an isolated test of background removal.

The accuracy-first pipeline uses complete-acquisition background and normalisation statistics, plus two future frames: **80 ms of look-ahead**. The causal variant replaces these with a gated EMA background, fixed training-derived normalisation, and a past-only five-frame stack. It removes future-frame access at a cost of **0.0253 F1** on this split.

> Accuracy on recorded data and readiness for live deployment are different questions. The causal front end removes future-frame dependencies; target-device timing still needs to be measured.

## Memory and generalisation

| Resource | Reported value | Stated limit |
| --- | ---: | ---: |
| Frozen INT8 model | 521.52 KiB | 800 KiB |
| Estimated TFLite activation arena | 159.19 KiB | 300 KiB |

Table: Static deployment evidence. The constraint checker reports no forbidden operations; the activation arena is an estimate, not an end-to-end measured device memory profile.

Leave-one-window-out evaluation across all 24 acquisitions yields **0.9178 pooled F1**, below the fixed held-out result. Performance deteriorates for stationary occupants: subtracting an acquisition's own mean can remove a person who barely moves. Empty-room folds are false-positive tests rather than ordinary localisation cases.

{{ figure('/assets/figures/uwb/cross-validation.png', 'Per-window cross-validation F1 bars, distinguishing moving subjects, mixed moving and seated subjects, and degenerate cases.', 'Leave-one-window-out results from report Figure 8. Acquisition content matters: the fixed held-out score is not a uniform guarantee across behaviours.', 'plain') }}

## What remains open

- **Target-device validation:** the report's causal preprocessing and inference times, approximately 0.119 ms and 0.111 ms per frame, were measured on the evaluation host, not on the ESP32-S3.
- **Stationary people:** background adaptation and coasting help with intermittent detection but do not establish reliable detection of fully static occupants.
- **Longer past context:** a separate single-seed Keras screening reached 0.9603 test F1 with nine causal frames. That candidate still needs INT8 export, constraint checks, and device timing; it is not the submitted model.
- **Controlled ablations:** the retained non-coasting baseline differs in threshold or export history. Its lower F1 cannot be attributed solely to switching coasting off.

For the architecture, preprocessing equations, full experiments, and references, see the [original report](/assets/papers/uwb-report.pdf).
