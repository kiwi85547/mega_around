import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const ProductDetailModal = ({ isOpen, onClose, productId }) => {
  // TODO : 권한마다 다른 화면
  //  admin/branch : 전부
  //  customer : 선택한 branch id 의 품절 상품
  const [data, setData] = useState({
    id: 0,
    title: "",
    content: "",
    filePath: "",
    price: 0,
    options: [],
  });
  const [checkedItems, setCheckedItems] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [count, setCount] = useState(1);
  const navigate = useNavigate();
  const toast = useToast();
  const {
    isOpen: alertIsOpen,
    onOpen: alertOnOpen,
    onClose: alertOnClose,
  } = useDisclosure();
  const cancelRef = React.useRef();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId !== 0) {
      axios
        .get(`/api/products/${productId}`)
        .then((response) => {
          const { id, title, content, file_path, price, options } =
            response.data;
          if (response.data != null) {
            setData({
              id: id,
              title: title,
              content: content,
              filePath: file_path,
              price: price,
              options: options,
            });
            setTotalPrice(response.data.price);
          }
          console.log("Response: ", response.data);
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
    }
  }, [productId]);

  const handleCheckboxChange = (optionId, itemId, itemPrice) => {
    itemPrice = count > 1 ? itemPrice * count : itemPrice;
    setCheckedItems((prevState) => {
      const prevItemId = prevState[optionId];
      const isCurrentlyChecked = prevItemId === itemId;

      let newTotalPrice = totalPrice;

      if (isCurrentlyChecked) {
        newTotalPrice -= itemPrice;
      } else {
        if (prevItemId) {
          const prevItem = data.options
            .find((option) => option.id === optionId)
            .option_item.find((item) => item.id === prevItemId);
          newTotalPrice -= prevItem.price;
        }
        newTotalPrice += itemPrice;
      }

      setTotalPrice(newTotalPrice);

      return {
        ...prevState,
        [optionId]: isCurrentlyChecked ? null : itemId,
      };
    });
  };

  const handleCountChange = (productCount) => {
    let prevPrice = totalPrice / count;
    setTotalPrice(
      productCount < 0 ? totalPrice - prevPrice : totalPrice + prevPrice,
    );
    setCount(count + productCount);
  };

  const closeModal = () => {
    onClose();
    setCheckedItems({});
    setTotalPrice(0);
    setCount(1);
  };

  const handleUpdateButton = () => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleDeleteButton = () => {
    axios
      .delete(`/api/products/${productId}`)
      .then(() => {
        toast({
          title: "상품 삭제 성공",
          status: "success",
          position: "top",
          duration: 1500,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          status: "warning",
          description: "상품 삭제 중 문제가 발생하였습니다.",
          position: "top",
          duration: 1500,
        });
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false);
        alertOnClose();
        closeModal();
        window.location.reload();
      });
  };
  // -- spinner
  if (data == null) {
    return <Spinner />;
  }

  return (
    <Modal onClose={closeModal} isOpen={isOpen} size={"xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={"center"}>{data.title}</ModalHeader>
        <ModalCloseButton />
        <VStack>
          {/* TODO : admin 권한 설정 */}
          <ButtonGroup>
            <Button onClick={handleUpdateButton}>
              {/* 수정하기 */}
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
            <Button onClick={alertOnOpen}>
              {/* 삭제하기 */}
              <FontAwesomeIcon icon={faTrashCan} />
            </Button>
          </ButtonGroup>
        </VStack>
        <ModalBody align={"center"}>
          <VStack spacing={4}>
            <Image
              height={"250px"}
              border={"1px solid red"}
              objectFit="cover"
              src={`https://huistudybucket01.s3.ap-northeast-2.amazonaws.com/${data.filePath}`}
            />
            <Text w={"80%"} fontSize={"xl"} as={"b"}>
              {data.title}
            </Text>
            <Text w={"80%"}>{data.content}</Text>
            <Divider orientation="horizontal" />
            <Text w={"80%"} fontSize={"lg"} as={"b"}>
              퍼스널 옵션
            </Text>
          </VStack>
          <Accordion allowMultiple align="stretch" mt={"20px"}>
            {data.options.map((option) => (
              <AccordionItem key={option.id}>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      {option.title}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <VStack align="start">
                    {option.option_item.map((item) => (
                      <Checkbox
                        key={item.id}
                        value={item.id}
                        id={item.optionId}
                        isChecked={checkedItems[option.id] === item.id}
                        onChange={() =>
                          handleCheckboxChange(option.id, item.id, item.price)
                        }
                      >
                        {item.content} +{item.price}원
                      </Checkbox>
                    ))}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
          <Flex justifyContent={"space-between"} align={"center"} mt={"20px"}>
            <Box>
              <HStack maxW="200px">
                <Button
                  isDisabled={count < 2}
                  onClick={() => handleCountChange(-1)}
                >
                  -
                </Button>
                <Input value={count} readOnly />
                <Button onClick={() => handleCountChange(1)}>+</Button>
              </HStack>
            </Box>
            <Box mr={"100px"}>
              <Text fontSize={"lg"} as={"b"}>
                {totalPrice} 원
              </Text>
            </Box>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <VStack>
            <ButtonGroup>
              <Button colorScheme={"red"}>바로 주문</Button>
              <Button colorScheme={"orange"}>장바구니 담기</Button>
              <Button onClick={onClose}>닫기</Button>
            </ButtonGroup>
          </VStack>
        </ModalFooter>
      </ModalContent>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={alertIsOpen}
        onClose={alertOnClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              상품 삭제
            </AlertDialogHeader>
            <AlertDialogBody>
              {data.title} 상품을 삭제하시겠습니까?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="red" onClick={handleDeleteButton} ml={3}>
                Delete
              </Button>
              <Button ref={cancelRef} onClick={alertOnClose}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Modal>
  );
};
