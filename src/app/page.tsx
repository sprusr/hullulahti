import { SpacesGraph } from "@/components/SpacesGraph";

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
    [10, 20, 30, 40, 50, 60].map((after) => fetchPrediction(after))
  );
  return times;
};

const getCurrentSpacesText = (spacesAvailable: number) =>
  `${spacesAvailable} ${spacesAvailable === 1 ? "space" : "spaces"}`;

const getFullAtText = (predictions: number[]) => {
  const fullAt = predictions.findIndex((prediction) => prediction === 0);
  if (fullAt === -1) {
    return "Spaces are not expected to run out within the next hour.";
  }
  return `All spaces are predicted to be taken within the next ${
    (fullAt + 1) * 10
  } minutes.`;
};

export default async function Home() {
  const utilization = await fetchUtilization();
  const predictions = await fetchPredictions();

  const timeNowText = new Date().toString();

  const currentSpacesText = getCurrentSpacesText(utilization.spacesAvailable);
  const fullAtText = getFullAtText(predictions);

  return (
    <main className="w-full max-w-lg mx-auto p-4 font-serif">
      <hgroup>
        <h1 className="text-6xl">Hullulahti</h1>
        <p className="text-2xl">Ruoholahti Park & Ride Situation</p>
      </hgroup>
      <p className="my-4">
        There are currently <strong>{currentSpacesText}</strong> available.{" "}
        {fullAtText}
      </p>
      <figure className="my-4">
        <SpacesGraph
          data={[utilization.spacesAvailable, ...predictions]}
          className="w-full"
        />
        <figcaption className="text-center text-sm">
          Predicted availability for the next hour (spaces/minutes)
        </figcaption>
      </figure>
      <h2 className="my-4 text-2xl">What is this website?</h2>
      <p className="my-4">
        It&apos;s crazy that HSL put a Park & Ride as close to the center as
        Ruoholahti. With only 141 parking spaces, the competitiveness of finding
        a spot there is also crazy.
      </p>
      <p className="my-4">
        This website was made to make it easier to know whether you should even
        bother trying to park there.
      </p>
      <p className="my-4">
        Prediction data is from{" "}
        <a
          className="underline"
          href="https://parking.fintraffic.fi/facilities/619"
        >
          Fintraffic
        </a>
        . Data last fetched: {timeNowText}.
      </p>
    </main>
  );
}
