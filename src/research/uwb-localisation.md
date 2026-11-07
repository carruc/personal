---
title: People localisation with UWB radar on a microcontroller
summary: We trained a small radar model to locate up to four people in a room with the ESP32-S3’s memory limits in mind. Joint work by Davide Metauro and I.
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

## The task

Given a few frames of radar data, can we tell how many people are in a room and where they’re standing or sitting?

The setup uses six synchronised UWB radar boards, each with three antennas, in a **4.8 × 7.2 m room**. We had 24 five-minute recordings at 25 Hz, for **180,000 frames**. Some recordings have people walking or sitting, and some show an empty room. For each frame, the model returns a set of zero to four 2D positions.

We designed for an ESP32-S3 with a budget of **800 KiB for the model** and **300 KiB for activations**, including preprocessing.

{{ figure('/assets/figures/uwb/room-setup.png', 'Six radars arranged around a rectangular room, with a sample walking trajectory.', 'Room layout and a trajectory from acquisition window 19. Reproduced from report Figure 1a.', 'plain', 'small') }}

## From radar signals to positions

The front end removes static background, retains **30 of 120 range bins**, and extracts log-magnitude plus the sine and cosine of inter-antenna phase differences. Five feature frames form an **18 × 30 × 15** network input.

A convolutional encoder combines information across range bins, time steps and antennas on each radar. A dense layer then combines the six radar readings, and a decoder turns that representation into a **36 × 24 heatmap** of the room. Each cell covers **0.2 × 0.2 m**. We borrowed the idea of locating people by their centre points from [CenterNet](https://arxiv.org/abs/1904.07850).

At inference, local peaks become coordinates after suppression and centroid refinement. A short coasting tracker bridges intermittent missed detections. The exported full-INT8 model contains **482,021 total parameters** and requires **12.14 million MACs per frame**.

## Accuracy and streaming

We evaluate predictions using per-frame Hungarian matching, accepting a matched position within **1 m** of its target. On held-out windows 3 and 11, covering **15,000 frames**, the two pipelines give:

| Pipeline | Precision | Recall | F1 at 1 m | Median matched error |
| --- | ---: | ---: | ---: | ---: |
| Accuracy-first INT8 | 0.9864 | 0.9641 | **0.9751** | **0.1391 m** |
| Causal front end with submitted weights | 0.9455 | 0.9542 | 0.9498 | 0.159 m |

Table: Both pipelines use the same held-out windows. They differ in background removal, normalisation and which frames they can see.

The more accurate pipeline computes background and normalisation statistics from the whole recording and looks **80 ms ahead** (two frames). For streaming, we use a gated exponential moving average for the background, use fixed normalisation statistics from the training set, and build the five-frame input from frames already available. F1 drops by **0.0253** on this split.

## Memory and generalisation

| Resource | Reported value | Stated limit |
| --- | ---: | ---: |
| Frozen INT8 model | 521.52 KiB | 800 KiB |
| Estimated TFLite activation arena | 159.19 KiB | 300 KiB |

Table: The constraint checker found no forbidden operations. We estimated the activation arena without measuring total memory use on the device.

When we held out each of the 24 recordings in turn, pooled F1 fell to **0.9178**. People sitting still were harder to detect. If someone barely moves, subtracting the recording’s mean can erase their radar return along with the background. The empty-room recordings show whether the model predicts people where there aren’t any.

{{ figure('/assets/figures/uwb/cross-validation.png', 'Per-window cross-validation F1 bars, distinguishing moving subjects, mixed moving and seated subjects, and degenerate cases.', 'F1 for each held-out recording, from Figure 8 of the report.', 'plain') }}

## What we’d test next

One idea we’d like to try is masking a different subset of radars during training. The model would have to locate people from whichever radars it could see. We could then test whether that helps when some readings are missing or noisy, and how many radars the model actually needs.

We could also make use of the room’s geometry and symmetry. The six radars could be split into two groups of three based on their placement. Each group could estimate positions using the known radar locations, then we could combine the two estimates. Both ideas are still untested. We suspect they could improve localisation, and we’d compare them with the current model on the same held-out recordings.

For the architecture, preprocessing equations, full experiments, and references, see the [original report](/assets/papers/uwb-report.pdf).
