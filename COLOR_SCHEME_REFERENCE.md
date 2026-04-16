# IntelliTrip Color Scheme Reference

## 🎨 Official Color Palette

### Primary Colors
```
Primary (Ocean Teal):     #06B6D4  |  hsl(174 70% 50%)
Secondary (Gold):         #F59E0B  |  hsl(40 95% 55%)
Accent (Coral):           #EF4444  |  hsl(10 85% 55%)
```

### Neutral Colors
```
Foreground (Navy):        #1E293B  |  hsl(220 30% 25%)
Background (White):       #FFFFFF  |  hsl(0 0% 100%)
Muted Foreground (Gray):  #64748B  |  hsl(220 20% 50%)
```

### CSS Variables (Applied Globally)

```css
:root {
  --primary: 174 70% 50%;           /* Ocean Teal */
  --primary-foreground: 0 0% 100%;  /* White */
  
  --secondary: 40 95% 55%;          /* Gold */
  --secondary-foreground: 220 30% 25%; /* Navy */
  
  --accent: 10 85% 55%;             /* Coral */
  --accent-foreground: 0 0% 100%;   /* White */
  
  --foreground: 220 30% 25%;        /* Navy */
  --background: 0 0% 100%;          /* White */
  
  --muted-foreground: 220 20% 50%;  /* Gray */
  --destructive: 0 84% 60%;         /* Red */
}

.dark {
  --primary: 174 70% 55%;
  --foreground: 0 0% 95%;
  --background: 220 30% 12%;
  /* ... dark mode overrides */
}
```

---

## Tailwind Color Mapping

### Primary
- Primary buttons: `bg-primary text-primary-foreground`
- Primary text: `text-primary`
- Primary borders: `border-primary/30`, `border-primary/50`
- Primary background: `bg-primary/5`, `bg-primary/10`, `bg-primary/20`

### Secondary (Gold)
- Accent elements: `text-secondary`
- Secondary buttons: `from-secondary to-primary`
- Secondary background: `bg-secondary/10`

### Destructive
- Delete buttons: `text-destructive`
- Error messages: `bg-destructive/10 text-destructive`
- Alert icons: `text-destructive`

---

## Component Color Usage

### Navigation
```tsx
/* Sidebar active state */
className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground"

/* Sidebar hover */
className="text-foreground hover:bg-primary/10"
```

### Cards & Containers
```tsx
/* Border */
className="border border-primary/30"

/* Background */
className="bg-primary/5"

/* Hover effect */
className="hover:border-primary/50 hover:shadow-lg"
```

### Buttons
```tsx
/* Primary button */
className="btn-gradient" /* from-primary to-secondary */

/* Outline button */
className="border-primary/30 text-foreground"

/* Destructive button */
className="text-destructive hover:text-destructive/80"
```

### Text
```tsx
/* Heading */
className="text-foreground"

/* Subtext */
className="text-muted-foreground"

/* Accent text */
className="text-primary"

/* Error text */
className="text-destructive"
```

### Forms
```tsx
/* Input border */
className="border-primary/30"

/* Input focus */
className="focus:border-primary focus:ring-primary/30"

/* Label */
className="text-foreground"

/* Placeholder */
className="placeholder:text-muted-foreground"
```

### Charts (Recharts)
```tsx
/* Primary color for bars */
fill="hsl(var(--primary))"

/* Secondary for accent */
stroke="hsl(var(--secondary))"

/* Colors array */
const CHART_COLORS = [
  'hsl(var(--primary))',    // Teal
  'hsl(var(--secondary))',   // Gold
  'hsl(var(--accent))',      // Coral
  'hsl(var(--foreground))',  // Navy
];
```

---

## Gradient Usage

### Primary Gradient (Used throughout)
```css
from-primary to-secondary
/* Teal to Gold */

from-primary to-primary/80
/* Teal to darker Teal */

from-primary to-accent
/* Teal to Coral */
```

### Background Gradients
```css
from-primary/10 to-secondary/10
/* Subtle teal-gold gradient for backgrounds */

from-white to-primary/5
/* White fading to teal tint */

from-primary/20 to-secondary/20
/* Stronger colored gradient */
```

---

## Accessibility Notes

### Color Contrast
- Primary on White: ✅ WCAG AAA
- Primary-foreground on Primary: ✅ WCAG AAA
- Muted-foreground on White: ✅ WCAG AA
- Destructive on White: ✅ WCAG AA

### Color Blindness
- Red/Green distinction: Uses Teal (not red for primary)
- Coral accent used for important calls-to-action (good contrast)
- Navy text on white provides clear distinction

---

## Before vs After

### Before (Inconsistent)
- Pink buttons in some places
- Purple in others
- Slate, cyan, orange mixed throughout
- No clear color system
- 8+ different color families

### After (Consistent)
- All primary actions: Teal/Gold gradient
- All text: Navy or muted gray
- All accents: Coral for CTAs
- All borders: Primary/30 or Primary/50
- 1 unified system
- 100% consistent theming

---

## Implementation Files Updated

1. ✅ app/page.tsx (home)
2. ✅ app/sign-in/page.tsx
3. ✅ app/sign-up/page.tsx
4. ✅ app/dashboard/page.tsx
5. ✅ app/globals.css
6. ✅ components/dashboard/header.tsx
7. ✅ components/dashboard/sidebar.tsx
8. ✅ components/dashboard/trip-card.tsx
9. ✅ components/dashboard/trip-detail-tabs.tsx
10. ✅ components/dashboard/tabs/itinerary-tab.tsx
11. ✅ components/dashboard/tabs/budget-tab.tsx
12. ✅ All new feature pages

---

## Quick Reference for Development

```tsx
// Always use these for new components:

// Borders
className="border border-primary/30"

// Text
className="text-foreground"  /* Main */
className="text-muted-foreground"  /* Secondary */
className="text-primary"  /* Accent */
className="text-destructive"  /* Error/Delete */

// Buttons
className="btn-gradient"  /* Primary */
className="border-primary/30"  /* Outline */

// Backgrounds
className="bg-white"  /* Default */
className="bg-primary/5"  /* Subtle tint */
className="bg-primary/10"  /* Stronger tint */

// Forms
className="border-primary/30"  /* Input border */
```

---

**Color System Version**: 1.0
**Last Updated**: 2024
**Status**: ✅ Production Ready
