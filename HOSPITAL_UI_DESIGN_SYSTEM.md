# Hospital Management System - Modern UI/UX Design System

## 🎨 Design Philosophy

**Vision**: Create a calming, professional, and efficient hospital management interface that reduces cognitive load and promotes a healing, peaceful atmosphere.

**Core Principles**:
- **Healing Colors**: Soft medical blues, greens, and whites
- **Breathing Space**: Generous padding and whitespace
- **Clarity First**: Clear hierarchy, readable typography
- **Smooth Interactions**: Subtle animations and transitions
- **Medical Professional**: Clean, sterile, organized aesthetic
- **Accessible**: WCAG 2.1 AA compliant

---

## 🎨 Color Palette

### Primary Colors (Medical Blue)
```css
--primary: oklch(0.58 0.14 220)          /* Soft Medical Blue */
--primary-foreground: oklch(1 0 0)       /* Pure White */
--primary-light: oklch(0.75 0.10 220)    /* Light Blue Accent */
--primary-dark: oklch(0.45 0.16 220)     /* Deep Blue */
```

### Secondary Colors (Healing Green)
```css
--secondary: oklch(0.88 0.05 160)        /* Soft Mint Green */
--secondary-foreground: oklch(0.25 0.04 160) /* Dark Green Text */
--secondary-accent: oklch(0.68 0.12 160) /* Medical Green */
```

### Accent Colors (Calm Teal)
```css
--accent: oklch(0.70 0.10 200)           /* Calm Teal */
--accent-foreground: oklch(0.98 0 0)     /* Near White */
--accent-light: oklch(0.85 0.06 200)     /* Light Teal */
```

### Backgrounds & Surfaces
```css
--background: oklch(0.98 0.005 220)      /* Off-White with Blue hint */
--foreground: oklch(0.25 0.015 220)      /* Dark Blue-Gray */
--card: oklch(1 0 0)                     /* Pure White */
--card-foreground: oklch(0.25 0.015 220) /* Dark Text */
--muted: oklch(0.95 0.01 220)            /* Very Light Blue-Gray */
--muted-foreground: oklch(0.50 0.02 220) /* Medium Gray */
```

### Status Colors
```css
--success: oklch(0.65 0.15 150)          /* Medical Green */
--success-foreground: oklch(1 0 0)       /* White */
--warning: oklch(0.75 0.15 60)           /* Warm Yellow */
--warning-foreground: oklch(0.20 0.03 60) /* Dark Text */
--error: oklch(0.60 0.18 15)             /* Soft Red (not alarming) */
--error-foreground: oklch(1 0 0)         /* White */
--info: oklch(0.62 0.12 230)             /* Info Blue */
--info-foreground: oklch(1 0 0)          /* White */
```

### Borders & Dividers
```css
--border: oklch(0.90 0.01 220)           /* Subtle Border */
--border-strong: oklch(0.80 0.02 220)    /* Emphasized Border */
--input: oklch(0.92 0.01 220)            /* Input Background */
--ring: oklch(0.58 0.14 220)             /* Focus Ring (Primary) */
```

### Shadows & Elevation
```css
--shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.08), 0 2px 4px -1px oklch(0 0 0 / 0.04)
--shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.08), 0 4px 6px -2px oklch(0 0 0 / 0.04)
--shadow-xl: 0 20px 25px -5px oklch(0 0 0 / 0.08), 0 10px 10px -5px oklch(0 0 0 / 0.03)
--shadow-card: 0 2px 8px oklch(0.58 0.14 220 / 0.06)
--shadow-hover: 0 8px 16px oklch(0.58 0.14 220 / 0.10)
```

---

## 📐 Typography

### Font Families
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
--font-heading: 'Inter', sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace
```

### Font Sizes & Line Heights
```css
--text-xs: 0.75rem;    /* 12px - Small labels */
--text-sm: 0.875rem;   /* 14px - Body small */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Emphasized */
--text-xl: 1.25rem;    /* 20px - Small headings */
--text-2xl: 1.5rem;    /* 24px - Section headings */
--text-3xl: 1.875rem;  /* 30px - Page headings */
--text-4xl: 2.25rem;   /* 36px - Hero headings */

