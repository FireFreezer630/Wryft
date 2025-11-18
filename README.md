
# Wryft

Wryft is a premium, pixel-perfect bio link platform designed for content creators. It features a highly customizable dashboard, real-time analytics, and a sleek, dark-themed public profile page.

## Features

- **Customizable Public Profiles**: Choose layouts, fonts, colors, and background effects (Snow, Rain, Scanlines, etc.).
- **Asset Management**: Upload avatars, backgrounds, custom cursors, and background audio.
- **Content Management**: Add unlimited links and social media integrations.
- **Analytics Dashboard**: Track profile views and link clicks with interactive charts.
- **Premium Aesthetics**: Glassmorphism, smooth animations, and a refined dark UI.

## Tech Stack

- **Frontend**: React 18 (Vite)
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: Supabase (Auth, Database, Storage)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wryft.git
   cd wryft
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Environment Variables:
   Create a `.env` file in the root directory based on `.env.example` and add your Supabase credentials.

   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Deployment

To deploy on a VPS with Nginx:

1. Run `npm run build`.
2. Configure Nginx to serve the `dist` folder and handle SPA routing:

   ```nginx
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

## License

[MIT](LICENSE)
