import React from "react";
import { Note } from "@prisma/client";
import { format } from "date-fns";

import AddNote from "../forms/add-note";

const Notes = ({ notes }: { notes: Note[] }) => {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Notes</h2>
      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {format(new Date(note.createdAt), "MMM dd yyyy, hh:mm a")}
                </p>
              </div>
            </div>
            <p className="mt-2 text-gray-800">{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
