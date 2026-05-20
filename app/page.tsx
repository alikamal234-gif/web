"use client";

import { useEffect, useState } from "react";

type Note = {
  _id: string;
  title: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");

  const fetchNotes = async () => {
    const res = await fetch("https://app-note-backend-6o3h.onrender.com/api/notes");
    const data = await res.json();
    setNotes(data);
  };

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
            placeholder="Add note..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 rounded border p-2 text-black"
          />

          <button
            onClick={addNote}
            className="rounded bg-black px-4 py-2 text-white"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note._id}
              className="rounded border bg-black p-3"
            >
              {note.title}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}