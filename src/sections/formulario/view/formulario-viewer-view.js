'use client'

import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Grid } from '@mui/material'
// mui
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { enqueueSnackbar } from 'notistack'
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'
import { useSettingsContext } from 'src/components/settings'
import SvgColor from 'src/components/svg-color'
import { RouterLink } from 'src/routes/components'
import Label from 'src/components/label'
// routes
import { useRouter } from 'src/routes/hooks'
import { paths } from 'src/routes/paths'
import { FormularioService } from 'src/services'
// utils
import * as Mask from 'src/utils/mask'

// ----------------------------------------------------------------------

export default function FormularioViwerView({ id }) {
  const settings = useSettingsContext()
  const theme = useTheme()

  const PRIMARY_MAIN = theme.palette.primary.main

  const [currentFormulario, setCurrentFormulario] = useState('')

  useEffect(() => {
    FormularioService.show(id)
      .then((response) => {
        setCurrentFormulario(response)
      })
      .catch((error) => {
        enqueueSnackbar('Serviço de formulário indisponível', {
          variant: 'error',
        })
      })
  }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Visualizar Formulário`}
        links={[
          {
            name: '',
          }
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.formulario.list}
            variant="contained"
            startIcon={<SvgColor src={`/assets/icons/book.svg`} />}
          >
            Lista Secretarias
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentFormulario && (
        <>
          <Grid container gap={3}>
            <Grid xs={12}>
              <Button
                component={Box}
                variant="contained"
                sx={{
                  backgroundColor: PRIMARY_MAIN,
                  paddingX: 3,
                  marginBottom: -2,
                  position: 'relative',
                  zIndex: 1,
                  borderRadius: 0.5,
                }}
              >
                Identificação
              </Button>
              <Card sx={{ p: 3, paddingTop: 5 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">CNPJ:</Typography>
                    <Typography>{currentFormulario?.cnpj}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Razão Social:</Typography>
                    <Typography>{currentFormulario?.razaoSocial}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Nome Fantasia:</Typography>
                    <Typography>{currentFormulario?.nomeFantasia}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      Data de Criação:
                    </Typography>
                    <Typography>
                      {Mask.date(currentFormulario?.dataCriacao)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2">
                      Natureza Jurídica:
                    </Typography>
                    <Typography>
                      {currentFormulario?.naturezaJuridica}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Decreto:</Typography>
                    <Typography>{currentFormulario?.decreto}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Secretário:</Typography>
                    <Typography>{currentFormulario?.secretario}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      Vinvulado ao entre Federativo:
                    </Typography>
                    <Typography>
                      {currentFormulario?.vincEnteFederativo}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Prefeito:</Typography>
                    <Typography>{currentFormulario?.prefeito}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid xs={12}>
              <Button
                component={Box}
                variant="contained"
                sx={{
                  backgroundColor: PRIMARY_MAIN,
                  paddingX: 3,
                  marginBottom: -2,
                  position: 'relative',
                  zIndex: 1,
                  borderRadius: 0.5,
                }}
              >
                Endereço
              </Button>
              <Card sx={{ p: 3, paddingTop: 5 }}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">CEP:</Typography>
                    <Typography>{currentFormulario?.endereco?.cep}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">UF:</Typography>
                    <Typography>
                      {currentFormulario?.endereco?.cidade?.estado?.uf}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Cidade:</Typography>
                    <Typography>
                      {currentFormulario?.endereco?.cidade?.nome}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Bairro:</Typography>
                    <Typography>
                      {currentFormulario?.endereco?.bairro}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Logradouro:</Typography>
                    <Typography>
                      {currentFormulario?.endereco?.logradouro}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Número:</Typography>
                    <Typography>
                      {currentFormulario?.endereco?.numero}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Complemento:</Typography>
                    <Typography>
                      {currentFormulario?.endereco?.complemento || '----------'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      Ponto de Referência:
                    </Typography>
                    <Typography>
                      {currentFormulario?.endereco?.pontoReferencia || '----------'}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Button
                  component={Box}
                  variant="contained"
                  sx={{
                    backgroundColor: PRIMARY_MAIN,
                    paddingX: 3,
                    marginBottom: -2,
                    position: 'relative',
                    zIndex: 1,
                    borderRadius: 0.5,
                  }}
                >
                  Contatos
                </Button>
                <Card sx={{ p: 3, paddingTop: 5 }}>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(2, 1fr)',
                    }}
                  >
                    {currentFormulario?.contato?.telefones?.map((item) => (
                      <>
                        <Box>
                          <Typography variant="subtitle2" color={item?.principal}>
                            Telefone:
                          </Typography>
                          <Typography color={item?.principal}>{item?.numero}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" color={item?.principal}>Tipo:</Typography>
                          <Typography color={item?.principal}>
                            {item?.tipo}
                            {item?.principal && (
                              <Label variant="soft" color={'primary'} style={{ marginLeft: '5vh', fontSize: '14px' }}>
                              Principal
                              </Label>
                            )}
                          </Typography>
                        </Box>
                      </>
                    ))}
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, marginTop: 3, paddingTop: 5 }}>
                <Box
                    rowGap={3}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(1, 1fr)',
                    }}
                  >
                    {currentFormulario?.contato?.emails?.map((item) => (
                      <>
                        <Box>
                          <Typography variant="subtitle2" color={item?.principal}>E-mail:</Typography>
                          <Typography color={item?.principal}>
                          {item?.email}
                          {item?.principal && (
                            <Label variant="soft" color={'primary'} style={{ marginLeft: '5vh', fontSize: '14px' }}>
                              Principal
                            </Label>
                          )}
                        </Typography>
                        </Box>
                      </>
                    ))}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  )
}

FormularioViwerView.propTypes = {
  id: PropTypes.string,
}
