"use client";

import { useContext, useEffect, useState, Suspense } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getProjects, addMember, removeMember } from "@/services/projectService";
import { getAllUsers } from "@/services/authService";
import { getTasks, createTask, updateTask, getDashboardStats } from "@/services/taskService";

function ProjectDashboardContent() {
  const { user, loading, logout } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "todo", assignedTo: "", priority: "medium", dueDate: "" });
  const [stats, setStats] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user && projectId) {
      fetchProjectData();
      
      // Set up polling to auto-refresh dashboard and show status updates in real-time
      const intervalId = setInterval(() => {
        fetchProjectData();
      }, 5000);
      
      return () => clearInterval(intervalId);
    }
  }, [user, loading, router, projectId]);

  useEffect(() => {
    if (myRole) {
      const loadUsers = async () => {
        try {
          const res = await getAllUsers();
          setAllUsers(res.users || []);
        } catch (err) {}
      };
      loadUsers();
    }
  }, [myRole]);

  const fetchProjectData = async () => {
    try {
      const data = await getProjects();
      const currentProject = data.projects.find(p => p._id === projectId);
      if (currentProject) {
        setProject(currentProject);
        const userId = user._id || user.id;
        const role = currentProject.members.find(m => m.user === userId)?.role;
        setMyRole(role);
      }
      
      const taskData = await getTasks(projectId);
      setTasks(taskData.tasks || []);

      const statsData = await getDashboardStats(projectId);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...newTask, projectId };
      if (!payload.dueDate) {
        delete payload.dueDate; // prevent mongoose CastError on empty string
      }
      await createTask(payload);
      setNewTask({ title: "", description: "", status: "todo", assignedTo: "", priority: "medium", dueDate: "" });
      setShowTaskModal(false);
      fetchProjectData();
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || err.response?.data?.msg || err.message || "Failed to create task"}`);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      fetchProjectData();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update task");
    }
  };

  const handleAddMemberDirect = async (userId) => {
    try {
      await addMember(projectId, userId);
      setSearchTerm("");
      fetchProjectData();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId) => {
    if(!confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeMember(projectId, userId);
      fetchProjectData();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to remove member");
    }
  };

  if (loading || !project) {
    return <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">Loading project...</div>;
  }

  return (
    <div className="min-h-screen font-sans selection:bg-primary/30">
      <nav className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 hover:bg-white/80 transition-all text-sm font-medium border border-gray-200/50 text-gray-700 shadow-sm">&larr; Back</button>
          <h1 className="text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-primary underline underline-offset-8 decoration-primary">{project.name} <span className="text-sm font-semibold text-gray-500">current project</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-medium text-sm bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full uppercase tracking-wider">Role: {myRole}</span>
          <button onClick={logout} className="px-5 py-2 rounded-3xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 transition-all duration-300 font-semibold text-sm border border-red-500/20 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20">Logout</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-10 mt-6">
        {stats && myRole === 'admin' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center justify-center">
              <h4 className="text-gray-500 text-sm font-semibold tracking-wide uppercase">Total Tasks</h4>
              <p className="text-4xl font-black text-gray-800 mt-2">{stats.totalTasks}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center justify-center">
              <h4 className="text-gray-500 text-sm font-semibold tracking-wide uppercase">Completed</h4>
              <p className="text-4xl font-black text-green-500 mt-2">
                {stats.tasksByStatus?.find(s => s._id === 'done')?.count || 0}
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center justify-center">
              <h4 className="text-gray-500 text-sm font-semibold tracking-wide uppercase">Overdue</h4>
              <p className="text-4xl font-black text-red-500 mt-2">{stats.overdueTasks?.length || 0}</p>
            </div>
            <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col items-center justify-center">
              <h4 className="text-gray-500 text-sm font-semibold tracking-wide uppercase">In Progress</h4>
              <p className="text-4xl font-black text-primary mt-2">
                {stats.tasksByStatus?.find(s => s._id === 'in-progress')?.count || 0}
              </p>
            </div>
          </div>
        )}

        {myRole === 'admin' && (
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Team Progress</h2>
            {project.members.filter(m => m.role !== 'admin').length === 0 ? (
              <p className="text-gray-500 text-base bg-white/40 p-6 rounded-3xl border border-white">No members added yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.members.filter(m => m.role !== 'admin').map(m => {
                  const userObj = allUsers.find(u => String(u._id) === String(m.user));
                  const memberTasks = tasks.filter(t => String(t.assignedTo) === String(m.user));
                  const completed = memberTasks.filter(t => t.status === 'done').length;
                  const total = memberTasks.length;
                  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
                  
                  return (
                    <div key={m.user} className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-white">
                      <h3 className="font-bold text-gray-800 mb-3 text-lg">{userObj ? userObj.name : 'Loading...'}</h3>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>{completed} / {total} Tasks Completed</span>
                        <span className="font-bold text-primary">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200/50 rounded-full h-3 mb-1 overflow-hidden">
                        <div className="bg-primary h-3 rounded-full transition-all duration-700 ease-out" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tasks</h2>
          {myRole === "admin" && (
            <div className="flex gap-4">
              <button 
                onClick={() => setShowMemberModal(true)}
                className="px-6 py-3 bg-black hover:bg-white hover:text-black text-white border border-gray-200 rounded-3xl font-semibold transition-all shadow-sm hover:shadow-md"
              >
                Manage Members
              </button>
              <button 
                onClick={() => setShowTaskModal(true)}
                className="px-6 py-3 bg-primary hover:opacity-90 text-white rounded-3xl font-semibold transition-all shadow-md hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                + Create Task
              </button>
            </div>
          )}
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-20 bg-white/40 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60">
            <h3 className="text-2xl text-gray-600 font-medium mb-2">No tasks found</h3>
            <p className="text-gray-500">Create a task to kick off the project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['todo', 'in-progress', 'done'].map(status => (
              <div key={status} className="bg-primary/50 backdrop-blur-md rounded-3xl p-6 border border-white min-h-[400px]">
                <h3 className="text-xl font-bold text-gray-800 mb-6 capitalize px-2 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${status === 'todo' ? 'bg-gray-400' : status === 'in-progress' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  {status.replace('-', ' ')}
                  <span className="ml-auto bg-white/50 px-3 py-0.5 rounded-full text-sm">{tasks.filter(t => t.status === status).length}</span>
                </h3>
                <div className="flex flex-col gap-4">
                  {tasks.filter(t => t.status === status).map(task => {
                    const assignee = allUsers.find(u => String(u._id) === String(task.assignedTo));
                    return (
                    <div key={task._id} className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-white hover:shadow-[0_8px_25px_rgb(0,0,0,0.06)] transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800 text-lg leading-tight">{task.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 mb-4 leading-relaxed">{task.description}</p>
                      <div className="flex flex-wrap gap-2 items-center mb-4">
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-600' : task.priority === 'low' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {task.priority?.toUpperCase() || "MEDIUM"}
                        </span>
                        {assignee && (
                          <span className="text-xs bg-primary/10 border border-black/10 text-primary font-bold px-3 py-1 rounded-full">
                            {assignee.name}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-gray-500 font-medium ml-auto border border-black/30 bg-gray-100 px-3 py-1 rounded-full">
                            {new Date(task.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                          </span>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200/50">
                        <select 
                          className="w-full text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-gray-700 font-medium appearance-none"
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        >
                          <option value="todo">Todo</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input 
                  type="text" 
                  placeholder="enter the title of project"
                  required
                  className="w-full px-4 py-2 border placeholder:text-black/20 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                placeholder="enter the description of the your project"
                  className="w-full px-4 py-2 border placeholder:text-black/20 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none h-20"
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select 
                    className="w-full px-4 py-2 border bg-primary/20 placeholder:text-black/20 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="low" className="rounded-lg">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 border text-black placeholder:text-black/20 border-gray-300 rounded-lg focus:ring-2 focus:text-black focus:border-primary outline-none"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                <select 
                  required
                  className="w-full px-4 py-2 border placeholder:text-black/20 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={newTask.assignedTo}
                  onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  <option value="">Select a member...</option>
                  {project.members
                    .filter(m => m.role !== "admin" && !tasks.some(t => String(t.assignedTo) === String(m.user)))
                    .map(m => {
                    const userObj = allUsers.find(u => String(u._id) === String(m.user));
                    return (
                      <option key={m.user} value={m.user}>{userObj ? userObj.name : m.user}</option>
                    );
                  })}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-black/80 text-white rounded-full font-medium transition-colors shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Members Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Manage Members</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Users to Add</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border placeholder:text-black/20 text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
              />
              
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                {searchTerm.trim() === "" ? (
                  <div className="p-3 text-sm text-gray-500 text-center">Type to search users...</div>
                ) : (
                  <>
                    {allUsers
                      .filter(u => !project.members.some(m => String(m.user) === String(u._id)))
                      .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(u => (
                        <div key={u._id} className="flex justify-between items-center p-3 hover:bg-gray-50 border-b last:border-0">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                          <button 
                            onClick={() => handleAddMemberDirect(u._id)}
                            className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/80"
                          >
                            Add
                          </button>
                        </div>
                      ))
                    }
                    {allUsers
                      .filter(u => !project.members.some(m => String(m.user) === String(u._id)))
                      .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
                      .length === 0 && (
                      <div className="p-3 text-sm text-gray-500 text-center">No available users found.</div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[150px]">
              <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Current Members</h4>
              <div className="flex flex-col gap-3">
                {project.members.map(m => {
                  const userObj = allUsers.find(u => String(u._id) === String(m.user));
                  return (
                  <div key={m.user} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-800 truncate max-w-[200px]">{userObj ? userObj.name : m.user}</p>
                      <p className="text-xs text-gray-500 capitalize">Role: {m.role}</p>
                    </div>
                    {m.role !== "admin" && (
                      <button 
                        onClick={() => handleRemoveMember(m.user)}
                        className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
              <button 
                onClick={() => setShowMemberModal(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectDashboard() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">Loading...</div>}>
      <ProjectDashboardContent />
    </Suspense>
  );
}