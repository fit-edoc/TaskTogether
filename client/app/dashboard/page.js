"use client";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getProjects, createProject } from "@/services/projectService";
import Link from "next/link";

export default function Dashboard() {
  const { user, loading, logout } = useContext(AuthContext);
  const router = useRouter();
  
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", description: "" });


  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      fetchProjects();
    }
  }, [user, loading, router]);
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      setNewProject({ name: "", description: "" });
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create project");
    }
  };

  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <nav className="flex items-center justify-between p-4 bg-gray-800 text-white shadow-md">
        <h1 className="text-xl font-bold tracking-wide">Task-Together</h1>
        <div className="flex items-center gap-4">
          <span className="font-medium">Welcome, {user?.name}</span>
          <button onClick={logout} className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold text-sm">Logout</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 mt-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Your Projects</h2>
          {user?.role === 'admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-sm"
            >
              + Create Project
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl text-gray-500 font-medium">No projects found. Create one to get started!</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const userId = user._id || user.id;
              const myRole = project.members.find(m => m.user === userId)?.role;
              return (
                <Link href={`/dashboard/projects?id=${project._id}`} key={project._id}>
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 cursor-pointer h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{project.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${myRole === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {myRole === 'admin' ? 'Admin' : 'Member'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm flex-grow line-clamp-3 mb-4">{project.description}</p>
                    <div className="text-sm text-gray-500 font-medium pt-4 border-t border-gray-100">
                      {project.members.length} Member{project.members.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  placeholder="E.g., Website Redesign"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none h-24"
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Brief description of the project..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}