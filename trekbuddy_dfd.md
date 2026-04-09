# TrekBuddy: Data Flow Diagrams (DFD)

This document outlines the data workflows for the TrekBuddy application. It includes the **Level 0 Context Diagram**, the **Level 1 Process Breakdown**, and a dedicated data flow for the **AI Itinerary Planner**.

---

## 1. Context Diagram (Level 0 DFD)
The Level 0 diagram shows the entire TrekBuddy system as a single process interacting with external entities (Users, Admins, and Third-Party APIs).

```mermaid
flowchart TD
    %% External Entities
    User([Tourist / User])
    Admin([Administrator])
    
    %% Main System Process
    System((TrekBuddy Application Engine))
    
    %% External APIs
    Groq[Groq AI / LLM API]
    Maps[Google Maps / Navigation API]
    Forex[ExchangeRate API]

    %% Data Flows
    User -- "Search queries, Travel Preferences, Credentials" --> System
    System -- "Tailored Recommendations, UI Visuals, Itineraries" --> User

    Admin -- "New Place Data, Event Additions, Configs" --> System
    System -- "Dashboard Analytics, Operation Status" --> Admin

    System -- "Location Coordinates / Place details" --> Maps
    Maps -- "Interactive Map Routing" --> System

    System -- "Structured Trip Parameters (Budget, Days)" --> Groq
    Groq -- "Generated JSON Itinerary Object" --> System

    System -- "Base currency conversion request" --> Forex
    Forex -- "Live exchange rate payload" --> System
```

---

## 2. Main System Processes (Level 1 DFD)
The Level 1 diagram breaks the TrekBuddy system down into its 4 core sub-processes and shows how data moves between them and the core database.

```mermaid
flowchart LR
    %% Entities
    User([Tourist])
    ExtAPI[External APIs: Maps, AI, Forex]
    DB[("MongoDB Data Store\n(Users, Places, Events)")]

    %% Sub-Processes
    subgraph TrekBuddy System Processes
        P1((1.0 \n Authentication \n & Session))
        P2((2.0 \n Place Discovery \n & Search))
        P3((3.0 \n AI Trip Planner \n Module))
        P4((4.0 \n Utilities \n (Currency, Emergency)))
    end

    %% Flows for 1.0
    User -- "Login / Signup details" --> P1
    P1 -- "Validate / Insert" --> DB
    DB -- "User Profile" --> P1
    P1 -- "Auth Token (JWT/Session)" --> User

    %% Flows for 2.0
    User -- "Category Filters, Search Terms" --> P2
    P2 -- "Fetch Indexed Data" --> DB
    DB -- "List of matching places" --> P2
    P2 -- "Rendered Place Cards" --> User

    %% Flows for 3.0
    User -- "Trip Needs (Pace, Budget, Days)" --> P3
    P3 -- "Fetch relevant places" --> DB
    DB -- "Seed Data" --> P3
    P3 -- "Prompt Payload" --> ExtAPI
    ExtAPI -- "Validated JSON" --> P3
    P3 -- "Finalized Trip UI" --> User

    %% Flows for 4.0
    User -- "Currency Value (e.g., 50 EUR)" --> P4
    P4 -- "Fetch Base Rates" --> ExtAPI
    ExtAPI -- "Rate Payload" --> P4
    P4 -- "Calculated INR Value" --> User
```

---

## 3. Deep-Dive: AI Itinerary Generator Data Flow
As we recently optimized the Planner code, here is the exact step-by-step data mutation sequence for the **Groq AI trip generation feature**.

```mermaid
sequenceDiagram
    participant UI as Next.js Frontend
    participant Server as Next.js Server Action
    participant DB as Place Data (Local/DB)
    participant Groq as Groq JSON API

    UI->>Server: POST /generateItinerary (draft: TripDraft)
    
    rect rgb(240, 248, 255)
        note right of Server: 1. Process Draft
        Server->>Server: Calculate total days (Start - End)
        Server->>Server: Extract user interests
    end

    Server->>DB: Fetch all PLACES_DATA
    DB-->>Server: Return 100+ raw place objects

    rect rgb(240, 248, 255)
        note right of Server: 2. Trim Token Usage
        Server->>Server: Filter down to max 25 places based on interests/cost
        Server->>Server: Build formatted string 'placesContext'
    end

    Server->>Groq: Generate JSON (Prompt + Context, strictly mapped wrapper)
    Groq-->>Server: JSON String {"itinerary": [ ... ]}

    rect rgb(240, 248, 255)
        note right of Server: 3. Parse & Validate
        Server->>Server: extractJson(response)
        Server->>Server: Validate Array logic inside 'itinerary' key
    end

    Server-->>UI: Return typed array of DailyItinerary[]
    UI-->>UI: Render 'ItineraryModal' to Tourist
```
