import _ from 'lodash';
import type { FuelAsset } from './fuel-assets';

export interface Nft extends FuelAsset {
  image?: string;
}

function groupNFTsByCollection(nfts: Nft[]) {
  return _.groupBy(nfts, 'collection');
}

export class NFTCollectionPaginator {
  loadedNFTs: Nft[];
  groupedNFTs: _.Dictionary<Nft[]>;
  priorityCollections: string[];
  collectionNames: string[];
  currentCollectionIndex: number;

  maxCollectionLoadSize: number;
  largeCollectionThreshold: number;
  currentCollectionOffset: number;
  currentCollectionName: string | null;

  constructor(
    nfts: Nft[],
    priorityCollections: string[],
    maxCollectionLoadSize = 10,
    largeCollectionThreshold = 15
  ) {
    this.loadedNFTs = [];
    this.groupedNFTs = groupNFTsByCollection(nfts);
    this.priorityCollections = priorityCollections;
    this.collectionNames = this.getSortedCollectionNames(priorityCollections);
    this.currentCollectionIndex = 0;

    // Specific for loading large collections in chunks
    this.maxCollectionLoadSize = maxCollectionLoadSize;
    this.largeCollectionThreshold = largeCollectionThreshold; // Collections larger than this will be loaded in chunks
    this.currentCollectionOffset = 0;
    this.currentCollectionName = null;
  }

  getSortedCollectionNames(priorityCollections: string[]) {
    const availableCollections = Object.keys(this.groupedNFTs);

    if (!priorityCollections || priorityCollections.length === 0) {
      return availableCollections.sort();
    }

    const firstCollections: string[] = [];

    // Add each priority collection that exists
    for (const collection of priorityCollections) {
      if (this.groupedNFTs[collection]) {
        firstCollections.push(collection);
      }
    }

    // Add remaining collections alphabetically
    const remainingCollections = availableCollections
      .filter((collection) => !priorityCollections.includes(collection))
      .sort();

    return [...firstCollections, ...remainingCollections];
  }
  getNextBatch() {
    if (this.currentCollectionIndex >= this.collectionNames.length) {
      return {
        nfts: [],
        collectionName: null,
        isLastCollection: true,
        hasMore: false,
        isPartialCollection: false,
      };
    }

    let collectionNFTs: Nft[];
    let isPartialCollection = false;
    const currentCollection =
      this.currentCollectionName ??
      this.collectionNames[this.currentCollectionIndex];

    const fullCollection = this.groupedNFTs[currentCollection];

    if (fullCollection?.length >= this.largeCollectionThreshold) {
      const remainingInCollection =
        fullCollection.length - this.currentCollectionOffset;

      // Load either remaining items or chunk of "maxCollectionLoadSize" (usually, 10)
      collectionNFTs = fullCollection.slice(
        this.currentCollectionOffset,
        this.currentCollectionOffset + this.maxCollectionLoadSize
      );

      this.currentCollectionOffset += this.maxCollectionLoadSize;
      isPartialCollection = remainingInCollection > this.maxCollectionLoadSize;

      // If we've processed the entire collection, move to next one
      if (!isPartialCollection) {
        this.currentCollectionName = null;
        this.currentCollectionOffset = 0;
        this.currentCollectionIndex++;
      } else {
        this.currentCollectionName = currentCollection;
      }
    } else {
      // For small collections (<= 10 items), load all at once
      collectionNFTs = fullCollection;
      this.currentCollectionIndex++;
      this.currentCollectionName = null;
      this.currentCollectionOffset = 0;
    }

    this.loadedNFTs = [...this.loadedNFTs, ...collectionNFTs];

    const hasMore =
      isPartialCollection ||
      this.currentCollectionIndex < this.collectionNames.length;

    return {
      nfts: collectionNFTs,
      collectionName: currentCollection,
      collectionSize: fullCollection.length,
      hasMore: hasMore,
      isPartialCollection: isPartialCollection,
    };
  }

  getNextBatchesUntilCount(minCount: number) {
    const results = [];
    let totalNFTs = 0;

    while (totalNFTs < minCount) {
      const nextBatch = this.getNextBatch();
      results.push(nextBatch);
      totalNFTs += nextBatch.nfts.length;

      if (!nextBatch.hasMore) break;
    }

    return {
      collections: results,
      totalNFTs: totalNFTs,
    };
  }
}
