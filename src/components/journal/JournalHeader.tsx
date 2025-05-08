
import { Leaf } from "lucide-react";

export function JournalHeader() {
  return (
    <header className="mb-12 text-center">
      <div className="inline-flex items-center gap-4 mb-4">
        <Leaf className="h-8 w-8 text-nature-brown animate-leaf-sway py-0" />
        <h1 className="text-4xl font-heading text-nature-brown py-0 font-semibold md:text-7xl">
          Whispering Grove Journal
        </h1>
        <Leaf className="h-8 w-8 text-nature-brown animate-leaf-sway" />
      </div>
      <p className="text-nature-brown/70 font-body text-xl">
        A peaceful place to capture your thoughts, feelings, and weekly missions
      </p>
    </header>
  );
}
