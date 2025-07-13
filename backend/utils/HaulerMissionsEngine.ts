interface Mission {
  id: string;
  data: Record<string, any>;
}

export class HaulerMissionsEngine {
  static async assignMission(userId: string): Promise<any> {
    return { mission: 'mock' };
  }

  static async calculateScore(missions: Mission[], missionId: string): Promise<number> {
    const mission = missions.find(m => m.id === missionId);
    return mission ? 100 : 0;
  }
}
