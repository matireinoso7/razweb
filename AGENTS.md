# RazWeb — Guía para agentes

Portal de noticias de IA y tecnología (Next.js App Router). Modos de diseño: **Operate** (feed, filtros, favoritos) y **Read** (artículo `/noticia/[id]`).

## Skills locales (27)

Leer el `SKILL.md` completo cuando el trabajo encaje con la descripción.

| Skill | Ruta | Cuándo usar en RazWeb |
|-------|------|------------------------|
| animate | `C:\Users\matir\.cursor\skills\animate\SKILL.md` | Transiciones, view transitions, micro-interacciones UI |
| animate-expo | `C:\Users\matir\.cursor\skills\animate-expo\SKILL.md` | Solo si hubiera app React Native |
| animation-vocabulary | `C:\Users\matir\.cursor\skills\animation-vocabulary\SKILL.md` | Nombrar efectos de motion |
| apple-design | `C:\Users\matir\.cursor\skills\apple-design\SKILL.md` | Gestos, springs, jerarquía visual |
| ask-sonner | `C:\Users\matir\.cursor\skills\ask-sonner\SKILL.md` | Toasts (si se añaden) |
| emil-design-eng | `C:\Users\matir\.cursor\skills\emil-design-eng\SKILL.md` | Polish UI, motion tokens |
| find-animation-opportunities | `C:\Users\matir\.cursor\skills\find-animation-opportunities\SKILL.md` | Auditar motion faltante |
| impeccable | `C:\Users\matir\.cursor\skills\impeccable\SKILL.md` | Layout, tipografía, UX del frontend |
| improve-animations | `C:\Users\matir\.cursor\skills\improve-animations\SKILL.md` | Roadmap de motion |
| mobile-native | `C:\Users\matir\.cursor\skills\mobile-native\SKILL.md` | Web móvil, tap targets, viewport |
| visualize | `C:\Users\matir\.cursor\skills\visualize\SKILL.md` | Diagramas en chat |
| write-swift | `C:\Users\matir\.cursor\skills\write-swift\SKILL.md` | No aplica salvo cliente iOS |
| automate | `C:\Users\matir\.cursor\skills-cursor\automate\SKILL.md` | Automations Cursor |
| autopilot | `C:\Users\matir\.cursor\skills-cursor\autopilot\SKILL.md` | PR merge-ready, CI |
| canvas | `C:\Users\matir\.cursor\skills-cursor\canvas\SKILL.md` | Artefactos visuales en canvas |
| create-hook | `C:\Users\matir\.cursor\skills-cursor\create-hook\SKILL.md` | Hooks de agente |
| create-rule | `C:\Users\matir\.cursor\skills-cursor\create-rule\SKILL.md` | Reglas `.cursor/rules` |
| create-skill | `C:\Users\matir\.cursor\skills-cursor\create-skill\SKILL.md` | Nuevas skills |
| loop | `C:\Users\matir\.cursor\skills-cursor\loop\SKILL.md` | Tareas recurrentes |
| new-repo | `C:\Users\matir\.cursor\skills-cursor\new-repo\SKILL.md` | Hosting en Cursor |
| origin | `C:\Users\matir\.cursor\skills-cursor\origin\SKILL.md` | CLI origin |
| review-bugbot | `C:\Users\matir\.cursor\skills-cursor\review-bugbot\SKILL.md` | Review de cambios antes de PR |
| review-security | `C:\Users\matir\.cursor\skills-cursor\review-security\SKILL.md` | Auth, API, XSS |
| sdk | `C:\Users\matir\.cursor\skills-cursor\sdk\SKILL.md` | Integraciones SDK Cursor |
| share | `C:\Users\matir\.cursor\skills-cursor\share\SKILL.md` | Backup del proyecto |
| split-to-prs | `C:\Users\matir\.cursor\skills-cursor\split-to-prs\SKILL.md` | PRs pequeños |
| statusline | `C:\Users\matir\.cursor\skills-cursor\statusline\SKILL.md` | Status line CLI |
| update-cursor-settings | `C:\Users\matir\.cursor\skills-cursor\update-cursor-settings\SKILL.md` | settings.json |

## Flujo recomendado (UI)

1. `impeccable` — jerarquía y layout  
2. `animate` / `emil-design-eng` — motion  
3. `mobile-native` — responsive táctil  
4. `review-bugbot` / `review-security` — antes de merge en cambios auth/API

## Convenciones del repo

- Componentes en `src/components/`; API en `src/app/api/`.
- Tokens CSS en `src/app/globals.css` (`--teal-*`, `--ease-spring`).
- Noticias: dominio en `src/domain/`, Prisma en `src/infrastructure/`.
