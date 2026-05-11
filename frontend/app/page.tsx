"use client";

import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, PlusCircle, AlertCircle } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/tasks");
      if (!res.ok) throw new Error("Gagal mengambil data dari server");
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!title || !subject) return;

    try {
      const res = await fetch("http://localhost:5001/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subject, status: "Belum" }),
      });

      if (!res.ok) throw new Error("Gagal menambahkan task");

      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setTitle("");
      setSubject("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Selesai").length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Navbar */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-3">
          <BookOpen className="text-blue-500 w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight text-white">StudyFlow</h1>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Form & Statistik */}
        <div className="space-y-6 md:col-span-1">
          {/* Card Statistik */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Statistik Belajar</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl">
                <p className="text-3xl font-bold text-white">{totalTasks}</p>
                <p className="text-xs text-slate-400 mt-1">Total Task</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl">
                <p className="text-3xl font-bold text-blue-500">{completedTasks}</p>
                <p className="text-xs text-slate-400 mt-1">Selesai</p>
              </div>
            </div>
          </div>

          {/* Card Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-500" /> Tambah Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Nama Task</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Baca Jurnal"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">Mata Kuliah</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Contoh: Metodologi Penelitian"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                Simpan Task
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Task */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-2">Daftar Task</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
              <p>Memuat task...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
              <p className="text-red-400 font-medium">{error}</p>
              <button onClick={fetchTasks} className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
                Coba Lagi
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-white">Belum ada task</h3>
              <p className="text-slate-400 text-sm mt-1">Mulai tambahkan jadwal belajarmu!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-700 transition-colors">
                  <div>
                    <h3 className="font-medium text-white">{task.title}</h3>
                    <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                      <BookOpen className="w-3.5 h-3.5" /> {task.subject}
                    </p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      task.status === "Selesai" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    }`}>
                      {task.status === "Selesai" ? "Selesai" : "Belum Selesai"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 mt-auto border-t border-slate-800/50 text-center text-slate-500 text-sm">
        <p>StudyFlow &copy; {new Date().getFullYear()} - Project Next.js & Express.js</p>
      </footer>
    </div>
  );
}