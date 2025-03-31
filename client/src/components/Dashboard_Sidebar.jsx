import React from "react";
import { Calendar, Home, Inbox, BookCheck, BookUser } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";

function Dashboard_Sidebar({ setActiveTab, activeTab }) {
  const items = [
    {
      title: "Home",
      icon: Home,
    },
    {
      title: "Books",
      icon: Inbox,
    },
    {
      title: "Users",
      icon: Calendar,
    },

    {
      title: "Reservations",
      icon: BookCheck,
    },

    {
      title: "Borrowed Books",
      icon: BookUser,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className="flex gap-2">
              <SidebarGroupLabel className="font-poppins text-1xl">
                Navigate
              </SidebarGroupLabel>
              <ModeToggle />
            </div>
            <SidebarGroupContent className="mt-10">
              <SidebarMenu className="space-y-2">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title} className="font-poppins">
                    <SidebarMenuButton
                      asChild
                      onClick={() => setActiveTab(item.title)}
                    >
                      <button
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                          activeTab === item.title
                            ? "bg-blue-500 text-white"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

export default Dashboard_Sidebar;
