import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { User, Report } from '../types';
import useAdminpageStore from '../store/adminpageStore';
import DeactivateControl from './DeactivateControl';
import ReportDetailPopup from './ReportDetailPopup';

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  width: 900px;
  height: 650px;
  overflow-y: auto;
  padding: 24px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

// const Avatar = styled.div`
//   width: 100px;
//   height: 120px;
//   background-color: #e0e0e0;
//   margin-right: 24px;
// `;

const Avatar = styled.img`
  width: 100px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 24px;
  background-color: #e0e0e0;
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

const Tag = styled.span`
  font-size: 14px;
  color: gray;
  margin-left: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-right: 40px;
`;

const ActionButton = styled.button<{ color: string }>`
  padding: 6px 12px;
  background-color: ${props => props.color};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
`;

const TableWrapper = styled.div`
  max-height: 300px; /* 원하는 높이로 조정 */
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  padding: 8px;
  border-bottom: 1px solid #ccc;
  background: #f1f1f1;
  text-align: left;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
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

// 단위
// 일 -> 분
// 1 -> 1440
// 5 -> 7200
// 10 -> 14400
// 30 -> 43200
// 영구정지 -> 999,999,999,999

const handleRowClick = () => {
  console.log('Row clicked!');
  // 원하는 로직 수행
};

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  const [reports, setReports] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { reportList, fetchReports } = useAdminpageStore();
  const { removeReport } = useAdminpageStore();

  useEffect(() => {
    fetchReports(user.userId);
  }, [user.userId]);

  console.info('[render] userDetailModal 호출');
  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Header>
          <Avatar src={user.profileImagePath || '/default-avatar.png'} alt="Profile" />
          <Info>
            <NameLine>
              <div>
                <strong>{user.name}</strong>
              </div>
              <ButtonGroup>
                {user.isDeactivate ? (
                  <ActionButton color="#28a745">정지해제</ActionButton>
                ) : (
                  <>
                    <DeactivateControl
                      user={user}
                      onSelect={days => {
                        console.log('선택한 정지 기간:', days);
                        // 여기에 백엔드 요청 보내는 로직 추가
                      }}
                    />
                  </>
                )}
              </ButtonGroup>
            </NameLine>
            <div>{user.email}</div>
            <div>피신고횟수: {user.nreported}</div>
            <div>제재횟수: {user.deactivateCount}</div>
            <div>제재상태: {user.isDeactivate ? '비활성화' : '활성화'}</div>
          </Info>
        </Header>

        <div>
          <strong>피신고내역</strong>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>번호</Th>
                  <Th>신고자</Th>
                  <Th>사유</Th>
                </tr>
              </thead>
              <tbody>
                {(reportList ?? []).map((report, index) => (
                  <tr
                    key={report.reportId}
                    onClick={() => {
                      setSelectedReport(report);
                      setIsPopupOpen(true);
                    }}
                  >
                    <Td>{index + 1}</Td>
                    <Td>{report.reporterName}</Td>
                    <Td>{report.reportContent}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </div>
      </ModalContainer>
      {selectedReport && isPopupOpen && (
        <ReportDetailPopup
          report={selectedReport}
          onClose={() => {
            removeReport(selectedReport.reportId);
            setSelectedReport(null);
            setIsPopupOpen(false);
          }}
        />
      )}
    </Overlay>
  );
};

export default UserDetailModal;
