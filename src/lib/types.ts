import type { ComponentType } from "react";

export type Category = "Buttons" | "Text" | "Loaders" | "Interactive";

export interface AnimationEntry {
  id: string;
  name: string;
  category: Category;
  Component: ComponentType;
}
