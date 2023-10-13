import LibraryCatalogue from "src/components/library-catalogue/index.jsx";
import "./App.css";
import "@fontsource/roboto";
import "bootstrap/dist/css/bootstrap.min.css";
function App() {
  return (
    <>
      <Header />

      <LibraryCatalogue />
    </>
  );
}

export default App;

const Header = () => {
  const styles = {
    display: "flex",
    justifyContent: "center",
  };
  return (
    <div style={styles}>
      <h2>Library Management System</h2>
    </div>
  );
};
