import { Experience } from "@components/experience";
import { Audio, UI } from "./components/ui";
import { Leva } from "leva";

function App() {
  return (
    <>
      <Experience />
      <UI />
      {/* <Audio /> */}
      <Leva hidden={true} />
    </>
  );
}

export default App;
