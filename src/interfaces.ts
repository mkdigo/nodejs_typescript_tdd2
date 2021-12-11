export interface LoadLastEventRepository {
  loadLastEvent: (input: {
    groupId: string;
  }) => Promise<{ endDate: Date; reviewDurationInHours: number } | undefined>;
}
