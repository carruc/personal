---
title: Exploring an idea through a small experiment
summary: A draft research/project entry for styling the overview, resource links, approach, and latest updates.
date: 2026-10-22
draft: true
toc: true
researchModules: true
math: true
visuals:
  - title: Baseline
    src: /assets/figures/demo/baseline.svg
    alt: Three blue blocks connected in sequence, from input to model to output.
    caption: Illustrative baseline pipeline. This is a layout fixture, not a measured result.
  - title: Variant
    src: /assets/figures/demo/variant.svg
    alt: Three green blocks connected in sequence, with an extra curved connection.
    caption: Illustrative variant with an additional connection. No performance claim is implied.
links:
  code: https://github.com/carruc
---
<!-- Layout reference excluded from site generation. To preview all research modules, copy this file to src/research/draft-project.md and run npm run dev. -->

This is placeholder content for styling, not a description of completed work. The code link currently points to my GitHub profile.

## Overview

Describe the problem, who it matters to, and the question this project aims to answer. Add a short explanation of my role and the current stage of the work.

## Approach

1. Define the question and a small, measurable scope.
2. Build a first version and compare it with a baseline.
3. Inspect the evidence and decide what to try next.

### Experiment notes

| Item | Placeholder |
| --- | --- |
| Main question | What do we want to learn? |
| Comparison | What is the baseline? |
| Measurement | What evidence would change our decision? |

Table: Questions to complete before running the experiment.

## Latest updates

- **22 October 2026:** Draft page created for layout review. Replace with a real project update.

## Results and next steps

Add findings, limitations, and the next experiment here. Keep planned work separate from completed results.

[Browse articles →](/articles/)


{% from "components/research.njk" import figure, selector, comparison, gallery %}

## Figures and captions

A single diagram with a subtle gray background. Captions can explain the setup, interpretation, and limitations.

{{ figure(visuals[0].src, visuals[0].alt, visuals[0].caption) }}

### Side-by-side figures

The grid stacks when the reading column is narrow. These original diagrams are intentionally simple placeholders.

<div class="figure-grid">
{{ figure(visuals[0].src, visuals[0].alt, visuals[0].caption, 'gradient') }}
{{ figure(visuals[1].src, visuals[1].alt, visuals[1].caption, 'gradient') }}
</div>

## Results table

**Dummy values for styling only.** Replace this table with measured results and a description of the evaluation protocol.

| Configuration | Example score ↑ | Example latency ↓ |
| --- | ---: | ---: |
| Baseline | 0.70 | 120 ms |
| Variant | **0.74** | 135 ms |
| Ablation | 0.68 | **105 ms** |

Table: Illustrative configuration comparison. **Dummy values only**, not measured results.

## Selectable examples

Switch the displayed configuration using the menu. A second selector demonstrates that instances operate independently.

{{ selector('Configuration', visuals) }}

{{ selector('Independent example', visuals) }}

## Image comparison

Drag the slider or use the arrow keys after focusing it. The diagrams use identical dimensions so corresponding elements stay aligned.

{{ comparison(visuals[0], visuals[1], 'Baseline visibility') }}

## Figure gallery

Use Previous and Next to step through the diagrams. There is no automatic motion.

{{ gallery('Pipeline walkthrough', visuals) }}

## Mathematics and code

An illustrative mean-squared-error expression, with no reported experiment attached:

$$ \mathcal{L} = \frac{1}{N} \sum_{i=1}^{N}(y_i - \hat{y}_i)^2 $$

```python
configurations = ["baseline", "variant"]
for name in configurations:
    print(f"Evaluate {name} under the same protocol")
```

### Citation block

Replace this deliberately incomplete placeholder with the actual paper citation.

```bibtex
@misc{project_placeholder,
  title = {Replace with the project title},
  note = {Draft placeholder, not a publication}
}
```
