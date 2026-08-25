import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dumbbell, X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { WorkoutPlanDto, WorkoutPlanFormInput, WorkoutGoal, WorkoutDay, Exercise } from '../../types/workoutPlan';

interface WorkoutPlanFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: WorkoutPlanFormInput) => Promise<void>;
  initialPlan?: WorkoutPlanDto | null;
}

const GOALS: WorkoutGoal[] = ['Muscle Gain', 'Fat Loss', 'Strength', 'Endurance', 'General Fitness'];

const emptyExercise = (): Exercise => ({ name: '', sets: 3, reps: '10-12', notes: '' });
const emptyDay = (): WorkoutDay => ({ dayName: '', exercises: [emptyExercise()] });

const emptyForm: WorkoutPlanFormInput = {
  name: '',
  goal: 'Muscle Gain',
  description: '',
  days: [emptyDay()],
  isActive: true,
};

export const WorkoutPlanFormDialog: React.FC<WorkoutPlanFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlan,
}) => {
  const [form, setForm] = useState<WorkoutPlanFormInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      setForm({
        name: initialPlan.name,
        goal: initialPlan.goal,
        description: initialPlan.description,
        days: initialPlan.days.length > 0 ? initialPlan.days : [emptyDay()],
        isActive: initialPlan.isActive,
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [initialPlan, isOpen]);

  const updateDay = (dayIndex: number, updater: (day: WorkoutDay) => WorkoutDay) => {
    setForm((f) => ({ ...f, days: f.days.map((d, i) => (i === dayIndex ? updater(d) : d)) }));
  };

  const addDay = () => setForm((f) => ({ ...f, days: [...f.days, emptyDay()] }));
  const removeDay = (dayIndex: number) =>
    setForm((f) => ({ ...f, days: f.days.filter((_, i) => i !== dayIndex) }));

  const addExercise = (dayIndex: number) =>
    updateDay(dayIndex, (d) => ({ ...d, exercises: [...d.exercises, emptyExercise()] }));
  const removeExercise = (dayIndex: number, exerciseIndex: number) =>
    updateDay(dayIndex, (d) => ({ ...d, exercises: d.exercises.filter((_, i) => i !== exerciseIndex) }));
  const updateExercise = (dayIndex: number, exerciseIndex: number, patch: Partial<Exercise>) =>
    updateDay(dayIndex, (d) => ({
      ...d,
      exercises: d.exercises.map((ex, i) => (i === exerciseIndex ? { ...ex, ...patch } : ex)),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const cleanedDays = form.days
        .filter((d) => d.dayName.trim())
        .map((d) => ({ ...d, exercises: d.exercises.filter((ex) => ex.name.trim()) }));
      await onSave({ ...form, days: cleanedDays });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workout plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                <Dumbbell className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {initialPlan ? 'Edit Workout Routine' : 'Build Workout Routine'}
                </h3>
                <p className="text-xs text-muted-foreground">Add training days and exercises for this routine.</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Routine Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Hypertrophy 4-Day Split"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Goal</label>
                  <select
                    value={form.goal}
                    onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value as WorkoutGoal }))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                  >
                    {GOALS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What is this routine for?"
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 leading-relaxed"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Training Days</label>
                  <button
                    type="button"
                    onClick={addDay}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[10px] font-bold text-foreground hover:bg-accent"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Day
                  </button>
                </div>

                {form.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="rounded-xl border border-border/80 bg-background/60 p-3 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={day.dayName}
                        onChange={(e) => updateDay(dayIndex, (d) => ({ ...d, dayName: e.target.value }))}
                        placeholder="Day 1 - Chest & Triceps"
                        className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => removeDay(dayIndex)}
                        className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                        title="Remove day"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="grid grid-cols-12 gap-1.5 items-center">
                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(e) =>
                              updateExercise(dayIndex, exerciseIndex, { name: e.target.value })
                            }
                            placeholder="Exercise name"
                            className="col-span-5 rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden"
                          />
                          <input
                            type="number"
                            min={1}
                            value={exercise.sets}
                            onChange={(e) =>
                              updateExercise(dayIndex, exerciseIndex, { sets: Number(e.target.value) })
                            }
                            onFocus={(e) => e.target.select()}
                            placeholder="Sets"
                            className="col-span-2 rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] text-foreground focus:border-primary focus:outline-hidden"
                          />
                          <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) =>
                              updateExercise(dayIndex, exerciseIndex, { reps: e.target.value })
                            }
                            placeholder="Reps"
                            className="col-span-2 rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden"
                          />
                          <input
                            type="text"
                            value={exercise.notes}
                            onChange={(e) =>
                              updateExercise(dayIndex, exerciseIndex, { notes: e.target.value })
                            }
                            placeholder="Notes"
                            className="col-span-2 rounded-lg border border-border bg-card px-2 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={() => removeExercise(dayIndex, exerciseIndex)}
                            className="col-span-1 p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-rose-500"
                            title="Remove exercise"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => addExercise(dayIndex)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                    >
                      <Plus className="h-3 w-3" /> Add Exercise
                    </button>
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                />
                Active — available to assign to members
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving...' : initialPlan ? 'Save Changes' : 'Create Routine'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
