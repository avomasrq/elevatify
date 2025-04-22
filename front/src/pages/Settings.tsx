import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@clerk/clerk-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// Define interface for settings
interface UserSettings {
  region: string;
  specialization: string;
  emailNotifications: boolean;
  projectUpdates: boolean;
  displayName: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  region: "us",
  specialization: "",
  emailNotifications: false,
  projectUpdates: false,
  displayName: "",
};

export default function Settings() {
  const { user } = useUser();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    if (!user) return;

    // Clear any settings without a user ID
    localStorage.removeItem('userSettings');
    
    const savedSettings = localStorage.getItem(`userSettings_${user.id}`);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      // Initialize with user data if available
      setSettings(prev => ({
        ...DEFAULT_SETTINGS,
        displayName: user.fullName || '',
      }));
    }
  }, [user]);

  const regions = [
    { value: "us", label: "United States" },
    { value: "eu", label: "Europe" },
    { value: "asia", label: "Asia" },
    { value: "kz", label: "Kazakhstan" },
    { value: "ru", label: "Russia" },
    { value: "by", label: "Belarus" },
    { value: "uz", label: "Uzbekistan" },
    { value: "kg", label: "Kyrgyzstan" },
    { value: "tj", label: "Tajikistan" },
    { value: "am", label: "Armenia" },
    { value: "az", label: "Azerbaijan" },
    { value: "md", label: "Moldova" },
    { value: "tm", label: "Turkmenistan" },
    { value: "other", label: "Other" }
  ];

  const specializations = [
    { value: "frontend", label: "Frontend Development" },
    { value: "backend", label: "Backend Development" },
    { value: "fullstack", label: "Full Stack Development" },
    { value: "mobile", label: "Mobile Development" },
    { value: "devops", label: "DevOps" },
    { value: "ui_ux", label: "UI/UX Design" },
    { value: "data", label: "Data Science" },
    { value: "ai_ml", label: "AI/Machine Learning" },
    { value: "security", label: "Security" },
    { value: "qa", label: "Quality Assurance" }
  ];

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      
      // Save to localStorage with user ID
      localStorage.setItem(`userSettings_${user.id}`, JSON.stringify(settings));

      // Here you would typically also save to your backend
      // await api.saveSettings(settings);

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
              
              <div className="space-y-8">
                {/* Profile Settings */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      value={settings.displayName}
                      onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Select
                      value={settings.specialization}
                      onValueChange={(value) => setSettings({ ...settings, specialization: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec.value} value={spec.value}>
                            {spec.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Region Settings */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Region</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="region">Preferred Region</Label>
                    <Select
                      value={settings.region}
                      onValueChange={(value) => setSettings({ ...settings, region: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region.value} value={region.value}>
                            {region.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      This helps us show you relevant projects and opportunities
                    </p>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive email notifications about your projects
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="project-updates">Project Updates</Label>
                      <p className="text-sm text-gray-500">
                        Get notified when there are updates to your projects
                      </p>
                    </div>
                    <Switch
                      id="project-updates"
                      checked={settings.projectUpdates}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, projectUpdates: checked })
                      }
                    />
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <Button 
                    className="bg-elevatify-600 hover:bg-elevatify-700"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 