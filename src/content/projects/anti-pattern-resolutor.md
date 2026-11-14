---
title: Anti-Pattern Resolutor
summary: An agentic refactoring pipeline for Java. It pairs SonarQube findings with LLM reasoning, and every proposed edit has to compile and pass the tests before it is kept.
field: green
context: With UCL and IBM Research
year: 2025
stack: [Python, LangChain, LangGraph, Ollama, vLLM, SonarQube, JaCoCo]
repo: https://github.com/Andrei-Constantin-Programmer/Anti-Pattern-Resolutor
selected: true
order: 1
---

## Problem

Legacy Java codebases carry code smells and anti-patterns that static analysis can find but not fix. Fixing them by hand is slow; letting a model fix them unchecked risks edits that read well and break behaviour.

## Approach

A local-first pipeline pairs SonarQube findings with LLM-based reasoning to propose file-scoped, behaviour-preserving edits. Every change is gated by a compile and the test suite; public interfaces are preserved; static analysis is re-run for reporting only. Run artefacts (plans, diffs and logs) are kept for auditability.
