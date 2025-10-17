import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  Plus, 
  Trash2, 
  Clock, 
  Calendar,
  BookOpen,
  Settings
} from 'lucide-react';
import type { 
  ClasseFormData, 
  ScheduleFormData, 
  ClasseSettingsFormData,
  CreateClasseDto,
  UpdateClasseDto,
  Classe
} from '../../types/classe';

// Schéma de validation Zod
const scheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format HH:MM requis'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format HH:MM requis'),
  duration: z.number().min(15, 'Durée minimum de 15 minutes'),
});

const classeFormSchema = z.object({
  className: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  courseId: z.string().min(1, 'Veuillez sélectionner un cours'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  schedule: z.array(scheduleSchema).optional(),
  settings: z.object({
    maxStudents: z.number().min(1, 'Minimum 1 étudiant').max(100, 'Maximum 100 étudiants'),
    isPublic: z.boolean(),
    requiresApproval: z.boolean(),
  }),
});

type ClasseFormValues = z.infer<typeof classeFormSchema>;

interface ClasseFormProps {
  initialData?: Classe;
  courses: Array<{ id: string; title: string; description?: string }>;
  onSubmit: (data: CreateClasseDto | UpdateClasseDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

const daysOfWeek = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
];

export function ClasseForm({ 
  initialData, 
  courses, 
  onSubmit, 
  onCancel, 
  loading = false,
  mode 
}: ClasseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<ClasseFormValues>({
    resolver: zodResolver(classeFormSchema),
    defaultValues: {
      className: initialData?.className || '',
      description: initialData?.description || '',
      courseId: initialData?.courseId || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
      schedule: initialData?.schedule || [],
      settings: {
        maxStudents: initialData?.settings?.maxStudents || 30,
        isPublic: initialData?.settings?.isPublic || false,
        requiresApproval: initialData?.settings?.requiresApproval || true,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedule',
  });

  const watchedSchedule = watch('schedule');

  // Calculer la durée automatiquement
  const calculateDuration = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    return Math.max(0, endMinutes - startMinutes);
  };

  // Mettre à jour la durée quand les heures changent
  const updateDuration = (index: number, startTime: string, endTime: string) => {
    const duration = calculateDuration(startTime, endTime);
    setValue(`schedule.${index}.duration`, duration);
  };

  const handleFormSubmit = async (data: ClasseFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Convertir les données pour l'API
      const apiData = {
        className: data.className,
        description: data.description || undefined,
        courseId: data.courseId,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        schedule: data.schedule?.length ? data.schedule : undefined,
        settings: {
          maxStudents: data.settings.maxStudents,
          isPublic: data.settings.isPublic,
          requiresApproval: data.settings.requiresApproval,
        },
      };

      await onSubmit(apiData);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addScheduleSlot = () => {
    append({
      dayOfWeek: 1, // Lundi par défaut
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Informations générales
          </CardTitle>
          <CardDescription>
            Définissez les informations de base de votre classe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="className">Nom de la classe *</Label>
            <Input
              id="className"
              {...register('className')}
              placeholder="Ex: Mathématiques Avancées - Groupe A"
            />
            {errors.className && (
              <p className="text-sm text-destructive">{errors.className.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Décrivez le contenu et les objectifs de cette classe..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseId">Cours associé *</Label>
            <Select
              value={watch('courseId')}
              onValueChange={(value) => setValue('courseId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un cours" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.courseId && (
              <p className="text-sm text-destructive">{errors.courseId.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Période de la classe
          </CardTitle>
          <CardDescription>
            Définissez les dates de début et de fin (optionnel)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horaire de la classe
          </CardTitle>
          <CardDescription>
            Définissez les créneaux horaires de votre classe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Créneau {index + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Jour de la semaine</Label>
                  <Select
                    value={watch(`schedule.${index}.dayOfWeek`).toString()}
                    onValueChange={(value) => setValue(`schedule.${index}.dayOfWeek`, parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Heure de début</Label>
                  <Input
                    type="time"
                    {...register(`schedule.${index}.startTime`)}
                    onChange={(e) => {
                      register(`schedule.${index}.startTime`).onChange(e);
                      updateDuration(index, e.target.value, watch(`schedule.${index}.endTime`));
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Heure de fin</Label>
                  <Input
                    type="time"
                    {...register(`schedule.${index}.endTime`)}
                    onChange={(e) => {
                      register(`schedule.${index}.endTime`).onChange(e);
                      updateDuration(index, watch(`schedule.${index}.startTime`), e.target.value);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Durée (minutes)</Label>
                  <Input
                    type="number"
                    {...register(`schedule.${index}.duration`, { valueAsNumber: true })}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              {errors.schedule?.[index] && (
                <p className="text-sm text-destructive">
                  {Object.values(errors.schedule[index] || {}).map(error => error?.message).join(', ')}
                </p>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addScheduleSlot}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un créneau horaire
          </Button>
        </CardContent>
      </Card>

      {/* Paramètres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres de la classe
          </CardTitle>
          <CardDescription>
            Configurez les options de votre classe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxStudents">Nombre maximum d'étudiants</Label>
            <Input
              id="maxStudents"
              type="number"
              min="1"
              max="100"
              {...register('settings.maxStudents', { valueAsNumber: true })}
            />
            {errors.settings?.maxStudents && (
              <p className="text-sm text-destructive">{errors.settings.maxStudents.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="isPublic">Classe publique</Label>
              <p className="text-sm text-muted-foreground">
                Les étudiants peuvent voir et rejoindre cette classe
              </p>
            </div>
            <Switch
              id="isPublic"
              checked={watch('settings.isPublic')}
              onCheckedChange={(checked) => setValue('settings.isPublic', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="requiresApproval">Approbation requise</Label>
              <p className="text-sm text-muted-foreground">
                Les inscriptions doivent être approuvées par l'enseignant
              </p>
            </div>
            <Switch
              id="requiresApproval"
              checked={watch('settings.requiresApproval')}
              onCheckedChange={(checked) => setValue('settings.requiresApproval', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={!isValid || isSubmitting || loading}
          className="min-w-[120px]"
        >
          {isSubmitting ? 'Enregistrement...' : mode === 'create' ? 'Créer' : 'Modifier'}
        </Button>
      </div>
    </form>
  );
}
