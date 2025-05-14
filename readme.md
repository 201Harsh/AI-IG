# 🎨 EndPix AI - AI Image Generator (MERN + EndGaming AI) [![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

A cutting-edge AI image generation platform built with React, Node.js, and integrated with EndGaming AI's powerful image generation API. Transform text prompts into stunning visual artworks with multiple style options and customization features.

---

![Project Banner](https://img.shields.io/badge/BANNER-COMING_SOON-blue?style=for-the-badge&logo=react&logoColor=white&color=61DAFB&labelColor=20232A)

An AI-powered image generator that creates high-quality visuals from text descriptions. Features 12+ art styles, multiple orientations, and a credit-based system to manage API usage.

[![React Version](https://img.shields.io/badge/React-18.2.0-blue)](https://react.dev/)
[![Node Version](https://img.shields.io/badge/Node-18.16.0-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0.9-green)](https://www.mongodb.com/)

---

## 🎛️ Table of Contents

- [🌟 Key Features](#-key-features)
- [🏗️ System Architecture](#-system-architecture)
- [🎨 Style Gallery](#-style-gallery)
- [🗺 Roadmap](#-roadmap)
- [📮 Contact & Support](#-contact--support)

---

## 🌟 Key Features

| Feature                      | Description                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| 🖼️ **AI Image Generation**   | Transform text prompts into stunning visuals with EndGaming AI |
| 🎨 **12+ Art Styles**        | Choose from UltraReal, Anime, Cyberpunk, Oil Painting, etc.    |
| 📐 **Multiple Orientations** | Portrait, Landscape, and Square output options                 |
| 🔒 **JWT Authentication**    | Secure user authentication with token refresh                  |
| 💳 **Credit System**         | Usage-based credit management (1 credit/generation)            |
| 🕰️ **Generation History**    | View and manage your previously created images                 |
| ⚡ **Real-Time Preview**     | Interactive interface with progress indicators                 |

---

## 🔷 Style Matrix

| Style        | Best For                   | Example Output    |
| ------------ | -------------------------- | ----------------- |
| UltraReal    | Photorealistic images      | ![UltraReal](https://images.unsplash.com/photo-1514315384763-ba401779410f?q=80&w=1583&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)   |
| Realistic    | Total Real Image      | ![Realistic](https://images.unsplash.com/photo-1601217672201-cca23494ed2c?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)   |
| Anime        | Japanese animation style   | ![Anime](https://images.unsplash.com/photo-1657815555962-297100ce4b0e?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)       |
| Cyberpunk    | Futuristic neon aesthetics | ![Cyberpunk](https://images.unsplash.com/photo-1575365717666-1a84be3fd104?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)   |
| Oil Painting | Classical art look         | ![OilPainting](https://images.unsplash.com/photo-1746309820725-7b20b6e82cef?q=80&w=1538&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D) |

---

# 🏗️ System Architecture

```mermaid
graph TD
    User[👤 User] --> FE[🌐 Frontend - React]
    FE --> BE[🖥️ Backend - Node.js/Express]
    BE --> DB[(🗄️ MongoDB)]
    BE --> AI[🤖 EndGaming AI API]
```

```mermaid
graph TB
    A[🖼️ AI Image Gen] --> A1[`EndGaming AI Integration`]
    B[🎨 Style Options] --> B1[`12+ artistic styles`]
    C[📐 Orientation] --> C1[`Portrait/Landscape/Square`]
    D[💳 Credit System] --> D1[`1 credit per generation`]
    E[🕰️ History] --> E1[`Browse past creations`]
    F[⚡ Real-Time] --> F1[`Progress indicators`]

    subgraph Style_Matrix
        SM1[UltraReal] --> SM1D[`Photorealistic outputs`]
        SM2[Anime] --> SM2D[`Japanese animation style`]
        SM3[Cyberpunk] --> SM3D[`Neon futuristic aesthetic`]
    end

    B --> Style_Matrix
```

# 🗺 Roadmap

- 🖼️ Bulk Image Generation

- 🔍 High-Resolution Image Upscaling

- 🎨 Train Your Own Style

- ✏️ AI-Powered Image Editing

- 🌐 Public Community Gallery

# 📮 Contact & Support

\*Developer: Harsh
GitHub: @201Harsh
Email: support@endgamingai.com

---

## Made With ❤️ by Harsh | Powered by EndGaming AI
