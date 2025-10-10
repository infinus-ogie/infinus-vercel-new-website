# Advanced Hero Components

This directory contains modern hero components with shader backgrounds for the Infinus website.

## Components

### `hero-advanced.tsx`
A flexible hero component with three display modes:

- **`shader`** (default): Uses neural network-inspired shader background
- **`image`**: Uses static image background
- **`split`**: Split layout with content and side image

### `neural-shader-bg.tsx`
A WebGL shader component that creates animated neural network patterns using Three.js.

## Usage

### Basic Shader Hero
```tsx
import HeroAdvanced from "@/components/ui/hero-advanced";

<HeroAdvanced
  mode="shader"
  title="Your Title Here"
  description="Your description here"
  badge={{ label: "Program", text: "GROW with SAP" }}
  ctas={[
    { text: "Primary Action", href: "#", primary: true },
    { text: "Secondary Action", href: "#" }
  ]}
/>
```

### Image Background Hero
```tsx
<HeroAdvanced
  mode="image"
  title="Your Title Here"
  description="Your description here"
  bgImage={{ src: "/path/to/image.jpg", alt: "Description" }}
  ctas={[
    { text: "Primary Action", href: "#", primary: true }
  ]}
/>
```

### Split Layout Hero
```tsx
<HeroAdvanced
  mode="split"
  title="Your Title Here"
  description="Your description here"
  sideImage={{ src: "/path/to/image.jpg", alt: "Description" }}
  ctas={[
    { text: "Primary Action", href: "#", primary: true }
  ]}
/>
```

## Features

- **Animated Text**: Uses SplitType and GSAP for smooth text animations
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Respects `prefers-reduced-motion` settings
- **Performance**: Lazy loads Three.js components
- **Customizable**: Easy to modify colors, animations, and content

## Dependencies

- `three` - WebGL library
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for react-three-fiber
- `gsap` - Animation library
- `@gsap/react` - React integration for GSAP
- `split-type` - Text splitting for animations

## Demo

Visit `/hero-demo` to see all three modes in action.
