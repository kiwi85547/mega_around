import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CustomToast } from "./component/CustomToast.jsx";

export function OauthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { successToast } = CustomToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);

      navigate("/");
    } else {
      successToast("가입 성공했습니다. 다시 로그인 해주세요");
      // TODO. 네비게이트 삭제
      // 입력창 만들고 put 요청 성공하면 /login 페이지로 네비게이트
      navigate("/login");
    }
  }, [location]);

  return null;
}
