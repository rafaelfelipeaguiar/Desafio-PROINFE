'use client'

// react
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
// mui
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
// components
import IconBedge from 'src/components/icon-badge'
import { useSnackbar } from 'src/components/snackbar'
// routes
import { useRouter } from 'src/routes/hooks'
// services
import { paths } from 'src/routes/paths'
// services
import { FormularioService } from 'src/services'
import { ProcessingErros } from 'src/utils/extract-errors'
import * as Resturcturer from 'src/utils/restructurer-datas'
import { getSessionItem, RemoveSessionItem, setSessionItem } from 'src/utils/storage'

//
import FormContato from './formulario-new-edit-form-contato'
import FormEndereco from './formulario-new-edit-form-endereco'
import FormIdentificacao from './formulario-new-edit-form-identificacao'

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'identificacao',
    label: 'Identificação',
    icon: <IconBedge>1</IconBedge>,
  },
  {
    value: 'endereco',
    label: 'Endereço',
    icon: <IconBedge>2</IconBedge>,
  },
  {
    value: 'contato',
    label: 'Contato',
    icon: <IconBedge>3</IconBedge>,
  },
]

// ----------------------------------------------------------------------

export default function FormularioNewEditForm({ currentFormulario = '' }) {
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()

  const [currentTab, setCurrentTab] = useState('identificacao')
  const [finalizeForm, setFinalizeForm] = useState(false)

  const handleCreat = async (datas) => {
    console.log(datas)
    FormularioService.create(datas)
      .then(() => {
        enqueueSnackbar('Criado com sucesso!')
        handleRemoveSessionItem()
      })
      .catch((error) => {
        enqueueSnackbar(ProcessingErros(error)?.[0], {
          variant: 'error',
        })
      })
      .finally(() => setFinalizeForm(false))
  }

  const handleUpdate = async (datas) => {
    FormularioService.update(
      removeUnusedFields(currentFormulario),
      removeUnusedFields(datas)
    )
      .then(() => {
        enqueueSnackbar('Atualizado com sucesso!')
        handleRemoveSessionItem()
      })
      .catch((error) => {
        enqueueSnackbar(ProcessingErros(error)?.[0], {
          variant: 'error',
        })
      })
      .finally(() => setFinalizeForm(false))
  }

  const handleSession = (session = '', datas = '') => {
    const path =  `formulario.${!currentFormulario ? 'create' : 'update'}.${session}`

    if(datas === 'path') 
      return path

    if(datas)
      setSessionItem(path, datas)
    else
      return getSessionItem(path)
  }

  const handleRemoveSessionItem = () => {
    RemoveSessionItem([
      handleSession('identificacao', 'path'),
      handleSession('endereco', 'path'),
      handleSession('contato', 'path'),
    ])
    router.push(paths.dashboard.formulario.list)
  }

  const removeUnusedFields = (datas) => {
    return Resturcturer.removeUnnecessaryFieldsUpdate(datas)
  }

  useEffect(() => {
    if (finalizeForm) {
      const datas = {
        ...handleSession('identificacao'),
        ...handleSession('endereco'),
        ...handleSession('contato'),
      }

      !currentFormulario ? handleCreat(datas) : handleUpdate(datas)
    }
  }, [finalizeForm])

  return (
    <>
      <Tabs
        value={currentTab}
        indicatorColor="#red"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            icon={tab.icon}
            value={tab.value}
            sx={{ cursor: 'default' }}
          />
        ))}
      </Tabs>

      {currentTab === 'identificacao' && (
        <FormIdentificacao
          currentFormulario={Resturcturer.replaceCommonValues(
            currentFormulario,
            handleSession('identificacao')
          )}
          session={handleSession}
          setCurrentTab={setCurrentTab}
        />
      )}

      {currentTab === 'endereco' && (
        <FormEndereco
          currentFormulario={Resturcturer.replaceCommonValues(
            currentFormulario,
           handleSession('endereco')
          )}
          session={handleSession}
          setCurrentTab={setCurrentTab}
        />
      )}

      {currentTab === 'contato' && (
        <FormContato
          currentFormulario={Resturcturer.replaceCommonValues(
            currentFormulario,
           handleSession('contato')
          )}
          session={handleSession}
          setCurrentTab={setCurrentTab}
          setFinalizeForm={setFinalizeForm}
          finalizeForm={finalizeForm}
        />
      )}
    </>
  )
}

FormularioNewEditForm.propTypes = {
  currentFormulario: PropTypes.object,
}
