import assert from "assert";
import { 
  TestHelpers,
  Marketplace_AssetAddedEvent
} from "generated";
const { MockDb, Marketplace } = TestHelpers;

describe("Marketplace contract AssetAddedEvent event tests", () => {
  // Create mock db
  const mockDb = MockDb.createMockDb();

  // Creating mock for Marketplace contract AssetAddedEvent event
  const event = Marketplace.AssetAddedEvent.mock({data: {} /* It mocks event fields with default values, so you only need to provide data */});

  it("Marketplace_AssetAddedEvent is created correctly", async () => {
    // Processing the event
    const mockDbUpdated = await Marketplace.AssetAddedEvent.processEvent({
      event,
      mockDb,
    });

    // Getting the actual entity from the mock database
    let actualMarketplaceAssetAddedEvent = mockDbUpdated.entities.Marketplace_AssetAddedEvent.get(
      `${event.chainId}_${event.block.height}_${event.logIndex}`
    );

    // Creating the expected entity
    const expectedMarketplaceAssetAddedEvent: Marketplace_AssetAddedEvent = {
      id: `${event.chainId}_${event.block.height}_${event.logIndex}`,
    };
    // Asserting that the entity in the mock database is the same as the expected entity
    assert.deepEqual(actualMarketplaceAssetAddedEvent, expectedMarketplaceAssetAddedEvent, "Actual MarketplaceAssetAddedEvent should be the same as the expectedMarketplaceAssetAddedEvent");
  });
});
