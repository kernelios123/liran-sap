
import { Leaf, Book, Calendar, BarChart, ListTodo } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Book, text: "Journal", path: "/" },
  { icon: ListTodo, text: "Tasks", path: "/tasks" },
  { icon: Leaf, text: "AI Chat", path: "/ai-chat" },
  { icon: BarChart, text: "Insights", path: "/insights" },
  { icon: Calendar, text: "Calendar", path: "/calendar" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-nature-softgreen sticky top-0 border-r border-nature-sage/20 transition-all duration-300 flex flex-col shadow-md",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-5 flex items-center justify-between border-b border-nature-sage/20">
        {!collapsed && (
          <h1 className="text-xl font-heading font-semibold text-nature-brown">
            Whispering Grove
          </h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-nature-brown hover:text-nature-sage hover:bg-nature-beige/50 transition-colors duration-300"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>

      <nav className="flex-1 py-8 px-2">
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-white/80 text-nature-brown font-medium shadow-soft"
                      : "text-nature-brown/70 hover:bg-white/50 hover:text-nature-brown"
                  )
                }
              >
                <item.icon className={`h-5 w-5 ${collapsed ? 'mx-auto' : ''}`} />
                {!collapsed && <span className="font-body">{item.text}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-nature-sage/20 mt-auto">
        {!collapsed && (
          <div className="text-xs text-nature-brown/60 font-body">
            <p>Whispering Grove Journal</p>
            <p className="mt-1">Connect with nature & yourself</p>
          </div>
        )}
      </div>
    </aside>
  );
}
