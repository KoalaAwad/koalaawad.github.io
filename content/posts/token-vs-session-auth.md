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

# Session Authentication

A session is a server-side record representing a user’s authenticated state. This record exists until the user’s authentication expires whether by logging out, or set expiration rules.  
Session authentication is where once a user logs in, the server stores information about the user’s authentication identity on a DB, making it stateful. This data is then returned to the user in the form of a cookie, and in subsequent requests, the generated cookie is sent alongside them.  

So, let’s say, for example, a user with a private Twitter account wants to see their posts. They enter their credentials and log in. Once the server verifies the credentials, it will generate a session record and store it server-side, which may look like this:

```json
{
  "session_id": "7f9c2e4a9b...",
  "user_id": 12345,
  "username": "alice",
  "authenticated": true,
  "roles": ["USER"],
  "created_at": "2026-01-07T10:12:00Z"
}
```

The important value to note here is `session_id`, which will now be sent back to the client as a cookie:

```
Set-Cookie: session_id=7f9c2e4a9b...;
```

The user now has their authentication information stored in a cookie. When the user opens their account to see their posts, a request is sent to the server containing that cookie.

```vbnet
GET /my/private-posts
Cookie: session_id=7f9c2e4a9b...
```

The server logic will see that the data is private and can only be accessed by a specific user (which it tracks using `user_id`). It will check if the session ID sent by the client:  
A. matches that of an existing record  
B. matches the user that is allowed to see the private posts  

Finally, the server responds with the requested resources.

**Advantages:**
- Easier to use in web-based applications since cookies are supported on the browser
- Session cookies are naturally small, making them efficient for storage on client-side

**Limitations:**
- Harder to scale since the cookies are stored in a database server-side
- Multiple domains become problematic since cookies typically work on a single domain
- Security risk: cookies are susceptible to Cross-Site Request Forgery

---

# Token Authentication

Tokens (such as JWTs) are cryptographically signed data that is stored by the user and sent alongside requests so servers can verify their authenticity.  
A good analogy is to think of tokens as a ticket to a movie resource. Your ticket gains you access to your movie and no other, so when the cashier hands you the ticket and you hand it to the theatre staff, they don’t have to authenticate that you are the buyer – they just validate your ticket.

In other words, when a user logs in using their credentials, the server will verify the credentials and return a signed token. The client receives this token and stores it locally. The token is then placed in the “Authorization” header of subsequent requests, and the server only verifies if the token is valid.  

Typical web API token authentication request headers:

```
> GET /api_path HTTP/1.1
> Host: yourdomain.com
> Authorization: Bearer <AUTHGEAR_ACCESS_TOKEN>
```

Finally, if the user logs out of the application, the client deletes the token from local storage.

**Advantages:**
- Mobile devices are far easier to implement
- Avoiding database lookups for sessions is faster and easier to scale
- Supports multiple complex infrastructures with multiple domains
- CSRF risks are reduced when JWTs are sent via Authorization headers rather than cookies

**Limitations:**
- JWTs are significantly larger than cookies since they store a lot more information
- If a token is hijacked by hackers, the server has a harder time invalidating them

---

# When to Implement Session vs Token

There are practical decision rules engineers follow when deciding whether their service should handle authentication via session-based auth or token-based auth.  

**Session-based authentication is recommended when:**
- The application is browser-first, i.e., traditional webapps with server-rendered pages
- You want the ability to admin-force logouts or instantly revoke sessions for compromised accounts
- The application has high-risk data access, and you wish to control sessions, e.g., allow only 1 active session per user

**Token-based authentication is recommended when:**
- You wish to scale to mobile applications, since session cookies aren’t native, tokens can be implemented more seamlessly
- The application is distributed in a microservice architecture where trust must cross domains or organizations
- Implementing single sign-on and wanting to give a single user identity access to multiple organizations or independent systems

---

## Sources

- https://www.authgear.com/post/session-vs-token-authentication  
- https://www.youtube.com/watch?v=VrWU8hNqn3c
