import { FC, useCallback, useMemo } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'

import EmptyList from '@coopfi/components/EmptyList'
import Table from '@coopfi/components/Table'

import { core } from '@coopfi/api/nft'

import { useSelectedNfts } from '../../nftsState'
import { getTableColumns } from './columns'

import styles from './RequestLoansTable.module.less'

interface RequestLoansTableProps {
  nfts: core.BorrowNft[]
  isLoading: boolean
  requestedLoanValue: number
}

const RequestLoansTable: FC<RequestLoansTableProps> = ({ nfts, isLoading, requestedLoanValue }) => {
  const { connected } = useWallet()

  const {
    selection,
    toggle: toggleNftInSelection,
    find: findNftInSelection,
    clear: clearSelection,
    set: setSelection,
  } = useSelectedNfts()

  const hasSelectedNfts = !!selection?.length

  const onSelectAll = useCallback(() => {
    return hasSelectedNfts ? clearSelection() : setSelection(nfts)
  }, [hasSelectedNfts, clearSelection, setSelection, nfts])

  const onRowClick = useCallback(
    (nft: core.BorrowNft) => toggleNftInSelection(nft),
    [toggleNftInSelection],
  )

  const columns = getTableColumns({
    requestedLoanValue,
    hasSelectedNfts,
    onSelectAll,
    toggleNftInSelection,
    findNftInSelection,
  })

  const rowParams = useMemo(() => {
    return { onRowClick }
  }, [onRowClick])

  const showEmptyList = !isLoading && !nfts.length

  if (!connected) return <EmptyList message="Connect wallet to see your NFTs" />

  return showEmptyList ? (
    <EmptyList message="You don't have NFTs of this collection" />
  ) : (
    <Table
      data={nfts}
      columns={columns}
      rowParams={rowParams}
      loading={isLoading}
      className={styles.tableRoot}
      classNameTableWrapper={styles.tableWrapper}
    />
  )
}

export default RequestLoansTable
