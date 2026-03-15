"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useReducer } from "react";

type Tabs = "organize" | "get-hired" | "manage-boards";
type Action = { type: "SET_ACTIVE_TAB"; payload: Tabs };

export default function ImageTabs() {
  const [activeTab, activeTabDispatch] = useReducer(reducer, "organize");

  function reducer(state: Tabs, action: Action): Tabs {
    switch (action.type) {
      case "SET_ACTIVE_TAB":
        return action.payload;
      default:
        return state;
    }
  }

  return (
    <section className="border-t bg-white py-16">
      <div className="container mx-auto px-4 flex flex-col items-center gap-10 max-w-6xl">
        <div className="flex gap-2 mb-8 flex-1 justify-center flex-col sm:flex-row">
          <Button
            onClick={() => {
              activeTabDispatch({
                type: "SET_ACTIVE_TAB",
                payload: "organize",
              });
            }}
            variant={"outline"}
            size={"lg"}
            className={`h-12 px-8 text-lg font-medium ${activeTab === "organize" ? "bg-black text-white" : ""}`}
          >
            Organize Applications
          </Button>
          <Button
            onClick={() => {
              activeTabDispatch({
                type: "SET_ACTIVE_TAB",
                payload: "get-hired",
              });
            }}
            variant={"outline"}
            size={"lg"}
            className={`h-12 px-8 text-lg font-medium ${activeTab === "get-hired" ? "bg-black text-white" : ""}`}
          >
            Get Hired
          </Button>
          <Button
            onClick={() => {
              activeTabDispatch({
                type: "SET_ACTIVE_TAB",
                payload: "manage-boards",
              });
            }}
            variant={"outline"}
            size={"lg"}
            className={`h-12 px-8 text-lg font-medium ${activeTab === "manage-boards" ? "bg-black text-white" : ""}`}
          >
            Manage Boards
          </Button>
        </div>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg border border-gray-200 shadow-2xl flex">
          {activeTab === "organize" && (
            <picture>
              <source srcSet="/demo-images/hero1.webp" type="image/webp" />
              <Image
                src="/demo-images/hero1.jpg"
                alt="Organize Applications"
                width={1200}
                height={800}
              />
            </picture>
          )}
          {activeTab === "get-hired" && (
            <picture>
              <source srcSet="/demo-images/hero2.webp" type="image/webp" />
              <Image
                src="/demo-images/hero2.jpg"
                alt="Get Hired"
                width={1200}
                height={800}
              />
            </picture>
          )}
          {activeTab === "manage-boards" && (
            <picture>
              <source srcSet="/demo-images/hero3.webp" type="image/webp" />
              <Image
                src="/demo-images/hero3.jpg"
                alt="Manage Boards"
                width={1200}
                height={800}
              />
            </picture>
          )}
        </div>
      </div>
    </section>
  );
}
