# ForensIQ - AI-Powered Speech & Debate Coach

ForensIQ is a comprehensive AI-powered platform designed to help users improve their public speaking and debate skills through personalized coaching, real-time feedback, and advanced analytics.

## 🚀 Features

### 🎤 Speech Practice
- **AI-Powered Analysis**: Record speeches and receive detailed feedback on clarity, pace, volume, tone variety, and engagement
- **Real-time Transcription**: Automatic speech-to-text conversion for analysis
- **Topic Library**: Curated practice topics or custom topic creation
- **Performance Scoring**: Comprehensive scoring system with actionable insights
- **Improvement Recommendations**: Personalized suggestions based on analysis results

### 🗣️ AI Debate Simulator
- **Interactive Debates**: Engage in structured debates with an AI opponent
- **Multiple Topics**: Wide range of debate topics across various subjects
- **Real-time Scoring**: Live scoring system during debates
- **Position Selection**: Choose to argue for or against any topic
- **Timed Sessions**: 5-minute debate rounds with countdown timer
- **Performance Analysis**: Post-debate analysis and feedback

### 👥 Team Collaboration
- **Team Creation**: Create and manage debate teams
- **Member Management**: Invite members and assign roles (leader/member)
- **Team Analytics**: Track team performance and progress
- **Collaborative Practice**: Schedule and organize team practice sessions
- **Activity Feed**: Monitor team member activities and achievements

### 📊 Advanced Analytics Dashboard
- **Performance Trends**: Track improvement over time with detailed charts
- **Skills Assessment**: Radar charts showing strengths and areas for improvement
- **Session History**: Complete history of all practice and debate sessions
- **Topic Performance**: Analysis of performance across different topics
- **Weekly Activity**: Track practice frequency and consistency
- **Comparative Analysis**: Compare current performance with past sessions

### 👤 User Profile & Settings
- **Personal Dashboard**: Customizable user profile with bio and goals
- **Achievement System**: Unlock badges and track milestones
- **Progress Tracking**: Visual representation of improvement journey
- **Preference Settings**: Customize notifications, themes, and analysis features
- **Account Management**: Secure profile and password management

### 🏆 Gamification Elements
- **Achievement Badges**: Earn rewards for consistent practice and improvement
- **Progress Streaks**: Track consecutive days of practice
- **Score Tracking**: Monitor average scores and improvement rates
- **Leaderboards**: Compare performance within teams

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the repository
```bash
git clone <repository-url>
cd verbal-virtuoso-forge-1
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL="your-supabase-project-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 4. Set up Supabase Database
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the SQL schema from `supabase/migrations/001_initial_schema.sql`
4. Create a storage bucket named `user-audio` for speech recordings

### 5. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles**: User profiles and preferences
- **teams**: Debate teams
- **team_members**: Team membership and roles
- **topics**: Practice and debate topics
- **speech_sessions**: Speech practice sessions and feedback
- **debate_sessions**: Debate sessions with AI opponent
- **achievements**: User achievements and badges
- **user_analytics**: Daily user performance metrics
- **team_analytics**: Team performance metrics

## 🔐 Authentication

ForensIQ uses Supabase Authentication with:
- Email/password authentication
- Row Level Security (RLS) for data protection
- Protected routes for authenticated users
- Automatic session management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── Layout.tsx      # Main layout with navigation
│   └── ProtectedRoute.tsx # Authentication wrapper
├── pages/              # Page components
│   ├── LandingPage.tsx # Landing page
│   ├── LoginPage.tsx   # Authentication pages
│   ├── DashboardPage.tsx # User dashboard
│   ├── PracticePage.tsx # Speech practice
│   ├── DebatePage.tsx  # AI debate simulator
│   ├── TeamsPage.tsx   # Team management
│   └── SettingsPage.tsx # User settings
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── App.tsx             # Main application component
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Adding New Features
1. Create new page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/Layout.tsx`
4. Add necessary database tables if required
5. Update types in `src/integrations/supabase/types.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@forensiq.com or join our Discord community.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Vite](https://vitejs.dev) for the fast build tool
- [React](https://reactjs.org) for the amazing frontend framework
