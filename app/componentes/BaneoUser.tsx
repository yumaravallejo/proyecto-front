"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  userId: z.string().min(1, "La ID del usuario es requerida"),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSubmit: (values: FormValues) => Promise<void>;
}

export default function BaneoUser({ onSubmit }: Props) {
  const [cargando, setCargando] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
    },
  });

  async function handleBanUser(values: FormValues) {
    setCargando(true);
    try {
      await onSubmit(values);
      form.reset();
    } catch (error) {
      toast.error("Error al banear el usuario", {
        description: "Intenta de nuevo más tarde " + error,
      });
    } finally {
      setCargando(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <div className="shadow-lg text-lg rounded-lg p-6 flex flex-col items-center space-y-4 hover:shadow-2xl transition-all bg-red-500 text-white font-bold hover:bg-red-700 cursor-pointer">
          BANEAR USUARIO
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl bg-white shadow-lg p-8 animate-fadeIn">
        {cargando && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold text-gray-800 mb-6">
            Banear Usuario
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleBanUser)}>
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium text-lg">
                    ID del Usuario
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Introduce el ID del usuario"
                      {...field}
                      className={`w-full rounded-md border px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 ${
                        form.formState.errors.userId
                          ? "border-2 border-red-500 focus:ring-red-300"
                          : "border border-gray-300 focus:ring-yellow-300"
                      }`}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <DialogFooter className="flex justify-end gap-4 mt-6">
              <button
                type="submit"
                className="bg-red-600 text-white rounded-full px-6 py-3 font-semibold hover:bg-red-700 transition cursor-pointer"
              >
                Banear Usuario
              </button>
              <DialogClose className="bg-gray-400 text-white rounded-full px-6 py-3 font-semibold hover:bg-gray-500 transition cursor-pointer">
                Cerrar
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
