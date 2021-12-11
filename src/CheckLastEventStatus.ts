import LoadLastEventRepository from './LoadLastEventRepository';

export default class CheckLastEventStatus {
  constructor(
    private readonly loadLastEventRepository: LoadLastEventRepository
  ) {
    this.loadLastEventRepository = loadLastEventRepository;
  }
  async perform(groupId: string): Promise<void> {
    this.loadLastEventRepository.groupId = groupId;
  }
}
