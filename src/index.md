---
layout: base.njk
title: Pietro Carrucciu
summary: Research on machine learning for sensor data and Italian language models, plus projects and essays by Pietro Carrucciu.
profile: true
---
<div class="profile-intro">
<aside class="profile-sidebar" aria-label="Profile">
<img class="profile-photo" src="/assets/figures/pietro-carrucciu.png" alt="Pietro Carrucciu outdoors holding a Minecraft pickaxe" width="2317" height="2317">
<div class="profile-details">

aka *carruc*

<ul class="bio-links">
{% for social in site.socials %}{% if social.url %}
<li><a href="{{ social.url }}" aria-label="{{ social.label }}{% if social.handle and social.handle != social.label %}: {{ social.handle }}{% endif %}"><i class="{{ social.icon or 'fa-solid fa-link' }}" aria-hidden="true"></i><span>{{ social.handle or social.label }}</span></a></li>
{% endif %}{% endfor %}
</ul>

</div>
</aside>
<div class="profile-bio">

I’m a master’s student in **Computer Science and Engineering at Politecnico di Milano** and a graduate researcher at **NECSTLab**.


## Current research

- **Language models and sensor data:** At NECSTLab, I’m studying how to encode sensor time series for language models that can help make sense of health data and translate this understanding in actionable insights. Under Professor Maurizio Magarini and PhD Arek Berc Gokdag.
- **[Italian Pretrain Dataset and SLM](https://github.com/SamueleTondelli/pavullmo):** we are building an all-italian, high-quality pretrain dataset and training a companion small language model in the 50-100M parameter range. Currently cooking the data pipeline.

## Projects

{% if collections.research.length %}
<ul>
{% for project in collections.research %}
{% if loop.index <= 3 and project.url %}
<li><a href="{{ project.url }}">{{ project.data.title }}</a></li>
{% endif %}
{% endfor %}
</ul>
{% endif %}

[All projects →](/research/)

## Recent articles

{% if collections.articles.length %}
<ul>
{% for entry in collections.articles %}
{% if loop.index <= 3 %}
<li><a href="{{ entry.url }}">{{ entry.data.title }}</a></li>
{% endif %}
{% endfor %}
</ul>
{% endif %}

[All articles →](/articles/)

## Reading

{% from "components/books.njk" import bookList, bookTitle %}

<p>I’m currently reading {% for book in reading.currently %}{% if not loop.first %}{% if loop.last %} and {% else %}, {% endif %}{% endif %}{{ bookTitle(book) }}{% endfor %}. Other books I've enjoyed as of late:</p>
{{ bookList(reading.finished.concat(reading.literary), true) }}

{% for entry in collections.articles %}
{% if entry.page.fileSlug == 'books-ive-read' %}

<p>Click here for the rest of my <a href="{{ entry.url }}">Library and Antilibrary →</a></p>
{% endif %}
{% endfor %}

</div>
</div>