--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Font Weights
```css
--font-light: 300
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

---

## 📏 Spacing System

### Base Unit: 4px (0.25rem)
```css
--space-0: 0
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
--space-16: 4rem     /* 64px */
--space-20: 5rem     /* 80px */
--space-24: 6rem     /* 96px */
```

### Usage Guidelines
- **Cards**: `p-6` (24px) padding, `gap-4` (16px) between content
- **Sections**: `gap-6` (24px) to `gap-8` (32px)
- **Page Margins**: `p-6` to `p-8` on containers
- **Forms**: `space-y-4` between fields, `space-y-2` for labels

---

## 🎯 Border Radius

```css
--radius-xs: 0.25rem    /* 4px - Badges, small buttons */
--radius-sm: 0.5rem     /* 8px - Input fields */
--radius-md: 0.75rem    /* 12px - Default buttons, cards */
--radius-lg: 1rem       /* 16px - Large cards */
--radius-xl: 1.5rem     /* 24px - Modal, drawer */
--radius-2xl: 2rem      /* 32px - Hero elements */
--radius-full: 9999px   /* Pills, avatars */
```

**Default**: `--radius: 0.75rem` (12px) - Soft, modern, medical feel

---

## 🏗️ Component Patterns

### 📦 Cards
```tsx
<Card className="shadow-card hover:shadow-hover transition-shadow duration-300">
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-foreground">Title</CardTitle>
    <CardDescription className="text-sm text-muted-foreground">Description</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>
```

**Variants**:
- **Default**: White background, subtle shadow
- **Outlined**: `variant="outline"` - border only
- **Glass**: Semi-transparent with backdrop blur
- **Stat Card**: Large number display, icon, trend indicator

### 🔘 Buttons
```tsx
<Button variant="default" size="default" className="shadow-sm">
  Primary Action
</Button>
```

**Variants**:
- `default`: Primary medical blue
- `secondary`: Soft mint green
- `outline`: Border only
- `ghost`: Transparent hover
- `destructive`: Soft red (for delete/cancel)

**Sizes**:
- `sm`: Small (h-8)
- `default`: Medium (h-10)
- `lg`: Large (h-12)
- `icon`: Square icon button

### 📋 Tables
```tsx
<Table className="border-separate border-spacing-0">
  <TableHeader>
    <TableRow className="bg-muted/50">
      <TableHead>Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell>Data</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Features**:
- Striped rows option: `even:bg-muted/20`
- Hover highlight
- Sticky headers for long lists
- Responsive: stack on mobile

### 📝 Forms
```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label className="text-sm font-medium">Field Label</Label>
    <Input 
      className="h-10 rounded-md border-input bg-background"
      placeholder="Enter value"
    />
    <p className="text-xs text-muted-foreground">Helper text</p>
  </div>
</form>
```

**Guidelines**:
- Clear labels above fields
- Adequate spacing between fields (space-y-4)
- Inline validation with colored borders
- Helper text in muted color

### 🔔 Badges & Status
```tsx
<Badge variant="success" className="rounded-full px-3 py-1">
  Active
</Badge>
```

**Status Colors**:
- Success: Green
- Warning: Yellow
- Error: Red
- Info: Blue
- Default: Gray

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Tablets */
md: 768px   /* Small laptops */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large */
```

### Grid Systems
- **Mobile**: Single column
- **Tablet**: 2 columns (`sm:grid-cols-2`)
- **Desktop**: 3-4 columns (`lg:grid-cols-3`, `lg:grid-cols-4`)

---

## ✨ Animations & Transitions

### Transitions
```css
--transition-fast: 150ms ease-in-out
--transition-base: 200ms ease-in-out
--transition-slow: 300ms ease-in-out
```

### Common Animations
```tsx
/* Fade In */
className="animate-in fade-in duration-300"

