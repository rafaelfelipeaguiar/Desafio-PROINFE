'use client'

import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
// mui
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { useTheme } from '@mui/material/styles'
import { enqueueSnackbar } from 'notistack'
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs'
import { useSettingsContext } from 'src/components/settings'
import SvgColor from 'src/components/svg-color'
import { RouterLink } from 'src/routes/components'
// routes
import { paths } from 'src/routes/paths'
import { FormularioService } from 'src/services'
import { RemoveSessionItem } from 'src/utils/storage'

//
import FormularioNewEditForm from '../formulario-new-edit-form'

// ----------------------------------------------------------------------

export default function FormularioEditView({ id }) {
  const settings = useSettingsContext()
  const theme = useTheme()

  const PRIMARY_MAIN = theme.palette.primary.main

  const [currentFormulario, setCurrentFormulario] = useState('')

  useEffect(() => {
    RemoveSessionItem([
      'formulario.update.identificacao',
      'formulario.update.endereco',
      'formulario.update.contato',
    ])
    FormularioService.show(id)
      .then((response) => {
        setCurrentFormulario(response)
      })
      .catch(() => {
        enqueueSnackbar('Serviço de formulário indisponível', {
          variant: 'error',
        })
      })
  }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Editar Formulário"
        links={[
          {
            name: 'Painel',
            href: paths.dashboard.root,
          },
          {
            name: 'Secretaria',
            href: paths.dashboard.formulario.list,
          },
          { name: currentFormulario?.razaoSocial },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.formulario.list}
            variant="contained"
            startIcon={<SvgColor src={`/assets/icons/book.svg`} />}
          >
            Lista Formulários
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {currentFormulario && (
        <FormularioNewEditForm currentFormulario={currentFormulario} />
      )}
    </Container>
  )
}

FormularioEditView.propTypes = {
  id: PropTypes.string,
}
