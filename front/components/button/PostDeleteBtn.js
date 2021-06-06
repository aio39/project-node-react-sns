import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';

const DeleteModal = styled(Modal)`
  ${props =>
    props.confirmLoading &&
    css`
      button {
        pointer-events: none;
      }
    `};
`;

const PostDeleteBtn = ({ postId }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('삭제하면 복구 할 수 없습니다.');
  const router = useRouter();

  const handleShowModal = () => {
    setVisible(p => !p);
  };

  const handleOk = async () => {
    setModalText('게시물을 삭제 중입니다.');
    setConfirmLoading(true);
    try {
      await axios.delete(`/post/${postId}`);
      setModalText('삭제에 성공했습니다. 잠시 후 메인 화면으로 이동합니다.');
      setTimeout(() => {
        router.push('/');
      }, 3500);
    } catch (error) {
      console.log(error);
      setModalText('삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleShowModal}>삭제</Button>
      <DeleteModal
        title="게시물을 삭제하시겠습니까?"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleShowModal}
      >
        <p>{modalText}</p>
      </DeleteModal>
    </>
  );
};

export default PostDeleteBtn;
