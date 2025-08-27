import { create } from 'zustand';

interface ListNowStore {
    nftIdToList: string;
    addNftIdToList: (nftIdToList: string) => void;
    removeNftIdToList: (nftIdToList: string) => void;
}

export const useListNowStore = create<ListNowStore>((set) => ({
    nftIdToList: '',
    addNftIdToList: (nftIdToList: string) => set({ nftIdToList }),
    removeNftIdToList: () => set({ nftIdToList: '' }),
}));

