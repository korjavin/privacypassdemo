## An Interactive Guide to the Privacy Pass Protocol

This repository contains the complete architectural, educational, and developmental blueprint for Project AnonymityPass. The project's mission is to create the web's most intuitive and interactive explanation of the Privacy Pass protocol. The primary educational goal is to guide a student from a state of general awareness about online tracking to a deep, conceptual understanding of the cryptographic guarantees that enable anonymous authentication. This is achieved by deconstructing the protocol into its fundamental building blocks and using interactive demonstrations and powerful analogies at each step.

## Core Technology: The "What" and "Why" of Privacy Pass

The internet's classic authentication model, which relies on mechanisms like cookies and user logins, inherently links a user's identity to their actions. This creates a persistent tension between a service's need to verify a user's access rights and the user's right to privacy.1 Every authenticated action can be logged and used to build a detailed profile of an individual's behavior, associations, and lifestyle.
Privacy Pass emerges as a powerful solution to this problem. It is a cryptographic protocol, standardized by the IETF, that decouples the act of authentication (proving you have the right to access a service) from identification (revealing who you are).2 It allows a user to prove they are a legitimate member of an anonymity set (e.g., a paid Kagi subscriber) without the service provider knowing
which specific member they are for any given action.2
The core cryptographic primitive that makes this possible is the Verifiable Oblivious Pseudorandom Function (VOPRF). This protocol allows a server to perform a computation on a user's input without learning the input itself, and to provide a proof that the computation was done correctly according to a publicly known key.4

## How to Use This Repository

This repository is structured to provide a single source of truth for all project stakeholders, including the project director, content creators, and the team of independent coding agents.
/ARCHITECTURE.md: This document contains the technical blueprint of the system. It details the frontend and backend architecture, the API specification, and the requirements for the cryptographic simulation engine. All technical implementation must adhere to this specification.
/STEPS.md: This document is the educational and narrative core of the project. It outlines the user's learning journey, step-by-step, providing the concepts, analogies, and interactive goals for each section of the website. It is the source of truth for all content.
/tasks: This directory contains all developer tasks, broken down into self-contained, parallelizable units. Each task file specifies its goal, acceptance criteria, and the exact files the agent is permitted to modify to prevent merge conflicts.
/design: This directory contains detailed prompts for generating all required visual assets, including diagrams, illustrations, and flowcharts.
/presentation: This directory contains the script and plan for a live demonstration of the final, completed project.