# Green Claims Validator

A SaaS web application that scans marketing text for potentially illegal environmental claims under EU regulation 2024/825 (effective September 2026).

## Features

### Landing Page
- Modern, trustworthy design with green/amber color scheme
- Hero section with value proposition
- Interactive live demo section (500 char limit)
- Pricing table (Free/Starter/Pro/Enterprise)
- FAQ section with accordion
- Smooth animations and transitions

### Web App
- Split-screen layout: Input (left) / Results (right)
- Real-time text scanning with debounce
- Flags 260+ banned terms in categories:
  - **Critical (red)**: klimaneutral, CO2-neutral, 100% umweltfreundlich
  - **Warning (yellow)**: nachhaltig, grün, öko (without proof)
  - **Minor (green)**: needs more specifics
- Results display:
  - Risk meter (0-100%)
  - List of flagged terms with line numbers
  - Regulation references (EU 2024/825)
  - Penalty ranges
  - Specific alternative suggestions
- Export to PDF functionality
- Scan history dashboard with search
- Dark mode support
- Mobile responsive design

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Export**: jsPDF
- **Storage**: LocalStorage (client-side)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
green-claim-check/
├── app/
│   ├── app/
│   │   └── page.tsx          # Web app scanner interface
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/
│   ├── scanner/
│   │   ├── RiskMeter.tsx     # Risk score visualization
│   │   └── ResultCard.tsx    # Individual finding card
│   └── ui/
│       ├── Button.tsx        # Reusable button component
│       ├── Card.tsx          # Card container component
│       └── DarkModeToggle.tsx # Theme switcher
├── lib/
│   ├── banned-terms.ts      # Database of banned terms
│   ├── scanner-logic.ts     # Core scanning algorithm
│   ├── pdf-export.ts         # PDF generation
│   ├── storage.ts            # LocalStorage utilities
│   └── utils.ts              # Helper functions
└── public/                   # Static assets
```

## Key Features Implementation

### Text Scanning
- Real-time scanning with 500ms debounce
- Regex-based pattern matching
- Line number tracking
- Context extraction around matches

### Risk Scoring
- Weighted scoring system:
  - Critical: 30 points each
  - Warning: 10 points each
  - Minor: 3 points each
- Maximum score: 100%

### PDF Export
- Comprehensive compliance report
- Includes risk score, findings, regulations, and suggestions
- Original text included

### History Management
- Stores up to 50 recent scans
- Search functionality
- Load previous scans
- Delete individual items

## Banned Terms Database

The application includes 20+ banned terms across three severity levels:

- **Critical**: Absolute claims requiring full proof (klimaneutral, carbon neutral, etc.)
- **Warning**: Generic claims requiring evidence (umweltfreundlich, sustainable, etc.)
- **Minor**: Claims needing more specifics (recycelbar, energieeffizient, etc.)

## Design System

### Colors
- Primary Green: `#0D5C3D`
- Accent Amber: `#F59E0B`
- Danger Red: `#EF4444`
- Success Green: `#10B981`

### Typography
- Headlines: Instrument Serif
- Body: Inter
- Code/Results: JetBrains Mono

### Animations
- Fade-in effects
- Slide-up transitions
- Pulse animations
- Smooth hover states

## Future Enhancements

- [ ] Supabase integration for cloud storage
- [ ] User authentication
- [ ] API endpoint for programmatic access
- [ ] Team collaboration features
- [ ] Browser extension
- [ ] Legal review service integration
- [ ] Multi-language support expansion

## License

MIT

## Disclaimer

This tool is for guidance only and does not constitute legal advice. Always consult with legal experts for final compliance verification.
