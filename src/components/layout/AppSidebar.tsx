
import { Book, ListTodo, MessageSquare, BarChart } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Book, text: "Journal", path: "/" },
  { icon: ListTodo, text: "Tasks", path: "/tasks" },
  { icon: MessageSquare, text: "AI Chat", path: "/ai-chat" },
  { icon: BarChart, text: "Insights", path: "/insights" },
];

export function AppSidebar() {
  return (
    <aside className="h-screen bg-grove-sidebar sticky top-0 w-60 border-r border-grove-sidebar/80 flex flex-col">
      <div className="p-6 border-b border-grove-sidebar/80">
        <h1 className="text-xl font-serif font-semibold text-grove-text">
          Whispering Grove
        </h1>
      </div>

      <nav className="flex-1 py-8">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium",
                    isActive
                      ? "bg-white/30 text-grove-text"
                      : "text-grove-text hover:bg-white/20"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 border-t border-grove-sidebar/80 mt-auto">
        <div className="text-xs text-grove-muted">
          <p>Whispering Grove Journal</p>
          <p>Connect with nature & yourself</p>
        </div>
      </div>
    </aside>
  );
}
