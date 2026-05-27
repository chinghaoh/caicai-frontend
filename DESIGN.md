# Caicai — DESIGN.md

Read this before writing any UI code. No exceptions.

---

## Theme

Dark theme only. No light theme until explicitly added as a feature.

Background: `#111111` — not pure black, slightly warm
Cards: `#1a1a1a`
Inputs: `#242424`
Border: `#2e2e2e`

---

## Color Mapping — Never Deviate

| Nutrient | Color | Hex |
|----------|-------|-----|
| Calories | green | `#4ade80` |
| Protein | blue | `#3b82f6` |
| Carbs | orange | `#f97316` |
| Fat | yellow | `#eab308` |
| Water | sky | `#0ea5e9` |

Always use these exact colors for these exact nutrients. Never swap them.

---

## Typography — Strict Rules

Two font sizes cover 95% of the UI:
- `text-sm` — labels, helper text, timestamps, brand names
- `text-base` — body text, inputs, buttons, food names

Exceptions (use sparingly):
- `text-xs` — field error messages only
- `text-lg` — page titles only
- `text-2xl` — stat values (calorie number, macro values in StatCard)

**Never use:** `text-xl`, `text-3xl`, `text-4xl` or anything not listed above.

---

## Icons

Lucide icons only. Never use Material Symbols, emojis, or any other icon library.

```jsx
import { Flame, Droplets, TrendingUp } from 'lucide-react'
```

---

## Emojis

Never in UI text — headings, labels, buttons, error messages, body text.

Only acceptable in `EmptyState` icon prop:
```jsx
<EmptyState icon="🍽️" title="No meals logged yet" />
```

---

## Navigation

**Mobile:** Bottom navigation bar — fixed, 5 items
```
Dashboard | Log | Trends | Goals | Settings
```

Active state: white icon + green label dot indicator. Never full green icon.

**Desktop:** Sidebar navigation — `hidden md:flex`

---

## Components

### Circular Progress Ring
Used for: calories (hero, large), protein/carbs/fat (small)

- Calories ring: large, centered, `stroke="#4ade80"`
- Macro rings: small (48px), color per nutrient mapping above
- Track color: `#242424`
- Shows: percentage inside ring, grams + label below

### Food Item Card
```
Food name (text-base font-semibold)
Brand (text-sm text-muted uppercase)
Macro dots: ● P 31g  ● C 0g  ● F 3.6g
[+] button (green, rounded)
```

Color dots follow nutrient color mapping above.

### Meal Filter Pills
Horizontal scroll, 4 options: Breakfast | Lunch | Dinner | Snack
Active: white background, dark text
Inactive: transparent background, border, muted text

### AI Suggestion Card
- "AI SUGGESTION" badge at top (green, small)
- "Target Found" headline
- Warm explanation text — never corporate language
- Calories hero card (large green number)
- 2x2 macro grid (protein, carbs, fat, water)
- Two full-width buttons: "Looks good" (green) / "Adjust manually" (outlined)

### Onboarding Form
- 3 steps with progress bar at top
- Skip button top right
- Gender: Male | Female only (cards with icons)
- Inputs: rounded, dark background, no border — focus ring green
- Continue / Back buttons at bottom

---

## Spacing

Consistent throughout:
- Card padding: `p-4`
- Card border radius: `rounded-xl`
- Gap between cards: `gap-3`
- Page padding: `px-4`

---

## What Not To Do

- Never hardcode hex colors — always use theme variables
- Never use neon/electric green — use `#4ade80` not `#22c55e`
- Never put emojis in nav, buttons, or labels
- Never use full green for active nav icon — white icon + green dot only
- Never invent new font sizes
- Never use Material Symbols icons

---

## Component Inventory

Complete list of reusable components. Build shared ones before any pages.

### Layout
- `BottomNav` — mobile navigation bar
- `Sidebar` — desktop navigation
- `PageHeader` — page title + optional action button
- `SectionHeader` — section title + optional subtitle/count

### Data Display
- `StatCard` — label + large value + unit
- `MacroCard` — circular ring + grams + label (protein/carbs/fat)
- `CalorieRing` — large circular progress ring (dashboard hero)
- `ProgressBar` — linear progress bar
- `FoodItemCard` — food name + brand + macro dots + add button
- `WeightCard` — current weight + target + trend line
- `WaterCard` — current/goal + quick-add button

### Forms & Inputs
- `Input` — styled text/number input with label + error
- `Button` — primary, secondary, danger variants
- `FilterPills` — horizontal scrollable pill selector
- `RadioCard` — selectable card (gender, activity, goal type)

### Feedback
- `LoadingSpinner`
- `EmptyState` — icon + title + description + optional action
- `ErrorMessage` — page-level error with optional retry button
- `Pagination`
- `SessionExpiredModal`
- `MacroBadge` — colored dots P/C/F inline (food item cards)

### Build Order
Build these five first — they appear on almost every page:
1. Button
2. Input
3. PageHeader
4. SectionHeader
5. StatCard

---

## State Management

- AuthContext — user, isAuthenticated, login, logout
- Never prop drill auth state — always use useAuth() hook
- apiClient is a utility, import directly, no context needed
- Component data passes as props — never put it in context

---

## Cursor Rules

Always add `cursor-pointer` to any interactive element that is not a native button or link:
- Buttons — `cursor-pointer` in base classes
- Selectable table/list rows
- Radio cards (gender, activity, goal type)
- Filter pills
- Food item cards (the row itself)
- Any `div` or `span` with an `onClick` handler

Rule: if it does something when clicked, it needs `cursor-pointer`.
Native `<button>` and `<a>` elements already have it by default in most browsers,
but add it explicitly to be safe.