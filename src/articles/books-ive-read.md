---
title: Library and Antilibrary
summary: Books, series and essays I’ve finished, plus the books I want to read.
date: 2026-11-07
lang: en-GB
toc: true
image: /assets/images/books.png
imageAlt: Illustration of a purple book
---
{% from "components/books.njk" import bookList %}

## Library

{{ bookList(reading.finished) }}

## Antilibrary

{{ bookList(reading.antilibrary) }}

## Literary works

{{ bookList(reading.literary) }}
