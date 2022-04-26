import { FormSchema } from '@/types/form-constructor'

export const formSchemaMock: FormSchema = {
  id: 'ee4254ef-a9a3-4243-be68-51ce733b338e',
  name: 'credentials',
  title: 'Креды',
  description: 'some description',
  schema: [
    {
      id: 'stackRootId',
      name: 'stackRoot',
      componentSchemaId: 'ee4254ef-9099-4289-be68-51ce733b3376',
      componentName: 'Stack',
      path: 'hello',
      type: 'component',
      props: {
        as: 'ul',
        horizontal: true,
        verticalAlign: 'center',
        tokens: {
          childrenGap: 10,
          padding: '45px 40px',
        },
      },
      children: ['stackChild'],
    },
    {
      id: 'stackChild',
      name: 'stackChildName',
      componentSchemaId: 'ee4254ef-9099-4289-be68-51ce733b3376',
      componentName: 'Stack',
      path: 'hello',
      type: 'component',
      props: {
        as: 'ul',
        horizontal: true,
        verticalAlign: 'center',
        tokens: {
          childrenGap: 10,
          padding: '45px 40px',
        },
      },
      children: ['buttonOneId', 'buttonTwoId', 'textInputOneId', 'textInputTwoId'],
    },
    {
      id: 'buttonOneId',
      name: 'КнопкаГлавная1',
      componentSchemaId: 'ee4254ef-9099-4243-be68-51ce733b3376',
      componentName: 'PrimaryButton',
      path: 'hello12',
      type: 'button',
      props: {
        disabled: false,
        type: 'submit',
        children: 'hello',
      },
    },
    {
      id: 'buttonTwoId',
      name: 'КнопкаГлавная2',
      componentSchemaId: 'ee4254ef-9099-4243-be68-51ce733b3376',
      componentName: 'PrimaryButton',
      path: 'world',
      type: 'button',
      props: {
        disabled: false,
        children: 'koko',
      },
    },
    {
      id: 'textInputOneId',
      name: 'ТекстовоеПоле1',
      componentSchemaId: 'ee4234ef-9099-8943-8968-51ce733b870',
      componentName: 'TextField',
      path: 'funny',
      defaultValue: 'init',
      type: 'input',
      bindings: [
        {
          events: ['onInit'],
          actions: ['setValue'],
          componentIds: ['textInputTwoId'],
        },
      ],
    },
    {
      id: 'textInputTwoId',
      name: 'ТекстовоеПоле2',
      componentSchemaId: 'ee4234ef-9099-8943-8968-51ce733b870',
      componentName: 'TextField',
      path: 'kuku',
      type: 'input',
    },
  ],
}