interface LoadLastEventRepository {
  loadLastEvent: (groupId: string) => Promise<void>;
}

export default class LoadLastEventRepositoryMock {
  groupId?: string;
}