/* Slide In */
className="animate-in slide-in-from-bottom-4 duration-500"

/* Hover Scale */
className="transition-transform hover:scale-105 duration-200"

/* Shimmer Loading */
className="animate-pulse"
```

### Page Transitions
```css
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}
.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 300ms ease-out;
}
```

---

## 🗺️ Page Layout Patterns

### Dashboard Layout
```tsx
<div className="grid gap-6 sm:gap-8">
  {/* Stats Row */}
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatCard />
  </div>
  
  {/* Charts Section */}
  <div className="grid gap-6 lg:grid-cols-2">
    <Card>Chart 1</Card>
    <Card>Chart 2</Card>
  </div>
  
  {/* Tables Section */}
  <Card>
    <CardHeader>Recent Activity</CardHeader>
    <CardContent>
      <Table />
    </CardContent>
  </Card>
</div>
```

### List Page Layout
```tsx
<div className="space-y-6">
  {/* Header with Search & Actions */}
  <div className="flex flex-col sm:flex-row justify-between gap-4">
    <div>
      <h1 className="text-3xl font-semibold">Patients</h1>
      <p className="text-muted-foreground">Manage patient records</p>
    </div>
    <div className="flex gap-2">
      <Input placeholder="Search..." />
      <Button>Add New</Button>
    </div>
  </div>
  
  {/* Filters */}
  <div className="flex gap-2">
    <Badge variant="outline">Filter 1</Badge>
    <Badge variant="outline">Filter 2</Badge>
  </div>
  
  {/* Content Grid/List */}
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Card />
  </div>
</div>
```

### Detail Page Layout
```tsx
<div className="space-y-6">
  {/* Breadcrumb */}
  <Breadcrumb />
  
  {/* Header with Actions */}
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-3xl font-semibold">Patient Details</h1>
      <p className="text-muted-foreground">ID: #12345</p>
    </div>
    <div className="flex gap-2">
      <Button variant="outline">Edit</Button>
      <Button>Save</Button>
    </div>
  </div>
  
  {/* Content Sections */}
  <div className="grid gap-6 lg:grid-cols-3">
    <div className="lg:col-span-2 space-y-6">
      <Card>Main Info</Card>
      <Card>History</Card>
    </div>
    <div className="space-y-6">
      <Card>Quick Actions</Card>
      <Card>Related Data</Card>
    </div>
  </div>
