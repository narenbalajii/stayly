'use client';

import { updatePropertyStatus, deleteProperty } from '@/lib/property-actions';
import { useState } from 'react';
import { Trash2, EyeOff, Eye } from 'lucide-react';

interface HostPropertyActionsProps {
  propertyId: string;
  currentStatus: string;
}

export function HostPropertyActions({ propertyId, currentStatus }: HostPropertyActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  async function handleToggleStatus() {
    setLoading('status');
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await updatePropertyStatus(propertyId, newStatus);
    } catch (e: any) {
      alert(e.message || 'Failed to update status');
    } finally {
      setLoading(null);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    setLoading('delete');
    try {
      await deleteProperty(propertyId);
    } catch (e: any) {
      alert(e.message || 'Failed to delete property');
      setLoading(null);
      setDeleteConfirm(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggleStatus}
        disabled={loading !== null}
        title={currentStatus === 'ACTIVE' ? 'Deactivate listing' : 'Activate listing'}
        className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition disabled:opacity-50"
      >
        {loading === 'status' ? (
          <span className="text-xs">...</span>
        ) : currentStatus === 'ACTIVE' ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>

      {deleteConfirm ? (
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            disabled={loading !== null}
            className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600 transition disabled:opacity-70"
          >
            {loading === 'delete' ? '...' : 'Confirm'}
          </button>
          <button
            onClick={() => setDeleteConfirm(false)}
            className="text-xs font-bold text-stone-500 px-2 py-1 rounded hover:bg-stone-100 transition"
          >
            No
          </button>
        </div>
      ) : (
        <button
          onClick={handleDelete}
          disabled={loading !== null}
          title="Delete listing"
          className="p-2 rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
