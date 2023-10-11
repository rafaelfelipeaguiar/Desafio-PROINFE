// react
import { useCallback, useMemo } from 'react'
//
import PropTypes from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
// mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Unstable_Grid2'
// react
import { useForm } from 'react-hook-form'
// components
import FormProvider, {
  RHFDatePicker,
  RHFTextField,
  RHFSelect,
} from 'src/components/hook-form'
import SvgColor from 'src/components/svg-color'
// utils
import { fDate } from 'src/utils/format-time'
//
import * as Yup from 'yup'
import { cnpj as CNPJ } from "cpf-cnpj-validator";

// ----------------------------------------------------------------------
export default function FormIdentificacao({
  currentFormulario,
  session,
  setCurrentTab,
}) {
  const theme = useTheme()

  const PRIMARY_MAIN = theme.palette.primary.main

  const validationSchema = Yup.object().shape({
    nome: Yup.string().required('Nome Fantasia é obrigatório').min(5, 'Minímo de 5 caracteres'),
    cpf: Yup.string().required('CPF é obrigatório'),
    sexo: Yup.string().required('Sexo é obrigatório'),
    dataNascimento: Yup.string().required('Data de Nascimento é obrigatório'),
  })

  const defaultValues = useMemo(
    () => ({
      nome: currentFormulario?.nome || '',
      cpf: currentFormulario?.cpf || '',
      sexo: currentFormulario?.sexo || '',
      dataNascimento: currentFormulario?.dataNascimento || '',
    }),
    [currentFormulario]
  )

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const values = watch()

  const onSubmit = useCallback(
    async (data) => {
      try {
        data.dataNascimento = fDate(data.dataNascimento)
        session('identificacao', data)
        setCurrentTab('endereco')
      } catch (error) {
        console.error(error)
      }
    },
    [currentFormulario]
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="nome"
                label="Nome"
                placeholder="Rafael Felipe de Oliveira Aguiar"
              />

              <RHFTextField
                name="cpf"
                label="CPF"
                placeholder="05582154260"
              />

              <RHFSelect  
                name="sexo"
                label="Sexo"
                placeholder="Masculino">
                  <MenuItem value={"Masculino"}>Masculino</MenuItem>
                  <MenuItem value={"Feminino"}>Feminino</MenuItem>
              </RHFSelect>

              <RHFDatePicker name="dataNascimento" label="Data de Criação" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: PRIMARY_MAIN }}
              >
                Avançar
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}

FormIdentificacao.propTypes = {
  currentFormulario: PropTypes.object,
  session: PropTypes.func,
  setCurrentTab: PropTypes.elementType,
}
