import { useQuery } from "@apollo/client";
import React from "react";
import { useParams } from "react-router-dom";
import { GET_TOTAL_CONTRIBUTIONS_OF_USER } from "../../../constants/gql/GET_TOTAL_CONTRIBUTIONS";
import { ITotalContributionsByWeekGraphqlResult } from "../../../shared/types/global.interfaces";

const date: Date = new Date();
const currentMonth = date.getMonth();

const ViewFarm: React.FC = () => {
  const { username } = useParams();

  const { loading, error, data } =
    useQuery<ITotalContributionsByWeekGraphqlResult>(
      GET_TOTAL_CONTRIBUTIONS_OF_USER,
      {
        variables: {
          username,
          from: `2022-${currentMonth
            .toString()
            .padStart(2, "0")}-01T00:00:00+00:00`,
          to: `2022-${(currentMonth + 1)
            .toString()
            .padStart(2, "0")}-01T00:00:00+00:00`,
        },
      }
    );

  return (
    <>
      <div>
        Viewing farm of {username} with total contribution of{" "}
        {data?.user.contributionsCollection.contributionCalendar
          .totalContributions || "Loading"}
      </div>
    </>
  );
};

export default ViewFarm;
