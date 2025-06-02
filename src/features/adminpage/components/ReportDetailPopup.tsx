import React, { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import useAdminpageStore from '../store/adminpageStore';
import { Report, ServiceType, TargetType } from '../types';

interface ReportPopupProps {
  report: Report;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  //   top: 0;
  //   left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const PopupContainer = styled.div`
  position: relative;
  background: white;
  border-radius: 10px;
  padding: 24px 32px;
  width: 600px;
  height: 400px;
  //   min-width: 320px;
  //   max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 1001;
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NameLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 40px;
`;

const CloseButton = styled.button`
  position: absolute;
  padding: 4px 10px;
  top: 25px;
  right: 20px;
  font-size: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #666;
  outline: none;

  &:hover {
    color: #000;
  }
`;

const ActionButton = styled.button<{ color: string; top: number; right: number }>`
  position: absolute;
  padding: 6px 12px;
  background-color: ${props => props.color};
  top: ${props => props.top}px;
  right: ${props => props.right}px;
  font-size: 18;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const translateServiceType = (serviceType: ServiceType | undefined) => {
  console.log('[Type] serbiceType: ', serviceType);
  switch (serviceType) {
    case ServiceType.COMMUNITY:
      return '커뮤니티';
    case ServiceType.DEBATE:
      return '토론';
    default:
      return '??';
  }
};

const translateTargetType = (targetType: TargetType | undefined) => {
  console.log('[Type] targetType: ', targetType);
  switch (targetType) {
    case TargetType.COMMENT:
      return '댓글';
    case TargetType.POST:
      return '게시글';
    case TargetType.REPLY:
      return '대댓글';
    default:
      return '??';
  }
};

const ReportDetailPopup: React.FC<ReportPopupProps> = ({ report, onClose }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { reportDetail, fetchReportDetail } = useAdminpageStore();
  const { reportedContent, fetchReportedContent } = useAdminpageStore();
  const { contentDelete, readReport } = useAdminpageStore();

  useEffect(() => {
    fetchReportDetail(report.reportId);
  }, [report.reportId]);
  useEffect(() => {
    if (
      reportDetail &&
      reportDetail.serviceType !== undefined &&
      reportDetail.targetType !== undefined &&
      reportDetail.contentId !== undefined
    ) {
      fetchReportedContent(
        reportDetail.serviceType,
        reportDetail.targetType,
        reportDetail.contentId
      );
    }
  }, [reportDetail]);

  return (
    <Overlay>
      <PopupContainer
        ref={ref}
        onClick={e => e.stopPropagation()} // 이 부분 추가!
      >
        {/* <CloseButton onClick={onClose}>&times;</CloseButton> */}
        <ActionButton
          top={25}
          right={20}
          onClick={() => {
            contentDelete(
              reportDetail?.serviceType,
              reportDetail?.targetType,
              reportDetail?.contentId
            );
            onClose();
          }}
          color="#dc3545"
        >
          삭제
        </ActionButton>
        <ActionButton
          top={25}
          right={80}
          onClick={() => {
            readReport(report.reportId);
            onClose();
          }}
          color="#33a02c"
        >
          신고내역 확인
        </ActionButton>

        <Header>
          <div>
            신고자
            <Info>
              <div>
                <strong>{report.reporterName}</strong>
              </div>
              <div>사유: {report.reportContent}</div>
            </Info>
          </div>
        </Header>
        <div>
          신고내용
          <div>게시판: {translateServiceType(reportDetail?.serviceType)}</div>
          <div>카테고리: {translateTargetType(reportDetail?.targetType)}</div>
          {reportDetail?.targetType === TargetType.POST ? (
            <>
              <div>제목: {reportedContent?.title}</div>
              <div>본문: {reportedContent?.content}</div>
            </>
          ) : (
            <div>댓글: {reportedContent?.content}</div>
          )}
        </div>
      </PopupContainer>
    </Overlay>
  );
};

export default ReportDetailPopup;
