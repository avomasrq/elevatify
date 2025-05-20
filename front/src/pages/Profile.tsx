import { useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Camera, MapPin, Github, Linkedin, Code, Briefcase, Mail, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  if (!user) {
    navigate("/sign-in");
    return null;
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateUser({
        imageUrl: reader.result as string
      });
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      await updateUser(user);
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAddSkill = async () => {
    if (newSkill.trim() && !user.skills.includes(newSkill.trim())) {
      try {
        await updateUser({
          skills: [...user.skills, newSkill.trim()]
        });
        setNewSkill("");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add skill",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    try {
      await updateUser({
        skills: user.skills.filter(skill => skill !== skillToRemove)
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove skill",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - Profile Info */}
              <div className="lg:w-1/3 space-y-6">
                {/* Profile Card */}
                <Card className="border-purple-200">
                  <CardHeader className="text-center">
                    <div 
                      className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden cursor-pointer relative group border-4 border-purple-200"
                      onClick={handleImageClick}
                    >
                      <img
                        src={user.imageUrl}
                        alt={user.displayName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                    <CardTitle className="text-2xl font-bold text-purple-800">{user.displayName}</CardTitle>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
                      <Code className="w-4 h-4 text-purple-600" />
                      {user.specialization}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      {user.region}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
                      <Mail className="w-4 h-4 text-purple-600" />
                      {user.email}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 py-4">
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-purple-800">{user.projects}</div>
                        <div className="text-xs text-gray-600">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-purple-800">{user.collaborators}</div>
                        <div className="text-xs text-gray-600">Collaborators</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-purple-800">{user.rating}</div>
                        <div className="text-xs text-gray-600">Rating</div>
                      </div>
                    </div>
                    {user.githubUsername && (
                      <Button
                        variant="outline"
                        className="w-full mb-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                        onClick={() => window.open(`https://github.com/${user.githubUsername}`, '_blank')}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub Profile
                      </Button>
                    )}
                    {user.linkedinUrl && (
                      <Button
                        variant="outline"
                        className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                        onClick={() => window.open(user.linkedinUrl, '_blank')}
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn Profile
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Skills Card */}
                <Card className="border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-800">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {skill}
                          {isEditing && (
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 text-purple-700 hover:text-purple-900"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <button
                          onClick={() => document.getElementById('skillInput')?.focus()}
                          className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center hover:bg-purple-100"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Skill
                        </button>
                      )}
                    </div>
                    {isEditing && (
                      <div className="mt-4 flex gap-2">
                        <Input
                          id="skillInput"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          placeholder="Add a skill"
                          className="border-purple-200 focus:ring-purple-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        />
                        <Button 
                          onClick={handleAddSkill}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Tabs */}
              <div className="lg:w-2/3">
                <Card className="border-purple-200">
                  <CardContent className="p-6">
                    <Tabs defaultValue="about">
                      <TabsList className="mb-4">
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>

                      <TabsContent value="about">
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Display Name
                              </label>
                              <Input
                                value={user.displayName}
                                onChange={(e) => updateUser({ displayName: e.target.value })}
                                className="border-purple-200 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                              </label>
                              <Input
                                value={user.email}
                                onChange={(e) => updateUser({ email: e.target.value })}
                                type="email"
                                className="border-purple-200 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bio
                              </label>
                              <Textarea
                                value={user.bio}
                                onChange={(e) => updateUser({ bio: e.target.value })}
                                rows={4}
                                className="border-purple-200 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Specialization
                              </label>
                              <Input
                                value={user.specialization}
                                onChange={(e) => updateUser({ specialization: e.target.value })}
                                className="border-purple-200 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Region
                              </label>
                              <Input
                                value={user.region}
                                onChange={(e) => updateUser({ region: e.target.value })}
                                className="border-purple-200 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                GitHub Username
                              </label>
                              <Input
                                value={user.githubUsername}
                                onChange={(e) => updateUser({ githubUsername: e.target.value })}
                                className="border-purple-200 focus:ring-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                LinkedIn URL
                              </label>
                              <Input
                                value={user.linkedinUrl}
                                onChange={(e) => updateUser({ linkedinUrl: e.target.value })}
                                className="border-purple-200 focus:ring-purple-500"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => setIsEditing(false)}
                                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleSave} 
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-gray-600">{user.bio}</p>
                            <Button 
                              onClick={() => setIsEditing(true)} 
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              Edit Profile
                            </Button>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="projects">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-purple-800">Your Projects</h3>
                            <Button 
                              className="bg-purple-600 hover:bg-purple-700"
                              onClick={() => navigate('/create-project')}
                            >
                              <Briefcase className="w-4 h-4 mr-2" />
                              Create Project
                            </Button>
                          </div>
                          <div className="grid gap-4">
                            {user.projects === 0 ? (
                              <div className="text-center py-8">
                                <Briefcase className="w-12 h-12 text-purple-300 mx-auto mb-4" />
                                <p className="text-gray-600 mb-4">No projects yet.</p>
                                <Button 
                                  variant="outline"
                                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                                  onClick={() => navigate('/create-project')}
                                >
                                  Start Your First Project
                                </Button>
                              </div>
                            ) : (
                              <p className="text-gray-600">Loading your projects...</p>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="settings">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-purple-800">Account Settings</h3>
                          <div className="space-y-4">
                            <Card className="border-purple-200">
                              <CardHeader>
                                <CardTitle className="text-base">Email Notifications</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-600">Notification preferences coming soon!</p>
                              </CardContent>
                            </Card>
                            <Card className="border-purple-200">
                              <CardHeader>
                                <CardTitle className="text-base">Privacy Settings</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-gray-600">Privacy controls coming soon!</p>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 