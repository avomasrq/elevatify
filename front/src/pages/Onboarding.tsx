import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/components/ui/use-toast";

export default function Onboarding() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    displayName: user?.fullName || "",
    specialization: "",
    region: "",
    bio: "",
    githubUsername: "",
    linkedinUrl: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Save to localStorage
      localStorage.setItem(`userSettings_${user.id}`, JSON.stringify({
        ...formData,
        emailNotifications: true,
        projectUpdates: true,
      }));

      // Here you would typically save to your backend as well
      // await api.saveUserProfile(formData);

      toast({
        title: "Profile Complete!",
        description: "Your profile has been set up successfully.",
      });

      // Redirect to home page
      navigate("/home");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    navigate("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-elevatify-50 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-10 h-10 rounded-full bg-elevatify-600 flex items-center justify-center mb-8">
        <span className="text-white font-bold text-lg">E</span>
      </div>

      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Let's set up your profile to help you get started with Elevatify
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => setFormData({ ...formData, specialization: value })}
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

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select
                value={formData.region}
                onValueChange={(value) => setFormData({ ...formData, region: value })}
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="githubUsername">GitHub Username</Label>
                <Input
                  id="githubUsername"
                  value={formData.githubUsername}
                  onChange={(e) => setFormData({ ...formData, githubUsername: e.target.value })}
                  placeholder="Your GitHub username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="Your LinkedIn profile URL"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-elevatify-600 hover:bg-elevatify-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Setting up your profile..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 