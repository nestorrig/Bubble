import { Experience } from "@components/experience";
import { UI } from "./components/ui";
import { Leva } from "leva";

function App() {
  return (
    <>
      <Experience />
      {/* <UI /> */}
      <Leva hidden={true} />
    </>
  );
}

export default App;
