import { getClient } from "@/apollo-client";
import CalloutCard from "@/components/CalloutCard";
import HumidityChart from "@/components/HumidityChart";
import Infopanel from "@/components/Infopanel";
import RainChart from "@/components/RainChart";
import Statcard from "@/components/Statcard";
import Tempchart from "@/components/Tempchart";
import fetchWeatherWuery from "@/graphql/queries/fetchWeatherQueries";
import { cleanData } from "@/lib/cleanData";
import getBasePath from "@/lib/getBaePath";
export const revalidate = 120;

type Props = {
  params: {
    city: string;
    lat: string;
    long: string;
  };
};

async function WeatherPage({ params: { city, lat, long } }: Props) {
  const client = getClient();
  const { data } = await client.query({
    query: fetchWeatherWuery,
    variables: {
      current_weather: "true",
      longitude: long,
      latitude: lat,
      timezone: "GMT",
    },
  });
  const results: Root = data.myQuery;
  const resultsToSend = cleanData(results, city);
  //we are in the server path not a client path
  const res = await fetch(`${getBasePath()}/api/getSummary`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      weatherData: resultsToSend,
    }),
  });
  const GPTdata = await res.json();
  const { content } = GPTdata;

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      <Infopanel city={city} results={results} long={long} lat={lat} />
      <div className="flex-1 p-5 lg:p-10">
        <div className="p-5">
          <div className="pb-5">
            <h2 className="text-xl font-bold">Today`s overview</h2>

            <p className="text-sm text-gray-400">
              Last updated at{" "}
              {new Date(results.current_weather.time).toLocaleString()}
              {results.timezone}
            </p>
          </div>
          <div className="m-2 rounded-2 mb-10">
            {/* Callout card */}
            <CalloutCard message={content} />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 m-2">
            <Statcard
              title="maximum temparature"
              metric={`${results.daily.temperature_2m_max[0].toFixed(1)}`}
              color="yellow"
            />
            <Statcard
              title="minimum temparature"
              metric={`${results.daily.temperature_2m_min[0].toFixed(1)}`}
              color="green"
            />
            <div>
              <Statcard
                title="UV Index"
                metric={`${results.daily.uv_index_max[0].toFixed(1)}`}
                color="rose"
              />
              {Number(results.daily.uv_index_max[0].toFixed(1)) > 5 && (
                <CalloutCard
                  warning
                  message="UV Index is high please wear SPF"
                />
              )}
            </div>
            <div className="flex space-x-3">
              <Statcard
                title="Wind speed"
                metric={`${results?.current_weather.windspeed.toFixed(1)}m/s`}
                color="cyan"
              />

              <Statcard
                title="Wind Direction"
                metric={`${results?.current_weather.winddirection.toFixed(1)}°`}
                color="violet"
              />
            </div>
          </div>
        </div>
        <hr className="mb-5" />
        <div className="space-y-3">
          {/* TEMPcHART */}
          <Tempchart results={results} />
          {/* rAINcHART */}
          <RainChart results={results} />
          {/* hUMIDITYCHART */}
          <HumidityChart results={results} />
        </div>
      </div>
    </div>
  );
}

export default WeatherPage;
