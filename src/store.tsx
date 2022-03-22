import * as React from 'react'
import {makeAutoObservable} from 'mobx'
import {SHA256} from 'crypto-js'

interface IBlock {
  hash: string
  transactions: string[]
}

class BlockchainStore {
  constructor(
    public blocks: IBlock[] = [],
    public transactions: string[] = [],
  ) {
    makeAutoObservable(this)
  }

  get blocksLength() {
    return this.blocks.length
  }

  public get isValid() {
    return this.blocks.every((block, index) => {
      const prevBlock = this.blocks[index - 1] ?? {hash: ''}
      const hash = SHA256(
        `${prevBlock.hash}${JSON.stringify(block.transactions)}`,
      ).toString()
      return hash === block.hash
    })
  }

  addTransaction(message: string) {
    this.transactions.push(message)
  }

  writeBlock() {
    if (!this.transactions.length) return

    const transactions = [...this.transactions]
    this.transactions = []

    const prevBlock = this.blocks[this.blocks.length - 1] ?? {hash: ''}
    const hash = SHA256(
      `${prevBlock.hash}${JSON.stringify(transactions)}`,
    ).toString()

    this.blocks.push({
      hash,
      transactions,
    })
  }
}

const StoreContext = React.createContext<BlockchainStore | null>(null)

const StoreProvider = ({
  store,
  children,
}: {
  store: BlockchainStore
  children: React.ReactNode
}) => {
  React.useEffect(() => {
    const interval = setInterval(() => store.writeBlock(), 5000)
    return () => clearInterval(interval)
  }, [store])

  return <StoreContext.Provider children={children} value={store} />
}

const useStore = () => React.useContext(StoreContext)

export {BlockchainStore, StoreProvider, useStore}
