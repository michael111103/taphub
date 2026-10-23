"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type Props = {
  base: string;
  orgName: string;
  orgId: string;
  orgs: { id: string; name: string }[];
  planLabel: string;
  trialDays: number | null;
  userName: string;
  userEmail: string;
  notices: { label: string; detail: string; href: string; tone: "rose" | "amber" | "blue" }[];
  children: React.ReactNode;
};

export default function AppShell(props: Props) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("taphub-sidebar") === "mini");
    } catch {}
  }, []);
  const toggle = () =>
    setCollapsed((c) => {
      try {
        localStorage.setItem("taphub-sidebar", c ? "full" : "mini");
      } catch {}
      return !c;
    });
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        base={props.base}
        orgName={props.orgName}
        planLabel={props.planLabel}
        trialDays={props.trialDays}
        userName={props.userName}
        userEmail={props.userEmail}
        open={open}
        onClose={close}
        collapsed={collapsed}
        onToggleCollapse={toggle}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar base={props.base} orgs={props.orgs} orgId={props.orgId} userName={props.userName} notices={props.notices} onMenu={() => setOpen(true)} />
        <main id="konten" className="min-w-0 flex-1 px-3 pb-16 pt-5 sm:px-6 sm:pt-6">
          {props.children}
        </main>
      </div>
    </div>
  );
}
