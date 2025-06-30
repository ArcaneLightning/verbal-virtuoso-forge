import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Save,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  goals: string;
  preferences: {
    notifications: boolean;
    email_updates: boolean;
    practice_reminders: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

const SettingsPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [goals, setGoals] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Preferences
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [practiceReminders, setPracticeReminders] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const userProfile: UserProfile = {
        id: data.id,
        email: data.email,
        full_name: data.full_name || '',
        bio: data.bio || '',
        avatar_url: data.avatar_url || '',
        goals: data.goals || '',
        preferences: data.preferences || {
          notifications: true,
          email_updates: true,
          practice_reminders: true,
          theme: 'system',
          language: 'en'
        }
      };

      setProfile(userProfile);
      setFullName(userProfile.full_name);
      setBio(userProfile.bio);
      setGoals(userProfile.goals);
      setNotifications(userProfile.preferences.notifications);
      setEmailUpdates(userProfile.preferences.email_updates);
      setPracticeReminders(userProfile.preferences.practice_reminders);
      setTheme(userProfile.preferences.theme);
      setLanguage(userProfile.preferences.language);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          bio: bio,
          goals: goals,
          preferences: {
            notifications,
            email_updates: emailUpdates,
            practice_reminders: practiceReminders,
            theme,
            language
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) throw error;

      setSuccess('Profile updated successfully!');
      fetchUserProfile(); // Refresh data
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      setError('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const exportUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: speechSessions } = await supabase
        .from('speech_sessions')
        .select('*')
        .eq('user_id', user.id);

      const { data: debateSessions } = await supabase
        .from('debate_sessions')
        .select('*')
        .eq('user_id', user.id);

      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id);

      const userData = {
        profile,
        speech_sessions: speechSessions,
        debate_sessions: debateSessions,
        achievements,
        export_date: new Date().toISOString()
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `forensiq-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('Data exported successfully!');
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(profile?.id || '');
      if (error) throw error;

      // Redirect to landing page
      window.location.href = '/';
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="goals">Goals</Label>
                <Textarea
                  id="goals"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="What are your speech and debate goals?"
                  rows={3}
                />
              </div>

              <Button onClick={updateProfile} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              <Button onClick={updatePassword} disabled={saving || !newPassword || !confirmPassword} className="w-full">
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preferences & Account Management */}
        <div className="space-y-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications about your progress</p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailUpdates">Email Updates</Label>
                  <p className="text-sm text-gray-500">Receive weekly progress reports</p>
                </div>
                <Switch
                  id="emailUpdates"
                  checked={emailUpdates}
                  onCheckedChange={setEmailUpdates}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="practiceReminders">Practice Reminders</Label>
                  <p className="text-sm text-gray-500">Get reminded to practice regularly</p>
                </div>
                <Switch
                  id="practiceReminders"
                  checked={practiceReminders}
                  onCheckedChange={setPracticeReminders}
                />
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export or delete your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={exportUserData} variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export My Data
              </Button>

              <Separator />

              <div className="space-y-2">
                <Button onClick={deleteAccount} variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
                <p className="text-xs text-gray-500">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 