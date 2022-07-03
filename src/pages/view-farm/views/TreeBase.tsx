import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Group } from "three";
import { ITotalContributionsByWeekGraphqlResult } from "../../../shared/types/global.interfaces";
import DynamicTreeBase, { TTreeSource } from "../three-models/DynamicTree";
import { IFarmNavigationData } from "./ViewFarm";
interface IProps {
  farmData:
    | ITotalContributionsByWeekGraphqlResult["user"]["contributionsCollection"]["contributionCalendar"]["weeks"][0]["contributionDays"]
    | null;
  currentNavigationData: IFarmNavigationData;
  onNavigationDone: () => void;
  onTransistStableized: () => void;
  loading: boolean;
}

const SMOOTH_AXIS_INCREASE_AMOUNT_PER_FRAME: number = 1.5;

const TreeBase: React.FC<IProps> = ({
  farmData,
  currentNavigationData,
  onNavigationDone,
  onTransistStableized,
  loading,
}) => {
  const groupRef = useRef<Group>(null);
  const [isStablelized, setIsStablelized] = useState<boolean>(false);
  const [selfFarmData, setSelfFarmData] = useState<
    | ITotalContributionsByWeekGraphqlResult["user"]["contributionsCollection"]["contributionCalendar"]["weeks"][0]["contributionDays"]
    | null
  >(null); // preventing reciving the updated prop when live-fetching on navigation
  const [startNavigationProcess, setStartNavigationProcess] =
    useState<boolean>(false);
  //
  // ─── CYCLES ─────────────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    setSelfFarmData(farmData!.slice(0, farmData!.length - 1));
    if (currentNavigationData.comeFromEdge) {
      console.log("[DEV]: TreeBase Should come in from the edge");
    } else {
      //Fresh mount
      setIsStablelized(true);
    }
    return () => {
      console.log("[DEV]: TreeBase got unmounted");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isStablelized || !farmData || loading || startNavigationProcess)
      return;
    setSelfFarmData(farmData!.slice(0, farmData!.length - 1));
  }, [farmData, isStablelized, loading, startNavigationProcess]);
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── WATCHER ────────────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    if (currentNavigationData.isNavigating) {
      setStartNavigationProcess(true);
    }
  }, [currentNavigationData]);

  useEffect(() => {
    if (startNavigationProcess) {
    }
  }, [startNavigationProcess]);

  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── RENDERING ──────────────────────────────────────────────────────────────────
  //

  useFrame(() => {
    if (!groupRef.current) return;
    if (startNavigationProcess) {
      if (currentNavigationData.direction === "backward") {
        groupRef.current?.position.setX(
          groupRef.current?.position.x + SMOOTH_AXIS_INCREASE_AMOUNT_PER_FRAME
        );
        if (groupRef.current?.position.x >= 80) {
          groupRef.current?.position.setX(80);
          //setStartNavigationProcess(false);
          onNavigationDone();
        }
      } else if (currentNavigationData.direction === "forward") {
        groupRef.current?.position.setX(
          groupRef.current?.position.x - SMOOTH_AXIS_INCREASE_AMOUNT_PER_FRAME
        );
        if (groupRef.current?.position.x <= -80) {
          groupRef.current?.position.setX(-80);
          //setStartNavigationProcess(false);
          onNavigationDone();
        }
      }
    }

    //&& !loading because preventing from transisting phase if the data hasn't finished loading
    if (currentNavigationData.comeFromEdge && !loading) {
      if (currentNavigationData.direction === "backward") {
        groupRef.current?.position.setX(
          groupRef.current?.position.x + SMOOTH_AXIS_INCREASE_AMOUNT_PER_FRAME
        );
        if (groupRef.current?.position.x >= 0) {
          groupRef.current?.position.setX(0);
          onTransistStableized();
          setIsStablelized(true);
        }
      } else if (currentNavigationData.direction === "forward") {
        groupRef.current?.position.setX(
          groupRef.current?.position.x - SMOOTH_AXIS_INCREASE_AMOUNT_PER_FRAME
        );
        if (groupRef.current?.position.x <= 0) {
          groupRef.current?.position.setX(0);
          onTransistStableized();
          setIsStablelized(true);
        }
      }
    }
  });

  const treesBase = useMemo(() => {
    let curZ: number = 0;
    let curX: number = 0;
    return selfFarmData?.map((data, index) => {
      if (index % 7 === 0) {
        curZ = (index / 7) * 5;
        curX = 0;
      }
      curX++;
      let targetTreeSource: TTreeSource = "leaf";
      if (data.contributionCount >= 20) targetTreeSource = "god_tree";
      else if (data.contributionCount >= 15) targetTreeSource = "birch_tree";
      else if (data.contributionCount >= 10) targetTreeSource = "pine_tree";
      else if (data.contributionCount >= 6) targetTreeSource = "pumpkin";
      else if (data.contributionCount >= 2) targetTreeSource = "leaf";
      else if (data.contributionCount >= 0) targetTreeSource = "mushroom";
      return (
        <DynamicTreeBase
          key={index}
          treeSource={targetTreeSource!}
          position={[5 * curX, 0, curZ]}
        />
      );
    });
  }, [selfFarmData]);
  // ────────────────────────────────────────────────────────────────────────────────

  return (
    <group
      ref={groupRef}
      position={[
        currentNavigationData.comeFromEdge
          ? currentNavigationData.direction === "backward"
            ? -50
            : 50
          : 0,
        0,
        0,
      ]}
      dispose={null}
    >
      {treesBase}
    </group>
  );
};

export default TreeBase;
