import { FunctionComponent } from "react";
import { Pacifico } from "next/font/google";
import { Chart } from "./Chart";

const pacifico = Pacifico({ subsets: ["latin"], weight: "400" });

const fetchUtilization = async () => {
  const response = await fetch(
    "https://parking.fintraffic.fi/api/v1/facilities/619/utilization",
    { next: { revalidate: 300 } }
  );
  const json: Array<{
    capacity: number;
    spacesAvailable: number;
    openNow: boolean;
  }> = await response.json();
  return json[0];
};

const fetchPrediction = async (after: number) => {
  const response = await fetch(
    `https://parking.fintraffic.fi/api/v1/facilities/619/prediction?after=${after}`,
    { next: { revalidate: 300 } }
  );
  const json: Array<{ spacesAvailable: number }> = await response.json();
  return json[0].spacesAvailable;
};

const fetchPredictions = async () => {
  const times = await Promise.all(
    [5, 10, 15, 20, 25, 30].map((after) => fetchPrediction(after))
  );
  return times;
};

const Utilization: FunctionComponent<{
  spacesAvailable: number;
  predictions: Array<number>;
}> = ({ spacesAvailable, predictions }) => {
  if (spacesAvailable === 0 && predictions.find((p) => p > 0)) {
    return "Freeing up soon";
  }
  if (spacesAvailable < 30 && spacesAvailable < predictions[0]) {
    return "Things are on the up";
  }
  if (spacesAvailable === 0) {
    return "None left";
  }
  if (spacesAvailable === 1) {
    return "Literally one left";
  }
  if (spacesAvailable < 5) {
    return "Hurry up";
  }
  if (spacesAvailable < 10) {
    return "Hope you're already on the way";
  }
  if (spacesAvailable < 15) {
    return "Time to start driving there";
  }
  return "Plenty";
};

export default async function Home() {
  const utilization = await fetchUtilization();
  const predictions = await fetchPredictions();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className={`${pacifico.className} text-3xl text-pink-600`}>
        Hullulahti
      </h1>
      <p className="text-8xl mb-4 text-green-700">
        {`${utilization.spacesAvailable} ${
          utilization.spacesAvailable === 1 ? "space" : "spaces"
        }`}
      </p>
      <p className="text-4xl mb-16 text-green-700">
        <Utilization
          spacesAvailable={utilization.spacesAvailable}
          predictions={predictions}
        />
      </p>
      <div className="w-full max-w-md">
        <Chart predictions={predictions} />
      </div>
    </main>
  );
}
