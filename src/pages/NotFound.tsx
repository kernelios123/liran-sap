
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nature-moss/20 to-nature-sky/10">
      <div className="text-center p-8 max-w-md">
        <div className="mb-6 flex justify-center">
          <Leaf className="h-16 w-16 text-nature-leaf animate-leaf-sway" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-nature-forest">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-6">
          It seems you've wandered off the path. Let's guide you back to the grove.
        </p>
        <Button asChild className="bg-nature-forest hover:bg-nature-forest/90">
          <Link to="/">Return to Journal</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
