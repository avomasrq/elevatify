import { useEffect, useState, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

interface UserProfileData {
  displayName: string;
  imageUrl: string;
}

interface Message {
  from: string;
  to: string;
  text: string;
  timestamp: number;
}

export default function Messages() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const [friends, setFriends] = useState<string[]>([]);
  const [groups, setGroups] = useState<any[]>([]); // New: list of groups
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null); // New: selected groupId
  const [friendProfile, setFriendProfile] = useState<UserProfileData | null>(null);
  const [groupProfile, setGroupProfile] = useState<any | null>(null); // New: group info
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load friends list
  useEffect(() => {
    if (!user) return;
    const f = JSON.parse(localStorage.getItem(`friends_${user.id}`) || "[]");
    setFriends(f);
    // Load groups the user belongs to
    const projects = JSON.parse(localStorage.getItem("elevatify_global_projects") || "[]");
    const userGroups = projects.filter((p: any) => p.groupId && p.members.includes(user.id)).map((p: any) => ({ groupId: p.groupId, title: p.title, members: p.members }));
    setGroups(userGroups);
    // If coming from ?user=... param, select that friend
    const userParam = searchParams.get("user");
    if (userParam && f.includes(userParam)) {
      setSelectedFriend(userParam);
      setSelectedGroup(null);
    }
  }, [user, searchParams]);

  // Load selected friend's profile
  useEffect(() => {
    if (selectedFriend) {
      const data = localStorage.getItem(`userSettings_${selectedFriend}`);
      if (data) setFriendProfile(JSON.parse(data));
      else setFriendProfile(null);
    } else {
      setFriendProfile(null);
    }
  }, [selectedFriend]);

  // Load selected group profile
  useEffect(() => {
    if (selectedGroup) {
      const projects = JSON.parse(localStorage.getItem("elevatify_global_projects") || "[]");
      const group = projects.find((p: any) => p.groupId === selectedGroup);
      setGroupProfile(group ? { title: group.title, members: group.members } : null);
    } else {
      setGroupProfile(null);
    }
  }, [selectedGroup]);

  // Load messages for selected friend or group
  useEffect(() => {
    if (!user) return setMessages([]);
    if (selectedFriend) {
      const key = `messages_${user.id}_${selectedFriend}`;
      const keyAlt = `messages_${selectedFriend}_${user.id}`;
      const msgs1 = JSON.parse(localStorage.getItem(key) || "[]");
      const msgs2 = JSON.parse(localStorage.getItem(keyAlt) || "[]");
      const allMsgs = [...msgs1, ...msgs2].sort((a, b) => a.timestamp - b.timestamp);
      setMessages(allMsgs);
    } else if (selectedGroup) {
      const key = `group_messages_${selectedGroup}`;
      const msgs = JSON.parse(localStorage.getItem(key) || "[]");
      setMessages(msgs);
    } else {
      setMessages([]);
    }
  }, [user, selectedFriend, selectedGroup, newMessage]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!user || (!selectedFriend && !selectedGroup) || !newMessage.trim()) return;
    if (selectedFriend) {
      const key = `messages_${user.id}_${selectedFriend}`;
      const msg: Message = {
        from: user.id,
        to: selectedFriend,
        text: newMessage.trim(),
        timestamp: Date.now(),
      };
      const msgs = JSON.parse(localStorage.getItem(key) || "[]");
      msgs.push(msg);
      localStorage.setItem(key, JSON.stringify(msgs));
      setNewMessage("");
      setMessages((prev) => [...prev, msg]);
    } else if (selectedGroup) {
      const key = `group_messages_${selectedGroup}`;
      const msg: Message = {
        from: user.id,
        to: selectedGroup,
        text: newMessage.trim(),
        timestamp: Date.now(),
      };
      const msgs = JSON.parse(localStorage.getItem(key) || "[]");
      msgs.push(msg);
      localStorage.setItem(key, JSON.stringify(msgs));
      setNewMessage("");
      setMessages((prev) => [...prev, msg]);
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 flex overflow-hidden">
          {/* Friends & Groups List */}
          <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Chats</h2>
            {friends.length === 0 && groups.length === 0 && <p className="text-gray-500">No chats yet.</p>}
            {/* Groups */}
            {groups.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-purple-700 mb-2">Groups</h3>
                <ul className="space-y-2">
                  {groups.map((g) => (
                    <li key={g.groupId}>
                      <button
                        className={`flex items-center w-full px-2 py-2 rounded-lg hover:bg-purple-50 ${selectedGroup === g.groupId ? "bg-purple-100" : ""}`}
                        onClick={() => { setSelectedGroup(g.groupId); setSelectedFriend(null); }}
                      >
                        <span className="text-sm font-medium text-purple-800">{g.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Friends */}
            {friends.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">Friends</h3>
                <ul className="space-y-2">
                  {friends.map((fid) => {
                    const data = localStorage.getItem(`userSettings_${fid}`);
                    const profile = data ? JSON.parse(data) : null;
                    return (
                      <li key={fid}>
                        <button
                          className={`flex items-center w-full px-2 py-2 rounded-lg hover:bg-purple-50 ${selectedFriend === fid ? "bg-purple-100" : ""}`}
                          onClick={() => { setSelectedFriend(fid); setSelectedGroup(null); }}
                        >
                          <img
                            src={profile?.imageUrl || "/default-avatar.png"}
                            alt={profile?.displayName || "User"}
                            className="w-8 h-8 rounded-full object-cover mr-3"
                          />
                          <span className="text-sm font-medium text-gray-800">{profile?.displayName || fid}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center border-b px-6 py-4 bg-white">
              {selectedGroup && groupProfile ? (
                <span className="text-lg font-semibold text-purple-800">Group: {groupProfile.title}</span>
              ) : selectedFriend && friendProfile ? (
                <>
                  <img
                    src={friendProfile.imageUrl || "/default-avatar.png"}
                    alt={friendProfile.displayName}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <span className="text-lg font-semibold text-gray-900">{friendProfile.displayName}</span>
                </>
              ) : (
                <span className="text-lg font-semibold text-gray-900">Select a chat</span>
              )}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
              {(selectedFriend || selectedGroup) ? (
                <div className="flex flex-col gap-2">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`max-w-xs px-4 py-2 rounded-lg text-sm ${msg.from === user.id ? "bg-purple-600 text-white self-end" : "bg-white text-gray-900 self-start border"}`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="text-gray-500">Select a chat to start messaging.</div>
              )}
            </div>
            {(selectedFriend || selectedGroup) && (
              <form
                className="flex items-center border-t bg-white px-6 py-4"
                onSubmit={e => { e.preventDefault(); handleSend(); }}
              >
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 mr-2"
                />
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Send</Button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}