import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export default function Messages() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
              <p className="text-gray-600">No messages at the moment.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 