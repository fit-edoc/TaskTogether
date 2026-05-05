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
      toast.success("Project created successfully");
      fetchProjects();
    } catch (err) {
      
      toast.error(err.response?.data?.msg || "Failed to create project");
    }
  };

  if (loading) {
    return <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen font-sans selection:bg-primary/30">
      <nav className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <h1 className="md:text-2xl text-sm font-semibold tracking-wide bg-clip-text text-transparent bg-primary">
          TaskTogether
        </h1>
        <div className="flex items-center gap-6">
          <span className="font-medium text-gray-700">Welcome, {user?.name}</span>
          <button onClick={logout} className="px-5 py-2 rounded-3xl bg-red-500 hover:bg-red-500 hover:text-white text-black transition-all duration-300 font-semibold text-sm border border-red-500/20 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 mt-6">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Projects</h2>
          <button 
            onClick={() => setShowModal(true)}
            className="md:px-6 px-2 py-3 bg-black hover:opacity-90 text-white rounded-3xl font-semibold transition-all duration-300 shadow-md hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            + Create Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60">
            <h3 className="text-2xl text-gray-600 font-medium mb-2">No projects found</h3>
            <p className="text-gray-500">Create one to get started and collaborate!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const userId = user._id || user.id;
              const myRole = project.members.find(m => m.user === userId)?.role;
              return (
                <Link href={`/dashboard/projects?id=${project._id}`} key={project._id}>
                  <div className="bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:bg-white/80 transition-all duration-300 border border-white cursor-pointer h-full flex flex-col group">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 line-clamp-1 group-hover:text-primary transition-colors">{project.name}</h3>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${myRole === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/10 text-secondary border border-secondary/20'}`}>
                        {myRole === 'admin' ? 'Admin' : 'Member'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-base flex-grow line-clamp-3 mb-6 leading-relaxed">{project.description}</p>
                    <div className="flex items-center text-sm text-gray-500 font-medium pt-5 border-t border-gray-200/50">
                      <div className="flex -space-x-2 mr-3">
                       
                         <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                         {project.members.length > 1 && <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>}
                      </div>
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
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 w-full max-w-lg transform transition-all border border-white">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Project Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-800 placeholder-gray-400"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  placeholder="E.g., Website Redesign"
                />
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                <textarea 
                  className="w-full px-5 py-4 bg-white/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none h-32 text-gray-800 placeholder-gray-400"
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  placeholder="Brief description of the project..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-3xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-black  hover:opacity-90 text-white rounded-3xl font-semibold transition-all shadow-md hover:shadow-primary/30"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}