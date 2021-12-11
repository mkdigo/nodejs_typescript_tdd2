export default class EventStatus {
  status: 'active' | 'inReview' | 'done';
  constructor(event?: { endDate: Date; reviewDurationInHours: number }) {
    if (event === undefined) {
      this.status = 'done';
      return;
    }
    const now = new Date();
    if (event.endDate >= now) {
      this.status = 'active';
      return;
    }
    const reviewDurationInMs = event.reviewDurationInHours * 60 * 60 * 1000;
    const reviewDate = new Date(event.endDate.getTime() + reviewDurationInMs);

    this.status = reviewDate >= now ? 'inReview' : 'done';
  }
}
