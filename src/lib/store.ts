import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTypePekerjaan, TypePekerjaan } from './api/type-pekerjaan';
import { getJenisUnit, JenisUnit } from './api/jenis-unit';
import { getCuaca, Cuaca } from './api/cuaca';
import { getKondisi, Kondisi } from './api/kondisi';
import { getTemplates, TemplateWithRelations } from './api/templates';

interface MasterDataStore<T> {
  data: T[];
  lastSynced: number | null;
  isSyncing: boolean;
  sync: () => Promise<void>;
  setData: (data: T[]) => void;
}

export const useTypePekerjaanStore = create<MasterDataStore<TypePekerjaan>>()(
  persist(
    (set) => ({
      data: [],
      lastSynced: null,
      isSyncing: false,
      setData: (data) => set({ data }),
      sync: async () => {
        set({ isSyncing: true });
        try {
          const freshData = await getTypePekerjaan();
          set({ data: freshData || [], lastSynced: Date.now(), isSyncing: false });
        } catch (error) {
          console.error("Failed to sync TypePekerjaan:", error);
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'type-pekerjaan-storage',
    }
  )
);

export const useJenisUnitStore = create<MasterDataStore<JenisUnit>>()(
  persist(
    (set) => ({
      data: [],
      lastSynced: null,
      isSyncing: false,
      setData: (data) => set({ data }),
      sync: async () => {
        set({ isSyncing: true });
        try {
          const freshData = await getJenisUnit();
          set({ data: freshData || [], lastSynced: Date.now(), isSyncing: false });
        } catch (error) {
          console.error("Failed to sync JenisUnit:", error);
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'jenis-unit-storage',
    }
  )
);

export const useCuacaStore = create<MasterDataStore<Cuaca>>()(
  persist(
    (set) => ({
      data: [],
      lastSynced: null,
      isSyncing: false,
      setData: (data) => set({ data }),
      sync: async () => {
        set({ isSyncing: true });
        try {
          const freshData = await getCuaca();
          set({ data: freshData || [], lastSynced: Date.now(), isSyncing: false });
        } catch (error) {
          console.error("Failed to sync Cuaca:", error);
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'cuaca-storage',
    }
  )
);

export const useKondisiStore = create<MasterDataStore<Kondisi>>()(
  persist(
    (set) => ({
      data: [],
      lastSynced: null,
      isSyncing: false,
      setData: (data) => set({ data }),
      sync: async () => {
        set({ isSyncing: true });
        try {
          const freshData = await getKondisi();
          set({ data: freshData || [], lastSynced: Date.now(), isSyncing: false });
        } catch (error) {
          console.error("Failed to sync Kondisi:", error);
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'kondisi-storage',
    }
  )
);

export const useTemplateStore = create<MasterDataStore<TemplateWithRelations>>()(
  persist(
    (set) => ({
      data: [],
      lastSynced: null,
      isSyncing: false,
      setData: (data) => set({ data }),
      sync: async () => {
        set({ isSyncing: true });
        try {
          const freshData = await getTemplates();
          set({ data: freshData || [], lastSynced: Date.now(), isSyncing: false });
        } catch (error) {
          console.error("Failed to sync Templates:", error);
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'templates-storage',
    }
  )
);
