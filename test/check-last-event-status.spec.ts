import { set, reset } from 'mockdate';
import LoadLastEventRepositorySpy from '../src/LoadLastEventRepositorySpy';
import CheckLastEventStatus from '../src/CheckLastEventStatus';

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

  it('should return status inReview when now is equal review time', async () => {
    const { sut, loadLastEventRepository } = makeSut();
    loadLastEventRepository.setEndDateWithReviewDurationToPast();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('inReview');
  });

  it('should return status done when now is after review time', async () => {
    const { sut, loadLastEventRepository } = makeSut();
    loadLastEventRepository.setEndDateWithReviewDurationToFuture();

    const eventStatus = await sut.perform({ groupId });

    expect(eventStatus.status).toBe('done');
  });
});
