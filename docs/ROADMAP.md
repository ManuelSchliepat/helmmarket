# Helm Market — Roadmap & TODO

## 🎨 Design Direction
- [ ] **Minimalist Overhaul:** Redesign Helm Market UI/UX inspired by [smithery.ai](https://smithery.ai) — clean, minimal, developer-focused aesthetic. This is the target style for the entire platform.
- [ ] **Permanent Reference:** Always consult smithery.ai's style when building new UI components.

## 🔴 Priority 1 — Current Sprint
- [ ] Agent Console Frontend testen und Bugs fixen
- [ ] Clerk Webhook Sync verifizieren (neue User → public.users)
- [ ] Agent erstellen + Chat-Interface End-to-End testen

## 🟡 Priority 2 — Next Up
- [ ] **Agent Identity Passport:** Jeder Agent bekommt einen DID-basierten "Helm Passport" als persistente Identität (USP gegenüber anderen Marketplaces)
- [ ] **Execution Analytics Dashboard:** skill_executions visualisieren (Performance Monitor)
- [ ] **Agent Sharing:** Agents öffentlich im Marketplace teilen

## 🟢 Priority 3 — Backlog
- [ ] Stripe Connect Onboarding Flow finalisieren
- [ ] Node Graph Dashboard (Konzept 3) als zentrale Skill-Visualisierung
- [ ] Git Log Timeline (Konzept 4) für Installations-History
- [ ] Agent-to-Agent Interaktionen im Marketplace

## 💡 Skill Ideas
- [ ] **AI-generierte App Screenshots:** Interne Pipeline statt shot.so (Marketplace skill concept, not a platform feature).

## 📝 Notes
- **Agent Identity Passport:** Basierend auf W3C DIDs + Verifiable Credentials. NIST und IETF arbeiten an Standards (Stand März 2026). Helm Market integriert das als nativen Layer — kein separates Produkt.
- **Revenue Ziel:** 10k-100k/Tag
