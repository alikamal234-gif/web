"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Note = {
  _id: string;
  title: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState(false);
  const [loadAddBtn, setLoadAddBtn] = useState(false)
  const [mode, setMode] = useState("POST");
  const [selectedId, setSelectedId] = useState("");
  const [userName, setUserName] = useState("");
  const [token, setToken] = useState("");

  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (!savedToken) {
      router.push("/login");
      return;
    }
    
    setToken(savedToken);

    // Decode JWT payload to get user name
    try {
      const payloadBase64 = savedToken.split('.')[1];
      const decodedJson = atob(payloadBase64);
      const decoded = JSON.parse(decodedJson);
      if (decoded.name) {
        setUserName(decoded.name);
      }
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  const fetchNotes = async () => {
    const res = await fetch("https://app-note-backend-6o3h.onrender.com/api/notes", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (res.ok) {
        const data = await res.json();
        setNotes(data);
    }
  };

  async function deleteNote(id: string) {
    try {
      setLoad(true);
      await fetch(`https://app-note-backend-6o3h.onrender.com/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setLoad(false);
      fetchNotes();
    } catch (error) {
      console.log(error);
    }
  }

  async function updateNote(id: string) {
    await fetch(`https://app-note-backend-6o3h.onrender.com/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });
    setMode("POST");
    setTitle("");
    setSelectedId("");
    setLoadAddBtn(false)
    fetchNotes();
  }

  const addNote = async () => {
    if (!title.trim()) return;

    await fetch("https://app-note-backend-6o3h.onrender.com/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ title }),
    });
    setLoadAddBtn(false)
    setTitle("");
    fetchNotes();
  };
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-6 hidden md:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Notes App
          </h2>
        </div>
        
        <div className="flex-1"></div>
        
        <div className="border-t border-gray-800 pt-6 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 text-blue-400 font-bold uppercase">
              {userName ? userName.charAt(0) : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-gray-400 truncate">Connecté en tant que</p>
              <p className="font-medium text-gray-100 truncate">{userName || "Utilisateur"}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-red-500/20 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-4xl">
          {/* Header Mobile (Visible uniquement sur petits écrans) */}
          <div className="mb-8 md:hidden flex justify-between items-center bg-gray-900/50 p-4 rounded-2xl border border-gray-800">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-blue-400 font-bold border border-gray-700 uppercase">
                  {userName ? userName.charAt(0) : "U"}
               </div>
               <span className="text-gray-200 font-medium">{userName || "Utilisateur"}</span>
             </div>
             <button onClick={handleLogout} className="p-2 text-red-400 bg-red-500/10 rounded-xl hover:bg-red-500/20">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
             </button>
          </div>

          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Vos Notes
            </h1>
            <p className="text-gray-400 mt-2">Organisez vos idées avec élégance</p>
          </div>

          {/* Main Card */}
          <div className="rounded-2xl bg-gray-800/50 backdrop-blur-sm shadow-2xl border border-gray-700 overflow-hidden">
            {/* Input Section */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={mode == "POST" ? " Écrivez votre note..." : mode == "PUT" ? " Modifiez votre note..." : ""}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl bg-gray-900 border border-gray-600 px-5 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && (mode == "POST" ? addNote() : mode == "PUT" && updateNote(selectedId))}
                  />
                </div>

                <button
                  onClick={() => {
                    setLoadAddBtn(true);

                    if (mode === "POST")
                      addNote();

                    if (mode === "PUT")
                      updateNote(selectedId);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-200 transform hover:scale-105"
                >
                  {loadAddBtn ? (
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 animate-spin text-white"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
                        fill="currentColor"
                        className="opacity-20"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124"
                        fill="currentColor"
                      />
                    </svg>
                  ) : mode === "POST" ? (
                    "Ajouter"
                  ) : (
                    "Modifier"
                  )}
                </button>
              </div>
            </div>

            {/* Notes List */}
            <div className="p-6">
              {notes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">Aucune note pour le moment</p>
                  <p className="text-gray-500 text-sm">Commencez par ajouter une note ci-dessus</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {notes.map((note) => (
                    <div
                      key={note._id}
                      className="group relative rounded-xl bg-gray-900/50 border border-gray-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200"
                    >
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-gray-100 text-lg break-words pr-4">
                            {note.title}
                          </p>
                        </div>

                        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
                            onClick={() => deleteNote(note._id)}
                          >
                            {load ? (
                              <div className="w-5 h-5">
                                <svg
                                  aria-hidden="true"
                                  className="w-5 h-5 animate-spin text-red-400"
                                  viewBox="0 0 100 101"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
                                    fill="currentColor"
                                    className="opacity-20"
                                  />
                                  <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124"
                                    fill="currentColor"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setMode("PUT");
                              setTitle(note.title);
                              setSelectedId(note._id);
                            }}
                            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Indicateur de mode édition */}
                      {mode === "PUT" && selectedId === note._id && (
                        <div className="absolute top-2 right-2">
                          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                            En cours d'édition
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer avec compteur */}
            <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/30">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">
                  Total: <span className="text-blue-400 font-semibold">{notes.length}</span> note{notes.length > 1 ? 's' : ''}
                </span>
                {mode === "PUT" && (
                  <button
                    onClick={() => {
                      setMode("POST");
                      setTitle("");
                      setSelectedId("");
                    }}
                    className="text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    Annuler la modification
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}