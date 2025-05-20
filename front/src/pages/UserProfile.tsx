import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

interface UserProfileData {
  displayName: string;
  imageUrl: string;
  age: string;
  bio: string;
  skills: string[];
  specialization: string;
  region: string;
  githubUsername?: string;
  linkedinUrl?: string;
}

export default function UserProfile() {
  const { userId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'received' | 'friends'>("none");

  useEffect(() => {
    if (!userId) return;
    const data = localStorage.getItem(`userSettings_${userId}`);
    if (data) {
      setProfile(JSON.parse(data));
    }
    // Check if already friends
    const friends = JSON.parse(localStorage.getItem(`friends_${user?.id}`) || "[]");
    setIsFriend(friends.includes(userId));
    // Check friend request status
    if (user && userId !== user.id) {
      const sent = JSON.parse(localStorage.getItem(`friendRequests_sent_${user.id}`) || "[]");
      const received = JSON.parse(localStorage.getItem(`friendRequests_received_${user.id}`) || "[]");
      if (friends.includes(userId)) setRequestStatus("friends");
      else if (sent.includes(userId)) setRequestStatus("pending");
      else if (received.includes(userId)) setRequestStatus("received");
      else setRequestStatus("none");
    }
  }, [userId, user]);

  const handleSendRequest = () => {
    if (!user || !userId) return;
    // Add to sent requests for current user
    const sent = JSON.parse(localStorage.getItem(`friendRequests_sent_${user.id}`) || "[]");
    if (!sent.includes(userId)) {
      sent.push(userId);
      localStorage.setItem(`friendRequests_sent_${user.id}`, JSON.stringify(sent));
    }
    // Add to received requests for target user
    const received = JSON.parse(localStorage.getItem(`friendRequests_received_${userId}`) || "[]");
    if (!received.includes(user.id)) {
      received.push(user.id);
      localStorage.setItem(`friendRequests_received_${userId}`, JSON.stringify(received));
    }
    setRequestStatus("pending");
  };

  const handleAcceptRequest = () => {
    if (!user || !userId) return;
    // Remove from received for current user
    let received = JSON.parse(localStorage.getItem(`friendRequests_received_${user.id}`) || "[]");
    received = received.filter((id: string) => id !== userId);
    localStorage.setItem(`friendRequests_received_${user.id}`, JSON.stringify(received));
    // Remove from sent for sender
    let sent = JSON.parse(localStorage.getItem(`friendRequests_sent_${userId}`) || "[]");
    sent = sent.filter((id: string) => id !== user.id);
    localStorage.setItem(`friendRequests_sent_${userId}`, JSON.stringify(sent));
    // Add each other as friends
    const myFriends = JSON.parse(localStorage.getItem(`friends_${user.id}`) || "[]");
    if (!myFriends.includes(userId)) {
      myFriends.push(userId);
      localStorage.setItem(`friends_${user.id}`, JSON.stringify(myFriends));
    }
    const theirFriends = JSON.parse(localStorage.getItem(`friends_${userId}`) || "[]");
    if (!theirFriends.includes(user.id)) {
      theirFriends.push(user.id);
      localStorage.setItem(`friends_${userId}`, JSON.stringify(theirFriends));
    }
    setIsFriend(true);
    setRequestStatus("friends");
  };

  const handleRejectRequest = () => {
    if (!user || !userId) return;
    // Remove from received for current user
    let received = JSON.parse(localStorage.getItem(`friendRequests_received_${user.id}`) || "[]");
    received = received.filter((id: string) => id !== userId);
    localStorage.setItem(`friendRequests_received_${user.id}`, JSON.stringify(received));
    // Remove from sent for sender
    let sent = JSON.parse(localStorage.getItem(`friendRequests_sent_${userId}`) || "[]");
    sent = sent.filter((id: string) => id !== user.id);
    localStorage.setItem(`friendRequests_sent_${userId}`, JSON.stringify(sent));
    setRequestStatus("none");
  };

  const handleStartChat = () => {
    if (!userId) return;
    navigate(`/messages?user=${userId}`);
  };

  if (!profile) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">User not found</h1>
              <p className="text-gray-600">This user does not exist or has not set up their profile.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
            <div className="flex flex-col items-center gap-4">
              <img
                src={profile.imageUrl}
                alt={profile.displayName}
                className="w-28 h-28 rounded-full object-cover border-4 border-purple-200"
              />
              <h2 className="text-2xl font-bold text-purple-800">{profile.displayName}</h2>
              <p className="text-gray-600">{profile.bio}</p>
              <div className="flex gap-2 text-sm text-gray-600">
                <span>Age: {profile.age}</span>
                <span>•</span>
                <span>{profile.specialization}</span>
                <span>•</span>
                <span>{profile.region}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                {user && userId !== user.id && requestStatus === "none" && !isFriend && (
                  <Button onClick={handleSendRequest} className="bg-purple-600 hover:bg-purple-700 text-white">Send Friend Request</Button>
                )}
                {user && userId !== user.id && requestStatus === "pending" && (
                  <Button disabled className="bg-gray-200 text-gray-600">Request Sent</Button>
                )}
                {user && userId !== user.id && requestStatus === "received" && (
                  <>
                    <Button onClick={handleAcceptRequest} className="bg-green-600 hover:bg-green-700 text-white">Accept</Button>
                    <Button onClick={handleRejectRequest} className="bg-red-600 hover:bg-red-700 text-white">Reject</Button>
                  </>
                )}
                {isFriend && (
                  <Button disabled className="bg-gray-200 text-gray-600">Friends</Button>
                )}
                <Button onClick={handleStartChat} variant="outline">Message</Button>
                {profile.githubUsername && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://github.com/${profile.githubUsername}`, '_blank')}
                  >
                    GitHub
                  </Button>
                )}
                {profile.linkedinUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(profile.linkedinUrl, '_blank')}
                  >
                    LinkedIn
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}