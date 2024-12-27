import { router } from "expo-router";

export default function app() {
  useEffect(() => {
    router.replace("./home");
  }, []);

  return <></>;
}
