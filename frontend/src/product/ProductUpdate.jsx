import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  NumberInput,
  NumberInputField,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { CategoryComp } from "./component/CategoryComp.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { OptionComp } from "./component/OptionComp.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

export const ProductUpdate = () => {
  const params = useParams();
  const productId = params.productId;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    id: 0,
    title: "",
    content: "",
    filePath: "",
    price: 0,
    options: [],
  });
  const [option, setOption] = useState([]);
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [filePath, setFilePath] = useState("");
  const [price, setPrice] = useState(0);
  // const [options, setOptions] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/products/${productId}`)
      .then((response) => {
        console.log("Response: ", response.data);
        if (response.data != null) {
          setTitle(response.data.title);
          setContent(response.data.content);
          setFilePath(response.data.file_path);
          setOption(response.data.options);
          setPrice(response.data.price);
          category({
            mainCategory: response.data.main_category,
            subCategory: response.data.sub_category,
          });
        }
      })
      .catch((error) => {
        toast({
          title: "상품 상세 조회 실패",
          description: "Unable to fetch data.",
          status: "error",
          duration: 1500,
          position: "top",
          isClosable: true,
        });
        console.error("Error:", error);
      })
      .finally();
  }, []);

  const category = (category) => {
    setMainCategory(category.mainCategory);
    setSubCategory(category.subCategory);
  };

  const options = (options) => {
    setOption(options);
  };

  return (
    <Box maxWidth="1000px" mx={"auto"}>
      <Box>
        <Heading>Upload</Heading>
      </Box>
      <Divider border={"1px solid black"} my={4} />
      <Box maxWidth="700px" mx={"auto"}>
        <Box>
          <FormControl>
            {/* TODO : 썸네일 크기 수정 */}
            <FormLabel>썸네일</FormLabel>
            <Image
              height={"300px"}
              border={"1px solid red"}
              objectFit="cover"
              src={`https://huistudybucket01.s3.ap-northeast-2.amazonaws.com/${filePath}`}
            ></Image>
            <Input
              multiple
              type={"file"}
              accept="image/*"
              // onChange={(event) => onUpload(event)}
            />
            <FormHelperText>
              총 용량은 10MB, 한 파일은 1MB를 초과할 수 없습니다.
            </FormHelperText>
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>상품명</FormLabel>
            <Input
              type="text"
              placeholder={"30자 이내 작성"}
              value={title}
              // onChange={handleTitleChange}
            />
          </FormControl>
        </Box>
        <Box>
          <CategoryComp
            category={category}
            checkMain={mainCategory}
            checkSub={subCategory}
          />
        </Box>
        <Box>
          <FormControl>
            <FormLabel>상세 내용</FormLabel>
            <Textarea
              type="text"
              placeholder={"100자 이내 작성"}
              value={content}
              // onChange={handleContentChange}
            />
          </FormControl>
        </Box>
        <Box>
          <OptionComp options={options} />
        </Box>
        <Box maxWidth="60%">
          <FormControl>
            <FormLabel>가격</FormLabel>
            <NumberInput value={price} min={0} max={100000}>
              <NumberInputField
              // onChange={handlePriceChange}
              />
            </NumberInput>
            <FormHelperText>가격은 0원 이상부터 가능합니다.</FormHelperText>
          </FormControl>
        </Box>
        <Box>
          <Center>
            <ButtonGroup variant="solid">
              <VStack>
                <Button
                  isLoading={loading}
                  colorScheme={"blue"}
                  width={"200px"}
                  // onClick={handleSaveClick}
                >
                  Save
                </Button>
                <Button
                  colorScheme={"gray"}
                  width={"200px"}
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
              </VStack>
            </ButtonGroup>
          </Center>
        </Box>
      </Box>
    </Box>
  );
};
