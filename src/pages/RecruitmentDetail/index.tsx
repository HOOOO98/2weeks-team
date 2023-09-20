import React, { useState, useEffect } from 'react';
import {
    Btn,
    BtnWrapper,
    CommentName,
    CommentWrapper,
    ContentContainer,
    ContentHeader,
    ContentHeaderName,
    ContentHeaderValuedFalse,
    ContentHeaderValuedTrue,
    ContentSub,
    ContentTitleWrapper,
    ContentWrapper,
    Content,
    RecruitmentDetailContainer,
    DeleteModalContainer,
    DeleteModalWrapper,
    DeleteModalTitle,
    DeleteCloseButton,
    DeleteModal,
    DeleteFallbackButton,
    DeleteCreateButton,
    DeleteText,
    RecruitmentEndBtn,
    ContentUserImage,
    CommentCreateWrapper,
    CommentInputWrapper,
    CommentBtn,
    DeleteBtnWrapper,
} from './style';
import CommentItem from './CommentItem';
import {
    getRecruitmentDetail,
    getUserData,
    createComment,
    deleteRecruitment,
    updateRecruitment,
} from '../../utils/firebase';
import { useRecoilState } from 'recoil';
import { UserId, Render } from '../../utils/recoil';
import { useNavigate } from 'react-router-dom';
import { RecruitmentData } from '../../utils/recoil';
import { collection, serverTimestamp, getDocs, Firestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import MDEditor from '@uiw/react-md-editor';

const RecruitmentDetail: React.FC = () => {
    const [userId, setUserId] = useRecoilState(UserId);
    const [userName, setUserName] = useState('');
    const [userImageURL, setUserImageURL] = useState('');
    const [recruitmentData, setRecruitmentData] = useRecoilState(RecruitmentData);
    const [deleteModalValued, setDeleteModalValued] = useState(false);
    const [commentValue, setCommentValue] = useState('');
    const [comments, setComments] = useState([]);
    const [render, setRender] = useRecoilState(Render);
    const [userData, setUserData] = useState<any>({});
    const [commentLength, setCommentLength] = useState<number>(0);

    const [data, setData] = useState<any>({});

    const navigate = useNavigate();

    const channel = location.pathname.split('/')[2];
    const path = location.pathname.split('/')[3];

    useEffect(() => {
        const fetchUserData = async () => {
            const docRef = doc(firestore, 'recruitmentContainer', 'recruitment', channel, path);
            const unsub = await onSnapshot(
                doc(firestore, 'recruitmentContainer', 'recruitment', channel, path),
                (doc) => {
                    setData(doc.data());
                    setComments(doc.data()?.comment);
                    setCommentLength(doc.data()?.comment.length);
                    // 수정
                },
            );
            return () => {
                unsub();
            };
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (!render) {
            setRender(!render);
        }
        getUserData(userId)
            .then((result) => {
                setUserData(result);
            })
            .catch((error) => {
                // 에러 핸들링
                console.error('Error fetching data:', error);
            });
    }, [render]);

    const handleCreateCommentSubmit = async (e: any) => {
        e.preventDefault();

        if (!userId) {
            alert('로그인 후 사용해주세요');
            return;
        }
        // e.target 및 속성의 존재 여부 확인
        if (e.target && e.target.uid && e.target.content && e.target.uid.value && e.target.content.value) {
            const fullDate = new Date();
            const date =
                fullDate.getFullYear() +
                '/' +
                (fullDate.getMonth() + 1) +
                '/' +
                fullDate.getDate() +
                ' ' +
                fullDate.getHours() +
                ':' +
                fullDate.getMinutes();
            const value = {
                uid: e.target.uid.value,
                content: e.target.content.value,
                time: date,
                name: userData.name,
                imageURL: userData.imageURL,
            };
            await createComment(channel, path, value);

            setCommentValue('');
            // location.reload();
        } else {
            console.error('uid 또는 content가 정의되지 않았습니다.');
        }
    };

    const handleEdit = () => {
        for (let i = 0; i < data.comment.length; i++) {
            data.comment[i] = {
                uid: data.comment[i].uid,
                time: data.comment[i].time,
                content: data.comment[i].content,
                name: data.comment[i].name,
                imageURL: data.comment[i].imageURL,
            };
        }
        setRecruitmentData({ ...data, channel: channel });
        navigate('/recruitment/edit/' + channel + '/' + path, data);
    };

    const handleDeleteRcruitment = (e: any) => {
        deleteRecruitment(channel, path);
        navigate('/recruitment');
    };

    const handleDeleteModal = () => {
        setDeleteModalValued(!deleteModalValued);
    };

    const handleRecruitmentValued = () => {
        const updated_at_timestamp = serverTimestamp();

        console.log(data);
        const value = data;
        value.recruitValued = !value.recruitValued;

        console.log(value);

        updateRecruitment(channel, path, value);
    };

    return (
        <RecruitmentDetailContainer>
            {deleteModalValued ? (
                <DeleteModalContainer>
                    <DeleteModalWrapper>
                        <DeleteModal>
                            <DeleteModalTitle>게시글 삭제</DeleteModalTitle>
                            <DeleteCloseButton onClick={handleDeleteModal}>x</DeleteCloseButton>
                            <DeleteText>정말 삭제하시겠습니까?</DeleteText>
                            <DeleteBtnWrapper>
                                <DeleteCreateButton onClick={handleDeleteRcruitment}>삭제</DeleteCreateButton>
                                <DeleteFallbackButton onClick={handleDeleteModal}>나가기</DeleteFallbackButton>
                            </DeleteBtnWrapper>
                        </DeleteModal>
                    </DeleteModalWrapper>
                </DeleteModalContainer>
            ) : (
                ''
            )}

            <ContentContainer>
                <ContentWrapper>
                    <ContentHeader>
                        <ContentUserImage src={data.imageURL} />
                        <ContentHeaderName>{data.name}</ContentHeaderName>
                        {data.recruitValued ? (
                            <ContentHeaderValuedTrue>모집중</ContentHeaderValuedTrue>
                        ) : (
                            <ContentHeaderValuedFalse>모집완료</ContentHeaderValuedFalse>
                        )}
                    </ContentHeader>
                    <ContentTitleWrapper>
                        <h2>{data.title}</h2>
                        <p>
                            {data.editValued
                                ? new Date(data.editTime?.toMillis()).toLocaleString() + ' (수정됨)'
                                : new Date(data.time?.toMillis()).toLocaleString()}
                        </p>
                        {userId == data.uid ? (
                            <BtnWrapper>
                                {data.recruitValued ? <Btn onClick={handleEdit}>수정</Btn> : ''}

                                <Btn onClick={handleDeleteModal}>삭제</Btn>
                            </BtnWrapper>
                        ) : (
                            ''
                        )}
                    </ContentTitleWrapper>
                    <ContentSub>
                        <p>분야 : {data.category}</p>
                        <p>인원 : {data.people} 명</p>
                        <p>댓글 : {commentLength} 개</p>
                    </ContentSub>
                    {/* <MDEditor.Markdown
                        source={data.content}
                        style={{
                            padding: '20px',
                            width: '100%',
                            backgroundColor: '#fff',
                            color: 'black',
                        }}
                    /> */}
                    <Content>
                        {data.content?.split('\n').map((line: string) => {
                            //this.props.data.content: 내용
                            return (
                                <span>
                                    {line}
                                    <br />
                                </span>
                            );
                        })}
                    </Content>

                    {userId == data.uid ? (
                        data.recruitValued ? (
                            <RecruitmentEndBtn onClick={handleRecruitmentValued}>모집 마감</RecruitmentEndBtn>
                        ) : (
                            ''
                        )
                    ) : (
                        ''
                    )}
                </ContentWrapper>
                {render ? (
                    <CommentWrapper>
                        {comments ? comments.map((v: any, i: number) => <CommentItem comment={v} i={i} />) : ''}
                        <CommentCreateWrapper>
                            <CommentName>댓글 쓰기</CommentName>
                            <CommentInputWrapper>
                                <form id="comment" onSubmit={handleCreateCommentSubmit}>
                                    <input
                                        type="text"
                                        name="uid"
                                        defaultValue={userId}
                                        disabled
                                        style={{ display: 'none' }}
                                    />
                                    <input
                                        name="content"
                                        value={commentValue}
                                        style={{
                                            width: '880px',
                                            height: '60px',
                                            border: '1px solid gray',
                                            fontSize: '1rem',
                                            paddingLeft: '10px',
                                        }}
                                        onChange={(e) => {
                                            setCommentValue(e.target.value);
                                        }}
                                        required
                                    />
                                </form>
                                <CommentBtn type="submit" form="comment">
                                    작성
                                </CommentBtn>
                            </CommentInputWrapper>
                        </CommentCreateWrapper>
                    </CommentWrapper>
                ) : (
                    <>로딩중..</>
                )}
            </ContentContainer>
        </RecruitmentDetailContainer>
    );
};

export default RecruitmentDetail;
