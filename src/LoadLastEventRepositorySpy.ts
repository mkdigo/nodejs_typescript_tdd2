import { LoadLastEventRepository } from './interfaces';

export default class LoadLastEventRepositorySpy
  implements LoadLastEventRepository
{
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

  setEndDateWithReviewDurationToNow(): void {
    const reviewDurationInHours = 1;
    const reviewDurationInMs = reviewDurationInHours * 60 * 60 * 1000;
    this.output = {
      endDate: new Date(new Date().getTime() - reviewDurationInMs),
      reviewDurationInHours,
    };
  }

  setEndDateWithReviewDurationToFuture(): void {
    const reviewDurationInHours = 1;
    const reviewDurationInMs = reviewDurationInHours * 60 * 60 * 1000;
    this.output = {
      endDate: new Date(new Date().getTime() - reviewDurationInMs - 1),
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
