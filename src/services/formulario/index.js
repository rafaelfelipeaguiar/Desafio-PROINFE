'use client'

// utils
import { api } from 'src/utils/axios'
import * as Resturcturer from 'src/utils/restructurer-datas'

// ----------------------------------------------------------------------

async function create(values) {
  const response = await api.post(
    `/funcionario`,
    Resturcturer.removeEmptyFields(values)
  )

  return response
}
/*
async function index(currentPage, itemsPerPage, searchBarApi) {
  const response = await api.get(
    `/secretaria-municipal?page=${currentPage}&limit=${itemsPerPage}&search=${searchBarApi}`
  )

  return response.data
}*/


async function index() {
  const response = await api.get(
    `/funcionario`
  )

  return response.data
}

async function show(id = '') {
  const response = await api.get(`/funcionario${id}`)

  return response.data 
}

async function update(currentValeus, updatedValeus) {
  const values = Resturcturer.removeFieldsNotUpdated(
    currentValeus,
    updatedValeus
  )
  const response = await api.patch(
    `/secretaria-municipal/${currentValeus?.id}`,
    Resturcturer.removeEmptyFields(values, ['complemento', 'pontoReferencia'])
  )

  return response
}

async function remove(id = '') {
  const response = await api.delete(`/secretaria-municipal/${id}`)

  return response
}

export const FormularioService = {
  create,
  show,
  index,
  update,
  remove,
}
