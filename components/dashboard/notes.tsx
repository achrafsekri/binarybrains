import React from "react";
import AddNote from "../forms/add-note";

const Notes = () => {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Notes</h2>
      <AddNote />
    </div>
  );
};

export default Notes;
