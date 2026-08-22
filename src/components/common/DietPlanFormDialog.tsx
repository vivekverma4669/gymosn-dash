import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, X, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { DietPlanDto, DietPlanFormInput, DietGoal } from '../../types/dietPlan';

interface DietPlanFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: DietPlanFormInput) => Promise<void>;
  initialPlan?: DietPlanDto | null;
}

const GOALS: DietGoal[] = ['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Maintenance'];

interface MealDraft {
  mealName: string;
  itemsText: string;
}

interface FormState {
  name: string;
  goal: DietGoal;
  dailyCalories: string;
  description: string;
  meals: MealDraft[];
  isActive: boolean;
}

const emptyMeal = (): MealDraft => ({ mealName: '', itemsText: '' });

const emptyForm: FormState = {
  name: '',
  goal: 'Weight Loss',
  dailyCalories: '',
  description: '',
  meals: [emptyMeal()],
  isActive: true,
};

export const DietPlanFormDialog: React.FC<DietPlanFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlan,
}) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      setForm({
        name: initialPlan.name,
        goal: initialPlan.goal,
        dailyCalories: initialPlan.dailyCalories !== null ? String(initialPlan.dailyCalories) : '',
        description: initialPlan.description,
        meals:
          initialPlan.meals.length > 0
            ? initialPlan.meals.map((m) => ({ mealName: m.mealName, itemsText: m.items.join('\n') }))
            : [emptyMeal()],
        isActive: initialPlan.isActive,
      });
    } else {
      setForm(emptyForm);
    }
    setError(null);
  }, [initialPlan, isOpen]);

  const updateMeal = (index: number, patch: Partial<MealDraft>) =>
    setForm((f) => ({ ...f, meals: f.meals.map((m, i) => (i === index ? { ...m, ...patch } : m)) }));
  const addMeal = () => setForm((f) => ({ ...f, meals: [...f.meals, emptyMeal()] }));
  const removeMeal = (index: number) =>
    setForm((f) => ({ ...f, meals: f.meals.filter((_, i) => i !== index) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const meals = form.meals
        .filter((m) => m.mealName.trim())
        .map((m) => ({
          mealName: m.mealName.trim(),
          items: m.itemsText
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean),
        }));

      await onSave({
        name: form.name,
        goal: form.goal,
        dailyCalories: form.dailyCalories ? Number(form.dailyCalories) : undefined,
        description: form.description,
        meals,
        isActive: form.isActive,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save diet plan');
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
                <Utensils className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {initialPlan ? 'Edit Diet Plan' : 'Create Diet Plan'}
                </h3>
                <p className="text-xs text-muted-foreground">Add meals — one food item per line.</p>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-500">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Plan Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Lean Bulk 2800kcal"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Daily Calories</label>
                  <input
                    type="number"
                    min={0}
                    value={form.dailyCalories}
                    onChange={(e) => setForm((f) => ({ ...f, dailyCalories: e.target.value }))}
                    placeholder="2800"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Goal</label>
                <select
                  value={form.goal}
                  onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value as DietGoal }))}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-hidden"
                >
                  {GOALS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What is this diet plan for?"
                  className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 leading-relaxed"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-foreground">Meals</label>
                  <button
                    type="button"
                    onClick={addMeal}
                    className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1.5 text-[10px] font-bold text-foreground hover:bg-accent"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Meal
                  </button>
                </div>

                {form.meals.map((meal, index) => (
                  <div key={index} className="rounded-xl border border-border/80 bg-background/60 p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={meal.mealName}
                        onChange={(e) => updateMeal(index, { mealName: e.target.value })}
                        placeholder="Breakfast"
                        className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => removeMeal(index)}
                        className="p-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                        title="Remove meal"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={meal.itemsText}
                      onChange={(e) => updateMeal(index, { itemsText: e.target.value })}
                      placeholder={'One food item per line, e.g.\n4 egg whites + 2 whole eggs\nOats with banana'}
                      className="w-full rounded-lg border border-border bg-card p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden leading-relaxed"
                    />
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
                  {isSubmitting ? 'Saving...' : initialPlan ? 'Save Changes' : 'Create Diet Plan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
