import { useEffect, useMemo, useState } from "react";
import { getRepairshopData, Shop } from "@/data/repairShopData";
import PieChart from "@/components/basicCharts/PieChart";

/** This component renders charts that display the different sectors that offer the option to repair things. */

type BranchenType = { branche: string; numb: number };

export default function SectorPieChart() {
  // get raw data from the API
  const [repairShopData, setRepairShopData] = useState<Shop[]>([]);
  useEffect(() => {
    const fetch = async () => {
      try {
        const data: Shop[] = await getRepairshopData();
        setRepairShopData(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };
    fetch();
  }, []);

  // process the data according to the requirement that only the different sectors are still present
  const numberOfBranchen: BranchenType[] = useMemo(() => {
    const branchen: string[] = repairShopData.map((shop) => shop.branche);

    const temp: BranchenType[] = [];
    branchen.forEach((br) => {
      const index: number = temp.findIndex((el) => el.branche === br);
      if (index === -1) {
        // sector does not exist
        temp.push({ branche: br, numb: 1 });
      } else {
        // sector does already exist
        temp[index].numb++;
      }
    });
    temp.sort((a, b) => {
      return b.numb - a.numb;
    });
    const others: number = temp
      .slice(12)
      .reduce((acc, cur) => acc + cur.numb, 0);
    const biggestSectors: BranchenType[] = temp.slice(0, 12);
    biggestSectors.push({ branche: "Sonstige", numb: others });

    return biggestSectors;
  }, [repairShopData]);

  function getRandomColor(count) {
    let colors = [];
    for (var i = 0; i < count; i++) {
      let letters = "0123456789ABCDEF".split("");
      let color = "#";
      for (let x = 0; x < 6; x++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colors.push(color);
    }
    return colors;
  }

  // process the data the way they are needed to be displayed in the charts
  const chartData = useMemo(
    () => ({
      labels: numberOfBranchen.map((data: BranchenType) => data.branche),
      // datasets is an array of objects where each object represents a set of data
      // to display corresponding to the labels above
      datasets: [
        {
          label: "Branchen",
          data: numberOfBranchen.map((data: BranchenType) => data.numb),
          backgroundColor: getRandomColor(10),
          borderColor: "black",
          borderWidth: 0.5,
        },
      ],
    }),
    [numberOfBranchen]
  );
  return (
    <div className="chart-container">
      <PieChart
        chartData={chartData}
        title={"Reparaturgewerbe nach Branchen"}
      />
    </div>
  );
}
