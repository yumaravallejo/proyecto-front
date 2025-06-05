"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  id: number | null;
  onCancel: () => void;
  onConfirm: (id: number) => void;
}

export default function DeleteDialog({
  open,
  id,
  onCancel,
  onConfirm,
}: Props) {
  if (id === null) return null;

  const handleConfirm = async () => {
    await onConfirm(id);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="max-w-md text-center space-y-4 bg-white rounded-2xl shadow-xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
            ¿Estás seguro de que quieres eliminarlo?
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-full bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-700 transition cursor-pointer"
          >
            Sí, borrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
