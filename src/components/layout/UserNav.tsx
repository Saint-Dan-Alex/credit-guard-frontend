"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  Building2,
  Lock,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { removeToken } from "@/lib/api";
import { toast } from "sonner";

export function UserNav() {
  const router = useRouter();
  const [userName, setUserName] = React.useState("Joël Ngombo");
  const [userEmail, setUserEmail] = React.useState("joel.ngombo@creditguard.com");
  const [userRole, setUserRole] = React.useState("Super Admin");
  const [initials, setInitials] = React.useState("JN");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("creditguard_user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          if (u.name) setUserName(u.name);
          if (u.email) setUserEmail(u.email);
          if (u.role?.name) setUserRole(u.role.name);
          else if (u.role) setUserRole(String(u.role));

          const names = (u.name || "Joël Ngombo").split(" ");
          setInitials(
            names.length > 1
              ? `${names[0][0]}${names[1][0]}`.toUpperCase()
              : names[0].slice(0, 2).toUpperCase()
          );
        } catch {}
      }
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    toast.success("Déconnexion réussie");
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2.5 p-1 pl-2 pr-1.5 rounded-lg border border-border/80 bg-muted/20 hover:bg-muted/60 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="h-7 w-7 rounded-md bg-primary/10">
            <AvatarFallback className="text-[11px] font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-foreground leading-none">
              {userName}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
              {userRole}
            </p>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56" forceMount>
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-bold leading-none text-foreground">
              {userName}
            </p>
            <p className="text-[11px] leading-none text-muted-foreground font-mono truncate">
              {userEmail}
            </p>
            <div className="pt-1">
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
                {userRole}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/admin/users")}>
            <Shield className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>Gestion des Accès & HRBAC</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/admin/logs")}>
            <Lock className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>Journaux de Sécurité</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/reports")}>
            <Building2 className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
            <span>Organisation & Paramètres</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          <span>Déconnexion</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
