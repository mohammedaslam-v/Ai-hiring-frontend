import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDemoTrainers, DemoTrainer } from '@/hooks/demo/useDemoTrainers';
import { Plus, Pencil, Trash2, X, Check, Loader2, GraduationCap } from 'lucide-react';
import { toast } from 'react-toastify';

interface DemoTrainerManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DemoTrainerManagementModal: React.FC<DemoTrainerManagementModalProps> = ({
    isOpen,
    onClose
}) => {
    const {
        trainers,
        loading,
        addTrainer,
        updateTrainer,
        deleteTrainer
    } = useDemoTrainers();

    const [newTrainerName, setNewTrainerName] = useState('');
    const [editingTrainer, setEditingTrainer] = useState<DemoTrainer | null>(null);
    const [editName, setEditName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAdd = async () => {
        if (!newTrainerName.trim()) {
            toast.error("Please enter a name");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await addTrainer(newTrainerName.trim());
            if (res.status) {
                toast.success("Demo trainer added successfully");
                setNewTrainerName('');
            } else {
                toast.error(res.message || "Failed to add demo trainer");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingTrainer || !editName.trim()) return;

        try {
            setIsSubmitting(true);
            const res = await updateTrainer(editingTrainer.id, editName.trim());
            if (res.status) {
                toast.success("Demo trainer updated successfully");
                setEditingTrainer(null);
                setEditName('');
            } else {
                toast.error(res.message || "Failed to update demo trainer");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this demo trainer?")) return;

        try {
            setIsSubmitting(true);
            const res = await deleteTrainer(id);
            if (res.status) {
                toast.success("Demo trainer deleted successfully");
            } else {
                toast.error(res.message || "Failed to delete demo trainer");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEditing = (trainer: DemoTrainer) => {
        setEditingTrainer(trainer);
        setEditName(trainer.name);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white shadow-2xl border-0 rounded-xl">
                <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-white">Manage Demo Trainers</DialogTitle>
                            <DialogDescription className="text-purple-100 text-sm mt-1">
                                Add, edit, or remove demo trainer names from the database.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Add New Section */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 block">
                            Add New Demo Trainer
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Enter full name"
                                value={newTrainerName}
                                onChange={(e) => setNewTrainerName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                className="bg-white border-slate-300 focus:ring-purple-500 rounded-lg"
                            />
                            <Button
                                onClick={handleAdd}
                                disabled={isSubmitting || !newTrainerName.trim()}
                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 shadow-sm transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Add
                            </Button>
                        </div>
                    </div>

                    {/* List Section */}
                    <div>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Active Demo Trainers ({trainers.length})
                            </Label>
                            {loading && <Loader2 className="h-3 w-3 animate-spin text-slate-400" />}
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {trainers.length === 0 && !loading ? (
                                <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-300">
                                    No demo trainers found
                                </div>
                            ) : (
                                trainers.map((trainer) => (
                                    <div
                                        key={trainer.id}
                                        className="group flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200"
                                    >
                                        {editingTrainer?.id === trainer.id ? (
                                            <div className="flex items-center gap-2 w-full">
                                                <Input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                                                    autoFocus
                                                    className="h-9 py-1 text-sm border-purple-400 focus:ring-purple-500"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={handleUpdate}
                                                    disabled={isSubmitting || !editName.trim()}
                                                    className="h-9 w-9 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setEditingTrainer(null)}
                                                    className="h-9 w-9 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-sm font-medium text-slate-700 group-hover:text-purple-700 transition-colors">
                                                    {trainer.name}
                                                </span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => startEditing(trainer)}
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(trainer.id)}
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-lg px-6 font-medium border-slate-300 text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
