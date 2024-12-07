import React from "react";
import { Loader2 } from "lucide-react";


const loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="size-10 animate-spin" />
    </div>
  );
};

export default loading;
