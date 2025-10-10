"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const avatarOptions = [
  { name: "bear", path: "/avatars/bear.png" },
  { name: "cat_1", path: "/avatars/cat_1.png" },
  { name: "cat_2", path: "/avatars/cat_2.png" },
  { name: "donkey", path: "/avatars/donkey.png" },
  { name: "elephant", path: "/avatars/elephant.png" },
  { name: "fox", path: "/avatars/fox.png" },
  { name: "monkey", path: "/avatars/monkey.png" },
  { name: "moose", path: "/avatars/moose.png" },
  { name: "panda", path: "/avatars/panda.png" },
  { name: "piggy", path: "/avatars/piggy.png" },
  { name: "puppy_1", path: "/avatars/puppy_1.png" },
  { name: "puppy_2", path: "/avatars/puppy_2.png" },
  { name: "rabbit", path: "/avatars/rabbit.png" },
  { name: "racoon", path: "/avatars/racoon.png" },
  { name: "tiger", path: "/avatars/tiger.png" },
  { name: "zebra", path: "/avatars/zebra.png" },
];

export default function AvatarSelector({
  currentAvatar,
  onAvatarChange,
  children,
}) {
  const [selectedAvatar, setSelectedAvatar] = useState(
    currentAvatar || "/avatars/monkey.png"
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleAvatarSelect = (avatarPath) => {
    setSelectedAvatar(avatarPath);
  };

  const handleConfirm = () => {
    onAvatarChange(selectedAvatar);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>选择头像</DialogTitle>
          <DialogDescription>点击下方头像选择您喜欢的形象</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          {avatarOptions.map((avatar) => (
            <div
              key={avatar.name}
              className={`cursor-pointer rounded-lg p-2 border-2 transition-all ${
                selectedAvatar === avatar.path
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:border-muted-foreground/20"
              }`}
              onClick={() => handleAvatarSelect(avatar.path)}
            >
              <img
                src={avatar.path}
                alt={avatar.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleConfirm}>确认选择</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