</div>
```

---

## 🧭 Navigation Design

### Sidebar (Desktop)
- **Width**: 16rem (256px) expanded, 4rem (64px) collapsed
- **Background**: White with subtle shadow
- **Active State**: Blue background with bold text
- **Icons**: Always visible, text hidden when collapsed
- **Smooth Transitions**: 200ms ease

### Top Bar
- **Height**: 4rem (64px)
- **Content**: Logo, breadcrumb, user menu, notifications
- **Background**: White with bottom border
- **Sticky**: Fixed at top on scroll

### Mobile Navigation
- **Drawer**: Slide from left
- **Overlay**: Semi-transparent backdrop
- **Touch-Friendly**: Large tap targets (min 44px)

---

## 📊 Page-Specific Designs

### 🏠 Dashboard
**Components**:
- 4-column stat cards (KPIs)
- Line charts for trends
- Recent activity feed
- Quick action buttons
- Alerts/notifications panel

**Layout**: Grid-based, responsive, scannable

### 👥 Patients List
**Components**:
- Search bar with filters
- Patient cards with avatar, name, status, last visit
- Pagination
- Quick actions (view, edit, schedule)

**Layout**: Card grid or table view toggle

### 🏥 Rooms
**Components**:
- Room status badges (Available, Occupied, Maintenance)
- Floor plan visualization (optional)
- Capacity indicators
- Assignment history

**Layout**: Grid of room cards with status colors

### 💊 Prescriptions
**Components**:
- Drug name, dosage, frequency
- Doctor info
- Patient info
- Date range
- Status (Active, Completed, Cancelled)

**Layout**: Timeline view or table

### 👨‍⚕️ Staff Directory
**Components**:
- Staff cards with photo, role, department
- Availability status
- Contact info
- Schedule overview

**Layout**: Grid with filters by role/department

### 📅 Appointments
**Components**:
- Calendar view (day/week/month)
- Appointment cards with time, patient, doctor
- Status indicators
- Quick reschedule/cancel

**Layout**: Calendar or list view toggle

### 📦 Inventory
**Components**:
- Item cards with stock levels
- Low stock warnings
- Category filters
- Expiry date tracking

**Layout**: Table with visual stock indicators

---

## ♿ Accessibility Standards

- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI elements
- **Focus Indicators**: Visible focus ring on all interactive elements
- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper labeling for screen readers
- **Touch Targets**: Minimum 44x44px for mobile
- **Error Messages**: Clear, descriptive, actionable

---

## 🚀 Implementation Checklist

### Phase 1: Foundation
- [ ] Update color tokens in `global.css`
- [ ] Configure Tailwind theme
- [ ] Set up typography system
- [ ] Define spacing utilities

### Phase 2: Core Components
- [ ] Update Card component
- [ ] Update Button variants
- [ ] Update Table styling
- [ ] Update Form components
- [ ] Update Badge/Status components

### Phase 3: Layout Components
- [ ] Redesign Sidebar
- [ ] Update Header/TopBar
- [ ] Create page templates
- [ ] Add loading states
- [ ] Add empty states

### Phase 4: Pages
- [ ] Redesign Dashboard
- [ ] Redesign Patients page
- [ ] Redesign Rooms page
- [ ] Redesign Appointments page
- [ ] Redesign Staff page
- [ ] Redesign Inventory page
- [ ] Redesign Prescriptions page

### Phase 5: Polish
- [ ] Add micro-interactions
- [ ] Optimize animations
- [ ] Add loading skeletons
- [ ] Test responsive layouts
- [ ] Accessibility audit

---

## 🎨 Design Tokens Summary

```css
/* Medical Blue Theme */
Primary: oklch(0.58 0.14 220)      /* Trustworthy, calm */
Secondary: oklch(0.88 0.05 160)    /* Healing, fresh */
Accent: oklch(0.70 0.10 200)       /* Professional, modern */
Background: oklch(0.98 0.005 220)  /* Clean, spacious */
Surface: oklch(1 0 0)              /* Pure white cards */

/* Typography */
Headings: Inter, 600-700 weight
Body: Inter, 400 weight
Small: 0.875rem
Base: 1rem
Large: 1.25rem

/* Spacing */
Card Padding: 1.5rem (24px)
Section Gap: 2rem (32px)
Element Gap: 1rem (16px)

/* Borders */
Radius: 0.75rem (12px)
Border: oklch(0.90 0.01 220)

/* Shadows */
Card: 0 2px 8px oklch(0.58 0.14 220 / 0.06)
Hover: 0 8px 16px oklch(0.58 0.14 220 / 0.10)
```

---

## 💡 UX Improvements

1. **Smart Defaults**: Pre-fill forms with common values
2. **Inline Editing**: Click to edit without modal
3. **Bulk Actions**: Select multiple items for batch operations
4. **Keyboard Shortcuts**: Quick actions (Cmd+K search, etc.)
5. **Progressive Disclosure**: Show details on demand
6. **Contextual Help**: Tooltips and hints
7. **Optimistic Updates**: Instant feedback before server response
8. **Auto-Save**: Save drafts automatically
9. **Smart Search**: Fuzzy matching, recent searches
10. **Notifications**: Toast messages for feedback

---

## 🎬 Next Steps

1. Review and approve this design system
2. Implement color tokens and typography
3. Update core components
4. Apply to pages systematically
5. Gather feedback and iterate

This design system creates a **calm, professional, modern hospital interface** that prioritizes user experience, readability, and medical aesthetics.
