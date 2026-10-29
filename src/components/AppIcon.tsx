import { School, Boxes, Bug, UsersRound } from "lucide-react";
import type { Application } from "../types";
const icons = { school: School, boxes: Boxes, bug: Bug, users: UsersRound };
export function AppIcon({ name }: { name: Application["icon"] }) {
  const Icon = icons[name];
  return <Icon size={25} strokeWidth={1.7} aria-hidden="true" />;
}
