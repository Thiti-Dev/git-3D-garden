import React, { ReactNode, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useNavigate, useParams } from "react-router-dom";
import { GET_TOTAL_CONTRIBUTIONS_OF_USER } from "../../../constants/gql/GET_TOTAL_CONTRIBUTIONS";
import { ITotalContributionsByWeekGraphqlResult } from "../../../shared/types/global.interfaces";
import { Vector3, PerspectiveCamera as TPerspectiveCamera } from "three";
import {
  ArrowNarrowLeftIcon,
  ArrowNarrowRightIcon,
  HomeIcon,
} from "@heroicons/react/solid";
import Spinner from "../../../components/common/spinner";
import TreeBase from "./TreeBase";
import { GraphQLError } from "graphql";

export interface IFarmNavigationData {
  isNavigating: boolean;
  isNavigationJustFinished: boolean;
  direction?: "forward" | "backward" | null;
  comeFromEdge: boolean;
  isSafeToNavigate: boolean;
}

const _date: Date = new Date();
const _currentMonth: number = _date.getMonth();
const _currentYear: number = _date.getFullYear();

const ViewFarm: React.FC = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [isFresh, setIsFresh] = useState<boolean>(true);
  const [currentYear, setCurrentYear] = useState<number>(_currentYear);
  const [currentMonth, setCurrentMonth] = useState<number>(_currentMonth);
  const [farmData, setFarmData] = useState<
    | ITotalContributionsByWeekGraphqlResult["user"]["contributionsCollection"]["contributionCalendar"]["weeks"][0]["contributionDays"]
    | null
  >(null);
  const [navigatingThruFarm, setNavigatingThruFarm] =
    useState<IFarmNavigationData>({
      isNavigating: false,
      direction: null,
      isNavigationJustFinished: false,
      comeFromEdge: false,
      isSafeToNavigate: true,
    });
  //
  // ─── REFS ───────────────────────────────────────────────────────────────────────
  //
  const cameraRef = React.useRef<TPerspectiveCamera | null>(null);
  const orbitControlRef = React.useRef<any | null>(null);
  // ────────────────────────────────────────────────────────────────────────────────

  // ─── Cycle ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    window.document.title = `🌲${username} garden🌲`;
  }, [username]);
  // ────────────────────────────────────────────────────────────────────────────────

  let currentToYear: number = currentYear;
  let currentToMonth: number = currentMonth + 1;

  if (currentMonth === 12) {
    currentToMonth = 1;
    currentToYear = currentYear + 1;
  }
  const { loading, error, data } =
    useQuery<ITotalContributionsByWeekGraphqlResult>(
      GET_TOTAL_CONTRIBUTIONS_OF_USER,
      {
        variables: {
          username,
          from: `${currentYear}-${currentMonth
            .toString()
            .padStart(2, "0")}-01T00:00:00+00:00`,
          to: `${currentToYear}-${currentToMonth
            .toString()
            .padStart(2, "0")}-01T00:00:00+00:00`,
        },
        fetchPolicy: "network-only",
      }
    );

  //
  // ─── INTERCEPTORS ───────────────────────────────────────────────────────────────
  //

  useEffect(() => {
    if (!data) return;
    const flattenedResult =
      data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
        (data) => data.contributionDays
      );
    setFarmData(flattenedResult);
  }, [data]);

  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── RENDERING ──────────────────────────────────────────────────────────────────
  //
  const renderedTreeBase = !navigatingThruFarm.isNavigationJustFinished ? (
    <TreeBase
      farmData={farmData}
      currentNavigationData={navigatingThruFarm}
      onNavigationDone={onNavigationFinish}
      onTransistStableized={onTransistStablelized}
      loading={loading}
    />
  ) : null;
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── BLOCK ──────────────────────────────────────────────────────────────────────
  //
  if (loading && isFresh) {
    return <Spinner withCenteredFullScreenContainer />;
  }
  if (error) {
    let renderedError: ReactNode = <h1>{error.message}</h1>;
    if (Array.isArray(error.graphQLErrors) && error.graphQLErrors.length) {
      const errorType: string = (
        error.graphQLErrors[0] as GraphQLError & { type: string }
      ).type;
      if (errorType === "NOT_FOUND") {
        renderedError = (
          <h1 className="text-3xl text-black-500">
            Username of <span className="text-red-500">{username}</span> doesn't
            exist on the GITHUB
          </h1>
        );
      }
    }
    return (
      <>
        <div className="h-screen w-screen absolute z-50 font-creepster">
          <div className="flex h-full w-full flex-col items-center justify-center">
            {renderedError}
            <div style={{ position: "absolute", left: "3%", top: "3%" }}>
              <HomeIcon
                onClick={() => {
                  navigate("/");
                }}
                className="h-10 w-10 text-grey-500 pointer-events-auto cursor-pointer hover:scale-125"
              />
            </div>
          </div>
        </div>
      </>
    );
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── EVENTS ─────────────────────────────────────────────────────────────────────
  //
  function clearNavigationData() {
    setNavigatingThruFarm({
      isNavigating: false,
      direction: null,
      isNavigationJustFinished: false,
      comeFromEdge: false,
      isSafeToNavigate: true,
    });
  }
  function onNavigating(direction: IFarmNavigationData["direction"]): void {
    if (isFresh) setIsFresh(false);
    if (navigatingThruFarm.isNavigating || !navigatingThruFarm.isSafeToNavigate)
      return;
    setNavigatingThruFarm((prev) => ({
      ...prev,
      isNavigating: true,
      direction,
      isSafeToNavigate: false,
    }));

    let targetMonth: number = currentMonth;
    let targetYear: number = currentYear;
    if (direction === "backward") targetMonth = currentMonth - 1;
    else targetMonth = currentMonth + 1;

    if (targetMonth <= 0) {
      targetMonth = 12;
      targetYear--;
    } else if (targetMonth >= 13) {
      targetMonth = 1;
      targetYear++;
    }

    setCurrentYear(targetYear);
    setCurrentMonth(targetMonth);
  }

  function onNavigationFinish(): void {
    setNavigatingThruFarm((prev) => ({
      ...prev,
      isNavigating: false,
      isNavigationJustFinished: true,
      comeFromEdge: true,
    }));
    setTimeout(() => {
      setNavigatingThruFarm((prev) => ({
        ...prev,
        isNavigating: false,
        isNavigationJustFinished: false,
      }));
    }, 50);
  }

  function onTransistStablelized() {
    clearNavigationData();
  }
  // ────────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="h-screen w-screen absolute z-50 pointer-events-none">
        <div className="flex w-full flex-col">
          <p className="m-auto leading-tight text-2xl mt-10 mb-2 text-black-600 font-creepster select-none">
            Contribution farm of{" "}
            <span className="text-red-600">{username}</span>:{" "}
            <span className="text-blue-400">
              {currentYear}-{currentMonth.toString().padStart(2, "0")}-01{" "}
            </span>
            to{" "}
            <span className="text-orange-400">
              {currentToYear}-{currentToMonth.toString().padStart(2, "0")}-01
            </span>
          </p>
          <div style={{ position: "absolute", left: "3%", top: "45%" }}>
            <ArrowNarrowLeftIcon
              onClick={onNavigating.bind(null, "backward")}
              className="h-20 w-20 text-blue-500 pointer-events-auto cursor-pointer hover:scale-125"
            />
          </div>
          <div style={{ position: "absolute", right: "3%", top: "45%" }}>
            <ArrowNarrowRightIcon
              onClick={onNavigating.bind(null, "forward")}
              className="h-20 w-20 text-blue-500 pointer-events-auto cursor-pointer hover:scale-125"
            />
          </div>
          <div style={{ position: "absolute", left: "3%", top: "3%" }}>
            <HomeIcon
              onClick={() => {
                navigate("/");
              }}
              className="h-10 w-10 text-grey-500 pointer-events-auto cursor-pointer hover:scale-125"
            />
          </div>
        </div>
      </div>
      <div className="h-screen w-screen">
        <Canvas>
          <PerspectiveCamera
            makeDefault
            ref={cameraRef}
            position={[-80, 65, 100]}
            fov={90}
            zoom={11}
            far={1000}
            // filmOffset={5.2}
          />
          <OrbitControls
            ref={orbitControlRef}
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            position={[-80, 65, 100]}
            target={new Vector3(22, -2, 4)}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={50}
            maxDistance={200}
          />
          {/* <fog attach="fog" color="wheat" near={0.5} far={10} /> */}
          <Environment preset="dawn" />
          {renderedTreeBase}
        </Canvas>
      </div>
    </>
  );
};

export default ViewFarm;
