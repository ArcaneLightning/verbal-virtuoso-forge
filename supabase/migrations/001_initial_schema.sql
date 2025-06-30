-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('leader', 'member');
CREATE TYPE session_type AS ENUM ('speech', 'debate');
CREATE TYPE achievement_type AS ENUM ('streak', 'score', 'practice', 'team');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    goals TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE public.teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE public.team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Topics table
CREATE TABLE public.topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    difficulty_level INTEGER DEFAULT 1,
    is_custom BOOLEAN DEFAULT false,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Speech sessions table
CREATE TABLE public.speech_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    title TEXT,
    audio_url TEXT,
    transcript TEXT,
    duration_seconds INTEGER,
    clarity_score DECIMAL(3,2),
    pace_score DECIMAL(3,2),
    volume_score DECIMAL(3,2),
    tone_score DECIMAL(3,2),
    engagement_score DECIMAL(3,2),
    overall_score DECIMAL(3,2),
    feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debate sessions table
CREATE TABLE public.debate_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    position TEXT NOT NULL, -- 'for' or 'against'
    duration_seconds INTEGER,
    ai_opponent_response TEXT,
    user_score DECIMAL(3,2),
    ai_score DECIMAL(3,2),
    feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type achievement_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics table
CREATE TABLE public.user_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_practice_time INTEGER DEFAULT 0,
    sessions_count INTEGER DEFAULT 0,
    average_score DECIMAL(3,2),
    streak_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Team analytics table
CREATE TABLE public.team_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_practice_time INTEGER DEFAULT 0,
    sessions_count INTEGER DEFAULT 0,
    average_score DECIMAL(3,2),
    active_members INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_speech_sessions_user_id ON public.speech_sessions(user_id);
CREATE INDEX idx_speech_sessions_created_at ON public.speech_sessions(created_at);
CREATE INDEX idx_debate_sessions_user_id ON public.debate_sessions(user_id);
CREATE INDEX idx_debate_sessions_created_at ON public.debate_sessions(created_at);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id);
CREATE INDEX idx_user_analytics_user_id_date ON public.user_analytics(user_id, date);
CREATE INDEX idx_team_analytics_team_id_date ON public.team_analytics(team_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speech_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Teams: Team leaders can manage their teams, members can view
CREATE POLICY "Team leaders can manage teams" ON public.teams
    FOR ALL USING (
        auth.uid() = leader_id OR 
        EXISTS (
            SELECT 1 FROM public.team_members 
            WHERE team_id = teams.id AND user_id = auth.uid()
        )
    );

-- Team members: Members can view team membership
CREATE POLICY "Team members can view membership" ON public.team_members
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.teams 
            WHERE id = team_members.team_id AND leader_id = auth.uid()
        )
    );

CREATE POLICY "Team leaders can manage members" ON public.team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.teams 
            WHERE id = team_members.team_id AND leader_id = auth.uid()
        )
    );

-- Topics: Public read access, authenticated users can create custom topics
CREATE POLICY "Anyone can view topics" ON public.topics
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create custom topics" ON public.topics
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Speech sessions: Users can only access their own sessions
CREATE POLICY "Users can manage own speech sessions" ON public.speech_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Debate sessions: Users can only access their own sessions
CREATE POLICY "Users can manage own debate sessions" ON public.debate_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Achievements: Users can only access their own achievements
CREATE POLICY "Users can view own achievements" ON public.achievements
    FOR SELECT USING (auth.uid() = user_id);

-- User analytics: Users can only access their own analytics
CREATE POLICY "Users can view own analytics" ON public.user_analytics
    FOR SELECT USING (auth.uid() = user_id);

-- Team analytics: Team members can view team analytics
CREATE POLICY "Team members can view team analytics" ON public.team_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.team_members 
            WHERE team_id = team_analytics.team_id AND user_id = auth.uid()
        )
    );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default topics
INSERT INTO public.topics (title, description, category, difficulty_level, is_custom) VALUES
('Climate Change and Renewable Energy', 'Discuss the impact of climate change and the role of renewable energy in addressing it.', 'Environment', 2, false),
('Social Media and Mental Health', 'Explore the effects of social media on mental health and well-being.', 'Technology', 1, false),
('Remote Work vs Office Work', 'Compare the benefits and drawbacks of remote work versus traditional office environments.', 'Business', 1, false),
('Artificial Intelligence in Education', 'Discuss how AI can enhance or hinder the educational experience.', 'Technology', 2, false),
('Universal Basic Income', 'Debate the merits of implementing a universal basic income system.', 'Economics', 3, false),
('Privacy vs Security', 'Explore the balance between individual privacy and national security.', 'Politics', 2, false),
('The Future of Transportation', 'Discuss emerging transportation technologies and their impact on society.', 'Technology', 1, false),
('Mental Health Awareness', 'Address the importance of mental health awareness and destigmatization.', 'Health', 1, false); 