import { Box, Center, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import MyPageMenu from "./MyPageMenu.jsx";

export function Navbar({ updateAlarm }) {
  const account = useContext(LoginContext);
  const navigate = useNavigate();
  // const [showTabs, setShowTabs] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  return (
    <Flex
      h={"40px"}
      fontSize={"lg"}
      align={"center"}
      justifyContent={"space-between"}
      backgroundColor={"yellow"}
    >
      <Box>
        <Center onClick={() => navigate("/")} cursor={"pointer"}>
          <Text>Home</Text>
        </Center>
      </Box>
      <Box>
        <Center onClick={() => navigate("branch/list")} cursor={"pointer"}>
          <Text>메가오더</Text>
        </Center>
      </Box>
      {!account.isLoggedIn() ? (
        <>
          <Box onClick={() => navigate("/signup")} cursor={"pointer"}>
            회원가입
          </Box>
          <Box onClick={() => navigate("/login")} cursor={"pointer"}>
            로그인
          </Box>
        </>
      ) : (
        <>
          {/*<Box mr={10} onMouseOver={() => setShowTabs(true)}>*/}
          {/*{account.nickName}*/}
          {/*{account.branchName}&nbsp;님*/}
          {/*</Box>*/}
          {/*{showTabs && <MyPageMenu />}*/}
          <MyPageMenu setIsChanged={setIsChanged} updateAlarm={updateAlarm} />
          <Box
            onClick={() => {
              account.logout();
              navigate("/");
            }}
            cursor={"pointer"}
          >
            로그아웃
          </Box>
        </>
      )}
    </Flex>
  );
}
