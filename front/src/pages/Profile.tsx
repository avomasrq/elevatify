import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Loader2, Camera, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: ""
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: (user.unsafeMetadata?.bio as string) || ""
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUpdating(true);
      await user.setProfileImage({ file });
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleProfileUpdate = async (data: {
    username?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    specialization?: string;
    region?: string;
    githubUsername?: string;
    linkedinProfile?: string;
  }) => {
    try {
      if (!user) return;

      // Update name if it changed
      if ((data.firstName && data.firstName !== user.firstName) || 
          (data.lastName && data.lastName !== user.lastName)) {
        await user.update({
          firstName: data.firstName,
          lastName: data.lastName
        });
      }

      // Update username separately if it changed
      if (data.username && data.username !== user.username) {
        await user.update({
          username: data.username
        });
      }

      // Update metadata for bio and other fields
      if (data.bio || data.specialization || data.region || data.githubUsername || data.linkedinProfile) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            bio: data.bio,
            specialization: data.specialization,
            region: data.region,
            githubUsername: data.githubUsername,
            linkedinProfile: data.linkedinProfile
          }
        });
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const success = await handleProfileUpdate({
        username: formData.firstName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        specialization: "",
        region: "",
        githubUsername: "",
        linkedinProfile: ""
      });

      if (success) {
        setError(null);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </div>
      </div>
    );
  }

  const hasChanges = 
    formData.firstName !== user?.firstName ||
    formData.lastName !== user?.lastName ||
    formData.bio !== (user?.unsafeMetadata?.bio as string || "");

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-8">Profile Settings</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div 
                      className="relative h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer group"
                      onClick={handleImageClick}
                    >
                      {user?.imageUrl ? (
                        <>
                          <img
                            src={user.imageUrl}
                            alt={user.firstName || "Profile"}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-6 w-6 text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Camera className="h-6 w-6 text-gray-400" />
                          <span className="text-xs text-gray-500 mt-1">Add Photo</span>
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className="text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                      <p className="text-sm text-gray-400">ID: {user?.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleLogout}
                      className="flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                    <Button
                      type="submit"
                      className="bg-elevatify-600 hover:bg-elevatify-700"
                      disabled={isUpdating || !hasChanges}
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 