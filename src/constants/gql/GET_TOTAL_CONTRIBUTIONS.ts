import { gql } from "@apollo/client";

export const GET_TOTAL_CONTRIBUTIONS = gql`
  query GetTotalContributions($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionLevel
              contributionCount
              weekday
              date
            }
          }
        }
      }
    }
  }
`;
