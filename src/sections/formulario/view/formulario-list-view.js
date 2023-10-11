'use client';

// react
import { useCallback, useEffect, useState } from 'react';
// mui
import { TableCell, TableHead, TableRow } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { ConfirmDialog } from 'src/components/custom-dialog';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { useSnackbar } from 'src/components/snackbar';
import { TableEmptyRows, TableNoData } from 'src/components/table';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { RouterLink } from 'src/routes/components';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { FormularioService } from 'src/services';
//utils
import { setSessionItem } from 'src/utils/storage';
import * as Mask from 'src/utils/mask';
//sections
import { LocalFilter, LocalPagination } from 'src/sections/utils';
//
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', width: 25 },
  { id: 'nome', label: ' Nome', width: 180 },
  { id: 'cpf', label: 'cpf', width: 180 },
  { id: 'sexo', label: 'sexo', width: 180 },
  { id: 'acoes', label: 'Ações', width: 50 },
];

// ----------------------------------------------------------------------

export default function FormularioListView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();

  const [dataTable, setDataTable] = useState([]);
  const [dataTableFilter, setDataTableFilter] = useState([]);
  const [dense, setDense] = useState(true);

  const [pageApi, setPageApi] = useState(1);
  const [quantPagsApi, setQuantPagsApi] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItemsApi, setTotalItemsApi] = useState(0);
  const [searchBarApi, setSearchBarApi] = useState('');

  const denseHeight = dense ? 52 : 72;
  const canReset = !isEqual('', '');
  const notFound = (!dataTableFilter?.length && canReset) || !dataTableFilter?.length;

  const emptyRows = () => {
    if (totalItemsApi <= itemsPerPage) {
      return 0;
    }
    const rowCount = Math.max(totalItemsApi, 0);
    return itemsPerPage - Math.min(itemsPerPage, rowCount - (pageApi - 1) * itemsPerPage);
  };

  const fetchData = async () => {
    const filtro = dataTable?.filter(
      (item) => 0 == 0 

        /*item.razaoSocial.toLowerCase().includes(searchBarApi.toLowerCase()) ||
        Mask.unmasked(item.cnpj)
          .toLocaleLowerCase()
          .includes(Mask.unmasked(searchBarApi.toLowerCase()))*/
    );

    setQuantPagsApi(Math.ceil(filtro.length / itemsPerPage));
    setTotalItemsApi(filtro.length);

    const itemsCurrentPage = pageApi * itemsPerPage - itemsPerPage;
    // START PAGE
    if (itemsCurrentPage == 0) {
      setDataTableFilter(
        filtro.filter((_, indice) => indice >= itemsCurrentPage && indice < itemsPerPage)
      );
    }
    // OTHERS PAGES
    if (itemsCurrentPage > 0) {
      setDataTableFilter(
        filtro.filter(
          (_, indice) => indice > itemsCurrentPage - 1 && indice < itemsCurrentPage + itemsPerPage
        )
      );
    }
  };

  const handleDeleteRow = useCallback(
    (id) => {
      // aqui no delete não estamos deletando da API, mas apenas visualmente no front, então pra deletar na API crie um service e chame ele aqui
      const deleteRow = dataTable?.filter((row) => row?.codigo !== id);
      setDataTable(deleteRow);
    },
    [dataTable?.length, dataTable]
  );

  const handleEditRow = useCallback(
    (id) => {
      setSessionItem('id', id); // para pegar o id estamos usando a session, então para mostrar o valor dela digite, getSessionItem('id')
      router.push(paths.dashboard.distribuidor.edit);
    },
    [router]
  );

  useEffect(() => {
    setPageApi(1);
    fetchData();
  }, [itemsPerPage, searchBarApi]);

  useEffect(() => {
    fetchData();
  }, [pageApi]);

  useEffect(() => {
    FormularioService.index()
      .then((response) => {
        console.log(response)
          setDataTable(response);
          setQuantPagsApi(Math.ceil(response.length / itemsPerPage));
          setTotalItemsApi(response.length);
          setDataTableFilter(response.slice(0, itemsPerPage));

      })
      .catch(() => {
        enqueueSnackbar('Serviço de formulário indisponível', {
          variant: 'error',
        });
      });
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
       <CustomBreadcrumbs
        heading="Listagem Formulário"
        links={[
          {
            name: '',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.formulario.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Novo cadastro
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card>
        <LocalFilter
          searchBarApi={searchBarApi}
          setSearchBarApi={setSearchBarApi}
          totalItemsApi={totalItemsApi}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 650 }} size={dense ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  {TABLE_HEAD.map((option) => (
                    <TableCell
                      key={option.id}
                      align={'left'}
                      style={{ width: `${option.width}px` }}
                    >
                      {option.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(dataTableFilter) && dataTableFilter.map((row, index) => (
                  <TableRow hover key={index}>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.id}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.nome}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.cpf}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.sexo}</TableCell>
                    <TableCell sx={{ px: 1, whiteSpace: 'nowrap' }}>
                      <IconButton
                        color="default"
                        onClick={() => {
                          handleEditRow(row?.id);
                        }}
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>

                      <IconButton color="default" onClick={confirm.onTrue}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
)}

                <ConfirmDialog
                  open={confirm.value}
                  onClose={confirm.onFalse}
                  title="Deletar"
                  content="Você tem certeza que deseja deletar?"
                  action={
                    <Button variant="contained" color="error" onClick={handleDeleteRow}>
                      Sim, deletar
                    </Button>
                  }
                />
                <TableEmptyRows height={denseHeight} emptyRows={emptyRows()} />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <LocalPagination
          dense={dense}
          setDense={setDense}
          quantPagsApi={quantPagsApi}
          pageApi={pageApi}
          setPageApi={setPageApi}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      </Card>
    </Container>
  );
}

