import EventStatus from './EventStatus';
import LoadLastEventRepositorySpy from './LoadLastEventRepositorySpy';

export default class CheckLastEventStatus {
  constructor(
    private readonly loadLastEventRepository: LoadLastEventRepositorySpy
  ) {
    this.loadLastEventRepository = loadLastEventRepository;
  }
  async perform(input: { groupId: string }): Promise<EventStatus> {
    const event = await this.loadLastEventRepository.loadLastEvent(input);
    return new EventStatus(event);
  }
}
