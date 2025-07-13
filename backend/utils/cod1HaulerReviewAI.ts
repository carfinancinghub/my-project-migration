interface Job {
  id: string;
  data: Record<string, any>;
}

export class Cod1HaulerReviewAI {
  static async reviewJob(job: Job): Promise<number> {
    return 5; // Mock score
  }
}
