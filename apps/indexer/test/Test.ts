import { TestHelpers } from 'generated';
const { MockDb } = TestHelpers;

describe('Manager contract NewRecordEvent event tests', () => {
  // Create mock db
  const _mockDb = MockDb.createMockDb();

  // Creating mock for Manager contract NewRecordEvent event
  // const event = Manager.ManagerLogEvent.mockData({data: {} /* It mocks event fields with default values, so you only need to provide data */});

  it('Manager_NewRecordEvent is created correctly', async () => {
    // Processing the event
    // const mockDbUpdated = await Manager.NewRecordEvent.processEvent({
    //   event,
    //   mockDb,
    // });
    //
    // // Getting the actual entity from the mock database
    // let actualManagerNewRecordEvent = mockDbUpdated.entities.Manager_NewRecordEvent.get(
    //   `${event.chainId}_${event.block.height}_${event.logIndex}`
    // );
    //
    // // Creating the expected entity
    // const expectedManagerNewRecordEvent: Manager_NewRecordEvent = {
    //   id: `${event.chainId}_${event.block.height}_${event.logIndex}`,
    // };
    // // Asserting that the entity in the mock database is the same as the expected entity
    // assert.deepEqual(actualManagerNewRecordEvent, expectedManagerNewRecordEvent, "Actual ManagerNewRecordEvent should be the same as the expectedManagerNewRecordEvent");
  });
});
