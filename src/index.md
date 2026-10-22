---
layout: base.njk
title: Pietro Carrucciu
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

I am a Computer Science and Engineering Master's degree student at **Politecnico di Milano**. I study things.

## Interests

*To write: introduce the topics and questions that interest me, and what I want to explore next.*

## Active projects & latest updates

*To write: describe what I am working on now. For each active project, add a short overview, a dated latest update, and a link to more details.*

## Projects

*To write: list selected projects with a one-line description, my contribution, and links to code, demos, or papers.*

[All research & projects →](/research/)

## Articles

*To write: list selected articles with a title, a short description, and a link.*

[All articles →](/articles/)

## Recently read books

*To write: list books I have recently finished, with the title, author, date read, and an optional short takeaway or link to notes.*

</div>
</div>
