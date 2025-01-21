"use client";

import React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignIn } from "./widgets/sign-in";
import { SignUp } from "./widgets/sign-up";
import { useModal } from "@/hooks/useModal";
export const AuthComponent = () => {
  const { isOpen, closeModal } = useModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogTitle></DialogTitle>
        <Tabs defaultValue="sign-in">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Войти</TabsTrigger>
            <TabsTrigger value="sign-up">Зарегистрироваться</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <Card>
              <SignIn />
            </Card>
          </TabsContent>
          <TabsContent value="sign-up">
            <Card>
              <SignUp />
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
