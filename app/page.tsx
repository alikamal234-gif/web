"use client";

import { useEffect, useState } from "react";

type Note = {
  _id: string;
  title: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState(false);
  const [mode, setMode] = useState("POST");
  const [selectedId , setSelectedId] = useState("")

  const fetchNotes = async () => {
    const res = await fetch("https://app-note-backend-6o3h.onrender.com/api/notes");
    const data = await res.json();
    setNotes(data);
  };

  async function deleteNote(id : string) {
    try {
      setLoad(true)
      await fetch(`https://app-note-backend-6o3h.onrender.com/api/notes/${id}`, {
        method: "DELETE"
      });
      setLoad(false)
      fetchNotes()
    } catch (error) {
      const message = await error
      console.log(message)
    }
  }

  async function updateNote(id : string) {
    await fetch(`https://app-note-backend-6o3h.onrender.com/api/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type" : "Application/json" 
      },
      body: JSON.stringify({
        title
      })
    })
    setMode("POST")
    setTitle("")
    setSelectedId("")
    fetchNotes()
  }

  const addNote = async () => {
    if (!title.trim()) return;

    await fetch("https://app-note-backend-6o3h.onrender.com/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-black">
          Notes App
        </h1>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder={mode == "POST" ? "Add note..." : mode == "PUT" ? "modifier note..." : ""}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded border p-2 text-black"
          />

          <button
            onClick={() => {
              if (mode == "POST") addNote
              if (mode == "PUT") updateNote(selectedId)
            }}
            className="rounded bg-black px-4 py-2 text-white"
          >
            {mode == "POST" ? "Add" : mode == "PUT" ? "Edit" : ""}
          </button>
        </div>

        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note._id}
              className="rounded border bg-black p-3 flex justify-between"
            ><div>
                
              {note.title}
            </div>
              <div className="flex justify-center items-center">
                <button
                  className=" p-1 rounded-lg"
                  onClick={() => deleteNote(note._id)}
                >
                  {load ?(
                    <div className="bg-black p-2 rounded-full">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 animate-spin text-white fill-white"
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
                    "✕"
                  )}
                </button>

                <button onClick={() => {
                  setMode("PUT")
                  setTitle(note.title)
                  setSelectedId(note._id);
                } }><svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 29"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.213 3 21l.787-4.5L16.862 4.487z"
                  />
                </svg></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}