---
title: "Why Every Payment API Must Be Idempotent"
description: "Learn how idempotency keys prevent double-charging users during network failures."
date: "2026-08-07"
author: "Soumyaranjan"
---

When building distributed systems, network requests will fail. Handling these failures safely is a massive **development challenge**.

## The Scenario
A user clicks "Pay". The request hits the server, charges the credit card, but the network drops before the server can reply "Success". The user clicks "Pay" again.

## Idempotency
By passing an `Idempotency-Key` in the header, the server knows if it has already processed this exact request, safely returning the cached result without double-charging the card.
