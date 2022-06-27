import { gql } from "@apollo/client";

export const GET_TOTAL_CONTRIBUTIONS_OF_USER = gql`
  query GetTotalContributions(
    $username: String!
    $from: DateTime!
    $to: DateTime!
  ) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              weekday
              contributionLevel
              contributionCount
            }
          }
        }
      }
    }
  }
`;
