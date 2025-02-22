import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSWRInfinite } from 'swr';
import Head from 'next/head';
import { Button, Col, Divider, Row, Spin, Statistic } from 'antd';
import { useRouter } from 'next/router';
import Title from 'antd/lib/typography/Title';
import AppLayout from '../components/layouts/AppLayout';
import { generateDummyPosts } from '../util/dummy';
import MainPostCard from '../components/MainPostCard';
import PostWriteButton from '../components/PostWriteButton';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import MainPostCardSkeleton from '../components/MainPostCardSkeleton';

const Home = () => {
  const router = useRouter();
  const { tag } = router.query;
  console.log(tag);
  const [postsLoadLimit, setPostsLoadLimit] = useState(12);
  const [target, setTarget] = useState(null);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const fetcher = url => {
    setShowSkeleton(true);
    return axios.get(url, { withCredentials: true }).then(result => {
      console.log('fetcher', result);
      setShowSkeleton(false);
      return result.data;
    });
  };

  const {
    data: postsDataArray,
    error: postsError,
    size,
    setSize,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData.length) return null; // reached the end
      let lastId = null;
      if (previousPageData) {
        lastId = previousPageData[previousPageData.length - 1].id;
      }
      if (lastId !== null && lastId < 2) return null;
      return `/posts?${tag ? `tag=${tag}&` : ''}${
        lastId ? `lastId=${lastId}?` : ''
      } `; // SWR key
    },
    fetcher,
    {
      // focusThrottleInterval: 3000,
      // dedupingInterval: 3000,
    },
  );
  console.log('size', size);

  const hasMorePosts = true;

  // if (postsDataArray && postsDataArray.length === size) setShowSkeleton(false);

  useInfiniteScroll({
    target,
    onIntersect: ([{ isIntersecting }]) => {
      if (isIntersecting) {
        console.log('Intersection 이벤트 발생');
        if (postsDataArray && postsDataArray.length === size) {
          console.log(`set Size() 실행 실행전 size: ${size}`);

          setSize(size + 1);
        }
      }
    },
  });

  const loadMorePosts = () => {
    setSize(size + 1);
  };

  return (
    <>
      <Head>
        <title>메인 홈</title>
      </Head>
      <AppLayout>
        <>
          {tag && (
            <Row>
              <Title>{`${tag}의 검색 결과 입니다.`}</Title>
              <Divider style={{ margin: '20px 0px' }} />
            </Row>
          )}
          <Row gutter={{ xs: 8, sm: 16, md: 24 }} align="top" justify="start">
            {postsDataArray?.flat().map(post => (
              <MainPostCard key={post.id} post={post} />
            ))}
            {showSkeleton &&
              Array(12)
                .fill()
                .map((a, index) => <MainPostCardSkeleton key={index} />)}
          </Row>
          {postsDataArray && (
            <Row justify="center">
              <Col>
                <Statistic title="post" value={postsDataArray.flat().length} />
                <div ref={setTarget} />
              </Col>
            </Row>
          )}
        </>
      </AppLayout>
    </>
  );
};
export default Home;
