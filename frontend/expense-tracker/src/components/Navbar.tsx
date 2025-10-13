import { NavLink } from "react-router-dom";
import {
  PiggyBank,
  LayoutDashboard,
  Receipt,
  BarChart3,
  User,
} from "lucide-react";
import { Button } from "./ui/Button";

const Navbar = () => {
  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/transactions", label: "Transactions", icon: Receipt },
    { path: "/budget", label: "Budget", icon: PiggyBank },
    { path: "/reports", label: "Reports", icon: BarChart3 },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="flex justify-between bg-card border-b border px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <PiggyBank className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">
            Expense Tracker
          </h1>
        </div>

        {/* Navigation links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                
              >
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
