import { useSearchParams } from "react-router-dom";

export function useUrlPositions() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  console.log(lat , lng)

  return [lat, lng];
}