import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Panel } from '@fluentui/react/lib/Panel'
import {
  Stack,
  ActionButton,
  DetailsList,
  Selection,
  TextField,
} from '@fluentui/react'
import * as userSelectors from '@/redux/user.selector'
import * as userActions from '@/redux/user.actions'
import store from '@/app/redux-store'
import { User } from '@/types/entities'
import UserForm from './form'
import useBoolean from '@/utils/use-boolean'
import { useSelection } from '@/utils/use-selection'
import Pagination from '@/components/pagination'

const buttonStyles = {
  root: { color: 'var(--themeDark)' },
  rootDisabled: { color: 'var(--themeTertiary)' },
}

const List: FC = (): JSX.Element => {
  const { t } = useTranslation()

  const userListState = useSelector(userSelectors.getList)

  const perPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  const [isFormPanelOpen, openFormPanel, closeFormPanel] = useBoolean(false)

  const { selectedItems: selectedUsers, selection } = useSelection<User>()

  useEffect(getUserList, [currentPage])

  function getUserList() {
    store.dispatch(userActions.getList({ currentPage, perPage }))
  }

  function pruneMany() {
    const ids = selectedUsers.map((user) => user.id)
    store.dispatch(userActions.pruneMany(ids, { onSuccess: getUserList }))
  }

  return (
    <div className="Users">
      <Panel
        isLightDismiss
        headerText="Sample panel"
        isOpen={isFormPanelOpen}
        onDismiss={closeFormPanel}
        closeButtonAriaLabel="Close"
      >
        <UserForm
          onSucces={() => setCurrentPage(1)}
          defaultValues={selectedUsers[0]}
          closeFormPanel={closeFormPanel}
        />
      </Panel>
      <Stack tokens={{ padding: '20px 40px' }}>
        <h1>{t('pagesNames.userList')}</h1>
      </Stack>
      <Stack tokens={{ padding: '20px 40px' }}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            <ActionButton
              disabled={selectedUsers.length > 0}
              onClick={openFormPanel}
              styles={buttonStyles}
              ariaLabel={t('buttons.create')}
            >
              {t('buttons.create')}
            </ActionButton>
            <ActionButton
              onClick={openFormPanel}
              disabled={selectedUsers.length !== 1}
              styles={buttonStyles}
              ariaLabel={t('buttons.edit')}
            >
              {t('buttons.edit')}
            </ActionButton>
            <ActionButton
              onClick={pruneMany}
              disabled={selectedUsers.length <= 0}
              styles={buttonStyles}
              ariaLabel={t('buttons.remove')}
            >
              {t('buttons.remove')}
            </ActionButton>
          </Stack>
          <Stack
            style={{ color: 'var(--neutralTertiaryAlt)' }}
            horizontal
            tokens={{ childrenGap: 20 }}
            verticalAlign="center"
          >
            <div>users: {userListState.data.total}</div>
            <div>pages: {Math.ceil(userListState.data.total / perPage)}</div>
            <Pagination
              onChange={setCurrentPage}
              currentPage={currentPage}
              totalItems={userListState.data.total}
              perPage={perPage}
              inputComponent={(inputProps) => (
                <TextField
                  onKeyUp={inputProps.onKeyUp}
                  defaultValue={inputProps.value}
                  styles={{
                    root: { maxWidth: 35 },
                    field: { textAlign: 'center' },
                  }}
                />
              )}
              buttonComponent={(buttonProps) => (
                <ActionButton {...buttonProps} styles={buttonStyles} />
              )}
            />
          </Stack>
        </Stack>
        <DetailsList
          selection={selection as Selection}
          items={userListState.data.items}
          columns={[
            {
              key: 'name',
              name: t('entities.user.name'),
              minWidth: 100,
              fieldName: 'name',
            },
            {
              key: 'email',
              name: t('entities.user.email'),
              minWidth: 100,
              fieldName: 'email',
            },
            {
              key: 'createdAt',
              name: t('entities.user.createdAt'),
              minWidth: 100,
              fieldName: 'createdAt',
              onRender: (user: User) => user.createdAt.slice(0, 10),
            },
            {
              key: 'updatedAt',
              name: t('entities.user.updatedAt'),
              minWidth: 100,
              fieldName: 'updatedAt',
              onRender: (user: User) => user.updatedAt.slice(0, 10),
            },
          ]}
          selectionPreservedOnEmptyClick
          setKey="set"
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="select row"
        />
      </Stack>
    </div>
  )
}

export default List
