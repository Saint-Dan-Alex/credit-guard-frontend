"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  Wallet,
  AlertCircle,
  BarChart3,
  Sparkles,
  Shield,
  Layers,
  History,
  Plus,
  Search,
  Scan,
  RefreshCw,
} from "lucide-react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Rechercher une page, un dossier, un emprunteur, un rapport..." />
      <CommandList>
        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

        <CommandGroup heading="Navigation Rapide">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4 text-blue-600" />
            <span>Tableau de Bord</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/applications"))}>
            <FileText className="mr-2 h-4 w-4 text-blue-600" />
            <span>Dossiers de Financement</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/applications/tasks"))}>
            <ClipboardList className="mr-2 h-4 w-4 text-indigo-600" />
            <span>Tâches & Décisions Comité</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/loans"))}>
            <Wallet className="mr-2 h-4 w-4 text-emerald-600" />
            <span>Prêts & Restructuration</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/recovery"))}>
            <AlertCircle className="mr-2 h-4 w-4 text-rose-600" />
            <span>Recouvrement & Contentieux</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/clients"))}>
            <Users className="mr-2 h-4 w-4 text-purple-600" />
            <span>Clients Emprunteurs</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/ai-assistant"))}>
            <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
            <span>Intelligence IA & OCR</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/reports"))}>
            <BarChart3 className="mr-2 h-4 w-4 text-amber-600" />
            <span>Rapports Réglementaires & Risque</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions Directes">
          <CommandItem onSelect={() => runCommand(() => router.push("/applications/new"))}>
            <Plus className="mr-2 h-4 w-4 text-primary" />
            <span>Créer une Nouvelle Demande</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/clients/new"))}>
            <Plus className="mr-2 h-4 w-4 text-primary" />
            <span>Enregistrer un Nouvel Emprunteur</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/ai-assistant"))}>
            <Scan className="mr-2 h-4 w-4 text-indigo-600" />
            <span>Scanner un Justificatif OCR</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/recovery"))}>
            <RefreshCw className="mr-2 h-4 w-4 text-amber-600" />
            <span>Recalculer les Retards DPD</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Administration & Sécurité HRBAC">
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/users"))}>
            <Shield className="mr-2 h-4 w-4 text-blue-600" />
            <span>Utilisateurs & Overrides</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/roles"))}>
            <Layers className="mr-2 h-4 w-4 text-blue-600" />
            <span>Matrice des Rôles HRBAC</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/admin/logs"))}>
            <History className="mr-2 h-4 w-4 text-blue-600" />
            <span>Journaux d'Audit Immuables</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
