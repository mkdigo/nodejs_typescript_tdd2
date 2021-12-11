import { set, reset } from 'mockdate';

type EventStatus = { status: string };

class CheckLastEventStatus {
  constructor(
    private readonly loadLastEventRepository: LoadLastEventRepository
  ) {
    this.loadLastEventRepository = loadLastEventRepository;
  }
  async perform(input: { groupId: string }): Promise<EventStatus> {
    const event = await this.loadLastEventRepository.loadLastEvent(input);
    if (event === undefined) return { status: 'done' };
    const now = new Date();
    return event.endDate >= now ? { status: 'active' } : { status: 'inReview' };
  }
}

interface LoadLastEventRepository {
  loadLastEvent: (input: {
    groupId: string;
  }) => Promise<{ endDate: Date; reviewDurationInHours: number } | undefined>;
}

class LoadLastEventRepositorySpy implements LoadLastEventRepository {
  groupId?: string;
  callsCount = 0;
  output?: { endDate: Date; reviewDurationInHours: number };

  setEndDateToFuture(): void {
    this.output = {
      endDate: new Date(new Date().getTime() + 1),
      reviewDurationInHours: 1,
    };
  }

  setEndDateToPast(): void {
    this.output = {
      endDate: new Date(new Date().getTime() - 1),
      reviewDurationInHours: 1,
    };
  }

  setEndDateToNow(): void {
    this.output = {
      endDate: new Date(),
      reviewDurationInHours: 1,
    };
  }

  setEndDateWithReviewDurationToPast(): void {
    const reviewDurationInHours = 1;
    const reviewDurationInMs = reviewDurationInHours * 60 * 60 * 1000;
    this.output = {
      endDate: new Date(new Date().getTime() - reviewDurationInMs + 1),
      reviewDurationInHours,
    };
  }

  async loadLastEvent({
    groupId,
  }: {
    groupId: string;
  }): Promise<{ endDate: Date; reviewDurationInHours: number } | undefined> {
    this.groupId = groupId;
    this.callsCount++;
    return this.output;
  }
}

// System Under Test
const makeSut = (): {
  sut: CheckLastEventStatus;
  loadLastEventRepository: LoadLastEventRepositorySpy;
} => {
  const loadLastEventRepository = new LoadLastEventRepositorySpy();
  const sut = new CheckLastEventStatus(loadLastEventRepository);
  return { sut, loadLastEventRepository };
};

describe('CheckLastEventStatus', () => {
  const groupId = 'any_group_id';

  beforeAll(() => {
    set(new Date());
  });

  afterAll(() => {
    reset();
  });

  it('should get last event data', async () => {
    const { sut, loadLastEventRepository } = makeSut();

    await sut.perform({ groupId });

    expect(loadLastEventRepository.groupId).toBe(groupId);
    expect(loadLastEventRepository.callsCount).toBe(1);
  });

  it('should return status done when group has no event', async () => {
    const { sut, loadLastEventRepository } = makeSut();
    loadLastEventRepository.output = undefined;

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('done');
  });

  it('should return status active when now is before event end time', async () => {
    const { sut, loadLastEventRepository } = makeSut();
    loadLastEventRepository.setEndDateToFuture();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('active');
  });

  it('should return status active when now is equal event end time', async () => {
    const { sut, loadLastEventRepository } = makeSut();
    loadLastEventRepository.setEndDateToNow();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('active');
  });

  it('should return status inReview when now is after event end time', async () => {
    const { sut, loadLastEventRepository } = makeSut();
    loadLastEventRepository.setEndDateToPast();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('inReview');
  });

  it('should return status inReview when now is before review time', async () => {
    const { sut, loadLastEventRepository } = makeSut();
    loadLastEventRepository.setEndDateWithReviewDurationToPast();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('inReview');
  });
});
