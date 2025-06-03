import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ResetWeekDialogProps = {
  open: boolean;
  dayIdx: number | null;
  daysOfWeek: string[];
  onCancel: () => void;
  onConfirm: (dayIdx: number) => Promise<void>;
};

export default function ResetWeekDialog({
  open,
  dayIdx,
  daysOfWeek,
  onCancel,
  onConfirm,
}: ResetWeekDialogProps) {
  if (dayIdx === null) return null;

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md text-center space-y-4 bg-white rounded-2xl shadow-xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            ¿Resetear el día?
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">
          Esto eliminará todas las clases del día <br />
          <span className="font-bold text-gray-800">
            {daysOfWeek[dayIdx]}
          </span>
          . ¿Estás seguro?
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={onCancel}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              await onConfirm(dayIdx);
              onCancel(); // Cerrar después de confirmar
            }}
            className="cursor-pointer px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
          >
            Sí, borrar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
