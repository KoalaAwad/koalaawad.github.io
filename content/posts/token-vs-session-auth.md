---
title: "Token vs Session Based Authentication"
date: 2026-01-05
draft: false
tags: ["authentication","security","backend"]
featured_image: "/images/posts/token-vs-session-auth/hero.jpg"
---


# Token vs Session Authentication

Authentication is the process of verifying if a user is who they claim to be. The most common way to verify a user is by using a password only the user would know, or by additionally having a third party verify their identity, also known as **two-factor authentication (2FA)**.

When a user initially sends their username and password to the server, two things happen:

1. The server verifies the credentials against its records.
2. If the credentials are valid, the server either:
   - establishes an authenticated **session**, or
   - issues a **token**.

Only then does the client (browser or application) store some form of proof of authentication—such as a cookie or token—so that subsequent requests can be authenticated without resending credentials.

This article focuses on **how backend servers handle authentication**, and the **trade-offs between different approaches** in terms of security, scalability, and performance.

---

## Stateless vs Stateful Authentication

Authentication systems generally fall into two categories:

- **Stateful**
- **Stateless**

### Stateful Authentication

Stateful authentication means that once a user logs in, the server **keeps track of the user’s authentication state**. The server remembers which users are logged in until they explicitly log out or their session expires.

User authentication state is typically stored server-side (often in a shared store such as Redis or a database). When the user makes a request, their browser sends a cookie containing a session identifier. The server then:

- Checks whether the session exists (active vs expired)
- Verifies that the session corresponds to the correct user

### Stateless Authentication

In stateless authentication, the server does **not track user state**. Each request contains all the information needed to authenticate the user. The server validates the data cryptographically and makes an authorization decision without storing session state.

- **Stateful** = easier revocation and control  
- **Stateless** = harder revocation, simpler distribution  

---

## Authentication Methods

There are many widely used authentication techniques, including:

- **Biometric authentication**  
  Verifying identity using physical characteristics (e.g., fingerprints).

- **Single Sign-On (SSO)**  
  A single set of credentials grants access to multiple applications or services.

- **Two-Factor / Multi-Factor Authentication (2FA/MFA)**  
  Authentication using a second factor such as email, SMS, or authenticator apps.

- **Certificates**  
  Cryptographic identities issued by a trusted authority.

This article focuses on two concrete mechanisms:

- **Session-based authentication**
- **Token-based authentication**

---

## Sources

- https://www.authgear.com/post/session-vs-token-authentication  
- https://www.youtube.com/watch?v=VrWU8hNqn3c
