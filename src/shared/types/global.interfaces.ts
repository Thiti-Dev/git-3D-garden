export interface ITotalContributionsByWeekGraphqlResult {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionDays: {
            date: string;
            weekday: number;
            contributionLevel: string;
            contributionCount: number;
          }[];
        }[];
      };
    };
  };
}
