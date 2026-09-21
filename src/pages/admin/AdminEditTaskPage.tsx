import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminTaskService } from '../../services/services';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Toast } from '../../components/ui/index';
import { extractThumbnailUrl } from '../../utils/thumbnail';
import React from 'react';

const linkSchema = z.object({
  id: z.string().optional(),
  platform: z.enum(['instagram', 'youtube', 'facebook', 'x', 'custom']),
  url: z.string().url('Must be a valid HTTPS URL').refine(v => v.startsWith('https://'), 'Must use HTTPS'),
  label: z.string().min(1, 'Label required'),
  description: z.string().optional(),
  sortOrder: z.number().optional(),
  actions: z.array(z.object({ actionType: z.string().min(1), isRequired: z.boolean().optional() })).optional(),
});

const schema = z.object({
  title: z.string().min(3, 'Title too short'),
  description: z.string().min(10, 'Description too short'),
  instructions: z.string().min(10, 'Instructions too short'),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED', 'PAUSED', 'EXPIRED', 'ARCHIVED']),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  links: z.array(linkSchema).optional(),
});

type FormData = z.infer<typeof schema>;

const ACTION_TYPES = ['like', 'follow', 'subscribe', 'share', 'post', 'repost', 'comment', 'watch', 'visit', 'report', 'custom'];

const AdminEditTaskPage = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, control, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'DRAFT',
      links: [],
    },
  });

  const firstLinkUrl = watch('links.0.url');
  const thumbnailUrl = watch('thumbnailUrl');

  React.useEffect(() => {
    if (firstLinkUrl && !thumbnailUrl && !loading) {
      const extracted = extractThumbnailUrl(firstLinkUrl);
      if (extracted) {
        setValue('thumbnailUrl', extracted, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [firstLinkUrl, thumbnailUrl, loading, setValue]);

  const { fields: links, append, remove } = useFieldArray({ control, name: 'links' });

  const loadTask = useCallback(async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const res = await adminTaskService.getTask(taskId);
      const task = res.data;
      reset({
        title: task.title,
        description: task.description,
        instructions: task.instructions,
        thumbnailUrl: task.thumbnailUrl || '',
        status: task.status,
        startAt: task.startAt ? new Date(task.startAt).toISOString().slice(0, 16) : undefined,
        endAt: task.endAt ? new Date(task.endAt).toISOString().slice(0, 16) : undefined,
        links: task.links?.map((l: any) => ({
          id: l.id,
          platform: l.platform,
          url: l.url,
          label: l.label,
          description: l.description,
          sortOrder: l.sortOrder,
          actions: l.actions,
        })) || [],
      });
    } catch {
      setToast({ message: 'Failed to load task', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [taskId, reset]);

  useEffect(() => {
    loadTask();
  }, [loadTask]);

  const onSubmit = async (data: FormData) => {
    if (!taskId) return;
    try {
      const payload = {
        ...data,
        startAt: data.startAt ? new Date(data.startAt).toISOString() : undefined,
        endAt: data.endAt ? new Date(data.endAt).toISOString() : undefined,
      };
      await adminTaskService.updateTask(taskId, payload);
      setToast({ message: 'Task updated successfully!', type: 'success' });
      setTimeout(() => navigate(`/admin/tasks`), 1500);
    } catch (err: any) {
      setToast({ message: err?.response?.data?.message || 'Failed to update task', type: 'error' });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center p-12">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-gray-900">Edit Task</h1>
          <p className="text-gray-500 mt-1">Update existing social media task</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader><h2 className="font-bold text-gray-900">📝 Basic Information</h2></CardHeader>
            <CardBody className="space-y-5">
              <Input label="Task Title" id="task-title" placeholder="Instagram Engagement Campaign" {...register('title')} error={errors.title?.message} />
              <Textarea label="Description" id="task-desc" placeholder="Short description of the task..." {...register('description')} error={errors.description?.message} />
              <Textarea label="Instructions" id="task-instr" placeholder="Step by step instructions for users..." {...register('instructions')} className="min-h-[140px]" error={errors.instructions?.message} />
              <Input label="Thumbnail URL (optional)" id="task-thumb" placeholder="https://example.com/image.jpg" {...register('thumbnailUrl')} error={errors.thumbnailUrl?.message} />
            </CardBody>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader><h2 className="font-bold text-gray-900">📅 Schedule & Status</h2></CardHeader>
            <CardBody className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Select label="Status" id="task-status" {...register('status')} error={errors.status?.message}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="PAUSED">Paused</option>
                <option value="EXPIRED">Expired</option>
                <option value="ARCHIVED">Archived</option>
              </Select>
              <Input label="Start Date" id="task-start" type="datetime-local" {...register('startAt')} />
              <Input label="End Date" id="task-end" type="datetime-local" {...register('endAt')} />
            </CardBody>
          </Card>

          {/* Social Media Links */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900">🔗 Social Media Links</h2>
                <button
                  type="button"
                  id="add-link-btn"
                  onClick={() => append({ platform: 'instagram', url: '', label: '', sortOrder: 0, actions: [{ actionType: 'like', isRequired: true }] })}
                  className="text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                >
                  + Add Link
                </button>
              </div>
            </CardHeader>
            <CardBody className="space-y-6">
              {links.map((field, idx) => (
                <div key={field.id} className="relative border border-gray-100 rounded-2xl p-5 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700 text-sm">Social Link #{idx + 1}</h3>
                    <button type="button" onClick={() => remove(idx)} className="text-xs text-red-500 hover:text-red-700 font-semibold">
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select label="Platform" id={`link-platform-${idx}`} {...register(`links.${idx}.platform`)}>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="facebook">Facebook</option>
                      <option value="x">X (Twitter)</option>
                      <option value="custom">Custom</option>
                    </Select>
                    <Select label="Required Action" id={`link-action-${idx}`} {...register(`links.${idx}.actions.0.actionType`)}>
                      {ACTION_TYPES.map(a => <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                    </Select>
                    <div className="sm:col-span-2">
                      <Input label="URL" id={`link-url-${idx}`} placeholder="https://instagram.com/p/..." {...register(`links.${idx}.url`)} error={errors.links?.[idx]?.url?.message} />
                    </div>
                    <div className="sm:col-span-2">
                      <Input label="Label" id={`link-label-${idx}`} placeholder="Like our latest post" {...register(`links.${idx}.label`)} error={errors.links?.[idx]?.label?.message} />
                    </div>
                    <div className="sm:col-span-2">
                      <Input label="Description (optional)" id={`link-desc-${idx}`} placeholder="Additional instructions..." {...register(`links.${idx}.description`)} />
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          <div className="flex gap-4 pb-8">
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/tasks')} className="flex-1 sm:flex-none sm:w-32">
              Cancel
            </Button>
            <Button id="submit-edit-task" type="submit" loading={isSubmitting} className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminEditTaskPage;
