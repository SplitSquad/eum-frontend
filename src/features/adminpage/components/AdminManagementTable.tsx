import { useState } from 'react';
import {
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { User } from '../types';
import styled from '@emotion/styled';
import { useAdminpageStore } from '../store/adminpageStore';

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

const RegisterButton = styled.button`
  padding: 6px 12px;
  background-color: #33a02c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff5252;
  }
`;

// // dummy data
interface UserItemProps {
  user: User[];
}

const columnHelper = createColumnHelper<User>();

const AdminManagementTable: React.FC<UserItemProps> = ({ user }) => {
  const [data, setData] = useState<User[]>(user);
  const { registerManager } = useAdminpageStore();

  const columns = [
    columnHelper.accessor('userId', {
      header: '유저Id',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: '이름',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: '이메일',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('role', {
      header: '권한',
      cell: info => (info.getValue() === 'ROLE_ADMIN' ? '관리자' : '일반회원'),
    }),
    columnHelper.display({
      id: 'adminRegistration',
      header: '관리자 등록',
      cell: props =>
        props.row.original.role === 'ROLE_ADMIN' ? (
          <Button onClick={() => registerManager(props.row.original.email)}>관리자 해제</Button>
        ) : (
          <RegisterButton onClick={() => registerManager(props.row.original.email)}>
            관리자 등록
          </RegisterButton>
        ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AdminManagementTable;
