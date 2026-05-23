---
name: Lumina Intelligence
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#831ada'
  on-secondary: '#ffffff'
  secondary-container: '#9e41f5'
  on-secondary-container: '#fffbff'
  tertiary: '#004598'
  on-tertiary: '#ffffff'
  tertiary-container: '#005cc6'
  on-tertiary-container: '#cedbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#6800b4'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 48px
  gutter: 24px
  section-gap: 80px
---

## Brand & Style
The design system is centered on the concept of "Ethereal Intelligence." It balances a clean, minimalist structural foundation with vibrant, fluid energy. The target audience includes tech-forward creators and professionals who seek an interface that feels less like a tool and more like an enlightened assistant.

The visual style is a fusion of **Modern Minimalism** and **Glassmorphism**. It utilizes expansive whitespace to create a sense of calm, while employing multi-layered frosted glass effects to suggest depth and sophistication. High-tech "spark" accents—manifesting as subtle glows and animated gradients—act as indicators of AI activity, making the interface feel alive and responsive. The emotional goal is to evoke a sense of wonder, clarity, and limitless potential.

## Colors
The palette is anchored in a serene "Light Mode" base using off-whites and cool grays to maintain high legibility. The primary visual interest comes from a sophisticated trio of **Indigo, Violet, and Blue**, which should be used in fluid, sweeping gradients rather than flat blocks of color.

**Soft Amber** is reserved strictly for "Spark" moments—iconography or small UI elements that signify AI insight or successful generation. Backgrounds should remain neutral to allow the glassmorphic blurs and vibrant accents to stand out without creating visual clutter.

## Typography
The typography system uses **Plus Jakarta Sans** for headlines to provide a friendly, geometric, and modern character. It features a slight negative letter-spacing in larger display sizes to create a more "editorial" and high-end tech feel. 

**Inter** is utilized for body text and labels to ensure maximum functional clarity and cross-platform reliability. When displaying AI-generated content, use the `body-lg` scale with increased line height to improve readability and give the content "room to breathe."

## Layout & Spacing
The layout follows a **Fluid Grid** model with an emphasis on generous margins to reinforce the minimalist brand identity. 

- **Desktop:** 12-column grid with 48px outer margins and 24px gutters.
- **Mobile:** 4-column grid with 20px outer margins and 16px gutters.

Spacing should be used to group related concepts into "islands" of content. High-level sections are separated by large vertical gaps (`section-gap`) to prevent the interface from feeling cramped. Elements should often be centered or use asymmetrical white space to create a dynamic, futuristic feel.

## Elevation & Depth
This design system rejects heavy shadows in favor of **Tonal Layers** and **Glassmorphism**. Depth is communicated through:

1.  **Backdrop Blurs:** Floating surfaces (like navigation bars or modals) use a 20px-32px blur radius with a semi-transparent white tint (60-80% opacity).
2.  **Inner Glows:** Instead of drop shadows, use subtle 1px white inner borders on glass elements to simulate light catching the edge of a physical lens.
3.  **Ambient Glows:** Large, soft, low-opacity colored orbs (Indigo/Violet) are placed deep in the background layer to provide a sense of atmospheric perspective.
4.  **Elevation via Contrast:** Active elements are lifted using a primary gradient fill, while inactive elements remain flat against the surface.

## Shapes
The shape language is defined by large, "squircle"-adjacent radii that feel soft and organic. Standard containers use `rounded-lg` (16px) or `rounded-xl` (24px) to avoid any sharp, aggressive corners. 

Buttons and input fields should lean toward a high degree of roundedness to maintain the approachable, futuristic aesthetic. Interactive "pills" are encouraged for tags and chips to contrast against the more structural rectangular cards.

## Components

### Buttons
Primary buttons use the fluid indigo-to-blue gradient with white text. They should have a subtle outer glow on hover that matches the gradient colors. Secondary buttons use a "ghost" glass style: a frosted background with a thin, semi-transparent border.

### Cards
Cards are the primary container unit. They should be styled with a white background at 70% opacity, a 32px backdrop blur, and a 1px border (#FFFFFF33). Do not use shadows; let the blur define the separation from the background.

### Input Fields
Inputs are minimalist, utilizing a soft gray background that turns into a vibrant indigo-tinted border upon focus. The cursor or "AI typing" indicator should use the Soft Amber "spark" color.

### AI Spark Accents
Small, 4-pointed star icons or animated "shimmer" gradients should be applied to features powered by intelligence. These should use the `accent_spark_hex` or a high-contrast violet-to-amber gradient.

### Chips & Lists
Chips are fully pill-shaped. Lists should have generous vertical padding (16px+) between items to maintain the "airy" feel of the system. Use subtle dividers with 10% opacity to separate items without breaking the visual flow.