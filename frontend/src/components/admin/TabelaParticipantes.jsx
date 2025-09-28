import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Download, Trash2 } from 'lucide-react';
import { ExcelJS } from 'exceljs';
import { saveAs } from 'file-saver';
import { useAuth } from '../../context/AuthContext';
import { deleteParticipante } from '../../services/EncontroService';

const TabelaParticipantes = ({ participantes, nome, setParticipantes, encontroId }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const { token } = useAuth();

  const handleDelete = async (inscricaoId, jogadoraId) => {
    if (!window.confirm("Tem certeza que deseja remover este participante?")) {
        return;
    }
    try {
        await deleteParticipante({ encontroId, inscricaoId, jogadoraId }, token);
        const novosParticipantes = participantes.filter(p => !(p.inscricao_id === inscricaoId && p.jogadoraId === jogadoraId));
        setParticipantes(novosParticipantes);
        alert("Participante removido com sucesso!");
    } catch (error) {
        console.error("Erro ao deletar participante:", error);
        alert(`Erro: ${error.message}`);
    }
  };

  const columns = [
    {
      accessorKey: 'nome',
      header: 'Nome do Participante',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'cpf',
      header: 'CPF',
    },
    {
      accessorKey: 'telefone',
      header: 'Telefone',
    },
    {
        accessorKey: 'dataNascimento',
        header: 'Nascimento',
      },
    {
      accessorKey: 'time',
      header: 'Time / Inscrição',
    },
    {
      accessorKey: 'fotoDocumentoUrl',
      header: 'Foto do Documento',
      cell: info => {
        const url = info.getValue();
        return url ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="truncate max-w-[200px] underline text-blue-600">
            Ver Foto
          </a>
        ) : 'N/A';
      },
      enableSorting: false,
    },
    {
        accessorKey: 'selfiePessoalUrl',
        header: 'Selfie Pessoal',
        cell: info => {
          const url = info.getValue();
          return url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="truncate max-w-[200px] underline text-blue-600">
              Ver Foto
            </a>
          ) : 'N/A';
        },
        enableSorting: false,
      },
    {
      accessorKey: 'posicaoPreferida',
      header: 'Posição',
      cell: info => <span className="capitalize">{info.getValue()}</span>
    },
    {
        id: 'acoes',
        header: 'Ações',
        cell: ({ row }) => {
            const participante = row.original;
            return (
                <button
                    onClick={() => handleDelete(participante.inscricao_id, participante.jogadoraId)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Remover participante"
                >
                    <Trash2 className="size-4" />
                </button>
            )
        }
    }
  ];

  const table = useReactTable({
    data: participantes,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Participantes');

    const headers = [
      "Nome do Participante", "Email", "CPF", "Telefone", "Nascimento",
      "Time / Inscrição", "Posição", "URL Foto Documento", "URL Selfie"
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF981FBA' },
      };
      cell.font = {
        color: { argb: 'FFFFFFFF' },
        bold: true,
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const dataToExport = table.getRowModel().rows.map(row => row.original);

    dataToExport.forEach(row => {
      worksheet.addRow([
        row.nome, row.email, row.cpf, row.telefone, row.dataNascimento,
        row.time, row.posicaoPreferida, row.fotoDocumentoUrl, row.selfiePessoalUrl
      ]);
    });

    worksheet.columns.forEach(column => {
        let maxLen = 0;
        column.eachCell({ includeEmpty: true }, cell => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLen) {
                maxLen = columnLength;
            }
        });
        column.width = maxLen < 10 ? 10 : maxLen + 2;
    });

    worksheet.autoFilter = {
      from: 'A1',
      to: {
        row: 1,
        column: headers.length,
      },
    };

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Lista_De_Participantes_${nome}.xlsx`);
  };


  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
          placeholder="Pesquisar em todas as colunas..."
        />
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-800 w-full sm:w-auto"
        >
          <Download className="size-4" />
          Exportar para Excel
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-b-0 shadow-sm">
        <table className="min-w-full bg-white text-sm">
          <caption className="sr-only">
            Lista de participantes inscritos no encontro
          </caption>
          <thead className="bg-[#981FBA] text-white font-bold">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} scope="col" className="px-4 py-2 text-left">
                    <div
                      className={header.column.getCanSort() ? 'cursor-pointer select-none flex items-center gap-1' : 'flex items-center gap-1'}
                      onClick={header.column.getToggleSortingHandler()}
                      title={header.column.getCanSort() ? 'Clique para ordenar' : undefined}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <div className="flex flex-col">
                          <ChevronUp className={`size-4 ${header.column.getIsSorted() === 'asc' ? 'text-white' : 'text-purple-300'}`} />
                          <ChevronDown className={`-mt-1 size-4 ${header.column.getIsSorted() === 'desc' ? 'text-white' : 'text-purple-300'}`} />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b hover:bg-gray-300">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaParticipantes;
