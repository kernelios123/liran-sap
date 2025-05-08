
import { Leaf, Book, Calendar, BarChart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Book, text: "Journal", path: "/" },
  { icon: Leaf, text: "AI Chat", path: "/ai-chat" },
  { icon: BarChart, text: "Insights", path: "/insights" },
  { icon: Calendar, text: "Calendar", path: "/calendar" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar sticky top-0 border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-border">
        {!collapsed && (
          <h1 className="text-xl font-semibold text-nature-forest">
            Whispering Grove
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-nature-forest"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>

      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-sidebar-foreground hover:bg-accent/50"
                  )
                }
              >
                <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
                {!collapsed && <span>{item.text}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            <p>Whispering Grove Journal</p>
            <p>Connect with nature & yourself</p>
          </div>
        )}
      </div>
    </aside>
  );
}
