import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Mic, 
  MessageSquare,
  Clock,
  Target,
  Save,
  Camera,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload
} from "lucide-react";
import { useUserData } from "../hooks/useUserData";
import { supabase } from "../integrations/supabase/client";

const Settings = () => {
  const { user, loading } = useUserData();
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    goals: user?.goals || ""
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      practiceReminders: true,
      achievementAlerts: true,
      teamUpdates: true,
      weeklyReports: false
    },
    practice: {
      sessionDuration: 15,
      difficultyLevel: "intermediate",
      autoAnalysis: true,
      voiceFeedback: false
    },
    debate: {
      opponentDifficulty: "medium",
      timeLimit: 300,
      showTimer: true,
      autoScoring: true
    }
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showProgress: true,
    allowTeamInvites: true,
    dataSharing: false
  });

  // Handle profile update
  const handleProfileUpdate = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          email: profileData.email,
          bio: profileData.bio,
          goals: profileData.goals
        })
        .eq('id', authUser.id);

      if (error) throw error;

      setSuccess('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess('Password updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setIsSaving(true);
        setError(null);

        const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
        if (error) throw error;

        // Redirect to landing page
        window.location.href = '/';
      } catch (err: any) {
        setError(err.message || 'Failed to delete account');
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-500 py-12">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and privacy settings.</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-gray-600">
                Update your personal information and profile details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-gray-700">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="goals" className="text-gray-700">Speaking Goals</Label>
                <Textarea
                  id="goals"
                  value={profileData.goals}
                  onChange={(e) => setProfileData(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="What are your speaking goals?"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button 
                onClick={handleProfileUpdate}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-green-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-gray-600">
                Choose which notifications you'd like to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">Practice Reminders</Label>
                  <p className="text-sm text-gray-500">Daily reminders to practice your speaking skills</p>
                </div>
                <Switch
                  checked={preferences.notifications.practiceReminders}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, practiceReminders: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">Achievement Alerts</Label>
                  <p className="text-sm text-gray-500">Get notified when you earn new achievements</p>
                </div>
                <Switch
                  checked={preferences.notifications.achievementAlerts}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, achievementAlerts: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">Team Updates</Label>
                  <p className="text-sm text-gray-500">Notifications about team activities and debates</p>
                </div>
                <Switch
                  checked={preferences.notifications.teamUpdates}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, teamUpdates: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Receive weekly progress summaries</p>
                </div>
                <Switch
                  checked={preferences.notifications.weeklyReports}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, weeklyReports: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Practice Settings */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Mic className="w-5 h-5 mr-2 text-purple-600" />
                Practice Settings
              </CardTitle>
              <CardDescription className="text-gray-600">
                Customize your practice session preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionDuration" className="text-gray-700">Default Session Duration (minutes)</Label>
                  <Select 
                    value={preferences.practice.sessionDuration.toString()} 
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      practice: { ...prev.practice, sessionDuration: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="20">20 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty" className="text-gray-700">Difficulty Level</Label>
                  <Select 
                    value={preferences.practice.difficultyLevel} 
                    onValueChange={(value) => setPreferences(prev => ({
                      ...prev,
                      practice: { ...prev.practice, difficultyLevel: value }
                    }))}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">Auto Analysis</Label>
                  <p className="text-sm text-gray-500">Automatically analyze your speech after each session</p>
                </div>
                <Switch
                  checked={preferences.practice.autoAnalysis}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    practice: { ...prev.practice, autoAnalysis: checked }
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">Voice Feedback</Label>
                  <p className="text-sm text-gray-500">Receive audio feedback during practice sessions</p>
                </div>
                <Switch
                  checked={preferences.practice.voiceFeedback}
                  onCheckedChange={(checked) => setPreferences(prev => ({
                    ...prev,
                    practice: { ...prev.practice, voiceFeedback: checked }
                  }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Privacy & Security
              </CardTitle>
              <CardDescription className="text-gray-600">
                Manage your privacy settings and account security.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="profileVisibility" className="text-gray-700">Profile Visibility</Label>
                <Select 
                  value={privacy.profileVisibility} 
                  onValueChange={(value) => setPrivacy(prev => ({ ...prev, profileVisibility: value }))}
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="team">Team Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">Show Progress</Label>
                  <p className="text-sm text-gray-500">Allow others to see your practice progress</p>
                </div>
                <Switch
                  checked={privacy.showProgress}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showProgress: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-700">Allow Team Invites</Label>
                  <p className="text-sm text-gray-500">Let other users invite you to teams</p>
                </div>
                <Switch
                  checked={privacy.allowTeamInvites}
                  onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowTeamInvites: checked }))}
                />
              </div>

              <Separator />

              <div>
                <Label className="text-gray-700">Export Data</Label>
                <p className="text-sm text-gray-500 mb-3">Download a copy of your data</p>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export My Data
                </Button>
              </div>

              <div>
                <Label className="text-gray-700 text-red-600">Delete Account</Label>
                <p className="text-sm text-gray-500 mb-3">Permanently delete your account and all data</p>
                <Button 
                  variant="outline" 
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={handleDeleteAccount}
                  disabled={isSaving}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings; 