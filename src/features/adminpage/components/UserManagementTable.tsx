import { useState, useEffect } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { User } from '../types';
import styled from '@emotion/styled';
import { useAdminpageStore } from '../store/adminpageStore';
import UserDetailModal from './UserDetailModal';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #495057;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
`;

const Button = styled.button`
  padding: 6px 12px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff5252;
  }

  &:disabled {
    background-color: #ffb3b3;
    cursor: not-allowed;
  }
`;

interface UserItemProps {
  user: User[];
}

const columnHelper = createColumnHelper<User>();
const UserManagementTable: React.FC<UserItemProps> = ({ user }) => {
  const [data, setData] = useState<User[]>(user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const columns = [
    columnHelper.accessor('name', {
      header: '이름',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('nreported', {
      header: '피신고횟수',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('isDeactivate', {
      header: '제재상태',
      cell: info => (info.getValue() === true ? '비활성화' : '활성화'),
    }),
    columnHelper.display({
      id: 'adminRegistration',
      header: '회원탈퇴',
      cell: props => {
        // const { registerManager } = useAdminpageStore();
        return (
          <Button
          // disabled={props.row.original.role === 'ROLE_ADMIN'}
          // onClick={() => registerManager(props.row.original.email)}
          >
            회원탈퇴
          </Button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <Th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </Th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              key={row.id}
              onClick={() => {
                setSelectedUser(row.original);
                setIsModalOpen(true);
              }}
            >
              {row.getVisibleCells().map(cell => (
                <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      {selectedUser && isModalOpen && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => {
            setSelectedUser(null);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default UserManagementTable;
