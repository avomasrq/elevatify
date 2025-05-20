import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";

export default function Requests() {
  const { user } = useUser();
  const [ownedProjects, setOwnedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [friendRequests, setFriendRequests] = useState<string[]>([]);

  const loadRequests = useCallback(() => {
    if (!user) return;
    const projects = JSON.parse(localStorage.getItem("elevatify_global_projects") || "[]");
    setOwnedProjects(projects.filter((p: any) => p.ownerId === user.id && p.pendingRequests && p.pendingRequests.length > 0));
    // Load friend requests received
    const received = JSON.parse(localStorage.getItem(`friendRequests_received_${user.id}`) || "[]");
    setFriendRequests(received);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadRequests();
    // Listen for localStorage changes (from other tabs/windows)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "elevatify_global_projects" || e.key?.startsWith("friendRequests_")) {
        loadRequests();
      }
    };
    // Listen for custom event in the same tab
    const onCustomUpdate = () => loadRequests();
    window.addEventListener("storage", onStorage);
    window.addEventListener("elevatify_requests_updated", onCustomUpdate);
    window.addEventListener("focus", loadRequests);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("elevatify_requests_updated", onCustomUpdate);
      window.removeEventListener("focus", loadRequests);
    };
  }, [loadRequests]);

  const getUserProfile = (userId: string) => {
    const data = localStorage.getItem(`userSettings_${userId}`);
    return data ? JSON.parse(data) : null;
  };

  const handleAccept = (projectId: string, requestId: string) => {
    const projects = JSON.parse(localStorage.getItem("elevatify_global_projects") || "[]");
    const updatedProjects = projects.map((p: any) =>
      p.id === projectId
        ? {
            ...p,
            pendingRequests: p.pendingRequests.filter((id: string) => id !== requestId),
            members: [...p.members, requestId],
          }
        : p
    );
    localStorage.setItem("elevatify_global_projects", JSON.stringify(updatedProjects));
    loadRequests();
  };

  const handleReject = (projectId: string, requestId: string) => {
    const projects = JSON.parse(localStorage.getItem("elevatify_global_projects") || "[]");
    const updatedProjects = projects.map((p: any) =>
      p.id === projectId
        ? {
            ...p,
            pendingRequests: p.pendingRequests.filter((id: string) => id !== requestId),
          }
        : p
    );
    localStorage.setItem("elevatify_global_projects", JSON.stringify(updatedProjects));
    loadRequests();
  };

  // Friend request handlers
  const handleAcceptFriend = (requestId: string) => {
    if (!user) return;
    // Remove from received
    let received = JSON.parse(localStorage.getItem(`friendRequests_received_${user.id}`) || "[]");
    received = received.filter((id: string) => id !== requestId);
    localStorage.setItem(`friendRequests_received_${user.id}`, JSON.stringify(received));
    // Remove from sent for sender
    let sent = JSON.parse(localStorage.getItem(`friendRequests_sent_${requestId}`) || "[]");
    sent = sent.filter((id: string) => id !== user.id);
    localStorage.setItem(`friendRequests_sent_${requestId}`, JSON.stringify(sent));
    // Add each other as friends
    const myFriends = JSON.parse(localStorage.getItem(`friends_${user.id}`) || "[]");
    if (!myFriends.includes(requestId)) {
      myFriends.push(requestId);
      localStorage.setItem(`friends_${user.id}`, JSON.stringify(myFriends));
    }
    const theirFriends = JSON.parse(localStorage.getItem(`friends_${requestId}`) || "[]");
    if (!theirFriends.includes(user.id)) {
      theirFriends.push(user.id);
      localStorage.setItem(`friends_${requestId}`, JSON.stringify(theirFriends));
    }
    loadRequests();
  };

  const handleRejectFriend = (requestId: string) => {
    if (!user) return;
    // Remove from received
    let received = JSON.parse(localStorage.getItem(`friendRequests_received_${user.id}`) || "[]");
    received = received.filter((id: string) => id !== requestId);
    localStorage.setItem(`friendRequests_received_${user.id}`, JSON.stringify(received));
    // Remove from sent for sender
    let sent = JSON.parse(localStorage.getItem(`friendRequests_sent_${requestId}`) || "[]");
    sent = sent.filter((id: string) => id !== user.id);
    localStorage.setItem(`friendRequests_sent_${requestId}`, JSON.stringify(sent));
    loadRequests();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* Friend Requests Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Friend Requests</h1>
                <Button variant="outline" onClick={loadRequests}>Refresh</Button>
              </div>
              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : friendRequests.length === 0 ? (
                <p className="text-gray-600">No friend requests at the moment.</p>
              ) : (
                <ul className="space-y-4">
                  {friendRequests.map((requestId: string) => {
                    const profile = getUserProfile(requestId);
                    return (
                      <li key={requestId} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="font-semibold">{profile?.displayName || `User ${requestId}`}</div>
                          <div className="text-xs text-gray-600">{profile?.specialization || 'N/A'} | {profile?.region || 'N/A'}</div>
                          <div className="text-gray-600 text-sm">{profile?.bio || "No bio."}</div>
                        </div>
                        <div className="mt-2 md:mt-0 flex gap-2">
                          <Button variant="default" onClick={() => handleAcceptFriend(requestId)}>Accept</Button>
                          <Button variant="destructive" onClick={() => handleRejectFriend(requestId)}>Reject</Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {/* Project Requests Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Project Requests</h1>
                <Button variant="outline" onClick={loadRequests}>Refresh</Button>
              </div>
              {loading ? (
                <p className="text-gray-600">Loading...</p>
              ) : ownedProjects.length === 0 ? (
                <p className="text-gray-600">No project requests at the moment.</p>
              ) : (
                ownedProjects.map((project) => (
                  <div key={project.id} className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">{project.title}</h2>
                    <ul className="space-y-4">
                      {project.pendingRequests.map((requestId: string) => {
                        const profile = getUserProfile(requestId);
                        return (
                          <li key={requestId} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="font-semibold">{profile?.displayName || `User ${requestId}`}</div>
                              <div className="text-xs text-gray-600">{profile?.specialization || 'N/A'} | {profile?.region || 'N/A'}</div>
                              <div className="text-gray-600 text-sm">{profile?.bio || "No bio."}</div>
                            </div>
                            <div className="mt-2 md:mt-0 flex gap-2">
                              <Button variant="default" onClick={() => handleAccept(project.id, requestId)}>Accept</Button>
                              <Button variant="destructive" onClick={() => handleReject(project.id, requestId)}>Reject</Button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}