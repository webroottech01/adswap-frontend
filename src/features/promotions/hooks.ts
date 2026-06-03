'use client';

import { useCallback, useEffect, useState } from 'react';
import { promotionsApi, extractMessage } from './api';
import type {
  CreatePromotionPayload,
  Promotion,
  PromotionStatus,
  PromotionStatusFilter,
  UpdatePromotionPayload,
} from './types';

export function usePromotions(statusFilter: PromotionStatusFilter = 'all') {
  const [data, setData] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const status = statusFilter === 'all' ? undefined : statusFilter;
      const list = await promotionsApi.list(status);
      setData(list);
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function usePromotionMutations(options?: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const wrap = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      options?.onSuccess?.();
      return result;
    } catch (err) {
      setError(extractMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const create = (payload: CreatePromotionPayload, files: File[]) =>
    wrap(async () => {
      const promotion = await promotionsApi.create(payload);
      if (files.length > 0) {
        await promotionsApi.uploadMedia(promotion.id, files);
        return promotionsApi.get(promotion.id);
      }
      return promotion;
    });

  const update = (id: number, payload: UpdatePromotionPayload, newFiles: File[]) =>
    wrap(async () => {
      await promotionsApi.update(id, payload);
      if (newFiles.length > 0) {
        await promotionsApi.uploadMedia(id, newFiles);
      }
      return promotionsApi.get(id);
    });

  const publish = (id: number) => wrap(() => promotionsApi.publish(id));
  const pause = (id: number) => wrap(() => promotionsApi.pause(id));
  const remove = (id: number) => wrap(async () => {
    await promotionsApi.delete(id);
    return true;
  });

  const deleteMedia = (promotionId: number, mediaId: number) =>
    wrap(async () => {
      await promotionsApi.deleteMedia(promotionId, mediaId);
      return true;
    });

  return {
    loading,
    error,
    clearError,
    create,
    update,
    publish,
    pause,
    remove,
    deleteMedia,
  };
}
