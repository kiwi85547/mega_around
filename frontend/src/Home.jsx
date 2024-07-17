import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./component/Navbar.jsx";

export function Home() {
  return (
    <Box h={"100%"}>
      <Box>
        <Navbar />
      </Box>
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}
