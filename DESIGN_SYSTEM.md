# IntelliTrip - Pastel Pink & Purple Design System

## Overview
IntelliTrip now features a soft, aesthetically pleasing design built on a pastel pink and purple color palette. The design emphasizes elegance, calmness, and a modern travel-friendly aesthetic.

## Color Palette

### Primary Colors
- **Pastel Pink**: `hsl(320 90% 70%)` - Main brand color for buttons, accents, and highlights
- **Soft Lavender**: `hsl(270 75% 75%)` - Complementary secondary color
- **Medium Purple**: `hsl(280 70% 60%)` - Call-to-action buttons and interactive elements
- **Dark Purple**: `hsl(280 30% 25%)` - Text, headings, and important content

### Neutral Colors
- **Light Background**: `hsl(290 100% 97%)` - Soft, minimal page background
- **White**: `hsl(0 0% 100%)` - Card backgrounds and primary surfaces
- **Soft Gray**: `hsl(270 30% 90%)` - Muted borders and subtle dividers

## Typography

### Font Family
- **Sans-serif**: Geist (primary font for all text)
- **Monospace**: Geist Mono (for code and technical content)

### Text Colors
- **Primary Text**: Dark purple (`hsl(280 30% 25%)`) on light backgrounds
- **Secondary Text**: Purple with reduced opacity (`text-purple-600/70`)
- **Muted Text**: Very light purple (`text-purple-400`)

## Component Styling

### Buttons
All buttons feature a gradient from pastel pink to purple:
```
bg-gradient-to-r from-pink-400 to-purple-400 
hover:from-pink-500 hover:to-purple-500 
text-white font-medium rounded-full shadow-md
```

### Cards
Cards have:
- Rounded corners (`rounded-2xl`)
- Soft borders (`border border-purple-200/50`)
- Light gradient backgrounds (`bg-gradient-to-br from-white to-pink-50/30`)
- Subtle shadows (`shadow-sm hover:shadow-md`)

### Input Fields
Inputs feature:
- Purple borders with low opacity
- White backgrounds with subtle transparency
- Purple text and placeholders
- Pink focus states with subtle rings

### Navigation & Sidebar
- Gradient background from purple to pink
- Active menu items show pink-to-purple gradient
- Smooth transitions on hover

## Effects & Animations

### Glassmorphism
Elements use:
- Semi-transparent backgrounds
- Backdrop blur effects
- Soft borders for a frosted glass appearance

### Gradients
Soft pink-to-purple gradients are used for:
- Hero section backgrounds
- Button hover states
- Card accents
- Progress bars

### Hover Effects
All interactive elements include:
- Smooth shadow transitions
- Scale effects
- Color deepening on hover
- Rounded transitions (300ms default)

## Accessibility Considerations

✓ **Contrast**: All text maintains minimum 4.5:1 contrast ratio
✓ **Color**: Pastel theme doesn't rely on color alone for information
✓ **Spacing**: Generous padding and rounded corners ensure clickability
✓ **Transitions**: Smooth animations respect user preferences
✓ **Focus States**: Clear, visible focus indicators for keyboard navigation

## Usage Guidelines

### Do's
- Use pastel pink for primary CTAs
- Use purple for secondary actions
- Combine gradients for visual interest
- Apply soft shadows to elevate surfaces
- Use rounded corners throughout (minimum `rounded-xl`)

### Don'ts
- Don't use solid colors without gradients for buttons
- Don't mix the pastel palette with harsh, bright colors
- Don't use thin borders; maintain `border-purple-200/50` or stronger
- Don't create elements without rounded corners
- Don't eliminate shadows; maintain subtle elevation

## Component Reference

### Featured Components
1. **Home Page**: Gradient hero section with glassmorphism cards
2. **Sidebar**: Gradient background with animated menu items
3. **Trip Cards**: Rounded cards with soft borders and hover effects
4. **Forms**: Pastel-themed inputs with focus states
5. **Dashboard**: Gradient backgrounds with layered cards
6. **Tabs**: Soft backgrounds with rounded containers
7. **Chat Interface**: Gradient message bubbles

## File Structure
- **globals.css**: Theme variables and utility classes
- **app/page.tsx**: Home page with gradient hero
- **components/dashboard/**: All dashboard components with pastel styling
- **app/dashboard/**: Dashboard pages with consistent theming

## Future Enhancements
- Add dark mode support with adjusted pastel values
- Create CSS variable system for easy theme swapping
- Add more gradient combinations for visual variety
- Implement theme customization options
