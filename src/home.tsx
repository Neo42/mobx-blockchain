import React from 'react'
import {observer} from 'mobx-react-lite'
import {useStore} from './store'

export function Home() {
  return (
    <main>
      <Title />
      <Form />
      <Transactions />
      <Blocks />
    </main>
  )
}

const Title = observer(() => {
  const store = useStore()
  return (
    <h1>
      {store?.blocksLength} Blocks ({store?.isValid ? 'Valid' : 'Invalid'})
    </h1>
  )
})

const Form = () => {
  const store = useStore()
  const [message, setMessage] = React.useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        store?.addTransaction(message)
        setMessage('')
      }}>
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="message"
        required
      />
      <button type="submit">Add</button>
    </form>
  )
}

const Transactions = observer(() => {
  const store = useStore()

  return store?.transactions.length ? (
    <div>
      <h2>Pending Transactions</h2>
      <ul className="pending">
        {store.transactions.map((transaction) => (
          <li key={transaction}>{transaction}</li>
        ))}
      </ul>
    </div>
  ) : null
})

const Blocks = observer(() => {
  const store = useStore()
  return (
    <div>
      <h2>Blocks</h2>
      <ul className="blocks">
        {[...(store?.blocks ?? [])].reverse().map((block) => (
          <li key={block.hash}>
            <h3>{block.hash}</h3>
            <pre>{JSON.stringify(block.transactions, null, 2)}</pre>
          </li>
        ))}
      </ul>
    </div>
  )
})
